import sequelize from '../db'
import { Wallet } from '../db/models'

async function createNewWallet(): Promise<Wallet> {
  return await Wallet.generateWallet()
}

const ROUND = 10

async function task(): Promise<void> {
  await sequelize.sync()
  for (let i = 0; i < ROUND; i++) {
    const wallet = await createNewWallet()
    console.log(`${wallet.id as number}: ${wallet.address}`)
  }
  await sequelize.close()
}

task().catch((e) => console.log(e))
