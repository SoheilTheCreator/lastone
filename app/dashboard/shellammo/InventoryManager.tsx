"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import InventoryCreate from "../inventory/InventoryCreate";
import InventoryStock from "../inventory/InventoryInitStock";
import InventoryPricing from "../inventory/InventoryPricing";

import InventoryViewer from "../inventory/InventoryViewer";
import InventoryReserver from "../inventory/InventoryReserver";

import {InventoryItem} from '../../types/inventory'
import { label } from "framer-motion/client";
import InventoryTransaction from "../inventory/InventoryTransactor";
type InventoryManagerProps={
  items: InventoryItem[]
}
export default function InventoryManager(props:InventoryManagerProps) {
  const [activeTab, setActiveTab] = useState("create");

  const tabs = [
    { key: "create", label: "ایجاد کالا" },
    { key: "stock", label: "ثبت موجودی" }, 
    {key: "transaction", label:"تراکنش ها"},
    { key: "pricing", label: "قیمت‌گذاری" },
    { key: "viewer", label: "نمایش انبار" },
    { key: "reserve", label: "رزرو و رهاسازی" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "create": return <InventoryCreate />;
      case "transaction" : return <InventoryTransaction />
      case "stock": return <InventoryStock />;
      case "pricing": return <InventoryPricing />;
      case "viewer": return <InventoryViewer items={props.items as any}/>;
      case "reserve": return <InventoryReserver />;
      default: return null;
    }
  };

  return (
    <motion.div
      dir="rtl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full h-full flex flex-col"
    >
      {/* Sticky Top Tab Bar */}
      <div
        className="
          sticky top-0 z-40
          w-full bg-[var(--bg)]/80 backdrop-blur-md
          px-4 py-3  
          flex items-center justify-center gap-3
          border-b border-[var(--secondary)]
          rounded-xl 
        "
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`
              px-6 py-2 transition-all text-sm font-medium
              border border-[var(--secondary)]
              rounded-xl
              ${
                activeTab === t.key
                  ? "bg-[var(--button)] text-[var(--font-alt)]" // espresso brown active
                  : "bg-transparent text-[var(--font-clr)] hover:text-[var(--primary)]"
              }
            `}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="
          flex-1 overflow-y-auto
          rounded-2xl /* was 3xl */
          border border-[var(--secondary)]
          bg-[var(--bg)]
          p-6
        "
      >
        {renderContent()}
      </motion.div>
    </motion.div>
  );
}