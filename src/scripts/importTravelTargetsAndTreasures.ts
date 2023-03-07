import sequelize from '../db'
import { targetRawData } from '../constants/targets'
import { treasuresRawData } from '../constants/treasures'
import { TravelTarget, TravelTreasure } from '../db/models'

async function task(): Promise<void> {
  await sequelize.sync()
  for (let i = 0; i < targetRawData.length; i++) {
    const target = targetRawData[i]
    await TravelTarget.create({
      key: target.key,
      level: target.level,
    })
    console.log(`imported ${target.key}`)
  }
  for (let i = 0; i < treasuresRawData.length; i++) {
    const target = treasuresRawData[i]
    await TravelTreasure.create({
      key: target.key,
      rarity: target.rarity,
      level: target.level,
    })
    console.log(`imported ${target.key}`)
  }
  await sequelize.close()
}

task().catch((e) => console.log(e))
