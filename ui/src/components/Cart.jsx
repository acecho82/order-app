import { formatPrice } from '../utils/format'

function Cart({ items, onOrder, isSubmitting }) {
  const totalPrice = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  )
  const isEmpty = items.length === 0

  return (
    <section className="cart">
      <div className="cart__list">
        <h2 className="cart__title">장바구니</h2>
        {isEmpty ? (
          <p className="cart__empty">장바구니가 비어 있습니다.</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.key} className="cart__item">
                <span className="cart__item-name">
                  {item.menu.name}
                  {item.options.length > 0 && (
                    <small className="cart__item-options">
                      ({item.options.map((option) => option.name).join(', ')})
                    </small>
                  )}
                  <span className="cart__item-quantity">X {item.quantity}</span>
                </span>
                <span className="cart__item-price">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="cart__summary">
        <p className="cart__total">
          총 금액 <strong>{formatPrice(totalPrice)}</strong>
        </p>
        <button
          type="button"
          className="button button--primary"
          onClick={onOrder}
          disabled={isEmpty || isSubmitting}
        >
          {isSubmitting ? '주문 중...' : '주문하기'}
        </button>
      </div>
    </section>
  )
}

export default Cart
