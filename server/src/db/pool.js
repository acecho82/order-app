import pg from 'pg'

export function createPool(database = process.env.DB_NAME) {
  return new pg.Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    database,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  })
}

const pool = createPool()

export default pool
