import React from 'react'
import { Search, X, Filter } from 'lucide-react'

export function OrderFilters({
  activeFilter,
  onSelectFilter,
  searchQuery,
  onSearchChange,
  totalMatching = 0
}) {
  const filterTabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'preparing', label: 'In Kitchen' },
    { id: 'out for delivery', label: 'Out For Delivery' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ]

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-neutral-900/90 p-3 sm:p-4 rounded-2xl border border-neutral-800">
      
      {/* Search Input Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by Ref ID (#ZR-...), Customer, Phone or Address..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition font-sans"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-white transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Status Filter Tabs (Horizontal Scroll on Mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onSelectFilter(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-neutral-950 shadow-sm shadow-amber-500/20'
                  : 'bg-neutral-950/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800/80'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

    </div>
  )
}

