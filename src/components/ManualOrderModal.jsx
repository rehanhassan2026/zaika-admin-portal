import React, { useState } from 'react'
import { X, Plus, Minus, Check, AlertCircle, ShoppingBag } from 'lucide-react'

const MENU_PRESETS = [
  { id: 'dish-1', name: 'Royal Dum Mutton Biryani', price: 1350 },
  { id: 'dish-2', name: 'Special Chicken Seekh Kabab', price: 890 },
  { id: 'dish-3', name: 'Royal Beef Bihari Boti', price: 1150 },
  { id: 'dish-4', name: 'Charcoal Chicken Malai Boti', price: 950 },
  { id: 'dish-5', name: 'Slow-Dum Beef Nihari', price: 1200 },
  { id: 'dish-6', name: 'Paneer Reshmi Handi', price: 990 },
  { id: 'dish-7', name: 'Garlic Roghani Naan', price: 150 },
  { id: 'dish-8', name: 'Royal Shahi Kheer', price: 450 },
]

export function ManualOrderModal({ isOpen, onClose, onCreateOrder }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [quantities, setQuantities] = useState({})
  const [customDish, setCustomDish] = useState({ name: '', price: '' })
  const [customItems, setCustomItems] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  const handleQtyChange = (dishId, delta) => {
    setQuantities(prev => {
      const cur = prev[dishId] || 0
      const next = Math.max(0, cur + delta)
      return { ...prev, [dishId]: next }
    })
  }

  const handleAddCustom = (e) => {
    e.preventDefault()
    if (!customDish.name || !customDish.price) return
    setCustomItems(prev => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: customDish.name.trim(),
        price: Number(customDish.price),
        quantity: 1,
      },
    ])
    setCustomDish({ name: '', price: '' })
  }

  // Calculate items and total
  const selectedPresetItems = MENU_PRESETS
    .filter(p => (quantities[p.id] || 0) > 0)
    .map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: quantities[p.id],
    }))

  const allItems = [...selectedPresetItems, ...customItems]
  const totalAmount = allItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg('Please fill in Customer Name, Phone, and Address!')
      return
    }

    if (allItems.length === 0) {
      setErrorMsg('Please add at least one dish to the order!')
      return
    }

    setErrorMsg('')
    setIsSubmitting(true)

    try {
      const result = await onCreateOrder({
        customer_name: name,
        customer_phone: phone,
        customer_address: address,
        notes,
        items: allItems,
        total_amount: totalAmount,
        status: 'Pending',
        payment_method: 'Cash on Delivery',
      })

      if (result.success) {
        setName('')
        setPhone('')
        setAddress('')
        setNotes('')
        setQuantities({})
        setCustomItems([])
        onClose()
      } else {
        setErrorMsg(result.error || 'Failed to save order to database')
      }
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white font-serif">Create Manual Order</h3>
              <p className="text-xs text-neutral-400">Take a phone or counter order into Supabase</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Customer Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tariq Mehmood"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                Contact Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="0300 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                Full Delivery Address *
              </label>
              <input
                type="text"
                required
                placeholder="House / Flat #, Street, Phase / Block, Area, Karachi"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                Kitchen / Delivery Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Extra raita, mild spice, ring the bell"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Quick Menu Dish Selectors */}
          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
              Select Signature Dishes
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MENU_PRESETS.map((dish) => {
                const qty = quantities[dish.id] || 0
                return (
                  <div
                    key={dish.id}
                    className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-850 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-white">{dish.name}</p>
                      <p className="text-[10px] font-mono text-amber-400">Rs. {dish.price.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(dish.id, -1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center font-mono font-bold text-amber-400">{qty}</span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(dish.id, 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Total & Submit Button */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between pt-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">Total Amount</span>
              <span className="text-xl font-black text-amber-400 font-mono">
                Rs. {totalAmount.toLocaleString()} PKR
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || allItems.length === 0}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider transition disabled:opacity-50 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              {isSubmitting ? 'Saving to Database...' : 'Save & Confirm Order'}
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}
