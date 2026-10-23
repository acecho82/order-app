import { Router } from 'express'
import pool from '../db/pool.js'
import { HttpError, parseId } from '../errors.js'

const router = Router()

const PREVIOUS_STATUS = {
  in_progress: 'received',
  completed: 'in_progress',
}

const ORDER_COLUMNS = `
  id,
  created_at AS "createdAt",
  items,
  total_price AS "totalPrice",
  status
`

function parseOrderItems(body) {
  const items = body?.items
  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpError(400, '주문 항목이 비어 있습니다.')
  }

  return items.map((item) => {
    const menuId = parseId(item?.menuId)
    const quantity = item?.quantity
    const optionIds = item?.optionIds ?? []
    if (!menuId) throw new HttpError(400, '메뉴 ID가 올바르지 않습니다.')
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      throw new HttpError(400, '수량은 1 이상 100 이하의 정수여야 합니다.')
    }
    if (!Array.isArray(optionIds) || optionIds.some((id) => !parseId(id))) {
      throw new HttpError(400, '옵션 ID가 올바르지 않습니다.')
    }
    return { menuId, quantity, optionIds: [...new Set(optionIds.map(Number))] }
  })
}

router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT ${ORDER_COLUMNS} FROM orders ORDER BY created_at DESC, id DESC`,
  )
  res.json(rows)
})

router.get('/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) throw new HttpError(404, '주문을 찾을 수 없습니다.')

  const { rows } = await pool.query(
    `SELECT ${ORDER_COLUMNS} FROM orders WHERE id = $1`,
    [id],
  )
  if (rows.length === 0) throw new HttpError(404, '주문을 찾을 수 없습니다.')
  res.json(rows[0])
})

router.post('/', async (req, res) => {
  const requestedItems = parseOrderItems(req.body)
  const menuIds = [...new Set(requestedItems.map((item) => item.menuId))]
  const optionIds = [...new Set(requestedItems.flatMap((item) => item.optionIds))]

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const { rows: menuRows } = await client.query(
      'SELECT id, name, price, stock FROM menus WHERE id = ANY($1) ORDER BY id FOR UPDATE',
      [menuIds],
    )
    const menus = new Map(menuRows.map((menu) => [menu.id, menu]))
    if (menus.size !== menuIds.length) {
      throw new HttpError(400, '존재하지 않는 메뉴가 포함되어 있습니다.')
    }

    const { rows: optionRows } = await client.query(
      'SELECT id, name, price, menu_id FROM options WHERE id = ANY($1)',
      [optionIds],
    )
    const options = new Map(optionRows.map((option) => [option.id, option]))

    const quantityByMenu = new Map()
    const items = requestedItems.map((item) => {
      const menu = menus.get(item.menuId)
      const itemOptions = item.optionIds.map((optionId) => {
        const option = options.get(optionId)
        if (!option || option.menu_id !== menu.id) {
          throw new HttpError(400, `${menu.name}에 선택할 수 없는 옵션이 포함되어 있습니다.`)
        }
        return option
      })
      quantityByMenu.set(menu.id, (quantityByMenu.get(menu.id) ?? 0) + item.quantity)

      const unitPrice =
        menu.price + itemOptions.reduce((sum, option) => sum + option.price, 0)
      return {
        menuId: menu.id,
        menuName: menu.name,
        quantity: item.quantity,
        options: itemOptions.map((option) => option.name),
        price: unitPrice * item.quantity,
      }
    })

    for (const [menuId, quantity] of quantityByMenu) {
      const menu = menus.get(menuId)
      if (menu.stock < quantity) {
        throw new HttpError(
          409,
          `${menu.name}의 재고가 부족합니다. (남은 재고 ${menu.stock}개)`,
        )
      }
      await client.query('UPDATE menus SET stock = stock - $1 WHERE id = $2', [
        quantity,
        menuId,
      ])
    }

    const totalPrice = items.reduce((sum, item) => sum + item.price, 0)
    const { rows } = await client.query(
      `INSERT INTO orders (items, total_price) VALUES ($1, $2) RETURNING ${ORDER_COLUMNS}`,
      [JSON.stringify(items), totalPrice],
    )

    await client.query('COMMIT')
    res.status(201).json(rows[0])
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
})

router.patch('/:id/status', async (req, res) => {
  const id = parseId(req.params.id)
  const { status } = req.body ?? {}
  if (!id) throw new HttpError(404, '주문을 찾을 수 없습니다.')
  if (!Object.hasOwn(PREVIOUS_STATUS, status)) {
    throw new HttpError(400, '변경할 수 없는 상태입니다.')
  }

  const { rows } = await pool.query(
    `UPDATE orders SET status = $1
     WHERE id = $2 AND status = $3
     RETURNING ${ORDER_COLUMNS}`,
    [status, id, PREVIOUS_STATUS[status]],
  )
  if (rows.length > 0) return res.json(rows[0])

  const { rowCount } = await pool.query('SELECT 1 FROM orders WHERE id = $1', [id])
  if (rowCount === 0) throw new HttpError(404, '주문을 찾을 수 없습니다.')
  throw new HttpError(400, '주문 상태는 주문 접수 → 제조 중 → 제조 완료 순서로만 변경할 수 있습니다.')
})

export default router
