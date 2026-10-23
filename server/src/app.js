import express from 'express'
import cors from 'cors'
import healthRouter from './routes/health.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'COZY 주문 앱 API 서버입니다.', health: '/api/health' })
})

app.use('/api/health', healthRouter)

app.use((req, res) => {
  res.status(404).json({ message: '요청한 경로를 찾을 수 없습니다.' })
})

app.use((err, req, res, next) => {
  console.error(err)
  const status = err.status ?? 500
  res
    .status(status)
    .json({ message: status === 500 ? '서버 오류가 발생했습니다.' : err.message })
})

export default app
