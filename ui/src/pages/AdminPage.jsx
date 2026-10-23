import AdminDashboard from '../components/AdminDashboard'
import InventoryStatus from '../components/InventoryStatus'
import OrderStatus from '../components/OrderStatus'

function AdminPage({ orders, inventory, onChangeStock, onAdvanceOrder }) {
  return (
    <main className="admin-page">
      <AdminDashboard orders={orders} />
      <InventoryStatus inventory={inventory} onChangeStock={onChangeStock} />
      <OrderStatus orders={orders} onAdvanceOrder={onAdvanceOrder} />
    </main>
  )
}

export default AdminPage
