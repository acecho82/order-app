import { useState } from 'react'
import { OPTIONS } from '../data/menus'
import { formatPrice } from '../utils/format'

function MenuCard({ menu, onAdd }) {
  const [selectedOptionIds, setSelectedOptionIds] = useState([])

  const toggleOption = (optionId) => {
    setSelectedOptionIds((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    )
  }

  const handleAdd = () => {
    onAdd(menu, selectedOptionIds)
    setSelectedOptionIds([])
  }

  return (
    <article className="menu-card">
      <div className="menu-card__image">
        {menu.image ? (
          <img src={menu.image} alt={menu.name} />
        ) : (
          <span aria-hidden="true">{menu.name}</span>
        )}
      </div>
      <div className="menu-card__body">
        <h3 className="menu-card__name">{menu.name}</h3>
        <p className="menu-card__price">{formatPrice(menu.price)}</p>
        <p className="menu-card__description">{menu.description}</p>
        <ul className="menu-card__options">
          {OPTIONS.map((option) => (
            <li key={option.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedOptionIds.includes(option.id)}
                  onChange={() => toggleOption(option.id)}
                />
                {option.name} (+{formatPrice(option.price)})
              </label>
            </li>
          ))}
        </ul>
        <button type="button" className="button" onClick={handleAdd}>
          담기
        </button>
      </div>
    </article>
  )
}

export default MenuCard
