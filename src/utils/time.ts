const second = 1_000
const minute = 60 * second
const hour = 60 * minute
const day = 24 * hour
const timeNumber = {
  second,
  minute,
  hour,
  day,
}

export { timeNumber }

export function addTime(start: Date, add: number): Date {
  const t = start.getTime()
  return new Date(t + add)
}

export function getNextRandomDatetime(start: Date, max: number, min = 0): Date {
  const diff = max - min
  const add = Math.random() * diff
  return addTime(start, add)
}
