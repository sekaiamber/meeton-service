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
import { pointInMap } from '../../utils'
import User from './User'
import CONSTANTS from '../../constants'
import { Transaction } from 'sequelize'
import { timeNumber } from '../../utils/time'

const { favorabilityLevelMap, movementLevelMap, timeScale } = CONSTANTS

@Table({
  modelName: 'status',
})
export default class Status extends Model {
  // favorability
  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  get initFavorability(): number {
    return this.getDataValue('initFavorability')
  }

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  get additionalFavorability(): number {
    return this.getDataValue('additionalFavorability')
  }

  @AllowNull(false)
  @Default(5000)
  @Column(DataType.INTEGER)
  get maxFavorability(): number {
    return this.getDataValue('maxFavorability')
  }

  get favorability(): number {
    return this.initFavorability + this.additionalFavorability
  }

  get favorabilityLevel(): number {
    return pointInMap(this.favorability, favorabilityLevelMap)
  }

  get isMaxFavorabilityLevel(): boolean {
    const { favorabilityLevel } = this
    return favorabilityLevel === favorabilityLevelMap.length - 1
  }

  get nextLevelFavorability(): number {
    const { favorabilityLevel } = this
    return (
      favorabilityLevelMap[favorabilityLevel + 1] ??
      favorabilityLevelMap[favorabilityLevelMap.length - 1]
    )
  }

  // movement
  @AllowNull(false)
  @Default(10)
  @Column(DataType.INTEGER)
  get movement(): number {
    return this.getDataValue('movement')
  }

  @AllowNull(false)
  @Default(10)
  @Column(DataType.INTEGER)
  get maxMovement(): number {
    return this.getDataValue('maxMovement')
  }

  get movementLevel(): number {
    return pointInMap(this.movement, movementLevelMap)
  }

  get isMaxMovementLevel(): boolean {
    const { movementLevel } = this
    return movementLevel === movementLevelMap.length - 1
  }

  get nextLevelMovement(): number {
    const { movementLevel } = this
    return (
      movementLevelMap[movementLevel + 1] ??
      movementLevelMap[movementLevelMap.length - 1]
    )
  }

  get isSleeping(): boolean {
    if (this.lastTravelEndAt === null) return false
    const now = new Date()
    const diff = now.getTime() - this.lastTravelEndAt.getTime()
    return diff < timeNumber.hour * timeScale
  }

  // talk points
  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  get talkPoints(): number {
    return this.getDataValue('talkPoints')
  }

  async recoverTalkPoints(): Promise<void> {
    this.setDataValue('talkPoints', 5)
    await this.save()
  }

  async onTalk(favorabilityChangeBy: number): Promise<void> {
    // TODO: transction
    await this.increment('talkPoints', { by: -1 })
    await this.addFavorability(favorabilityChangeBy)
    await this.reload()
    if (this.talkPoints === 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const user = (await User.findOrCreateUser(this.userId))!
      if (this.movementLevel > 0) {
        await user.addStartTravelTask()
      } else {
        this.setDataValue('travelInWaiting', true)
        await this.save()
        await user.addRecoverTalkPointsTask()
      }
    }
  }

  // travel cooldown
  @AllowNull(true)
  @Column(DataType.DATE)
  get lastTravelEndAt(): Date | null {
    return this.getDataValue('lastTravelEndAt')
  }

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  get travelInWaiting(): boolean {
    return this.getDataValue('travelInWaiting')
  }

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  get userId(): number {
    return this.getDataValue('userId')
  }

  @BelongsTo(() => User)
  user?: User

  async addMovement(by: number, t?: Transaction): Promise<void> {
    await this.increment('movement', { by, transaction: t })
    await this.reload({ transaction: t })
    if (this.maxMovement < this.movement) {
      await this.setDataValue('movement', this.maxMovement)
      await this.save({ transaction: t })
    }
    // check if there is travel in waiting
    if (this.travelInWaiting) {
      const user = await User.findOrCreateUser(this.userId)
      await user.addStartTravelTask()
      this.setDataValue('travelInWaiting', false)
      await this.save()
    }
  }

  async addFavorability(by: number, t?: Transaction): Promise<void> {
    await this.increment('additionalFavorability', { by, transaction: t })
    await this.reload({ transaction: t })
    if (this.maxFavorability < this.favorability) {
      await this.setDataValue(
        'additionalFavorability',
        this.maxFavorability - this.initFavorability
      )
      await this.save({ transaction: t })
    }
  }

  async addMaxMovement(by: number, t?: Transaction): Promise<void> {
    await this.increment('maxMovement', { by, transaction: t })
    await this.reload({ transaction: t })
  }
}
