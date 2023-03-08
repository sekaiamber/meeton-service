import { filledBar } from 'string-progressbar'

const { DEBUG } = process.env

export function debug(message: string): void {
  if (DEBUG === '1') {
    console.log(message)
  }
}

// https://www.compart.com/en/unicode/block/U+2580
export function drawProgressBar(
  total: number,
  current: number,
  size = 30,
  line = '-',
  slider = '=',
  arrow = '>'
): string {
  const d = filledBar(total, current, size, line, slider)[0]
  if (d.startsWith(line)) return d
  if (d.endsWith(slider)) return d
  const i = d.indexOf(line)
  const dd = d.split('')
  dd[i - 1] = arrow
  return dd.join('')
}

export function randomGt(gt = 0.5): boolean {
  return Math.random() > gt
}

export function randomPick<T>(source: T[]): T {
  return source[Math.floor(Math.random() * source.length)]
}

export function pointInMap(point: number, map: number[]): number {
  let lv = 0
  for (let i = 0; i < map.length; i++) {
    lv = i
    if (point < map[i]) {
      break
    }
  }
  return lv
}

interface RandomMap<T> {
  data: T
  weight: number
}

export function randomMapPick<T>(source: Array<RandomMap<T>>): T {
  if (source.length === 1) {
    return source[0].data
  }
  const accumulateWeights = source.map((_, i) => {
    return source
      .slice(0, i + 1)
      .map((rm) => rm.weight)
      .reduce((a, b) => a + b, 0)
  })
  const point = Math.random() * accumulateWeights[accumulateWeights.length - 1]
  const index = pointInMap(point, accumulateWeights)
  return source[index].data
}
