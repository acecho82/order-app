import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../data/orderStatus'

function AdminDashboard({ orders }) {
  const countByStatus = (status) =>
    orders.filter((order) => order.status === status).length

  const stats = [
    { label: '총 주문', count: orders.length },
    ...Object.values(ORDER_STATUS).map((status) => ({
      label: ORDER_STATUS_LABELS[status],
      count: countByStatus(status),
    })),
  ]

  return (
    <section className="admin-section">
      <h2 className="admin-section__title">관리자 대시보드</h2>
      <ul className="dashboard">
        {stats.map((stat) => (
          <li key={stat.label} className="dashboard__item">
            <span className="dashboard__label">{stat.label}</span>
            <strong className="dashboard__count">{stat.count}</strong>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default AdminDashboard
