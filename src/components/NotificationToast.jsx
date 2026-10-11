import React from 'react'
import { Bell, X, ArrowRight } from 'lucide-react'

export function NotificationToast({ order, onClose, onView }) {
  if (!order) return null

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full bg-neutral-900 border border-amber-500/50 rounded-2xl shadow-2xl p-4 animate-fadeIn">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 animate-bounce">
          <Bell className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
              New Order Received!
            </span>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-white transition p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-sm font-bold text-white truncate mt-0.5">
            #{order.ref_id} · {order.customer_name}
          </p>
          <p className="text-xs text-neutral-300 font-mono mt-0.5">
            Rs. {Number(order.total_amount || 0).toLocaleString()} PKR
          </p>

          <button
            onClick={() => {
              onView(order)
              onClose()
            }}
            className="mt-2.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>View &amp; Dispatch Order</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

