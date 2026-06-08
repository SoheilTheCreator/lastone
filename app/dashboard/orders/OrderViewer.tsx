"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiGetAll, apiRequest } from "../../api/request"; // Assuming this utility exists

type ItemIngredient = {
  name: string;
  grams: number;
  price: number;
};

type ItemBox = {
  name: string;
  quantity: number;
  price: number;
};

type OrderTemplate = {
  id: number;
  name: string;
  code: string;
  description?: string;
  price: number;
  markupPercent: number; // Derived or stored
  ingredients: ItemIngredient[];
  boxes: ItemBox[];
  createdAt: string;
};

export default function OrderViewer() {
  const [templates, setTemplates] = useState<OrderTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "price">("newest");

  // 1. Fetch real products/items from DB
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        /**
         * BACKEND NOTE:
         * Using the Item Maker list endpoint.
         * Endpoint: http://localhost/api/v1/item-maker/items
         */
        const response = await apiGetAll("https://polemis.runflare.run/api/v1/items");
        
        // Ensure the data is formatted correctly for the UI
        const formattedData = (response.data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          code: item.code,
          description: item.description,
          price: Number(item.price),
          // Backend might not return markup directly, we assume it's baked into 'price' 
          // or we can calculate it if base_cost is provided.
          markupPercent: item.markup_percent || 0, 
          ingredients: item.ingredients || [],
          boxes: item.boxes || [],
          createdAt: item.created_at?.split("T")[0] || "---",
        }));

        setTemplates(formattedData);
      } catch (err) {
        console.error("Failed to load items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredTemplates = useMemo(() => {
    return templates
      .filter((t) => {
        const query = searchTerm.toLowerCase();
        return (
          t.name.toLowerCase().includes(query) ||
          t.code.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortBy === "price") return b.price - a.price;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [templates, searchTerm, sortBy]);

  const handleDelete = async (id: number) => {
    if (!confirm("آیا از حذف این آیتم اطمینان دارید؟")) return;
    try {
      /**
       * BACKEND NOTE:
       * Endpoint: DELETE http://localhost/api/v1/item-maker/items/{id}
       */
      await apiRequest(`/v1/item-maker/items/${id}`, null, "DELETE");
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert("خطا در حذف آیتم");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-7xl rounded-3xl border border-[var(--secondary)] bg-[var(--ternary)] p-5 shadow-lg lg:p-8 text-right"
      dir="rtl"
    >
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--primary)]">مدیریت آیتم‌های منو</h2>
          <p className="text-sm text-[var(--primary)]/60 font-medium">مشاهده ترکیب مواد اولیه و قیمت‌گذاری محصولات نهایی</p>
        </div>
        <div className="rounded-2xl bg-[var(--button)]/10 px-4 py-2 text-[var(--button)] text-xs font-bold border border-[var(--button)]/20">
          تعداد کل: {templates.length} آیتم
        </div>
      </div>

      {/* --- SEARCH --- */}
      <div className="mb-6 space-y-3">
        <div className="relative group">
          <input
            type="text"
            placeholder="جستجو در نام محصول، کد SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-[var(--secondary)] bg-[var(--bg)] px-5 py-4 pr-12 text-right outline-none focus:border-[var(--button)] transition-all shadow-sm"
          />
        </div>

        <div className="rounded-2xl border border-[var(--secondary)] bg-[var(--bg)] overflow-hidden shadow-sm">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex w-full items-center justify-between p-4 text-sm font-bold opacity-70"
          >
            <div className="flex items-center gap-2"><span>تنظیمات مرتب‌سازی</span></div>
            <motion.div animate={{ rotate: showFilters ? 180 : 0 }}>▼</motion.div>
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="border-t border-[var(--secondary)] p-5">
                <div className="flex gap-2">
                  <button onClick={() => setSortBy("newest")} className={`rounded-xl px-4 py-2 text-xs ${sortBy === "newest" ? "bg-[var(--button)] text-white" : "bg-[var(--ternary)]"}`}>جدیدترین</button>
                  <button onClick={() => setSortBy("price")} className={`rounded-xl px-4 py-2 text-xs ${sortBy === "price" ? "bg-[var(--button)] text-white" : "bg-[var(--ternary)]"}`}>گران‌ترین</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- LIST --- */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center opacity-50">در حال بارگذاری اطلاعات...</div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template) => (
              <motion.div key={template.id} layout className="overflow-hidden rounded-3xl border border-[var(--secondary)] bg-[var(--bg)]">
                <div onClick={() => setExpandedId(expandedId === template.id ? null : template.id)} className="flex cursor-pointer flex-col md:flex-row md:items-center justify-between p-5 gap-4">
                  <div className="flex items-center gap-6">
                    <div className="text-xs font-mono opacity-30">#{template.code}</div>
                    <div className="text-right">
                      <div className="font-bold text-[var(--primary)] text-lg">{template.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-12">
                    <div className="text-left">
                      <div className="text-[10px] uppercase font-bold opacity-40">قیمت فروش</div>
                      <div className="font-mono font-black text-[var(--button)] text-xl">{template.price.toLocaleString()}</div>
                    </div>
                    <motion.div animate={{ rotate: expandedId === template.id ? 180 : 0 }}>▼</motion.div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === template.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-[var(--secondary)] bg-[var(--ternary)]/30 p-6">
                      <div className="grid gap-8 lg:grid-cols-2">
                        <div>
                          <h4 className="mb-4 text-xs font-bold uppercase opacity-40">آنالیز ساختار (مواد و بسته‌بندی)</h4>
                          <div className="space-y-2">
                            {template.ingredients.map((ing, idx) => (
                              <div key={idx} className="flex justify-between rounded-xl border border-[var(--secondary)] bg-[var(--bg)] p-3 text-sm">
                                <span>{ing.name} ({ing.grams} گرم)</span>
                                <span className="font-mono opacity-60">{ing.price.toLocaleString()}</span>
                              </div>
                            ))}
                            {template.boxes.map((box, idx) => (
                              <div key={idx} className="flex justify-between rounded-xl border border-[var(--secondary)] bg-[var(--bg)] p-3 text-sm">
                                <span>{box.name} ({box.quantity} عدد)</span>
                                <span className="font-mono opacity-60">{box.price.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col justify-between">
                          <div>
                            <h4 className="mb-2 text-xs font-bold uppercase opacity-40">توضیحات فنی</h4>
                            <div className="rounded-2xl bg-[var(--bg)] p-4 text-sm border border-[var(--secondary)]">
                              {template.description || "توضیحی ثبت نشده است."}
                            </div>
                          </div>
                          <div className="mt-8 flex justify-end gap-3">
                            <button onClick={() => handleDelete(template.id)} className="rounded-xl bg-red-50 px-6 py-2.5 text-sm font-bold text-red-600 border border-red-200">حذف آیتم</button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}