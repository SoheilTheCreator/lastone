'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { PencilIcon } from '@heroicons/react/24/outline';

type DashboardHomeProps = {
  permissions?: string[];
};

export default function DashboardHome({ permissions = [] }: DashboardHomeProps) {
  const { screenName } = useAuth();
  const [imageUrl] = useState<string | null>(null);
  const name = screenName || 'اطلاعاتی ثبت نشده';

  const actions = [
    { key: 'inventory', title: 'انبارداری', subtitle: 'مدیریت کالاها' },
    { key: 'tickets', title: 'تیکت‌ها', subtitle: 'پیگیری درخواست‌ها' },
    { key: 'analytics', title: 'تحلیل‌ها', subtitle: 'بینش‌های کسب‌وکار' },
    { key: 'users', title: 'کاربران', subtitle: 'مدیریت دسترسی‌ها' },
  ] as const;

  return (
    <section dir="rtl" className="w-full max-w-6xl mx-auto p-6 h-[85vh]">
      {/* Background espresso surface */}
      <div
        className="w-full h-full rounded-3xl border border-[var(--secondary)] bg-[var(--bg)] shadow-sm overflow-hidden"
      >
        <div className="p-6 h-full flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-full">
            {/* -------- Profile Bento -------- */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="col-span-1 rounded-2xl border border-[var(--secondary)] bg-[var(--ternary)] shadow-sm p-6 flex flex-col items-center"
            >
              {/* Avatar */}
              <div className="relative">
                <div
                  className="w-28 h-28 rounded-full overflow-hidden border-4 border-[var(--secondary)] bg-[var(--secondary)] shadow-sm"
                >
                  <img
                    src={imageUrl || '/profile-placeholder.jpg'}
                    className="w-full h-full object-cover"
                    alt="profile"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => alert('Edit image modal…')}
                  className="absolute -bottom-3 -left-3 w-9 h-9 rounded-full flex items-center justify-center border border-[var(--primary)]
                    bg-[var(--button)] text-[var(--button-text)] shadow-md"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Name + edit (clean alignment) */}
              <div className="mt-6 w-full text-center flex flex-col items-center">
                <p className="text-lg font-bold leading-tight text-[var(--primary)]">
                  {name}
                </p>

                <button
                  type="button"
                  onClick={() => alert('Edit name modal…')}
                  className="mt-3 w-7 h-7 rounded-full flex items-center justify-center border border-[var(--primary)]
                    bg-[var(--secondary)] shadow-sm"
                >
                  <PencilIcon className="w-4 h-4 text-[var(--primary)]" />
                </button>

                <p className="text-xs mt-3 text-[var(--primary)]">
                  ویرایش اطلاعات کاربری
                </p>
              </div>
            </motion.div>

            {/* -------- Quick Access Bento -------- */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38 }}
              className="col-span-1 md:col-span-2 lg:col-span-3 rounded-2xl border border-[var(--secondary)]
                bg-[var(--ternary)] shadow-sm p-6"
            >
              <h3 className="text-sm font-medium mb-4 text-[var(--primary)]">
                دسترسی سریع
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {actions.map((a) =>
                  permissions.includes(a.key) ? (
                    <BentoAction key={a.key} title={a.title} subtitle={a.subtitle} />
                  ) : (
                    <NoDataCard key={a.key} />
                  )
                )}
              </div>
            </motion.div>

            {/* -------- Stats Bento -------- */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42 }}
              className="col-span-1 rounded-2xl border border-[var(--secondary)] bg-[var(--ternary)] shadow-sm p-6"
            >
              <h3 className="text-sm font-medium mb-3 text-[var(--primary)]">آمار کلی</h3>
              <div className="space-y-3 text-sm">
                <StatItem label="کالاهای ثبت شده" value={128} />
                <StatItem label="تیکت‌های باز" value={5} />
                <StatItem label="کاربران فعال" value={21} />
              </div>
            </motion.div>

            {/* -------- Recent Activity Bento -------- */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="col-span-1 md:col-span-2 lg:col-span-3 rounded-2xl border border-[var(--secondary)]
                bg-[var(--ternary)] shadow-sm p-6 overflow-y-auto"
            >
              <h3 className="text-sm font-medium mb-4 text-[var(--primary)]">
                فعالیت‌های اخیر
              </h3>

              <ul className="space-y-3 text-sm text-[var(--primary)]">
                <li className="rounded-xl p-3 bg-[var(--secondary)] border border-[var(--secondary)]">
                  کالا‌ی “Laptop 14” اضافه شد
                </li>
                <li className="rounded-xl p-3 bg-[var(--secondary)] border border-[var(--secondary)]">
                  کاربر “مریم” وارد شد
                </li>
                <li className="rounded-xl p-3 bg-[var(--secondary)] border border-[var(--secondary)]">
                  تیکت جدید توسط “رضا” ثبت شد
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Components ---------------- */

function BentoAction({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="rounded-xl p-4 border shadow-sm cursor-pointer select-none
        bg-[var(--secondary)] border-[var(--secondary)]"
    >
      <p className="font-semibold text-sm text-[var(--primary)]">{title}</p>
      <p className="text-xs mt-1 text-[var(--primary)]">{subtitle}</p>
    </motion.div>
  );
}

function NoDataCard() {
  return (
    <div
      className="rounded-xl p-4 flex items-center justify-center text-xs border border-dashed
        bg-[var(--secondary)]"
      style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
    >
      داده‌ای ندارد
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[var(--primary)]">{label}</span>
      <span className="font-semibold text-[var(--primary)]">{value ?? '—'}</span>
    </div>
  );
}
