"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiGetAll, apiRequest } from "../../api/request"; // Assuming this handles JWT and Base URL [cite: 16, 18]

interface InventoryItem {
  id: number;
  code: string;
  name: string;
  type: "ING" | "BOX";
}

export default function InventoryPricing() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState({ buy_price: "", sell_price: "" });
  const [loading, setLoading] = useState(false);

  // 1. Fetch real inventory on mount 
  useEffect(() => {
    const loadInventory = async () => {
      try {
        const [ingRes, boxRes] = await Promise.all([
          apiGetAll("http://polemis.runflare.run/api/v1/inventory/ingredients"),
          apiGetAll("http://polemis.runflare.run/api/v1/inventory/boxes"),
        ]);
        
        const ings = ingRes.data.map((i: any) => ({ ...i, type: "ING" }));
        const boxes = boxRes.data.map((b: any) => ({ ...b, type: "BOX" }));
        setItems([...ings, ...boxes]);
      } catch (err) {
        console.error("Failed to load inventory for pricing:", err);
      }
    };
    loadInventory();
  }, []);

  const handleSearch = (val: string) => {
    setQuery(val);
    if (!val) {
      setFiltered([]);
      return;
    }
    setFiltered(
      items.filter(
        (item) =>
          item.code.toLowerCase().includes(val.toLowerCase()) ||
          item.name.includes(val)
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !form.buy_price || !form.sell_price) {
      return alert("لطفا تمام فیلدها را پر کنید");
    }

    setLoading(true);

    /**
     * BACKEND NOTES FOR THE DEV:
     * 1. Target URL: http://localhost/api/v1/inventory/prices/update 
     * 2. The backend expects different keys based on type:
     * - Box: "box_id", "unit_id", "buy_price", "sell_price" [cite: 127, 128, 129, 130, 131]
     * - Ingredient: "ingredient_id", "unit_id", "buy_price", "sell_price" [cite: 134, 135, 136, 137, 138]
     * 3. NOTE: The 'unit_id' is required by your docs. I am hardcoding typical values 
     * (25 for boxes, 21 for grams) per the examples on page 7.
     */
    
    const isBox = selectedItem.type === "BOX";
    const endpoint = "http://polemis.runflare.run/api/v1/inventory/prices/update"; 

    const payload = isBox
      ? {
          box_id: selectedItem.id, //[cite: 128]
          unit_id: 25, // Per doc example p.7 [cite: 129]
          buy_price: Number(form.buy_price), //[cite: 130]
          sell_price: Number(form.sell_price), //[cite: 131]
        }
      : {
          ingredient_id: selectedItem.id, //[cite: 135]
          unit_id: 21, // Per doc example p.7 (grams) [cite: 136]
          buy_price: Number(form.buy_price), //[cite: 137]
          sell_price: Number(form.sell_price), //[cite: 138]
        };

    try {
      await apiRequest(endpoint, payload, "POST"); //[cite: 123, 124]
      alert("قیمت با موفقیت بروزرسانی شد");
      setForm({ buy_price: "", sell_price: "" });
      setQuery("");
      setSelectedItem(null);
    } catch (err) {
      alert("خطا در ثبت قیمت. لطفا دوباره تلاش کنید");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      dir="rtl"
      className="mx-auto w-full max-w-2xl rounded-3xl border border-[var(--secondary)] bg-[var(--ternary)] p-5 shadow-lg sm:p-6 lg:p-8"
    >
      <div className="mb-7 text-center">
        <h2 className="text-xl font-semibold text-[var(--primary)] sm:text-2xl">قیمت‌گذاری</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--primary)]/70">
          کالا را انتخاب کرده و قیمت خرید و فروش را تنظیم کنید.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:gap-5">
        <div className="relative">
          <input
            type="text"
            placeholder="جستجوی کد یا نام کالا..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-2xl border border-[var(--secondary)] bg-[var(--bg)] px-4 py-4 outline-none transition focus:border-[var(--button)]"
          />

          <AnimatePresence>
            {filtered.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute top-full z-10 mt-2 w-full overflow-hidden rounded-2xl border border-[var(--secondary)] bg-[var(--ternary)] shadow-lg max-h-60 overflow-y-auto"
              >
                {filtered.map((item) => (
                  <li
                    key={`${item.type}-${item.id}`}
                    onClick={() => {
                      setSelectedItem(item);
                      setQuery(`${item.code} - ${item.name}`);
                      setFiltered([]);
                    }}
                    className="cursor-pointer px-4 py-3 transition hover:bg-[var(--button)] hover:text-white text-right"
                  >
                    <span className="font-bold">{item.code}</span> - {item.name} 
                    <span className="text-xs opacity-50 mr-2">({item.type === "BOX" ? "باکس" : "مواد"})</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs mr-2 text-[var(--primary)]/60">قیمت خرید (تومان)</label>
            <input
              type="number"
              placeholder="قیمت خرید"
              value={form.buy_price}
              onChange={(e) => setForm({ ...form, buy_price: e.target.value })}
              className="w-full rounded-2xl border border-[var(--secondary)] bg-[var(--bg)] px-4 py-4 outline-none transition focus:border-[var(--button)]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs mr-2 text-[var(--primary)]/60">قیمت فروش (تومان)</label>
            <input
              type="number"
              placeholder="قیمت فروش"
              value={form.sell_price}
              onChange={(e) => setForm({ ...form, sell_price: e.target.value })}
              className="w-full rounded-2xl border border-[var(--secondary)] bg-[var(--bg)] px-4 py-4 outline-none transition focus:border-[var(--button)]"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="mt-2 rounded-2xl bg-[var(--button)] py-4 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "در حال ثبت..." : "ثبت قیمت جدید"}
        </motion.button>
      </form>
    </motion.div>
  );
}