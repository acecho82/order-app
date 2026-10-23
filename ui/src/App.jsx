import { useState } from 'react'
import Header from './components/Header'
import OrderPage from './pages/OrderPage'
import AdminPage from './pages/AdminPage'
import { MENUS } from './data/menus'
import { ORDER_STATUS, NEXT_ORDER_STATUS } from './data/orderStatus'
import './App.css'

const INITIAL_STOCK = 10
const STOCK_MENU_COUNT = 3

function App() {
  const [currentPage, setCurrentPage] = useState('order')
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState(() =>
    MENUS.slice(0, STOCK_MENU_COUNT).map((menu) => ({
      menuId: menu.id,
      name: menu.name,
      stock: INITIAL_STOCK,
    })),
  )

  const handleCreateOrder = (cartItems) => {
    const items = cartItems.map((item) => ({
      name: item.menu.name,
      options: item.options.map((option) => option.name),
      quantity: item.quantity,
      price: item.unitPrice * item.quantity,
    }))
    const order = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      items,
      totalPrice: items.reduce((sum, item) => sum + item.price, 0),
      status: ORDER_STATUS.RECEIVED,
    }
    setOrders((prev) => [order, ...prev])
  }

  const handleChangeStock = (menuId, delta) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.menuId === menuId
          ? { ...item, stock: Math.max(0, item.stock + delta) }
          : item,
      ),
    )
  }

  const handleAdvanceOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((order) => {
        const nextStatus = NEXT_ORDER_STATUS[order.status]
        return order.id === orderId && nextStatus
          ? { ...order, status: nextStatus }
          : order
      }),
    )
  }

  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      {currentPage === 'order' ? (
        <OrderPage onCreateOrder={handleCreateOrder} />
      ) : (
        <AdminPage
          orders={orders}
          inventory={inventory}
          onChangeStock={handleChangeStock}
          onAdvanceOrder={handleAdvanceOrder}
        />
      )}
    </div>
  )
}

export default App
