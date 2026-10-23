import {
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  NEXT_ACTION_LABELS,
} from '../data/orderStatus'
import { formatDate, formatPrice, formatTime } from '../utils/format'

function OrderStatus({ orders, onAdvanceOrder }) {
  return (
    <section className="admin-section">
      <h2 className="admin-section__title">주문 현황</h2>
      {orders.length === 0 ? (
        <p className="admin-section__empty">접수된 주문이 없습니다.</p>
      ) : (
        <table className="orders">
          <thead>
            <tr>
              <th>접수 일자</th>
              <th>접수 시간</th>
              <th>메뉴</th>
              <th>금액</th>
              <th>상태</th>
              <th aria-label="처리" />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const isCompleted = order.status === ORDER_STATUS.COMPLETED
              return (
                <tr key={order.id}>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{formatTime(order.createdAt)}</td>
                  <td>
                    <ul className="orders__items">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.menuName}
                          {item.options.length > 0 && (
                            <small className="orders__options">
                              ({item.options.join(', ')})
                            </small>
                          )}{' '}
                          x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="orders__price">
                    {formatPrice(order.totalPrice)}
                  </td>
                  <td>
                    <span className={`badge badge--${order.status}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="button button--primary"
                      onClick={() => onAdvanceOrder(order.id)}
                      disabled={isCompleted}
                    >
                      {isCompleted ? '완료' : NEXT_ACTION_LABELS[order.status]}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default OrderStatus
