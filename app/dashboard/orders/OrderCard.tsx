'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Order } from '../../types/order'

interface OrderCardProps {
  order: Order
  onDelete: (id: number) => void
  onConfirm: (id: number) => void
}

const statusStyles: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-purple-100 text-purple-700',
}

export function OrderCard({ order, onDelete, onConfirm }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border-b border-[var(--secondary)] last:border-none">
      {/* TABLE STYLE ROW (Compact) */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex cursor-pointer items-center px-4 py-4 transition hover:bg-[var(--secondary)]/20"
      >
        <div className="w-20 font-mono text-sm text-[var(--primary)]/70">#{order.id}</div>
        <div className="flex-1 font-medium">{order.items.length} آیتم</div>
        <div className="w-32">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status]}`}>
            {order.status}
          </span>
        </div>
        <div className="w-40 text-left font-semibold text-[var(--primary)]">
          {order.total_amount.toLocaleString()} تومان
        </div>
      </div>

      {/* EXPANDED DETAILS */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[var(--ternary)]/30"
          >
            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]/50">جزئیات آیتم‌ها</h4>
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between rounded-xl bg-[var(--bg)] p-3 text-sm border border-[var(--secondary)]">
                    <span>{item.quantity}x {item.item_name}</span>
                    <span className="font-mono">{item.total_price.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Order Actions & Summary */}
              <div className="flex flex-col justify-between space-y-4 text-left">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]/50">یادداشت</h4>
                  <p className="mt-1 text-sm text-[var(--primary)]/80">{order.notes || 'بدون یادداشت'}</p>
                </div>

                <div className="flex justify-end gap-3 border-t border-[var(--secondary)] pt-4">
                  {order.status === 'draft' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onConfirm(order.id); }}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition"
                    >
                      تایید سفارش
                    </button>
                  )}
                  <button className="rounded-xl bg-[var(--secondary)] px-4 py-2 text-sm transition hover:opacity-80">
                    ویرایش
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(order.id); }}
                    className="rounded-xl bg-red-100 px-4 py-2 text-sm text-red-600 hover:bg-red-200 transition"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}