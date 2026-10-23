export function formatPrice(price) {
  return `${price.toLocaleString('ko-KR')}원`
}

export function formatDate(date) {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}

export function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}
