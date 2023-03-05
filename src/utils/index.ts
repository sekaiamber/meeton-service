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
