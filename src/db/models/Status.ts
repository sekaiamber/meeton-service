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

const { favorabilityLevelMap, movementLevelMap } = CONSTANTS

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

  // travel cooldown
  @AllowNull(true)
  @Column(DataType.DATE)
  get lastMovementAddedAt(): Date {
    return this.getDataValue('lastMovementAddedAt')
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
  }
}
