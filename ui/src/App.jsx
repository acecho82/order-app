import { useEffect, useState } from 'react'
import Header from './components/Header'
import OrderPage from './pages/OrderPage'
import AdminPage from './pages/AdminPage'
import * as api from './api'
import { NEXT_ORDER_STATUS } from './data/orderStatus'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('order')
  const [menus, setMenus] = useState([])
  const [orders, setOrders] = useState([])
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    let ignore = false
    Promise.all([api.getMenus(), api.getOrders()])
      .then(([nextMenus, nextOrders]) => {
        if (ignore) return
        setMenus(nextMenus)
        setOrders(nextOrders)
        setLoadError(null)
      })
      .catch((err) => {
        if (!ignore) setLoadError(err.message)
      })
    return () => {
      ignore = true
    }
  }, [currentPage])

  const handleCreateOrder = async (cartItems) => {
    const order = await api.createOrder(
      cartItems.map((item) => ({
        menuId: item.menu.id,
        quantity: item.quantity,
        optionIds: item.options.map((option) => option.id),
      })),
    )
    setOrders((prev) => [order, ...prev])
    setMenus(await api.getMenus())
  }

  const handleChangeStock = async (menuId, delta) => {
    try {
      const updated = await api.updateStock(menuId, delta)
      setMenus((prev) =>
        prev.map((menu) =>
          menu.id === updated.id ? { ...menu, stock: updated.stock } : menu,
        ),
      )
    } catch (err) {
      alert(err.message)
    }
  }

  const handleAdvanceOrder = async (orderId) => {
    const order = orders.find((item) => item.id === orderId)
    const nextStatus = order && NEXT_ORDER_STATUS[order.status]
    if (!nextStatus) return

    try {
      const updated = await api.updateOrderStatus(orderId, nextStatus)
      setOrders((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      )
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      {loadError && <p className="app__error">{loadError}</p>}
      {currentPage === 'order' ? (
        <OrderPage menus={menus} onCreateOrder={handleCreateOrder} />
      ) : (
        <AdminPage
          orders={orders}
          inventory={menus}
          onChangeStock={handleChangeStock}
          onAdvanceOrder={handleAdvanceOrder}
        />
      )}
    </div>
  )
}

export default App
