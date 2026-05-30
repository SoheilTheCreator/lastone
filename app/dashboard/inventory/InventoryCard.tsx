'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { InventoryCardProps, ColumnKey } from '../../types/inventory'

const statusMap: Record<
  'good' | 'medium' | 'low' | 'empty',
  { label: string; className: string }
> = {
  good: {
    label: 'موجود',
    className: 'bg-emerald-100 text-emerald-700',
  },
  medium: {
    label: 'متوسط',
    className: 'bg-amber-100 text-amber-700',
  },
  low: {
    label: 'کم',
    className: 'bg-orange-100 text-orange-700',
  },
  empty: {
    label: 'خالی',
    className: 'bg-rose-100 text-rose-700',
  },
}

const columnMinWidth: Record<ColumnKey, string> = {
  code: 'w-32 shrink-0',
  name: 'min-w-[12rem]',
  status: 'min-w-[7rem]',
  quantity: 'min-w-[6rem]',
  type: 'min-w-[7rem]',
  point_reorder: 'min-w-[8rem]',
  total_weight_grams: 'min-w-[10rem]',
  updatedAt: 'min-w-[9rem]',
}

export default function InventoryCard({
  item,
  mode,
  visibleColumns,
  onToggle,
}: InventoryCardProps) {
  const status = statusMap[item.status]

  const renderCell = (key: ColumnKey) => {
    switch (key) {
      case 'code':
        return <span className="font-bold">{item.code}</span>

      case 'name':
        return <span className="truncate">{item.name}</span>

      case 'status':
        return (
          <span className={`inline-flex rounded-xl px-3 py-1 text-xs font-medium ${status?.className}`}
          >
            {status?.label}
          </span>
        )

      case 'quantity':
        return <span>{item.quantity}</span>

      case 'type':
        return <span>{item.type === 'ingredient' ? 'مواد اولیه' : 'جعبه'}</span>

      case 'point_reorder':
        return (
          <span>
            {item.type === 'ingredient'
              ? item.point_reorder ?? '-'
              : '-'}
          </span>
        )

      case 'total_weight_grams':
        return (
          <span>
            {item.type === 'box' && item.total_weight_grams != null
              ? `${item.total_weight_grams.toLocaleString()} گرم`
              : '-'}
          </span>
        )

      case 'updatedAt':
        return <span>{item.updatedAt ?? '-'}</span>

      default:
        return null
    }
  }

  if (mode === 'row') {
    return (
      <motion.div
        layout
        onClick={onToggle}
        whileHover={{ y: -1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="cursor-pointer rounded-2xl border border-[var(--secondary)] bg-[var(--bg)] px-4 py-3 shadow-sm"
        dir="rtl"
      >
        <div className="flex items-center gap-6 overflow-x-auto text-sm text-[var(--primary)]">
          {visibleColumns.map(column => (
            <div key={column} className={columnMinWidth[column]}>
              {renderCell(column)}
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      onClick={onToggle}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="cursor-pointer rounded-3xl border border-[var(--secondary)] bg-[var(--ternary)] p-6 shadow-md"
      dir="rtl"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="text-xs text-[var(--primary)]/60">کد کالا</div>
          <div className="text-base font-bold text-[var(--primary)]">
            {item.code}
          </div>
        </div>

        <span
          className={`inline-flex rounded-2xl px-3 py-1.5 text-xs font-medium ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoBox title="نام" value={item.name} />
        <InfoBox
          title="نوع"
          value={item.type === 'ingredient' ? 'مواد اولیه' : 'جعبه'}
        />
        <InfoBox title="تعداد" value={String(item.quantity)} />
        <InfoBox title="آخرین بروزرسانی" value={item.updatedAt ?? '-'} />

        <InfoBox
          title="نقطه سفارش"
          value={
            item.type === 'ingredient'
              ? String(item.point_reorder ?? '-')
              : '-'
          }
        />

        <InfoBox
          title="وزن کل"
          value={
            item.type === 'box' && item.total_weight_grams != null
              ? `${item.total_weight_grams.toLocaleString()} گرم`
              : '-'
          }
        />
      </div>

      <div className="mt-5 text-xs text-[var(--primary)]/55">
        برای بستن، دوباره روی کارت کلیک کنید
      </div>
    </motion.div>
  )
}

function InfoBox({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[var(--bg)] p-4">
      <div className="mb-1 text-xs text-[var(--primary)]/60">{title}</div>
      <div className="text-sm font-semibold text-[var(--primary)]">{value}</div>
    </div>
  )
}
