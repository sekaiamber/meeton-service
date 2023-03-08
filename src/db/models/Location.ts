import { Transaction } from 'sequelize'
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
import Travel from './Travel'
import User from './User'

@Table({
  modelName: 'location',
})
export default class Location extends Model {
  @AllowNull(true)
  @Column(DataType.INTEGER)
  get onTravelId(): number | null {
    return this.getDataValue('onTravelId')
  }

  @BelongsTo(() => Travel, 'onTravelId')
  travel?: Travel

  get isAtHome(): boolean {
    return this.onTravelId === null
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

  async onTravel(
    travel: Travel | null,
    transaction?: Transaction
  ): Promise<void> {
    if (travel === null) {
      if (this.onTravelId !== null) {
        const lastTravel = await Travel.findByPk(this.onTravelId, {
          transaction,
        })
        if (lastTravel) {
          this.setDataValue('lastTravelStartedAt', lastTravel.startedAt)
          this.setDataValue('lastTravelEndAt', lastTravel.endAt)
        }
      }
      this.setDataValue('onTravelId', null)
    } else {
      this.setDataValue('onTravelId', travel.id)
    }
    await this.save({ transaction })
  }

  async reachHome(): Promise<void> {
    await this.onTravel(null)
    const user = await User.findOrCreateUser(this.userId)
    await user.status.addMaxMovement(2)
  }
}
