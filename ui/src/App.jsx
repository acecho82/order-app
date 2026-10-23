import { useState } from 'react'
import Header from './components/Header'
import OrderPage from './pages/OrderPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('order')

  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      {currentPage === 'order' ? (
        <OrderPage />
      ) : (
        <main className="placeholder">관리자 화면은 준비 중입니다.</main>
      )}
    </div>
  )
}

export default App
