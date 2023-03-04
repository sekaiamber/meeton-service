const { DEBUG } = process.env

export function debug(message: string): void {
  if (DEBUG === '1') {
    console.log(message)
  }
}
