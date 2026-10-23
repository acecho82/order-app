const NAV_ITEMS = [
  { id: 'order', label: '주문하기' },
  { id: 'admin', label: '관리자' },
]

function Header({ currentPage, onNavigate }) {
  return (
    <header className="header">
      <h1 className="header__logo">COZY</h1>
      <nav className="header__nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`header__nav-button${
              currentPage === item.id ? ' header__nav-button--active' : ''
            }`}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

export default Header
