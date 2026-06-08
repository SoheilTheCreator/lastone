'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiGetAll, apiRequest } from '../../api/request' // Uses your baseAxios with JWT headers

// 1. Define the shape of the inventory items for TypeScript
interface InventoryItem {
  id: number;
  code: string;
  type: 'ING' | 'BOX'; // ING = Ingredient, BOX = Box
}

export default function InventoryStock() {
  // State for raw data from DB and filtered results for UI
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filtered, setFiltered] = useState<InventoryItem[]>([]);
  
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [quantity, setQuantity] = useState<number>(0)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [loading, setLoading] = useState(false)

  // 2. FETCH DATA FROM BACKEND ON MOUNT
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        /** * BACKEND NOTE: 
         * Fetching ingredients from Page 5/6 and boxes from Page 12
         */
        const [ingRes, boxRes] = await Promise.all([
          apiGetAll('https://polemis.runflare.run/api/v1/inventory/ingredients'),
          apiGetAll('https://polemis.runflare.run/api/v1/inventory/boxes')
        ]);

        const ingredients: InventoryItem[] = ingRes.data.map((i: any) => ({ 
          id: i.id, 
          code: i.code, 
          type: 'ING' 
        }));

        const boxes: InventoryItem[] = boxRes.data.map((b: any) => ({ 
          id: b.id, 
          code: b.code, 
          type: 'BOX' 
        }));

        const combined = [...ingredients, ...boxes];
        setItems(combined);
      } catch (err) {
        console.error("BACKEND ERROR: Check if GET /ingredients and /boxes are working", err);
      }
    };

    fetchInventory();
  }, []);

  const handleSearch = (val: string) => {
    setQuery(val)
    const matches = items.filter((item) =>
      item.code.toLowerCase().includes(val.toLowerCase())
    )
    setFiltered(matches)
    setShowDropdown(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItem) return alert('لطفاً یک کد معتبر انتخاب کنید')
    setLoading(true)

    const isBox = selectedItem.type === 'BOX'
    
    /**
     * BACKEND NOTE: Routing & Payload Logic
     * Ingredients -> /v1/inventory/products/stock (Page 2)
     * Boxes       -> /v1/inventory/boxes/stock (Page 3)
     */
    const endpoint = isBox
      ? 'https://polemis.runflare.run/api/v1/inventory/boxes/stock'
      : 'https://polemis.runflare.run/api/v1/inventory/products/stock'

    const payload = isBox
      ? {
          box_id: selectedItem.id,
          quantity: quantity
        }
      : {
          ingredient_id: selectedItem.id,
          quantity_grams: quantity,    
          available_grams: quantity // Documentation: "Both take the same value"
        }

    try {
      await apiRequest(endpoint, payload, 'POST')
      alert('موجودی با موفقیت در دیتابیس ثبت شد')
      
      // Reset Form
      setQuery('')
      setQuantity(0)
      setSelectedItem(null)
    } catch (err) {
      console.error('Submission error:', err)
      alert('خطا در ثبت موجودی. کد خطا را در کنسول چک کنید.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mx-auto w-full max-w-2xl rounded-3xl border border-[var(--secondary)] bg-[var(--ternary)] p-5 shadow-lg sm:p-6 lg:p-8"
    >
      <div className="mb-7 text-center">
        <h2 className="text-xl font-semibold text-[var(--primary)] sm:text-2xl"> ثبت موجودی اولیه</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--primary)]/70">
          انتخاب کالا از دیتابیس و تنظیم مقدار اولیه انبار
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:gap-5">
        <div className="relative">
          <input
            type="text"
            placeholder="جستجوی کد کالا (مثلا ING001)..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            className="w-full rounded-2xl border border-[var(--secondary)] bg-[var(--bg)] px-4 py-4 outline-none transition focus:border-[var(--button)] text-right"
            dir="rtl"
          />

          <AnimatePresence>
            {showDropdown && filtered.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full z-10 mt-2 w-full max-h-60 overflow-y-auto rounded-2xl border border-[var(--secondary)] bg-[var(--ternary)] shadow-lg"
              >
                {filtered.map((item) => (
                  <li
                    key={`${item.type}-${item.id}`}
                    onClick={() => {
                      setSelectedItem(item)
                      setQuery(item.code)
                      setShowDropdown(false)
                    }}
                    className="cursor-pointer px-4 py-3 transition hover:bg-[var(--button)] hover:text-[var(--font-alt)] text-right"
                  >
                    {item.code} <span className="text-xs opacity-60">({item.type === 'BOX' ? 'باکس' : 'ماده اولیه'})</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <input
          type="number"
          placeholder={selectedItem?.type === 'BOX' ? 'تعداد باکس (عدد)' : 'وزن اولیه (گرم)'}
          value={quantity || ''}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full rounded-2xl border border-[var(--secondary)] bg-[var(--bg)] px-4 py-4 outline-none transition focus:border-[var(--button)] text-right"
        />

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="mt-2 rounded-2xl bg-[var(--button)] py-4 font-medium text-[var(--font-alt)] transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'در حال ثبت...' : 'ثبت موجودی'}
        </motion.button>
      </form>
    </motion.div>
  )
}