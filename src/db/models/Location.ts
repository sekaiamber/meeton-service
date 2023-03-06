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

export enum Place {
  home = 0,
  commonOutside = 1,
}

@Table({
  modelName: 'location',
})
export default class Location extends Model {
  @AllowNull(false)
  @Default(Place.home)
  @Column(DataType.INTEGER)
  get place(): Place {
    return this.getDataValue('place')
  }

  get isAtHome(): boolean {
    return this.place === Place.home
  }

  @AllowNull(true)
  @Column(DataType.DATE)
  get lastTravelStartedAt(): Date {
    return this.getDataValue('lastTravelStartedAt')
  }

  @AllowNull(true)
  @Column(DataType.DATE)
  get lastTravelEndAt(): Date {
    return this.getDataValue('lastTravelEndAt')
  }

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  get userId(): number {
    return this.getDataValue('userId')
  }

  @BelongsTo(() => User)
  user?: User
}
