import { readFile } from 'node:fs/promises'
import { createPool } from './pool.js'

const dbName = process.env.DB_NAME

async function createDatabaseIfMissing() {
  const adminPool = createPool('postgres')
  try {
    const { rowCount } = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName],
    )
    if (rowCount === 0) {
      const safeName = dbName.replaceAll('"', '""')
      await adminPool.query(`CREATE DATABASE "${safeName}"`)
      console.log(`Created database "${dbName}"`)
    }
  } finally {
    await adminPool.end()
  }
}

async function createTablesAndSeed() {
  const pool = createPool()
  try {
    const schema = await readFile(new URL('./schema.sql', import.meta.url), 'utf8')
    await pool.query(schema)
    console.log('Tables are ready')

    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM menus')
    if (rows[0].count === 0) {
      const seed = await readFile(new URL('./seed.sql', import.meta.url), 'utf8')
      await pool.query(seed)
      console.log('Inserted seed menus and options')
    } else {
      console.log('Menus already exist, skipping seed')
    }
  } finally {
    await pool.end()
  }
}

try {
  await createDatabaseIfMissing()
  await createTablesAndSeed()
} catch (err) {
  console.error('Database setup failed:', err.message)
  process.exitCode = 1
}
