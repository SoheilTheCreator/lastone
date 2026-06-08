// "use client";

// import React, { useMemo, useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { apiRequest } from "../../api/request"; // Your Axios instance

// type InventoryItem = {
//   id: number;
//   code: string;
//   name: string;
//   sell_price: number;
//   type: "ING" | "BOX";
// };

// type OrderItemRow = {
//   id: number; // local unique id for list keys
//   dbId: number; // the ID from the database
//   code: string;
//   name: string;
//   quantity: number;
//   unitPrice: number;
//   type: "ING" | "BOX";
// };

// export default function OrderCreate() {
//   // --- Data State ---
//   const [dbItems, setDbItems] = useState<InventoryItem[]>([]);
//   const [loading, setLoading] = useState(false);
  
//   // --- Form State ---
//   const [query, setQuery] = useState("");
//   const [filtered, setFiltered] = useState<InventoryItem[]>([]);
//   const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
//   const [quantity, setQuantity] = useState<number>(1);
//   const [rows, setRows] = useState<OrderItemRow[]>([]);
  
//   const [globalMarkup, setGlobalMarkup] = useState<number>(20);
//   const [manualTotal, setManualTotal] = useState<string>("");
//   const [notes, setNotes] = useState<string>("");
//   const [itemName, setItemName] = useState<string>(""); // Added for "Item Maker"
//   const [itemCode, setItemCode] = useState<string>(""); // Added for "Item Maker"

//   // 1. Fetch Ingredients and Boxes from DB on mount
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [ingRes, boxRes] = await Promise.all([
//           apiRequest("http://polemis.runflare.run/api/v1/inventory/ingredients", null, "GET"),
//           apiRequest("http://polemis.runflare.run/api/v1/inventory/boxes", null, "GET"),
//         ]);
        
//         const combined = [
//           ...(ingRes.data || []).map((i: any) => ({ ...i, type: "ING" })),
//           ...(boxRes.data || []).map((b: any) => ({ ...b, type: "BOX" })),
//         ];
//         setDbItems(combined);
//       } catch (err) {
//         console.error("Backend Error: Could not load items", err);
//       }
//     };
//     loadData();
//   }, []);

//   const handleSearch = (val: string) => {
//     setQuery(val);
//     if (!val.trim()) { setFiltered([]); return; }
//     setFiltered(dbItems.filter(item => 
//       item.code.toLowerCase().includes(val.toLowerCase()) || 
//       item.name.toLowerCase().includes(val.toLowerCase())
//     ));
//   };

//   const handleAdd = () => {
//     if (!selectedItem || quantity < 1) return;
//     setRows(prev => [...prev, {
//       id: Date.now(),
//       dbId: selectedItem.id,
//       code: selectedItem.code,
//       name: selectedItem.name,
//       quantity,
//       unitPrice: selectedItem.sell_price || 0,
//       type: selectedItem.type
//     }]);
//     setQuery(""); setFiltered([]); setSelectedItem(null); setQuantity(1);
//   };

//   const subtotal = useMemo(() => rows.reduce((sum, row) => sum + row.unitPrice * row.quantity, 0), [rows]);
  
//   const totalAfterMarkup = useMemo(() => {
//     const base = manualTotal.trim() !== "" ? Number(manualTotal) : subtotal;
//     return base + (base * globalMarkup) / 100;
//   }, [manualTotal, subtotal, globalMarkup]);

//   const profitAmount = useMemo(() => totalAfterMarkup - subtotal, [totalAfterMarkup, subtotal]);

//   const handleSave = async () => {
//     if (!itemName || !itemCode || rows.length === 0) {
//       return alert("نام آیتم، کد و حداقل یک ماده اولیه الزامی است.");
//     }
    
//     setLoading(true);

//     /**
//      * BACKEND NOTE:
//      * This follows the 'Item Maker' Module (Docs Page 16-17).
//      * Endpoint: /v1/item-maker/items/create
//      * Payload maps local rows to 'ingredients' and 'boxes' arrays.
//      */
//     const payload = {
//       name: itemName,
//       code: itemCode,
//       description: notes,
//       price: totalAfterMarkup, // Final calculated price
//       ingredients: rows.filter(r => r.type === "ING").map(r => ({
//         id: r.dbId,
//         grams: r.quantity
//       })),
//       boxes: rows.filter(r => r.type === "BOX").map(r => ({
//         id: r.dbId,
//         quantity: r.quantity
//       }))
//     };

//     try {
//       await apiRequest("http://polemis.runflare.run/api/v1/items", payload, "POST");
//       alert("آیتم جدید با موفقیت در منو ثبت شد.");
//       // Reset Form
//       setRows([]); setItemName(""); setItemCode(""); setNotes(""); setManualTotal("");
//     } catch (err) {
//       console.error("Save failed", err);
//       alert("خطا در ثبت آیتم. لطفا ورودی‌ها را چک کنید.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 14 }}
//       animate={{ opacity: 1, y: 0 }}
//       dir="rtl"
//       className="mx-auto w-full max-w-7xl rounded-3xl border border-[var(--secondary)] bg-[var(--ternary)] p-5 shadow-lg lg:p-8"
//     >
//       <div className="mb-7 text-right">
//         <h2 className="text-2xl font-bold text-[var(--primary)]">ساخت محصول جدید (Item Maker)</h2>
//         <p className="mt-1 text-sm text-[var(--primary)]/60">ترکیب مواد اولیه و تعیین قیمت نهایی برای منو</p>
//       </div>

//       <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
//         <div className="space-y-6">
//           {/* Metadata: Product Name & Code */}
//           <div className="grid gap-4 rounded-3xl border border-[var(--secondary)] bg-[var(--bg)] p-5 sm:grid-cols-2">
//             <div>
//               <label className="mb-2 block text-xs font-bold opacity-50 text-right">نام محصول نهایی</label>
//               <input 
//                 value={itemName}
//                 onChange={(e) => setItemName(e.target.value)}
//                 placeholder="مثلاً: لاته زعفرانی" 
//                 className="w-full rounded-xl border border-[var(--secondary)] bg-[var(--ternary)] px-4 py-3 text-right outline-none focus:border-[var(--button)]"
//               />
//             </div>
//             <div>
//               <label className="mb-2 block text-xs font-bold opacity-50 text-right">کد محصول (SKU)</label>
//               <input 
//                 value={itemCode}
//                 onChange={(e) => setItemCode(e.target.value)}
//                 placeholder="مثلاً: LAT-ZAF-01" 
//                 className="w-full rounded-xl border border-[var(--secondary)] bg-[var(--ternary)] px-4 py-3 text-right outline-none focus:border-[var(--button)]"
//               />
//             </div>
//           </div>

//           {/* Search & Add */}
//           <div className="rounded-3xl border border-[var(--secondary)] bg-[var(--bg)] p-5">
//             <div className="grid gap-4 sm:grid-cols-[1fr_120px_auto]">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="جستجوی مواد اولیه یا باکس..."
//                   value={query}
//                   onChange={(e) => handleSearch(e.target.value)}
//                   className="w-full rounded-2xl border border-[var(--secondary)] bg-[var(--ternary)] px-4 py-4 text-right outline-none focus:border-[var(--button)]"
//                 />
//                 <AnimatePresence>
//                   {filtered.length > 0 && (
//                     <motion.ul className="absolute top-full z-20 mt-2 w-full overflow-hidden rounded-2xl border border-[var(--secondary)] bg-[var(--ternary)] shadow-xl max-h-60 overflow-y-auto">
//                       {filtered.map(item => (
//                         <li key={`${item.type}-${item.id}`} onClick={() => { setSelectedItem(item); setQuery(item.name); setFiltered([]) }}
//                             className="cursor-pointer px-4 py-3 text-right hover:bg-[var(--button)] hover:text-white transition border-b border-[var(--secondary)] last:border-none">
//                           <div className="font-medium">{item.name}</div>
//                           <div className="text-xs opacity-60 font-mono">{item.code} ({item.type === "ING" ? "مواد" : "بسته"})</div>
//                         </li>
//                       ))}
//                     </motion.ul>
//                   )}
//                 </AnimatePresence>
//               </div>

//               <input
//                 type="number"
//                 min={1}
//                 value={quantity}
//                 onChange={(e) => setQuantity(Number(e.target.value))}
//                 className="rounded-2xl border border-[var(--secondary)] bg-[var(--ternary)] px-4 py-4 text-center outline-none"
//               />

//               <button onClick={handleAdd} className="rounded-2xl bg-[var(--button)] px-8 py-4 font-bold text-white hover:opacity-90 transition">افزودن</button>
//             </div>

//             {/* Rows Table */}
//             <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--secondary)]">
//               <table className="w-full text-right text-sm">
//                 <thead className="bg-[var(--ternary)] text-[var(--primary)]/50">
//                   <tr>
//                     <th className="p-4">شرح کالا</th>
//                     <th className="p-4 text-center">مقدار (G/Qty)</th>
//                     <th className="p-4">هزینه واحد</th>
//                     <th className="p-4 text-left">عملیات</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[var(--secondary)]">
//                   {rows.map(row => (
//                     <tr key={row.id}>
//                       <td className="p-4">
//                         <div className="font-bold">{row.name}</div>
//                         <div className="text-xs opacity-50 font-mono">{row.code}</div>
//                       </td>
//                       <td className="p-4 text-center font-mono">{row.quantity}</td>
//                       <td className="p-4 font-mono">{row.unitPrice.toLocaleString()}</td>
//                       <td className="p-4 text-left">
//                         <button onClick={() => setRows(prev => prev.filter(r => r.id !== row.id))} className="text-red-400 hover:text-red-600">حذف</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="rounded-3xl border border-[var(--secondary)] bg-[var(--bg)] p-5">
//             <label className="mb-2 block text-sm font-bold text-[var(--primary)]/70 text-right">توضیحات محصول</label>
//             <textarea
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               placeholder="دستورالعمل تهیه یا نکات سرو..."
//               className="h-28 w-full resize-none rounded-2xl border border-[var(--secondary)] bg-[var(--ternary)] p-4 text-right outline-none focus:border-[var(--button)]"
//             />
//           </div>
//         </div>

//         {/* FINANCIAL SUMMARY */}
//         <div className="flex flex-col gap-5">
//           <div className="rounded-3xl border border-[var(--secondary)] bg-[var(--bg)] p-6 shadow-sm">
//             <h3 className="mb-6 text-lg font-bold border-b border-[var(--secondary)] pb-4 text-right">آنالیز قیمت</h3>
            
//             <div className="space-y-5">
//               <div className="flex justify-between items-center text-sm">
//                 <span className="opacity-60">مجموع هزینه تمام شده</span>
//                 <span className="font-mono font-bold">{subtotal.toLocaleString()}</span>
//               </div>

//               <div>
//                 <div className="mb-3 flex justify-between text-sm">
//                   <span className="opacity-60 text-xs">سود (Markup)</span>
//                   <span className="font-bold text-green-500">+{globalMarkup}%</span>
//                 </div>
//                 <input
//                   type="range"
//                   min={0} max={300}
//                   value={globalMarkup}
//                   onChange={(e) => setGlobalMarkup(Number(e.target.value))}
//                   className="w-full accent-green-500"
//                 />
//               </div>

//               <div className="pt-4 border-t border-[var(--secondary)]">
//                 <label className="mb-2 block text-xs opacity-50 text-right">تعدیل دستی هزینه پایه</label>
//                 <input
//                   type="number"
//                   value={manualTotal}
//                   onChange={(e) => setManualTotal(e.target.value)}
//                   placeholder="قیمت پایه جدید..."
//                   className="w-full rounded-xl border border-[var(--secondary)] bg-[var(--ternary)] px-3 py-3 font-mono text-left outline-none"
//                 />
//               </div>

//               <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
//                 <div className="flex justify-between items-center mb-2">
//                    <span className="text-xs text-green-600 font-bold">حاشیه سود</span>
//                    <span className="text-xs text-green-600 font-mono font-bold">+{globalMarkup}%</span>
//                 </div>
//                 <div className="text-2xl font-black text-green-600 font-mono">
//                   +{profitAmount.toLocaleString()}
//                 </div>
//               </div>

//               <div className="rounded-2xl bg-[var(--button)] p-5 text-center text-white shadow-lg">
//                 <div className="text-xs opacity-80 mb-1">قیمت نهایی فروش (واحد)</div>
//                 <div className="text-3xl font-black font-mono">{totalAfterMarkup.toLocaleString()}</div>
//               </div>
//             </div>

//             <button
//               onClick={handleSave}
//               disabled={loading}
//               className="mt-6 w-full rounded-2xl bg-[var(--button)] py-4 font-bold text-white hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50"
//             >
//               {loading ? "در حال ثبت محصول..." : "ثبت در لیست منو"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }


"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "../../api/request"; // Your Axios instance

type InventoryItem = {
  id: number;
  code: string;
  name: string;
  type: "ING" | "BOX";
};

type OrderItemRow = {
  id: number; // local unique id for list keys
  dbId: number; // the ID from the database
  code: string;
  name: string;
  quantity: number;
  type: "ING" | "BOX";
  isCustomizable?: boolean;
  preparationNote?: string;
  wasteFactor?: number;
  isOptional?: boolean;
};

export default function OrderCreate() {
  // --- Data State ---
  const [dbItems, setDbItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // --- Form State ---
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [rows, setRows] = useState<OrderItemRow[]>([]);
  
  // New form fields
  const [productName, setProductName] = useState<string>("");
  const [productCode, setProductCode] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [subcategory, setSubcategory] = useState<string>("");
  const [targetSellPrice, setTargetSellPrice] = useState<string>("");
  const [preparationTime, setPreparationTime] = useState<number>(0);
  const [servingSize, setServingSize] = useState<number>(0);
  const [servingUnit, setServingUnit] = useState<string>("گرم");
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [dailyStockLimit, setDailyStockLimit] = useState<number>(0);
  const [calories, setCalories] = useState<number>(0);
  const [allergens, setAllergens] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  // Helper function to format numbers with commas
  const formatNumber = (num: number | string) => {
    if (num === "" || num === undefined) return "";
    const number = typeof num === "string" ? parseFloat(num.replace(/,/g, "")) : num;
    if (isNaN(number)) return "";
    return number.toLocaleString("en-US");
  };

  // Helper to parse formatted number back to raw number
  const parseFormattedNumber = (value: string) => {
    return parseFloat(value.replace(/,/g, "")) || 0;
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");
    const numberValue = parseFloat(rawValue);
    if (!isNaN(numberValue)) {
      setTargetSellPrice(formatNumber(numberValue));
    } else if (rawValue === "") {
      setTargetSellPrice("");
    }
  };

  // 1. Fetch Ingredients and Boxes from DB on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [ingRes, boxRes] = await Promise.all([
          apiRequest("https://polemis.runflare.run/api/v1/inventory/ingredients", null, "GET"),
          apiRequest("https://polemis.runflare.run/api/v1/inventory/boxes", null, "GET"),
        ]);
        
        const combined = [
          ...(ingRes.data || []).map((i: any) => ({ 
            id: i.id, 
            code: i.code, 
            name: i.name, 
            type: "ING" 
          })),
          ...(boxRes.data || []).map((b: any) => ({ 
            id: b.id, 
            code: b.code, 
            name: b.name, 
            type: "BOX" 
          })),
        ];
        setDbItems(combined);
      } catch (err) {
        console.error("Backend Error: Could not load items", err);
      }
    };
    loadData();
  }, []);

  const handleSearch = (val: string) => {
    setQuery(val);
    if (!val.trim()) { setFiltered([]); return; }
    setFiltered(dbItems.filter(item => 
      item.code.toLowerCase().includes(val.toLowerCase()) || 
      item.name.toLowerCase().includes(val.toLowerCase())
    ));
  };

  const handleAdd = () => {
    if (!selectedItem || quantity < 1) return;
    setRows(prev => [...prev, {
      id: Date.now(),
      dbId: selectedItem.id,
      code: selectedItem.code,
      name: selectedItem.name,
      quantity,
      type: selectedItem.type
    }]);
    setQuery(""); 
    setFiltered([]); 
    setSelectedItem(null); 
    setQuantity(1);
  };

  const handleSave = async () => {
    if (!productName || !productCode || rows.length === 0) {
      return alert("نام محصول، کد و حداقل یک ماده اولیه الزامی است.");
    }
    
    if (!targetSellPrice || parseFormattedNumber(targetSellPrice) <= 0) {
      return alert("لطفا قیمت فروش محصول را وارد کنید.");
    }
    
    setLoading(true);

    const payload = {
      name: productName,
      code: productCode,
      description: description,
      category: category,
      subcategory: subcategory,
      target_sell_price: parseFormattedNumber(targetSellPrice),
      actual_sell_price: parseFormattedNumber(targetSellPrice),
      preparation_time: preparationTime,
      serving_size: servingSize,
      serving_unit: servingUnit,
      is_featured: isFeatured,
      daily_stock_limit: dailyStockLimit,
      calories: calories,
      allergens: allergens ? allergens.split(",").map(a => a.trim()) : [],
      image_url: imageUrl || undefined,
      ingredients: rows.filter(r => r.type === "ING").map(r => ({
        ingredient_id: r.dbId,
        required_grams: r.quantity,
        waste_factor: 0,
        is_optional: false,
        preparation_note: ""
      })),
      boxes: rows.filter(r => r.type === "BOX").map(r => ({
        box_id: r.dbId,
        required_quantity: r.quantity,
        is_default_packaging: true,
        note: ""
      }))
    };

    try {
      await apiRequest("https://polemis.runflare.run/api/v1/items", payload, "POST");
      alert("آیتم جدید با موفقیت در منو ثبت شد.");
      // Reset Form
      setRows([]);
      setProductName("");
      setProductCode("");
      setDescription("");
      setCategory("");
      setSubcategory("");
      setTargetSellPrice("");
      setPreparationTime(0);
      setServingSize(0);
      setServingUnit("گرم");
      setIsFeatured(false);
      setDailyStockLimit(0);
      setCalories(0);
      setAllergens("");
      setImageUrl("");
    } catch (err) {
      console.error("Save failed", err);
      alert("خطا در ثبت آیتم. لطفا ورودی‌ها را چک کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      dir="rtl"
      className="mx-auto w-full max-w-7xl rounded-3xl border border-[var(--secondary)] bg-[var(--ternary)] p-5 shadow-lg lg:p-8"
    >
      <div className="mb-7 text-right">
        <h2 className="text-2xl font-bold text-[var(--primary)]">ساخت محصول جدید (Item Maker)</h2>
        <p className="mt-1 text-sm text-[var(--primary)]/60">ترکیب مواد اولیه و تعیین قیمت نهایی برای منو</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="rounded-3xl border border-[var(--secondary)] bg-[var(--bg)] p-5">
            <h3 className="mb-4 text-lg font-bold text-right">اطلاعات پایه محصول</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold opacity-50 text-right">نام محصول *</label>
                <input 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="مثلاً: پودر کاکائو کیلویی" 
                  className="w-full rounded-xl border border-[var(--secondary)] bg-[var(--ternary)] px-4 py-3 text-right outline-none focus:border-[var(--button)]"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold opacity-50 text-right">کد محصول (SKU) *</label>
                <input 
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  placeholder="مثلاً: COCAMOCATOK2A" 
                  className="w-full rounded-xl border border-[var(--secondary)] bg-[var(--ternary)] px-4 py-3 text-right outline-none focus:border-[var(--button)]"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold opacity-50 text-right">دسته‌بندی</label>
                <input 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="مثلاً: فله ای" 
                  className="w-full rounded-xl border border-[var(--secondary)] bg-[var(--ternary)] px-4 py-3 text-right outline-none focus:border-[var(--button)]"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold opacity-50 text-right">زیردسته</label>
                <input 
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="مثلاً: پودری" 
                  className="w-full rounded-xl border border-[var(--secondary)] bg-[var(--ternary)] px-4 py-3 text-right outline-none focus:border-[var(--button)]"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold opacity-50 text-right">قیمت فروش (تومان) *</label>
                <input 
                  type="text"
                  value={targetSellPrice}
                  onChange={handlePriceChange}
                  placeholder="مثلاً: 800,000" 
                  className="w-full rounded-xl border border-[var(--secondary)] bg-[var(--ternary)] px-4 py-3 text-left font-mono outline-none focus:border-[var(--button)]"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold opacity-50 text-right">زمان آماده‌سازی (دقیقه)</label>
                <input 
                  type="number"
                  value={preparationTime}
                  onChange={(e) => setPreparationTime(Number(e.target.value))}
                  placeholder="مثلاً: 5" 
                  className="w-full rounded-xl border border-[var(--secondary)] bg-[var(--ternary)] px-4 py-3 text-right outline-none focus:border-[var(--button)]"
                />
              </div>
            </div>
          </div>

          {/* Serving & Stock Info */}
          <div className="rounded-3xl border border-[var(--secondary)] bg-[var(--bg)] p-5">
            <h3 className="mb-4 text-lg font-bold text-right">اطلاعات سرو و موجودی</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold opacity-50 text-right">اندازه سرو</label>
                <div className="flex gap-2">
                  <input 
                    type="number"
                    value={servingSize}
                    onChange={(e) => setServingSize(Number(e.target.value))}
                    placeholder="مثلاً: 1220" 
                    className="flex-1 rounded-xl border border-[var(--secondary)] bg-[var(--ternary)] px-4 py-3 text-right outline-none focus:border-[var(--button)]"
                  />
                  <input 
                    value={servingUnit}
                    onChange={(e) => setServingUnit(e.target.value)}
                    placeholder="واحد" 
                    className="w-24 rounded-xl border border-[var(--secondary)] bg-[var(--ternary)] px-4 py-3 text-right outline-none focus:border-[var(--button)]"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold opacity-50 text-right">محدودیت روزانه موجودی</label>
                <input 
                  type="number"
                  value={dailyStockLimit}
                  onChange={(e) => setDailyStockLimit(Number(e.target.value))}
                  placeholder="مثلاً: 10" 
                  className="w-full rounded-xl border border-[var(--secondary)] bg-[var(--ternary)] px-4 py-3 text-right outline-none focus:border-[var(--button)]"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold opacity-50 text-right">کالری (kcal)</label>
                <input 
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  placeholder="مثلاً: 8500" 
                  className="w-full rounded-xl border border-[var(--secondary)] bg-[var(--ternary)] px-4 py-3 text-right outline-none focus:border-[var(--button)]"
                />
              </div>
              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-3">
                  <input 
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-5 w-5 rounded border-[var(--secondary)]"
                  />
                  <span className="text-sm font-bold opacity-70">محصول ویژه</span>
                </label>
              </div>
            </div>
          </div>

          {/* Search & Add Ingredients/Boxes */}
          <div className="rounded-3xl border border-[var(--secondary)] bg-[var(--bg)] p-5">
            <h3 className="mb-4 text-lg font-bold text-right">مواد اولیه و بسته‌بندی</h3>
            <div className="grid gap-4 sm:grid-cols-[1fr_120px_auto]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="جستجوی مواد اولیه یا باکس..."
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full rounded-2xl border border-[var(--secondary)] bg-[var(--ternary)] px-4 py-4 text-right outline-none focus:border-[var(--button)]"
                />
                <AnimatePresence>
                  {filtered.length > 0 && (
                    <motion.ul className="absolute top-full z-20 mt-2 w-full overflow-hidden rounded-2xl border border-[var(--secondary)] bg-[var(--ternary)] shadow-xl max-h-60 overflow-y-auto">
                      {filtered.map(item => (
                        <li key={`${item.type}-${item.id}`} onClick={() => { setSelectedItem(item); setQuery(item.name); setFiltered([]) }}
                            className="cursor-pointer px-4 py-3 text-right hover:bg-[var(--button)] hover:text-white transition border-b border-[var(--secondary)] last:border-none">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs opacity-60 font-mono">{item.code} ({item.type === "ING" ? "مواد اولیه" : "بسته"})</div>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="rounded-2xl border border-[var(--secondary)] bg-[var(--ternary)] px-4 py-4 text-center outline-none"
              />

              <button onClick={handleAdd} className="rounded-2xl bg-[var(--button)] px-8 py-4 font-bold text-white hover:opacity-90 transition">افزودن</button>
            </div>

            {/* Rows Table */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--secondary)]">
              <table className="w-full text-right text-sm">
                <thead className="bg-[var(--ternary)] text-[var(--primary)]/50">
                  <tr>
                    <th className="p-4">شرح کالا</th>
                    <th className="p-4 text-center">مقدار (گرم/تعداد)</th>
                    <th className="p-4 text-left">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--secondary)]">
                  {rows.map(row => (
                    <tr key={row.id}>
                      <td className="p-4">
                        <div className="font-bold">{row.name}</div>
                        <div className="text-xs opacity-50 font-mono">{row.code}</div>
                      </td>
                      <td className="p-4 text-center font-mono">{row.quantity} {row.type === "ING" ? "گرم" : ""}</td>
                      <td className="p-4 text-left">
                        <button onClick={() => setRows(prev => prev.filter(r => r.id !== row.id))} className="text-red-400 hover:text-red-600">حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length === 0 && (
                <div className="p-8 text-center text-sm opacity-50">
                  هیچ آیتمی اضافه نشده است
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="rounded-3xl border border-[var(--secondary)] bg-[var(--bg)] p-5">
            <h3 className="mb-4 text-lg font-bold text-right">اطلاعات تکمیلی</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold opacity-50 text-right">توضیحات محصول</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="دستورالعمل تهیه یا نکات سرو..."
                  className="h-24 w-full resize-none rounded-2xl border border-[var(--secondary)] bg-[var(--ternary)] p-4 text-right outline-none focus:border-[var(--button)]"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold opacity-50 text-right">آلرژن‌ها (با کاما جدا کنید)</label>
                <input
                  value={allergens}
                  onChange={(e) => setAllergens(e.target.value)}
                  placeholder="مثلاً: کافئین, گلوتن, لاکتوز"
                  className="w-full rounded-xl border border-[var(--secondary)] bg-[var(--ternary)] px-4 py-3 text-right outline-none focus:border-[var(--button)]"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold opacity-50 text-right">آدرس تصویر محصول</label>
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border border-[var(--secondary)] bg-[var(--ternary)] px-4 py-3 text-right outline-none focus:border-[var(--button)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button Section */}
        <div className="flex flex-col gap-5">
          <div className="rounded-3xl border border-[var(--secondary)] bg-[var(--bg)] p-6 shadow-sm sticky top-5">
            <h3 className="mb-6 text-lg font-bold border-b border-[var(--secondary)] pb-4 text-right">ثبت محصول</h3>
            
            <div className="space-y-5">
              <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-5 text-center">
                <div className="text-xs opacity-70 mb-2">قیمت فروش نهایی</div>
                <div className="text-3xl font-black text-green-700 font-mono">
                  {targetSellPrice ? `${targetSellPrice} تومان` : "—"}
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="mt-6 w-full rounded-2xl bg-[var(--button)] py-4 font-bold text-white hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50"
            >
              {loading ? "در حال ثبت محصول..." : "ثبت در لیست منو"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}