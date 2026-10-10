import React from 'react'
import {
  ShoppingBag,
  Clock,
  Flame,
  Truck,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  XCircle
} from 'lucide-react'

export function StatsOverview({ orders = [], activeFilter, onSelectFilter }) {
  const totalOrders = orders.length
  
  const pendingOrders = orders.filter(
    o => (o.status || 'Pending').toLowerCase() === 'pending'
  ).length

  const preparingOrders = orders.filter(
    o => ['preparing', 'in kitchen', 'kitchen'].includes((o.status || '').toLowerCase())
  ).length

  const outForDeliveryOrders = orders.filter(
    o => ['out for delivery', 'on the way', 'dispatched'].includes((o.status || '').toLowerCase())
  ).length

  const deliveredOrders = orders.filter(
    o => (o.status || '').toLowerCase() === 'delivered'
  ).length

  const cancelledOrders = orders.filter(
    o => (o.status || '').toLowerCase() === 'cancelled'
  ).length

  const totalRevenue = orders
    .filter(o => (o.status || '').toLowerCase() !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0)

  const cards = [
    {
      id: 'all',
      title: 'Total Orders',
      count: totalOrders,
      icon: ShoppingBag,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      subtext: 'All time received',
    },
    {
      id: 'pending',
      title: 'Pending Action',
      count: pendingOrders,
      icon: Clock,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      badge: pendingOrders > 0 ? 'Urgent' : null,
      subtext: 'Needs kitchen routing',
    },
    {
      id: 'preparing',
      title: 'In Kitchen',
      count: preparingOrders,
      icon: Flame,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      subtext: 'Charcoal cooking live',
    },
    {
      id: 'out for delivery',
      title: 'On The Road',
      count: outForDeliveryOrders,
      icon: Truck,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      subtext: 'Rider dispatched',
    },
    {
      id: 'delivered',
      title: 'Delivered',
      count: deliveredOrders,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      subtext: 'Completed orders',
    },
    {
      id: 'revenue',
      title: 'Total Revenue',
      isRevenue: true,
      amount: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-amber-300',
      bg: 'bg-gradient-to-br from-amber-500/15 to-orange-500/10',
      border: 'border-amber-500/40',
      subtext: 'Active cash revenue',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        const isSelected = activeFilter === card.id

        return (
          <button
            key={card.id}
            onClick={() => !card.isRevenue && onSelectFilter(card.id)}
            disabled={card.isRevenue}
            className={`p-3.5 sm:p-4 rounded-2xl bg-neutral-900 border text-left transition relative overflow-hidden flex flex-col justify-between ${
              card.isRevenue
                ? 'cursor-default ring-1 ring-amber-500/20'
                : 'hover:border-neutral-700 cursor-pointer'
            } ${
              isSelected ? 'border-amber-500 ring-2 ring-amber-500/30 bg-neutral-850' : 'border-neutral-800'
            }`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between w-full mb-2">
              <div className={`w-8 h-8 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>

              {card.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-yellow-500 text-neutral-950 animate-pulse">
                  {card.badge}
                </span>
              )}
            </div>

            {/* Middle: Count / Revenue */}
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 truncate">
                {card.title}
              </p>
              <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
                {card.isRevenue ? card.amount : card.count}
              </div>
            </div>

            {/* Bottom subtitle */}
            <p className="text-[10px] text-neutral-500 mt-2 truncate">
              {card.subtext}
            </p>
          </button>
        )
      })}
    </div>
  )
}
