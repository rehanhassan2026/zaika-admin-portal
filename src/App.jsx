import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './config/supabase'
import {
  fetchAllOrders,
  updateOrderStatus,
  deleteOrder,
  createManualOrder,
  exportOrdersToCSV,
  extractRefId,
  parseItems
} from './services/adminOrderService'
import { AdminNavbar } from './components/AdminNavbar'
import { AdminLogin } from './components/AdminLogin'
import { StatsOverview } from './components/StatsOverview'
import { OrderFilters } from './components/OrderFilters'
import { OrderTable } from './components/OrderTable'
import { OrderDetailModal } from './components/OrderDetailModal'
import { ManualOrderModal } from './components/ManualOrderModal'
import { NotificationToast } from './components/NotificationToast'
import { RefreshCw, AlertCircle, Sparkles } from 'lucide-react'

// Web Audio chime generator (crisp, pleasant bell chime)
function playOrderChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15) // A5

    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.7)
  } catch (e) {
    // AudioContext blocked or not allowed until user interaction
  }
}

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('zaika_admin_auth') === 'true'
  })
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isConnected, setIsConnected] = useState(true)
  
  // Filtering & Search
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals & Interactivity
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isManualOrderOpen, setIsManualOrderOpen] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [newOrderToast, setNewOrderToast] = useState(null)

  const previousCountRef = useRef(0)

  // 1. Initial orders fetch
  const loadOrders = async (showLoading = false) => {
    if (showLoading) setIsLoading(true)
    setError(null)

    const res = await fetchAllOrders()
    if (res.error) {
      setError(res.error)
      setIsConnected(false)
    } else {
      setIsConnected(true)
      
      // Check for new orders to trigger sound
      if (previousCountRef.current > 0 && res.orders.length > previousCountRef.current) {
        const latest = res.orders[0]
        if (soundEnabled) playOrderChime()
        setNewOrderToast(latest)
      }
      
      previousCountRef.current = res.orders.length
      setOrders(res.orders)
    }

    if (showLoading) setIsLoading(false)
  }

  useEffect(() => {
    if (!isAuthenticated) return

    loadOrders(true)

    // 2. Realtime subscription to Supabase `orders` table
    const channel = supabase
      .channel('admin-dashboard-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newObj = {
              ...payload.new,
              ref_id: extractRefId(payload.new),
              parsed_items: parseItems(payload.new),
            }
            setOrders(prev => [newObj, ...prev.filter(o => o.id !== newObj.id)])
            previousCountRef.current += 1
            if (soundEnabled) playOrderChime()
            setNewOrderToast(newObj)
          } else if (payload.eventType === 'UPDATE') {
            const updatedObj = {
              ...payload.new,
              ref_id: extractRefId(payload.new),
              parsed_items: parseItems(payload.new),
            }
            setOrders(prev => prev.map(o => (o.id === updatedObj.id ? updatedObj : o)))
            setSelectedOrder(cur => (cur && cur.id === updatedObj.id ? updatedObj : cur))
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(o => o.id !== payload.old.id))
            setSelectedOrder(cur => (cur && cur.id === payload.old.id ? null : cur))
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    // 3. Fallback polling every 8 seconds
    const interval = setInterval(() => {
      loadOrders(false)
    }, 8000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [soundEnabled, isAuthenticated])

  // Handle status update
  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    // Optimistic UI update
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }))
    }

    const res = await updateOrderStatus(orderId, newStatus)
    setUpdatingId(null)

    if (!res.success) {
      alert('Failed to update status in Supabase: ' + res.error)
      loadOrders(false) // Rollback
    }
  }

  // Handle delete order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order from Supabase?')) {
      return
    }

    setOrders(prev => prev.filter(o => o.id !== orderId))
    const res = await deleteOrder(orderId)
    if (!res.success) {
      alert('Failed to delete order: ' + res.error)
      loadOrders(false)
    }
  }

  // Handle manual order create
  const handleCreateOrder = async (orderPayload) => {
    const res = await createManualOrder(orderPayload)
    if (res.success) {
      setOrders(prev => [res.order, ...prev])
      previousCountRef.current += 1
      if (soundEnabled) playOrderChime()
      return { success: true }
    }
    return { success: false, error: res.error }
  }

  // Filter and Search Pipeline
  const filteredOrders = orders.filter((order) => {
    const status = (order.status || 'Pending').toLowerCase()

    // 1. Status Filter
    if (activeFilter === 'pending' && status !== 'pending') return false
    if (activeFilter === 'preparing' && !['preparing', 'in kitchen', 'kitchen'].includes(status)) return false
    if (activeFilter === 'out for delivery' && !['out for delivery', 'on the way', 'dispatched'].includes(status)) return false
    if (activeFilter === 'delivered' && status !== 'delivered') return false
    if (activeFilter === 'cancelled' && status !== 'cancelled') return false

    // 2. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      const refMatch = (order.ref_id || '').toLowerCase().includes(q)
      const nameMatch = (order.customer_name || '').toLowerCase().includes(q)
      const phoneMatch = (order.customer_phone || '').includes(q)
      const addressMatch = (order.customer_address || '').toLowerCase().includes(q)
      const notesMatch = (order.notes || '').toLowerCase().includes(q)
      return refMatch || nameMatch || phoneMatch || addressMatch || notesMatch
    }

    return true
  })

  // Handle Admin Logout
  const handleLogout = () => {
    localStorage.removeItem('zaika_admin_auth')
    localStorage.removeItem('zaika_admin_user')
    setIsAuthenticated(false)
  }

  // If not authenticated, show professional demo login screen
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-neutral-950">
      
      {/* Top Navbar */}
      <AdminNavbar
        isLoading={isLoading}
        onRefresh={() => loadOrders(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenManualOrder={() => setIsManualOrderOpen(true)}
        onExportCSV={() => exportOrdersToCSV(orders)}
        isConnected={isConnected}
        ordersCount={orders.length}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Supabase Connection Warning / Notice */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Database Connection Note: {error}</span>
            </div>
            <button
              onClick={() => loadOrders(true)}
              className="px-3 py-1 rounded-lg bg-red-900/60 hover:bg-red-800 text-white font-bold text-[11px] transition cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Live Metrics Header */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-serif tracking-tight">
                Live Kitchen &amp; Order Dashboard
              </h2>
              <p className="text-xs text-neutral-400">
                Connected to Supabase · Real-time order dispatch &amp; status updater
              </p>
            </div>
            
            <div className="text-right hidden sm:block">
              <span className="text-[11px] font-mono text-neutral-400">
                Total Orders Loaded: <strong className="text-amber-400">{orders.length}</strong>
              </span>
            </div>
          </div>

          <StatsOverview
            orders={orders}
            activeFilter={activeFilter}
            onSelectFilter={setActiveFilter}
          />
        </section>

        {/* Search & Filter Toolbar */}
        <OrderFilters
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalMatching={filteredOrders.length}
        />

        {/* Orders Table & Grid Cards */}
        <section>
          {isLoading && orders.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-3">
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
              <p className="text-sm font-bold text-white">Loading orders from Supabase...</p>
              <p className="text-xs text-neutral-400">Fetching live customer orders</p>
            </div>
          ) : (
            <OrderTable
              orders={filteredOrders}
              onSelectOrder={setSelectedOrder}
              onUpdateStatus={handleUpdateStatus}
              onDeleteOrder={handleDeleteOrder}
              updatingId={updatingId}
            />
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-850 py-4 text-center text-xs text-neutral-500 no-print">
        <p>Zaika Royale Bistro Administration · Supabase Backend · Express Kitchen Dispatch</p>
      </footer>

      {/* Modals & Floating Toasts */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateStatus}
        updatingId={updatingId}
      />

      <ManualOrderModal
        isOpen={isManualOrderOpen}
        onClose={() => setIsManualOrderOpen(false)}
        onCreateOrder={handleCreateOrder}
      />

      <NotificationToast
        order={newOrderToast}
        onClose={() => setNewOrderToast(null)}
        onView={(ord) => setSelectedOrder(ord)}
      />

    </div>
  )
}

export default App

