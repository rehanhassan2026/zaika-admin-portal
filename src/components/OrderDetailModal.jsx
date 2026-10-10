import React, { useState } from 'react'
import {
  X,
  Phone,
  MapPin,
  Clock,
  Printer,
  Copy,
  Check,
  Flame,
  Truck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChefHat
} from 'lucide-react'

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  updatingId
}) {
  const [copiedField, setCopiedField] = useState(null)

  if (!isOpen || !order) return null

  const handleCopy = (text, fieldName) => {
    if (!text) return
    navigator.clipboard?.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const items = order.parsed_items && order.parsed_items.length > 0
    ? order.parsed_items
    : (Array.isArray(order.items) && order.items.length > 0 ? order.items : [])

  const phoneDigits = (order.customer_phone || '').replace(/\D/g, '')

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white font-serif">Order #{order.ref_id}</h3>
                <button
                  onClick={() => handleCopy(order.ref_id, 'ref')}
                  className="p-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition"
                  title="Copy Ref ID"
                >
                  {copiedField === 'ref' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-xs text-neutral-400">
                Placed: {new Date(order.created_at || Date.now()).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })} PKT
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Print Kitchen Ticket / Invoice"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Print Slip</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable & Visible Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Status Quick Bar */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">Current Status</span>
              <span className="text-base font-black text-white">
                {order.status || 'Pending'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-400 font-semibold">Change to:</span>
              <select
                value={order.status || 'Pending'}
                onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                disabled={updatingId === order.id}
                className="bg-neutral-900 border border-neutral-700 text-white rounded-xl px-3 py-2 text-xs font-bold focus:border-amber-500 transition cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Preparing">In Kitchen</option>
                <option value="Out For Delivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Customer Box */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">Customer Information</span>
              <p className="text-sm font-bold text-white">{order.customer_name || 'Walk-in Guest'}</p>
              
              <div className="flex items-center justify-between text-neutral-300">
                <a
                  href={`tel:${order.customer_phone}`}
                  className="flex items-center gap-1.5 text-amber-300 hover:underline font-mono text-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{order.customer_phone}</span>
                </a>

                {phoneDigits && (
                  <a
                    href={`https://wa.me/92${phoneDigits.startsWith('0') ? phoneDigits.slice(1) : phoneDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30"
                  >
                    WhatsApp Chat
                  </a>
                )}
              </div>
            </div>

            {/* Address Box */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Delivery Address</span>
                <button
                  onClick={() => handleCopy(order.customer_address, 'address')}
                  className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                >
                  {copiedField === 'address' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === 'address' ? 'Copied' : 'Copy Address'}</span>
                </button>
              </div>
              <p className="text-neutral-200 leading-relaxed flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{order.customer_address}</span>
              </p>
            </div>

          </div>

          {/* Special Notes */}
          {order.notes && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">Kitchen &amp; Order Notes</span>
              <p className="text-amber-100">{order.notes}</p>
            </div>
          )}

          {/* Ordered Dishes Table */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">Dishes in Order</span>
            
            {items.length > 0 ? (
              <div className="rounded-2xl border border-neutral-800 overflow-hidden bg-neutral-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-900 border-b border-neutral-800 text-[10px] uppercase text-neutral-400 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Item</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 text-neutral-300">
                    {items.map((item, idx) => {
                      const qty = Number(item.quantity || 1)
                      const price = Number(item.price || 0)
                      return (
                        <tr key={idx} className="hover:bg-neutral-900/40">
                          <td className="py-2.5 px-3 font-semibold text-white">{item.name}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-400">{qty}x</td>
                          <td className="py-2.5 px-3 text-right font-mono">Rs. {price.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-white">Rs. {(qty * price).toLocaleString()}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : order.items_summary ? (
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 font-mono text-neutral-200">
                {order.items_summary}
              </div>
            ) : (
              <p className="text-neutral-500 italic">No itemized details recorded.</p>
            )}
          </div>

          {/* Total Breakdown */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 to-orange-500/10 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Payment Method</span>
              <span className="text-xs font-semibold text-white">{order.payment_method || 'Cash on Delivery'}</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">Total Payable</span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                Rs. {Number(order.total_amount || 0).toLocaleString()} <span className="text-xs text-neutral-400 font-normal">PKR</span>
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between no-print">
          <span className="text-[11px] text-neutral-500">
            Zaika Royale Operations Management
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  )
}
