import { Router } from 'express'
import pool from '../db/pool.js'
import { HttpError, parseId } from '../errors.js'

const router = Router()

router.get('/', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT
      m.id,
      m.name,
      m.description,
      m.price,
      m.image_url AS "imageUrl",
      m.stock,
      COALESCE(
        json_agg(
          json_build_object('id', o.id, 'name', o.name, 'price', o.price)
          ORDER BY o.id
        ) FILTER (WHERE o.id IS NOT NULL),
        '[]'
      ) AS options
    FROM menus m
    LEFT JOIN options o ON o.menu_id = m.id
    GROUP BY m.id
    ORDER BY m.id
  `)
  res.json(rows)
})

router.patch('/:id/stock', async (req, res) => {
  const id = parseId(req.params.id)
  const { delta } = req.body ?? {}
  if (!id) throw new HttpError(404, '메뉴를 찾을 수 없습니다.')
  if (!Number.isInteger(delta) || delta === 0) {
    throw new HttpError(400, 'delta는 0이 아닌 정수여야 합니다.')
  }

  const { rows } = await pool.query(
    `UPDATE menus SET stock = stock + $1
     WHERE id = $2 AND stock + $1 >= 0
     RETURNING id, stock`,
    [delta, id],
  )
  if (rows.length > 0) return res.json(rows[0])

  const { rowCount } = await pool.query('SELECT 1 FROM menus WHERE id = $1', [id])
  if (rowCount === 0) throw new HttpError(404, '메뉴를 찾을 수 없습니다.')
  throw new HttpError(400, '재고는 0개 미만이 될 수 없습니다.')
})

export default router
