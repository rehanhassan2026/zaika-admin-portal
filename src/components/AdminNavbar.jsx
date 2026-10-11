import React from 'react'
import {
  UtensilsCrossed,
  RefreshCw,
  Bell,
  BellOff,
  Download,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogOut
} from 'lucide-react'

export function AdminNavbar({
  isLoading,
  onRefresh,
  soundEnabled,
  onToggleSound,
  onOpenManualOrder,
  onExportCSV,
  isConnected,
  ordersCount = 0,
  onLogout
}) {
  return (
    <header className="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Portal Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 text-neutral-950 shrink-0 font-bold">
              <UtensilsCrossed className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white font-serif">
                  Zaika<span className="text-amber-400">Royale</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Admin Portal
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">Order Management &amp; Kitchen Dispatch</p>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Database Status Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
              <span className="text-neutral-400 text-[11px] font-medium">
                {isConnected ? 'Database Live' : 'Connecting...'}
              </span>
            </div>

            {/* Sound notification toggle */}
            <button
              onClick={onToggleSound}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                soundEnabled
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
              title={soundEnabled ? 'Order sound alert ON' : 'Order sound alert OFF'}
            >
              {soundEnabled ? <Bell className="w-4 h-4 text-amber-400" /> : <BellOff className="w-4 h-4" />}
              <span className="hidden sm:inline">{soundEnabled ? 'Alerts ON' : 'Muted'}</span>
            </button>

            {/* Export CSV button */}
            <button
              onClick={onExportCSV}
              disabled={ordersCount === 0}
              className="px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold hidden sm:flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              title="Export all orders to Excel / CSV"
            >
              <Download className="w-3.5 h-3.5 text-neutral-400" />
              <span>Export CSV</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2.5 sm:px-3.5 sm:py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Manual Order Creation */}
            <button
              onClick={onOpenManualOrder}
              className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden xs:inline">New Order</span>
            </button>

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 sm:px-3 sm:py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="Sign out of Admin Dashboard"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  )
}

