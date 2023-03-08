import {
  Table,
  Column,
  AllowNull,
  DataType,
  ForeignKey,
  BelongsTo,
  HasOne,
  Unique,
  BeforeUpdate,
  BeforeCreate,
  Is,
  Model,
  Default,
} from 'sequelize-typescript'
import { randomMapPick, randomPick } from '../../utils'
import { addTime } from '../../utils/time'
import User from './User'
import CONSTANTS from '../../constants'
import targetRawDataMap from '../../constants/targets'
import treasuresRawDataMap from '../../constants/treasures'

const {
  favorabilityTreasureRarityWeightMap,
  favorabilityTargetLevelWeightMap,
  targetLevelTimeCostMap,
  targetLevelMovementCostMap,
} = CONSTANTS

@Table({
  modelName: 'travel',
})
export default class Travel extends Model {
  @AllowNull(false)
  @Column(DataType.INTEGER)
  get targetId(): number {
    return this.getDataValue('targetId')
  }

  @BelongsTo(() => TravelTarget, 'targetId')
  get target(): TravelTarget {
    return this.getDataValue('target')
  }

  set target(w: TravelTarget) {
    //
  }

  @AllowNull(false)
  @Column(DataType.INTEGER)
  get treasureId(): number {
    return this.getDataValue('treasureId')
  }

  @BelongsTo(() => TravelTreasure, 'treasureId')
  get treasure(): TravelTreasure {
    return this.getDataValue('treasure')
  }

  set treasure(w: TravelTreasure) {
    //
  }

  @AllowNull(false)
  @Column(DataType.DATE)
  get startedAt(): Date {
    return this.getDataValue('startedAt')
  }

  @AllowNull(false)
  @Column(DataType.DATE)
  get endAt(): Date {
    return this.getDataValue('endAt')
  }

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  get userId(): number {
    return this.getDataValue('userId')
  }

  @BelongsTo(() => User)
  user?: User

  static async createByUserIdNow(userId: number): Promise<Travel | undefined> {
    const user = await User.findOrCreateUser(userId)
    const { status, id, location } = user
    const { movementLevel, favorabilityLevel } = status
    if (movementLevel === 0) return undefined
    // random target
    const maxTargetLevel = movementLevel
    const targetWeights = favorabilityTargetLevelWeightMap[
      favorabilityLevel
    ].slice(0, maxTargetLevel)
    const tragetLevel = randomMapPick(
      targetWeights.map((weight, i) => ({
        data: i,
        weight,
      }))
    )
    const targets = await TravelTarget.findAll({
      where: { level: tragetLevel },
    })
    const target = randomPick(targets)
    // random treasure
    const treasureWeights =
      favorabilityTreasureRarityWeightMap[favorabilityLevel]
    const treasureRarity = randomMapPick(
      treasureWeights.map((weight, i) => ({
        data: i,
        weight,
      }))
    )
    const treasures = await TravelTreasure.findAll({
      where: { level: tragetLevel, rarity: treasureRarity },
    })
    const treasure = randomPick(treasures)
    const startedAt = new Date()
    const endAt = addTime(startedAt, targetLevelTimeCostMap[tragetLevel])
    const transaction = await this.sequelize!.transaction()
    try {
      const travel = await Travel.create(
        {
          userId: id,
          targetId: target.id,
          treasureId: treasure.id,
          startedAt,
          endAt,
        },
        {
          transaction,
        }
      )
      await user.addMovement(-target.movementCost, transaction)
      await location.onTravel(travel, transaction)
      await transaction.commit()
      return travel
    } catch (error) {
      await transaction.rollback()
      return undefined
    }
  }
}

@Table({
  modelName: 'travelTarget',
  indexes: [
    {
      fields: ['key'],
      unique: true,
    },
  ],
})
export class TravelTarget extends Model {
  @AllowNull(false)
  @Column(DataType.INTEGER)
  get level(): number {
    return this.getDataValue('level')
  }

  @AllowNull(false)
  @Column(DataType.CHAR(20))
  get key(): string {
    return this.getDataValue('key')
  }

  get movementCost(): number {
    return targetLevelMovementCostMap[this.level]
  }

  get description(): string {
    return targetRawDataMap[this.key]?.description ?? ''
  }
}

@Table({
  modelName: 'travelTreasure',
  indexes: [
    {
      fields: ['key'],
      unique: true,
    },
  ],
})
export class TravelTreasure extends Model {
  @AllowNull(false)
  @Column(DataType.INTEGER)
  get level(): number {
    return this.getDataValue('level')
  }

  @AllowNull(false)
  @Column(DataType.INTEGER)
  get rarity(): number {
    return this.getDataValue('rarity')
  }

  @AllowNull(false)
  @Column(DataType.CHAR(20))
  get key(): string {
    return this.getDataValue('key')
  }

  get description(): string {
    return treasuresRawDataMap[this.key]?.description ?? ''
  }
}
