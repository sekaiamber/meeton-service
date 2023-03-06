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

  @HasOne(() => TravelTarget)
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

  @HasOne(() => TravelTreasure)
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

  static async createByUser(
    user: User,
    startedAt = new Date()
  ): Promise<Travel> {
    const { status, id } = user
    const { movementLevel, favorabilityLevel } = status
    // random target
    const maxTargetLevel = movementLevel
    const targetWeights = favorabilityTargetLevelWeightMap[
      favorabilityLevel
    ].slice(0, maxTargetLevel + 1)
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
    const endAt = addTime(startedAt, targetLevelTimeCostMap[tragetLevel])
    return await Travel.create({
      userId: id,
      targetId: target.id,
      treasureId: treasure.id,
      startedAt,
      endAt,
    })
  }
}

@Table({
  modelName: 'travelTarget',
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
}

@Table({
  modelName: 'travelTreasure',
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
}
