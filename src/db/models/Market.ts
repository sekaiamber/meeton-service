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
import { BalanceAssets } from './Balance'
import User from './User'

@Table({
  modelName: 'marketItem',
  indexes: [
    {
      fields: ['key'],
      unique: true,
    },
  ],
})
export class MarketItem extends Model {
  @AllowNull(false)
  @Column(DataType.CHAR(20))
  get key(): string {
    return this.getDataValue('key')
  }

  @AllowNull(false)
  @Column(DataType.BIGINT)
  get cost(): string {
    return this.getDataValue('cost')
  }

  @AllowNull(false)
  @Column(DataType.CHAR(12))
  get costAsset(): BalanceAssets {
    return this.getDataValue('costAsset')
  }

  @AllowNull(false)
  @Column(DataType.TEXT)
  get iconUrl(): string {
    return this.getDataValue('iconUrl')
  }

  @AllowNull(false)
  @Default(1)
  @Column(DataType.INTEGER)
  get order(): number {
    return this.getDataValue('order')
  }

  static async buy(
    user: User,
    key: string
  ): Promise<UserMarketItem | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const t = await this.sequelize!.transaction()
    try {
      const item = await MarketItem.findOne({ where: { key }, transaction: t })
      if (!item) {
        throw new Error(`item not found by ${key}`)
      }
      const r = await UserMarketItem.create(
        {
          marketItemId: item.id,
          userId: user.id,
        },
        {
          transaction: t,
        }
      )
      await user.reloadAllModels(t)
      const { wallet } = user
      const balance = await wallet.getBalance(item.costAsset, 9, t)
      // TODO: balace log
      await balance.incrementAmount(`-${item.cost}`, t)
      await t.commit()
      return r
    } catch (error) {
      console.log(error)
      await t.rollback()
    }
  }
}

@Table({
  modelName: 'userMarketItem',
  indexes: [
    {
      fields: ['userId'],
    },
  ],
})
export class UserMarketItem extends Model {
  @ForeignKey(() => MarketItem)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  get marketItemId(): number {
    return this.getDataValue('marketItemId')
  }

  @BelongsTo(() => MarketItem)
  get marketItem(): MarketItem {
    return this.getDataValue('marketItem')
  }

  set marketItem(v: MarketItem) {
    //
  }

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  get userId(): number {
    return this.getDataValue('userId')
  }

  @BelongsTo(() => User)
  get user(): User {
    return this.getDataValue('user')
  }

  set user(v: User) {
    //
  }

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  get used(): boolean {
    return this.getDataValue('used')
  }
}
