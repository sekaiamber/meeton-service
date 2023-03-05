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
import User from './User'

const FavorabilityLevelMap = [10, 150, 300, 1000, 2000, 5000]
const MovementLevelMap = [10, 20, 60, 120, 300]

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
    const { favorability } = this
    let lv = 0
    for (let i = 0; i < FavorabilityLevelMap.length; i++) {
      lv = i
      if (favorability < FavorabilityLevelMap[i]) {
        break
      }
    }
    return lv
  }

  get isMaxFavorabilityLevel(): boolean {
    const { favorabilityLevel } = this
    return favorabilityLevel === FavorabilityLevelMap.length - 1
  }

  get nextLevelFavorability(): number {
    const { favorabilityLevel } = this
    return (
      FavorabilityLevelMap[favorabilityLevel + 1] ??
      FavorabilityLevelMap[FavorabilityLevelMap.length - 1]
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
    const { movement } = this
    let lv = 0
    for (let i = 0; i < MovementLevelMap.length; i++) {
      lv = i
      if (movement < FavorabilityLevelMap[i]) {
        break
      }
    }
    return lv
  }

  get isMaxMovementLevel(): boolean {
    const { movementLevel } = this
    return movementLevel === MovementLevelMap.length - 1
  }

  get nextLevelMovement(): number {
    const { movementLevel } = this
    return (
      MovementLevelMap[movementLevel + 1] ??
      MovementLevelMap[MovementLevelMap.length - 1]
    )
  }

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  get userId(): number {
    return this.getDataValue('userId')
  }

  @BelongsTo(() => User)
  user?: User
}
