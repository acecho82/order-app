const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'

async function request(path, { method = 'GET', body } = {}) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('서버에 연결할 수 없습니다.')
  }

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.message ?? '요청을 처리하지 못했습니다.')
  }
  return data
}

export const getMenus = () => request('/menus')

export const updateStock = (menuId, delta) =>
  request(`/menus/${menuId}/stock`, { method: 'PATCH', body: { delta } })

export const getOrders = () => request('/orders')

export const createOrder = (items) =>
  request('/orders', { method: 'POST', body: { items } })

export const updateOrderStatus = (orderId, status) =>
  request(`/orders/${orderId}/status`, { method: 'PATCH', body: { status } })
