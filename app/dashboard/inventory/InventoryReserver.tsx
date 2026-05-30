"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiGetAll, apiRequest } from "../../api/request"; // Your Axios instance

interface Item {
  id: number;
  code: string;
  name: string;
  type: "ING" | "BOX";
}

export default function InventoryReserver() {
  const [items, setItems] = useState<Item[]>([]);
  const [type, setType] = useState<"ING" | "BOX">("ING");
  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Fetch real items from DB on mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [ingRes, boxRes] = await Promise.all([
          apiGetAll("http://polemis.runflare.run/api/v1/inventory/ingredients"),
          apiGetAll("http://polemis.runflare.run/api/v1/inventory/boxes"),
        ]);

        const formattedIngs = ingRes.data.map((i: any) => ({ ...i, type: "ING" }));
        const formattedBoxes = boxRes.data.map((b: any) => ({ ...b, type: "BOX" }));

        setItems([...formattedIngs, ...formattedBoxes]);
      } catch (err) {
        console.error("BACKEND ERROR: Could not fetch inventory items", err);
      }
    };
    fetchItems();
  }, []);

  // Filter based on the current toggle (Ingredient vs Box) AND the search query
  const filteredItems = items.filter(
    (item) =>
      item.type === type &&
      (item.code.toLowerCase().includes(query.toLowerCase()) ||
        item.name.includes(query))
  );

  const handleSelect = (item: Item) => {
    setSelectedItem(item);
    setQuery(item.code);
    setShowDropdown(false);
  };

  const handleAction = async (action: "reserve" | "release") => {
    if (!selectedItem || !amount) return alert("لطفا کالا و مقدار را وارد کنید");
    setLoading(true);

    /**
     * BACKEND NOTE:
     * Reserve: /api/v1/inventory/products/reserve (ING) or /boxes/reserve (BOX)
     * Release: /api/v1/inventory/products/release (ING) or /boxes/release (BOX)
     */
    const category = selectedItem.type === "BOX" ? "boxes" : "stock";
    const endpoint = `http://polemis.runflare.run/api/v1/inventory/${category}/${selectedItem.id}/${action}`;

    const payload = selectedItem.type === "BOX" 
      ? { quantity: amount }
      : { grams: amount };

    try {
      await apiRequest(endpoint, payload, "POST");
      alert(`موفقیت: مقدار ${amount} برای ${selectedItem.name} ${action === 'reserve' ? 'رزرو' : 'رها'} شد.`);
      
      // Reset
      setAmount("");
      setQuery("");
      setSelectedItem(null);
    } catch (err) {
      console.error("Action failed", err);
      alert("خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      dir="rtl"
      className="w-full h-full flex items-center justify-center p-4"
    >
      <div className="w-full max-w-2xl bg-[var(--ternary)] border border-[var(--secondary)] p-8 gap-6 flex flex-col rounded-3xl shadow-xl">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[var(--primary)]">رزرو و رهاسازی موجودی</h2>
          <p className="text-sm text-[var(--primary)]/60 mt-1">مدیریت موجودی در حال انتظار</p>
        </div>

        {/* Type Toggle */}
        <div className="flex gap-2 p-1 bg-[var(--bg)] rounded-2xl border border-[var(--secondary)]">
          {[
            { key: "ING", label: "مواد اولیه" },
            { key: "BOX", label: "جعبه" },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => {
                setType(option.key as "ING" | "BOX");
                setSelectedItem(null);
                setQuery("");
              }}
              className={`flex-1 py-3 transition-all rounded-xl ${
                  type === option.key ? "bg-[var(--button)] text-white" : "text-[var(--primary)]"
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="جستجوی کد یا نام..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full p-4 border border-[var(--secondary)] bg-[var(--bg)] rounded-2xl focus:outline-none focus:border-[var(--button)] transition-all"
          />

          <AnimatePresence>
            {showDropdown && query && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute top-full mt-2 w-full bg-[var(--ternary)] border border-[var(--secondary)] shadow-2xl max-h-48 overflow-y-auto rounded-2xl z-50"
              >
                {filteredItems.length === 0 ? (
                  <div className="p-4 text-sm opacity-60">موردی یافت نشد</div>
                ) : (
                  filteredItems.map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      onClick={() => handleSelect(item)}
                      className="p-4 cursor-pointer hover:bg-[var(--button)] hover:text-white transition-all text-sm border-b border-[var(--secondary)] last:border-0"
                    >
                      {item.code} - {item.name}
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Amount */}
        <input
          type="number"
          placeholder={type === "BOX" ? "تعداد" : "مقدار (گرم)"}
          value={amount}
          onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
          className="w-full p-4 border border-[var(--secondary)] bg-[var(--bg)] rounded-2xl focus:outline-none focus:border-[var(--button)]"
        />

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => handleAction("reserve")}
            disabled={loading}
            className="flex-1 py-4 bg-[var(--button)] text-white rounded-2xl hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? "در حال پردازش..." : "رزرو کردن"}
          </button>

          <button
            onClick={() => handleAction("release")}
            disabled={loading}
            className="flex-1 py-4 border border-[var(--button)] text-[var(--button)] rounded-2xl hover:bg-[var(--button)] hover:text-white transition-all disabled:opacity-50"
          >
            رهاسازی
          </button>
        </div>
      </div>
    </motion.div>
  );
}