import pg from 'pg'

function sslForHost(host = '') {
  return host.includes('render.com') ? { rejectUnauthorized: false } : undefined
}

export function createPool(database = process.env.DB_NAME) {
  const host = process.env.DB_HOST
  return new pg.Pool({
    host,
    port: Number(process.env.DB_PORT ?? 5432),
    database,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: sslForHost(host),
  })
}

const pool = createPool()

export default pool
