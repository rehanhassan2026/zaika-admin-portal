import { supabase } from '../config/supabase'

// Helper: Extract Ref ID from notes if not present as a separate field
export function extractRefId(order) {
  if (order.ref_id) return order.ref_id
  if (order.notes && typeof order.notes === 'string') {
    const match = order.notes.match(/\[Ref:\s*([A-Za-z0-9-]+)\]/i)
    if (match && match[1]) {
      return match[1]
    }
  }
  if (order.id && typeof order.id === 'string' && order.id.length > 8) {
    return 'ZR-' + order.id.slice(0, 5).toUpperCase()
  }
  return order.id || 'ZR-ORDER'
}

// Helper: Parse items whether stored as JSON, array or string
export function parseItems(order) {
  if (Array.isArray(order.items) && order.items.length > 0) {
    return order.items
  }
  if (typeof order.items === 'string') {
    try {
      const parsed = JSON.parse(order.items)
      if (Array.isArray(parsed)) return parsed
    } catch (e) {
      // not JSON array
    }
  }
  if (order.items_summary) {
    // Parse comma-separated summary: "2x Dish Name (Rs. 1200)"
    return order.items_summary.split(',').map((part, idx) => {
      const trimmed = part.trim()
      const match = trimmed.match(/^(\d+)x\s*(.*?)(?:\s*\(Rs\.\s*(\d+)\))?$/i)
      if (match) {
        return {
          id: `item-${idx}`,
          quantity: parseInt(match[1], 10),
          name: match[2].trim(),
          price: match[3] ? parseInt(match[3], 10) : 0,
        }
      }
      return {
        id: `item-${idx}`,
        quantity: 1,
        name: trimmed,
        price: 0,
      }
    })
  }
  return []
}

// Fetch all orders from Supabase
export async function fetchAllOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching Supabase orders:', error)
      return { orders: [], error: error.message }
    }

    const normalized = (data || []).map(order => ({
      ...order,
      ref_id: extractRefId(order),
      parsed_items: parseItems(order),
    }))

    return { orders: normalized, error: null }
  } catch (err) {
    console.error('Exception fetching Supabase orders:', err)
    return { orders: [], error: err.message }
  }
}

// Update order status in Supabase (Pending, Preparing, Out For Delivery, Delivered, Cancelled)
export async function updateOrderStatus(orderId, newStatus) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
      .select()
      .single()

    if (error) {
      console.error('Error updating status:', error)
      return { success: false, error: error.message }
    }

    return {
      success: true,
      order: {
        ...data,
        ref_id: extractRefId(data),
        parsed_items: parseItems(data),
      },
    }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// Delete order
export async function deleteOrder(orderId) {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)

    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// Create a manual phone order directly from Admin Dashboard
export async function createManualOrder(orderData) {
  const refCode = 'ZR-' + Math.floor(10000 + Math.random() * 90000)
  const notesWithRef = orderData.notes
    ? `${orderData.notes.trim()} [Ref: ${refCode}]`
    : `[Ref: ${refCode}]`

  const payload = {
    customer_name: orderData.customer_name.trim(),
    customer_phone: orderData.customer_phone.trim(),
    customer_address: orderData.customer_address.trim(),
    items: orderData.items || [],
    items_summary: (orderData.items || []).map(i => `${i.quantity}x ${i.name} (Rs. ${i.price})`).join(', ') || orderData.items_summary || 'Custom order',
    total_amount: Number(orderData.total_amount),
    status: orderData.status || 'Pending',
    notes: notesWithRef,
    payment_method: orderData.payment_method || 'Cash on Delivery',
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([payload])
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return {
      success: true,
      order: {
        ...data,
        ref_id: refCode,
        parsed_items: parseItems(data),
      },
    }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// Export orders list to CSV file
export function exportOrdersToCSV(orders) {
  if (!orders || orders.length === 0) return

  const headers = ['Ref ID', 'Order ID', 'Date & Time', 'Customer Name', 'Phone', 'Address', 'Items', 'Total (PKR)', 'Status', 'Notes']
  const rows = orders.map(o => [
    o.ref_id,
    o.id,
    new Date(o.created_at || Date.now()).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' }),
    `"${(o.customer_name || '').replace(/"/g, '""')}"`,
    `"${(o.customer_phone || '').replace(/"/g, '""')}"`,
    `"${(o.customer_address || '').replace(/"/g, '""')}"`,
    `"${(o.items_summary || '').replace(/"/g, '""')}"`,
    o.total_amount || 0,
    o.status || 'Pending',
    `"${(o.notes || '').replace(/"/g, '""')}"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `Zaika_Royale_Orders_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

