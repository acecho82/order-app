import { useState } from 'react'
import MenuCard from '../components/MenuCard'
import Cart from '../components/Cart'
import { MENUS, OPTIONS } from '../data/menus'

function OrderPage({ onCreateOrder }) {
  const [cartItems, setCartItems] = useState([])

  const handleAdd = (menu, selectedOptionIds) => {
    const options = OPTIONS.filter((option) =>
      selectedOptionIds.includes(option.id),
    )
    const key = [menu.id, ...options.map((option) => option.id)].join('-')
    const unitPrice =
      menu.price + options.reduce((sum, option) => sum + option.price, 0)

    setCartItems((prev) => {
      const existing = prev.find((item) => item.key === key)
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { key, menu, options, unitPrice, quantity: 1 }]
    })
  }

  const handleOrder = () => {
    onCreateOrder(cartItems)
    alert('주문이 완료되었습니다.')
    setCartItems([])
  }

  return (
    <main className="order-page">
      <section className="menu-list">
        {MENUS.map((menu) => (
          <MenuCard key={menu.id} menu={menu} onAdd={handleAdd} />
        ))}
      </section>
      <Cart items={cartItems} onOrder={handleOrder} />
    </main>
  )
}

export default OrderPage
