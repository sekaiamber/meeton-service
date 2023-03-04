import { mnemonicNew } from 'ton-crypto'
import { std } from 'mathjs'

// get cost of main process
async function runCase(): Promise<number> {
  const start = new Date()
  const password = '111'
  const mnemonics: string[] = await mnemonicNew(24, password)
  const end = new Date()
  return end.getTime() - start.getTime()
}

const ROUNDS = 10

async function pr(): Promise<void> {
  const costs: number[] = []
  for (let i = 0; i < ROUNDS; i++) {
    console.log(`running ${i + 1}/${ROUNDS}`)
    const cost = await runCase()
    costs.push(cost)
  }
  console.log(`Max: ${Math.max(...costs)}`)
  console.log(`Min: ${Math.min(...costs)}`)
  console.log(`Avg: ${costs.reduce((a, b) => a + b) / ROUNDS}`)
  console.log(`Standard Deviation: ${std(...costs)}`)
}

pr().catch((e) => console.log(e))
