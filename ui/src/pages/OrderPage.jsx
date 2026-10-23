import { useState } from 'react'
import MenuCard from '../components/MenuCard'
import Cart from '../components/Cart'

function OrderPage({ menus, onCreateOrder }) {
  const [cartItems, setCartItems] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAdd = (menu, selectedOptionIds) => {
    const options = menu.options.filter((option) =>
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

  const handleOrder = async () => {
    setIsSubmitting(true)
    try {
      await onCreateOrder(cartItems)
      alert('주문이 완료되었습니다.')
      setCartItems([])
    } catch (err) {
      alert(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="order-page">
      <section className="menu-list">
        {menus.map((menu) => (
          <MenuCard key={menu.id} menu={menu} onAdd={handleAdd} />
        ))}
      </section>
      <Cart
        items={cartItems}
        onOrder={handleOrder}
        isSubmitting={isSubmitting}
      />
    </main>
  )
}

export default OrderPage
