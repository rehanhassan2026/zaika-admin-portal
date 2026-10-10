import React from 'react'
import {
  Clock,
  Phone,
  MapPin,
  Flame,
  Truck,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  ExternalLink,
  ChevronRight,
  MessageSquare,
  AlertCircle
} from 'lucide-react'

export function OrderTable({
  orders = [],
  onSelectOrder,
  onUpdateStatus,
  onDeleteOrder,
  updatingId = null
}) {
  const getStatusBadge = (status) => {
    const s = (status || 'Pending').toLowerCase()
    switch (s) {
      case 'preparing':
      case 'in kitchen':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30">
            <Flame className="w-3 h-3" />
            <span>In Kitchen</span>
          </span>
        )
      case 'out for delivery':
      case 'on the way':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Truck className="w-3 h-3" />
            <span>Out for Delivery</span>
          </span>
        )
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Delivered</span>
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 animate-pulse">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        )
    }
  }

  // Get next logical status step
  const getNextStep = (status) => {
    const s = (status || 'Pending').toLowerCase()
    if (s === 'pending') {
      return { nextStatus: 'Preparing', label: 'Start Cooking', icon: Flame, color: 'bg-orange-500 hover:bg-orange-400 text-neutral-950' }
    }
    if (s === 'preparing' || s === 'in kitchen') {
      return { nextStatus: 'Out For Delivery', label: 'Dispatch Rider', icon: Truck, color: 'bg-blue-500 hover:bg-blue-400 text-neutral-950' }
    }
    if (s === 'out for delivery' || s === 'on the way') {
      return { nextStatus: 'Delivered', label: 'Mark Delivered', icon: CheckCircle2, color: 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950' }
    }
    return null
  }

  if (orders.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-neutral-900/60 border border-neutral-800">
        <div className="w-14 h-14 rounded-2xl bg-neutral-950 border border-neutral-800 text-neutral-500 flex items-center justify-center mx-auto mb-3">
          <Clock className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-white">No Orders Found</h3>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
          No orders match your current filter or search criteria. When new orders are placed, they will appear here in real-time.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      
      {/* ================= DESKTOP TABLE VIEW (lg and up) ================= */}
      <div className="hidden lg:block bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950/80 border-b border-neutral-800 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              <tr>
                <th className="py-4 px-5">Ref ID / Time</th>
                <th className="py-4 px-5">Customer Info</th>
                <th className="py-4 px-5">Dishes Summary</th>
                <th className="py-4 px-5">Total (PKR)</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 font-normal">
              {orders.map((order) => {
                const nextStep = getNextStep(order.status)
                const isUpdating = updatingId === order.id
                const phoneDigits = (order.customer_phone || '').replace(/\D/g, '')

                return (
                  <tr key={order.id} className="hover:bg-neutral-850/60 transition group">
                    
                    {/* Ref ID & Time */}
                    <td className="py-4 px-5">
                      <span className="font-mono text-sm font-black text-amber-400 block">
                        #{order.ref_id}
                      </span>
                      <span className="text-[11px] text-neutral-500 mt-0.5 block">
                        {new Date(order.created_at || Date.now()).toLocaleTimeString('en-PK', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })} · {new Date(order.created_at || Date.now()).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}
                      </span>
                    </td>

                    {/* Customer Info */}
                    <td className="py-4 px-5 max-w-xs">
                      <p className="font-bold text-white truncate">{order.customer_name || 'Walk-in Guest'}</p>
                      
                      <div className="flex items-center gap-2 mt-0.5 text-neutral-400 text-[11px]">
                        <a
                          href={`tel:${order.customer_phone}`}
                          className="hover:text-amber-400 transition flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-amber-400" />
                          <span>{order.customer_phone}</span>
                        </a>

                        {phoneDigits && (
                          <a
                            href={`https://wa.me/92${phoneDigits.startsWith('0') ? phoneDigits.slice(1) : phoneDigits}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:text-emerald-300 transition text-[10px] font-bold"
                            title="Chat on WhatsApp"
                          >
                            WhatsApp
                          </a>
                        )}
                      </div>

                      <p className="text-[11px] text-neutral-400 truncate mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-500 shrink-0" />
                        <span className="truncate">{order.customer_address}</span>
                      </p>
                    </td>

                    {/* Items summary */}
                    <td className="py-4 px-5 max-w-sm">
                      <p className="text-xs text-neutral-200 line-clamp-2 leading-relaxed">
                        {order.items_summary || (order.parsed_items || []).map(i => `${i.quantity}x ${i.name}`).join(', ') || 'No items listed'}
                      </p>
                      {order.notes && (
                        <p className="text-[10px] text-amber-300 mt-1 truncate">
                          Note: {order.notes}
                        </p>
                      )}
                    </td>

                    {/* Bill Total */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="font-mono text-sm font-black text-white block">
                        Rs. {Number(order.total_amount || 0).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-neutral-500 block">
                        {order.payment_method || 'Cash on Delivery'}
                      </span>
                    </td>

                    {/* Status Badge & Selector */}
                    <td className="py-4 px-5">
                      <div className="space-y-1.5">
                        {getStatusBadge(order.status)}

                        <select
                          value={order.status || 'Pending'}
                          onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                          disabled={isUpdating}
                          className="block w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-[11px] text-neutral-300 focus:outline-none focus:border-amber-500 transition cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">In Kitchen</option>
                          <option value="Out For Delivery">Out For Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                    {/* Quick Action Button */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Next progression button */}
                        {nextStep && (
                          <button
                            onClick={() => onUpdateStatus(order.id, nextStep.nextStatus)}
                            disabled={isUpdating}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer ${nextStep.color}`}
                            title={`Advance to ${nextStep.nextStatus}`}
                          >
                            <nextStep.icon className="w-3.5 h-3.5" />
                            <span>{nextStep.label}</span>
                          </button>
                        )}

                        {/* View full receipt / print */}
                        <button
                          onClick={() => onSelectOrder(order)}
                          className="p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition cursor-pointer"
                          title="View order receipt & print"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => onDeleteOrder(order.id)}
                          className="p-2 rounded-xl bg-neutral-950 hover:bg-red-950/60 text-neutral-500 hover:text-red-400 border border-neutral-800 hover:border-red-500/30 transition cursor-pointer"
                          title="Delete test order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MOBILE & TABLET CARD VIEW (below lg) ================= */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {orders.map((order) => {
          const nextStep = getNextStep(order.status)
          const isUpdating = updatingId === order.id
          const phoneDigits = (order.customer_phone || '').replace(/\D/g, '')

          return (
            <div
              key={order.id}
              className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3 shadow-lg flex flex-col justify-between"
            >
              {/* Card Header: Ref ID & Status */}
              <div className="flex items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
                <div>
                  <span className="font-mono text-base font-black text-amber-400">
                    #{order.ref_id}
                  </span>
                  <span className="text-[10px] text-neutral-500 block">
                    {new Date(order.created_at || Date.now()).toLocaleTimeString('en-PK', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })} · {new Date(order.created_at || Date.now()).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div>
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Customer info */}
              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-white text-sm">{order.customer_name || 'Walk-in Guest'}</p>
                
                <div className="flex items-center justify-between text-neutral-400">
                  <a
                    href={`tel:${order.customer_phone}`}
                    className="flex items-center gap-1.5 text-amber-300 font-medium hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{order.customer_phone}</span>
                  </a>

                  {phoneDigits && (
                    <a
                      href={`https://wa.me/92${phoneDigits.startsWith('0') ? phoneDigits.slice(1) : phoneDigits}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 text-xs font-bold"
                    >
                      WhatsApp
                    </a>
                  )}
                </div>

                <p className="text-neutral-400 text-[11px] flex items-start gap-1 pt-0.5 leading-snug">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                  <span>{order.customer_address}</span>
                </p>
              </div>

              {/* Dishes Summary */}
              <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-850 text-xs text-neutral-300 space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Order Items</span>
                <p className="line-clamp-2 leading-relaxed">
                  {order.items_summary || (order.parsed_items || []).map(i => `${i.quantity}x ${i.name}`).join(', ') || 'No items listed'}
                </p>
              </div>

              {/* Price & Payment */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[10px] uppercase text-neutral-500 block">Total Bill</span>
                  <span className="font-mono text-base font-black text-amber-400">
                    Rs. {Number(order.total_amount || 0).toLocaleString()} PKR
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase text-neutral-500 block">Status Change</span>
                  <select
                    value={order.status || 'Pending'}
                    onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                    disabled={isUpdating}
                    className="bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-neutral-200 focus:border-amber-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Preparing">In Kitchen</option>
                    <option value="Out For Delivery">Out For Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-2">
                {nextStep ? (
                  <button
                    onClick={() => onUpdateStatus(order.id, nextStep.nextStatus)}
                    disabled={isUpdating}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer ${nextStep.color}`}
                  >
                    <nextStep.icon className="w-3.5 h-3.5" />
                    <span>{nextStep.label}</span>
                  </button>
                ) : (
                  <div className="flex-1 text-[11px] text-neutral-500 font-semibold">
                    Status Completed
                  </div>
                )}

                <button
                  onClick={() => onSelectOrder(order)}
                  className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 cursor-pointer"
                  title="View full details"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDeleteOrder(order.id)}
                  className="p-2.5 rounded-xl bg-neutral-950 hover:bg-red-950/60 text-neutral-500 hover:text-red-400 border border-neutral-800 cursor-pointer"
                  title="Delete order"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}
