export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

const MAX_INT = 2147483647

export function parseId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 && id <= MAX_INT ? id : null
}
