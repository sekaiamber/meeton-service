import sequelize from '../db'
import { User, Wallet } from '../db/models'

async function pr(): Promise<void> {
  await sequelize.sync()
  // 1.
  // const user = await User.findOrCreateUser(13)
  // console.log(user.wallet?.address)

  // 2.
  // const wallet = await Wallet.generateWallet()
  // console.log(wallet.address)
  // const user = await User.findOrCreateUser(17)
  // console.log(user.wallet?.address)

  await sequelize.close()
}

pr().catch((e) => console.log(e))
