const LOW_STOCK_THRESHOLD = 5

function getStockLevel(stock) {
  if (stock === 0) return { label: '품절', modifier: 'soldout' }
  if (stock < LOW_STOCK_THRESHOLD) return { label: '주의', modifier: 'low' }
  return { label: '정상', modifier: 'normal' }
}

function InventoryStatus({ inventory, onChangeStock }) {
  return (
    <section className="admin-section">
      <h2 className="admin-section__title">재고 현황</h2>
      <div className="inventory">
        {inventory.map((item) => {
          const level = getStockLevel(item.stock)
          return (
            <article key={item.menuId} className="inventory__card">
              <div className="inventory__header">
                <h3 className="inventory__name">{item.name}</h3>
                <span className={`badge badge--${level.modifier}`}>
                  {level.label}
                </span>
              </div>
              <p className="inventory__stock">{item.stock}개</p>
              <div className="inventory__controls">
                <button
                  type="button"
                  className="button"
                  onClick={() => onChangeStock(item.menuId, -1)}
                  disabled={item.stock === 0}
                  aria-label={`${item.name} 재고 감소`}
                >
                  -
                </button>
                <button
                  type="button"
                  className="button"
                  onClick={() => onChangeStock(item.menuId, 1)}
                  aria-label={`${item.name} 재고 증가`}
                >
                  +
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default InventoryStatus
