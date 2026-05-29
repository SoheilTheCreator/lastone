'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiRequest } from '../../api/request'

interface InventoryItem {
  id: number;
  code: string;
  type: 'ING' | 'BOX';
}

export default function InventoryTransaction() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filtered, setFiltered] = useState<InventoryItem[]>([]);
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [quantity, setQuantity] = useState<number>(0)
  const [entityType, setEntityType] = useState<'BOX' | 'ING'>('ING')
  const [transactionReason, setTransactionReason] = useState<'expiry' | 'waste' | 'usage' | 'purchase'>('purchase')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const [ingRes, boxRes] = await Promise.all([
          apiRequest('http://polemis.runflare.run/api/v1/inventory/ingredients', null, 'GET'),
          apiRequest('http://polemis.runflare.run/api/v1/inventory/boxes', null, 'GET')
        ]);

        const combined: InventoryItem[] = [
          ...ingRes.data.map((i: any) => ({ id: i.id, code: i.code, type: 'ING' })),
          ...boxRes.data.map((b: any) => ({ id: b.id, code: b.code, type: 'BOX' }))
        ];

        setItems(combined);
      } catch (err) {
        console.error("Fetch error", err);
      }
    };
    fetchInventory();
  }, []);

  const handleSearch = (val: string) => {
    setQuery(val)

    const filteredItems = items
      .filter(i => i.type === entityType)
      .filter(i => i.code.toLowerCase().includes(val.toLowerCase()))

    setFiltered(filteredItems)
    setShowDropdown(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedItem || quantity <= 0)
      return alert('باید کالا و مقدار معتبر وارد کنید')

    setLoading(true)

    const isBox = entityType === 'BOX'
    const signedQuantity = transactionReason === 'purchase' ? quantity : quantity * -1

    const endpoint =
      'http://polemis.runflare.run/api/v1/inventory/transactions'

    const payload = isBox
      ? {
          entity_id: selectedItem.id,
          entity_type: isBox ? 'box' : 'ingredient',
          transaction_type: transactionReason,
          quantity_effect: signedQuantity,
          input_quantity: 1
        }
      : {
          entity_id: selectedItem.id,
          entity_type: isBox ? 'box' : 'ingredient',
          transaction_type: transactionReason,
          input_quantity: 1,
          grams_effect: signedQuantity
        }

    try {
      await apiRequest(endpoint, payload, 'POST')

      alert(`تراکنش با موفقیت ثبت شد`)

      setQuery('')
      setQuantity(0)
      setSelectedItem(null)

    } catch (err) {
      alert('خطا در ثبت تراکنش')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-2xl rounded-3xl border border-[var(--secondary)] bg-[var(--ternary)] p-5 shadow-lg sm:p-6 lg:p-8"
    >

      <div className="mb-7 text-center">
        <h2 className="text-xl font-semibold text-[var(--primary)] sm:text-2xl">مدیریت تراکنش انبار</h2>
        <p className="mt-2 text-sm text-[var(--primary)]/70">ورود یا خروج کالا از موجودی فعلی</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">

        {/* BOX / ING Toggle */}
        <div className="flex gap-2 p-1 bg-[var(--bg)] rounded-2xl border border-[var(--secondary)]">
          <button
            type="button"
            onClick={() => {
              setEntityType('BOX')
              setSelectedItem(null)
              setQuery('')
            }}
            className={`flex-1 py-2 rounded-xl transition ${entityType === 'BOX' ? 'bg-[var(--button)] text-white' : 'text-[var(--primary)]'}`}
          >
            جعبه
          </button>

          <button
            type="button"
            onClick={() => {
              setEntityType('ING')
              setSelectedItem(null)
              setQuery('')
            }}
            className={`flex-1 py-2 rounded-xl transition ${entityType === 'ING' ? 'bg-[var(--button)] text-white' : 'text-[var(--primary)]'}`}
          >
            مواد اولیه
          </button>
        </div>

        {/* Transaction Type */}
        <select
          value={transactionReason}
          onChange={(e) => setTransactionReason(e.target.value as any)}
          className="w-full rounded-2xl border border-[var(--secondary)] bg-[var(--bg)] px-4 py-4 outline-none text-right"
          dir="rtl"
        >
          <option value="purchase">خرید (Purchase)</option>
          <option value="usage">مصرف (Usage)</option>
          <option value="waste">ضایعات (Waste)</option>
          <option value="expiry">انقضا (Expiry)</option>
        </select>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="جستجوی کد کالا..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            className="w-full rounded-2xl border border-[var(--secondary)] bg-[var(--bg)] px-4 py-4 outline-none text-right"
            dir="rtl"
          />

          <AnimatePresence>
            {showDropdown && filtered.length > 0 && (
              <motion.ul className="absolute top-full z-10 mt-2 w-full max-h-48 overflow-y-auto rounded-2xl border border-[var(--secondary)] bg-[var(--ternary)] shadow-xl">
                {filtered.map((item) => (
                  <li
                    key={`${item.type}-${item.id}`}
                    onClick={() => {
                      setSelectedItem(item)
                      setQuery(item.code)
                      setShowDropdown(false)
                    }}
                    className="cursor-pointer px-4 py-3 hover:bg-[var(--button)] hover:text-white text-right"
                  >
                    {item.code} ({item.type === 'BOX' ? 'باکس' : 'ماده'})
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Quantity */}
        <input
          type="number"
          placeholder="مقدار تراکنش"
          value={quantity || ''}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full rounded-2xl border border-[var(--secondary)] bg-[var(--bg)] px-4 py-4 outline-none text-right"
        />

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.98 }}
          className="mt-2 rounded-2xl bg-[var(--button)] py-4 font-medium text-[var(--font-alt)] disabled:opacity-50"
        >
          {loading ? 'در حال پردازش...' : 'ثبت تراکنش'}
        </motion.button>

      </form>
    </motion.div>
  )
}
