'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import OrderCreate from '../orders/OrderCreate'
import OrderViewer from '../orders/OrderViewer'

export default function OrderManager() {
  const [activeMiniTab, setActiveMiniTab] = useState<number>(1)

  const tabs = [
    { id: 1, label: 'ایجاد سفارش' },
    { id: 2, label: 'مشاهده سفارش‌ها' },
  ]

  return (
    <div
      dir="rtl"
      className="min-h-[80vh] w-full bg-[var(--bg)] px-4 py-6 text-[var(--primary)] sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="mx-auto flex w-full max-w-7xl flex-col gap-6"
      >
        <div className="rounded-3xl border border-[var(--secondary)] bg-[var(--ternary)] p-3 shadow-sm">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {tabs.map((t) => {
              const active = activeMiniTab === t.id
              return (
                <motion.button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveMiniTab(t.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.15 }}
                  className={`rounded-2xl px-4 py-4 text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-[var(--button)] text-[var(--font-alt)] shadow-md'
                      : 'bg-[var(--bg)] text-[var(--primary)] hover:bg-[var(--secondary)]'
                  }`}
                >
                  {t.label}
                </motion.button>
              )
            })}
          </div>
        </div>

        <motion.div
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center px-0 py-2 sm:px-2 sm:py-4"
        >
          <div className="w-full">
            {activeMiniTab === 1 && <OrderCreate />}
            {activeMiniTab === 2 && <OrderViewer />}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}