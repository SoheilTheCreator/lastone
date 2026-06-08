// 'use client'
// import React, { useState } from 'react'
// import { motion } from 'framer-motion'
// import { apiRequest } from '../../api/request'
// import toast from 'react-hot-toast'

// export default function InventoryCreate() {
//   const [loading, setLoading] = useState(false)

//   const [type, setType] = useState<'ingredient' | 'box'>('ingredient')

//   const [form, setForm] = useState({
//     name: '',
//     code: '',
//     reorder_point: '',
//   })

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     setLoading(true)

//     const endpoint =
//       type === 'ingredient'
//         ? 'http://polemis.runflare.run/api/v1/inventory/products/create'
//         : 'http://polemis.runflare.run/api/v1/inventory/boxes'

//     const payload =
//       type === 'ingredient'
//         ? {
//             name: form.name,
//             code: form.code,
//             reorder_point: Number(form.reorder_point),
//           }
//         : {
//             name: form.name,
//             code: form.code,
//             total_weight_grams: Number(form.reorder_point),
//           }

//     try {
//       // wait for request
//       const response = await apiRequest(endpoint, payload, 'POST')

//       console.log(response)

//       // success toast
//       toast.success(
//         response?.message || 'با موفقیت ثبت شد'
//       )

//       // optional reset form
//       setForm({
//         name: '',
//         code: '',
//         reorder_point: '',
//       })

//     } catch (error: any) {
//       console.error(error)

//       // error toast
//       toast.error(
//         error?.response?.data?.message ||
//         'خطا در ثبت اطلاعات'
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 14 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.35, ease: 'easeOut' }}
//       className="mx-auto w-full max-w-2xl rounded-3xl border border-[var(--secondary)] bg-[var(--ternary)] p-5 shadow-lg sm:p-6 lg:p-8"
//     >
//       <div className="mb-7 text-center">
//         <h2 className="text-xl font-semibold text-[var(--primary)] sm:text-2xl">
//           ایجاد کالا
//         </h2>

//         <p className="mt-2 text-sm leading-6 text-[var(--primary)]/70">
//           نوع کالا را انتخاب کن، بعد اطلاعات اصلی را وارد کن
//         </p>
//       </div>

//       <div className="mb-7 grid grid-cols-1 gap-3 rounded-3xl bg-[var(--secondary)] p-3 sm:grid-cols-2">
//         <button
//           type="button"
//           className={`rounded-2xl px-4 py-4 text-sm font-medium transition-all ${
//             type === 'ingredient'
//               ? 'bg-[var(--button)] text-[var(--font-alt)] shadow-sm'
//               : 'bg-transparent text-[var(--primary)] hover:bg-[var(--bg)]'
//           }`}
//           onClick={() => setType('ingredient')}
//         >
//           مواد اولیه
//         </button>

//         <button
//           type="button"
//           className={`rounded-2xl px-4 py-4 text-sm font-medium transition-all ${
//             type === 'box'
//               ? 'bg-[var(--button)] text-[var(--font-alt)] shadow-sm'
//               : 'bg-transparent text-[var(--primary)] hover:bg-[var(--bg)]'
//           }`}
//           onClick={() => setType('box')}
//         >
//           جعبه
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="grid gap-4 sm:gap-5">
//         <input
//           type="text"
//           placeholder="نام کالا"
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//           className="w-full rounded-2xl border border-[var(--secondary)] bg-[var(--bg)] px-4 py-4 outline-none transition focus:border-[var(--button)]"
//         />

//         <input
//           type="text"
//           placeholder="کد کالا"
//           value={form.code}
//           onChange={(e) => setForm({ ...form, code: e.target.value })}
//           className="w-full rounded-2xl border border-[var(--secondary)] bg-[var(--bg)] px-4 py-4 outline-none transition focus:border-[var(--button)]"
//         />

//         <input
//           type="number"
//           placeholder="نقطه سفارش مجدد"
//           value={form.reorder_point}
//           onChange={(e) =>
//             setForm({ ...form, reorder_point: e.target.value })
//           }
//           className="w-full rounded-2xl border border-[var(--secondary)] bg-[var(--bg)] px-4 py-4 outline-none transition focus:border-[var(--button)]"
//         />

//         <motion.button
//           type="submit"
//           disabled={loading}
//           whileHover={{ scale: 1.01 }}
//           whileTap={{ scale: 0.99 }}
//           transition={{ duration: 0.15 }}
//           className="mt-2 rounded-2xl bg-[var(--button)] py-4 font-medium text-[var(--font-alt)] transition hover:opacity-90 disabled:opacity-60"
//         >
//           {loading
//             ? 'در حال ثبت...'
//             : `ثبت ${type === 'ingredient' ? 'مواد اولیه' : 'جعبه'} جدید`}
//         </motion.button>
//       </form>
//     </motion.div>
//   )
// }


'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { apiRequest } from '../../api/request'
import toast from 'react-hot-toast'

export default function InventoryCreate() {
  const [loading, setLoading] = useState(false)

  const [type, setType] = useState<'ingredient' | 'box'>('ingredient')

  const [form, setForm] = useState({
    name: '',
    code: '',
    reorder_point: '',
    price: '', // Added price field
    unit: '', // Added unit field for ingredients
    total_weight_grams: '', // For boxes
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!form.name.trim()) {
      toast.error('نام کالا الزامی است')
      return
    }
    
    if (!form.code.trim()) {
      toast.error('کد کالا الزامی است')
      return
    }

    setLoading(true)

    // Corrected endpoints
    const endpoint =
      type === 'ingredient'
        ? 'https://polemis.runflare.run/api/v1/inventory/ingredients'
        : 'https://polemis.runflare.run/api/v1/inventory/boxes'

    // Corrected payload based on typical API expectations
    const payload =
      type === 'ingredient'
        ? {
            name: form.name,
            code: form.code,
            reorder_point: Number(form.reorder_point) || 0,
          
          }
        : {
            name: form.name,
            code: form.code,
            reorder_point: Number(form.reorder_point) || 0,
          }

    console.log('Sending to:', endpoint)
    console.log('Payload:', payload)

    try {
      const response = await apiRequest(endpoint, payload, 'POST')
      console.log('Response:', response)

      toast.success(
        response?.message || `${type === 'ingredient' ? 'مواد اولیه' : 'جعبه'} با موفقیت ثبت شد`
      )

      // Reset form
      setForm({
        name: '',
        code: '',
        reorder_point: '',
        price: '',
        unit: '',
        total_weight_grams: '',
      })

    } catch (error: any) {
      console.error('Error details:', error)
      
      // Better error message
      const errorMessage = 
        error?.response?.data?.message ||
        error?.response?.data?.errors?.join(', ') ||
        error?.message ||
        'خطا در ثبت اطلاعات'
      
      toast.error(errorMessage)
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
        <h2 className="text-xl font-semibold text-[var(--primary)] sm:text-2xl">
          ایجاد کالا
        </h2>

        <p className="mt-2 text-sm leading-6 text-[var(--primary)]/70">
          نوع کالا را انتخاب کن، بعد اطلاعات اصلی را وارد کن
        </p>
      </div>

      <div className="mb-7 grid grid-cols-1 gap-3 rounded-3xl bg-[var(--secondary)] p-3 sm:grid-cols-2">
        <button
          type="button"
          className={`rounded-2xl px-4 py-4 text-sm font-medium transition-all ${
            type === 'ingredient'
              ? 'bg-[var(--button)] text-[var(--font-alt)] shadow-sm'
              : 'bg-transparent text-[var(--primary)] hover:bg-[var(--bg)]'
          }`}
          onClick={() => setType('ingredient')}
        >
          مواد اولیه
        </button>

        <button
          type="button"
          className={`rounded-2xl px-4 py-4 text-sm font-medium transition-all ${
            type === 'box'
              ? 'bg-[var(--button)] text-[var(--font-alt)] shadow-sm'
              : 'bg-transparent text-[var(--primary)] hover:bg-[var(--bg)]'
          }`}
          onClick={() => setType('box')}
        >
          جعبه
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:gap-5">
        <input
          type="text"
          placeholder="نام کالا *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-2xl border border-[var(--secondary)] bg-[var(--bg)] px-4 py-4 outline-none transition focus:border-[var(--button)]"
          required
        />

        <input
          type="text"
          placeholder="کد کالا *"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          className="w-full rounded-2xl border border-[var(--secondary)] bg-[var(--bg)] px-4 py-4 outline-none transition focus:border-[var(--button)]"
          required
        />

        {type === 'ingredient' && (
          <>
            <input
              type="text"
              placeholder="واحد (مثلاً: kg, gr, لیتر)"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full rounded-2xl border border-[var(--secondary)] bg-[var(--bg)] px-4 py-4 outline-none transition focus:border-[var(--button)]"
            />
            
            
          </>
        )}

        

        <input
          type="number"
          placeholder="نقطه سفارش مجدد (حداقل موجودی)"
          value={form.reorder_point}
          onChange={(e) => setForm({ ...form, reorder_point: e.target.value })}
          className="w-full rounded-2xl border border-[var(--secondary)] bg-[var(--bg)] px-4 py-4 outline-none transition focus:border-[var(--button)]"
        />

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.15 }}
          className="mt-2 rounded-2xl bg-[var(--button)] py-4 font-medium text-[var(--font-alt)] transition hover:opacity-90 disabled:opacity-60"
        >
          {loading
            ? 'در حال ثبت...'
            : `ثبت ${type === 'ingredient' ? 'مواد اولیه' : 'جعبه'} جدید`}
        </motion.button>
      </form>
    </motion.div>
  )
}