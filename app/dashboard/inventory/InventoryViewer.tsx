"use client";

import React, { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import InventoryCard from "./InventoryCard";
import { apiGetAll } from "../../api/request";
import type {
  InventoryProduct,
  ColumnKey,
} from "@/app/types/inventory";

const columnLabels: Record<ColumnKey, string> = {
  code: "کد",
  name: "نام",
  status: "وضعیت",
  quantity: "موجودی",
  point_reorder: "نقطه سفارش",
  total_weight_grams: "وزن کل",
  updatedAt: "بروزرسانی",
  type: "نوع",
};

const defaultVisibleColumns: Record<ColumnKey, boolean> = {
  code: true,
  name: true,
  status: true,
  quantity: true,
  point_reorder: false,
  total_weight_grams: false,
  updatedAt: true,
  type: true,
};

const orderedColumns: ColumnKey[] = [
  "code",
  "name",
  "type",
  "quantity",
  "status",
  "point_reorder",
  "total_weight_grams",
  "updatedAt",
];

export default function InventoryViewer(props:any) {
  const [items, setItems] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "ingredient" | "box">("all");
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>(defaultVisibleColumns);

  // Fetch data from DB on mount
  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const [ingRes, boxRes] = await Promise.all([
          apiGetAll("http://polemis.runflare.run/api/v1/inventory/ingredients"),
          apiGetAll("http://polemis.runflare.run/api/v1/inventory/boxes"),
        ]);

        // Map API response to match InventoryProduct type
        const formattedIngs = (ingRes?.data || []).map((item: any): InventoryProduct => ({
          id: item.id,
          code: item.code,
          name: item.name,
          type: "ingredient",
          quantity: item.total_weight_grams || 0,
          status: (item.status as "low" | "medium" | "good" | "empty") || "medium",
          point_reorder: item.point_reorder || item.reorder_point || 0,
          total_weight_grams: item.total_weight_grams || 0,
          updatedAt: item.updated_at || item.updatedAt || new Date().toISOString(),
        }));

        const formattedBoxes = (boxRes?.data || []).map((item: any): InventoryProduct => ({
          id: item.id,
          code: item.code,
          name: item.name,
          type: "box",
          quantity: item.quantity || 0,
          status: (item.status as "low" | "medium" | "good" | "empty") || "medium",
          point_reorder: item.point_reorder || 0,
          total_weight_grams: item.total_weight_grams || 0,
          updatedAt: item.updated_at || item.updatedAt || new Date().toISOString(),
        }));

        setItems([...formattedIngs, ...formattedBoxes]);
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const activeColumns = useMemo(() => {
    return orderedColumns.filter((key) => key === "code" || visibleColumns[key]);
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      if (!matchesType) return false;
      if (!q) return true;

      const name = item.name?.toLowerCase?.() ?? "";
      const code = item.code?.toLowerCase?.() ?? "";
      const status = item.status?.toLowerCase?.() ?? "";

      return name.includes(q) || code.includes(q) || status.includes(q);
    });
  }, [items, search, typeFilter]);

  const toggleColumn = (key: ColumnKey) => {
    if (key === "code") return;
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleCard = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm" dir="rtl">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو بر اساس نام، کد..."
            className="w-full rounded-xl border border-zinc-300 px-4 py-2 outline-none transition focus:border-zinc-500 md:max-w-sm"
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="rounded-xl border border-zinc-300 px-4 py-2 outline-none transition focus:border-zinc-500"
          >
            <option value="all">همه</option>
            <option value="ingredient">مواد اولیه</option>
            <option value="box">بسته‌بندی</option>
          </select>
        </div>

        <button
          onClick={() => setSettingsOpen((prev) => !prev)}
          className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-50"
        >
          تنظیم ستون‌ها
        </button>
      </div>

      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 p-4"
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {orderedColumns.map((key) => (
                <label key={key} className={`flex items-center gap-2 text-sm ${key === "code" ? "opacity-60" : ""}`}>
                  <input
                    type="checkbox"
                    checked={key === "code" ? true : visibleColumns[key]}
                    disabled={key === "code"}
                    onChange={() => toggleColumn(key)}
                  />
                  <span>{columnLabels[key]}</span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-hidden rounded-2xl border border-zinc-200">
        <div
          className="hidden gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-700 md:grid"
          style={{ gridTemplateColumns: `repeat(${activeColumns.length}, minmax(120px, 1fr))` }}
        >
          {activeColumns.map((col) => (
            <div key={col}>{columnLabels[col]}</div>
          ))}
        </div>

        <div className="divide-y divide-zinc-200">
          {loading ? (
            <div className="px-4 py-10 text-center text-sm text-zinc-500">در حال بارگذاری...</div>
          ) : filteredItems.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-zinc-500">موردی یافت نشد</div>
          ) : (
            filteredItems.map((item) => (
              <InventoryCard
                key={`${item.type}-${item.id}`}
                item={item}
                mode={expandedId === item.id ? "detail" : "row"}
                visibleColumns={activeColumns}
                onToggle={() => handleToggleCard(item.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}