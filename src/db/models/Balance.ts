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
import Wallet from './Wallet'
import { tokenHumanAmount } from '../../utils'
import { Transaction } from 'sequelize'

export enum BalanceAssets {
  mee = 'MEE',
}

export interface CreateDepositPayload {
  amount: string
  from: string
  to: string
  hash: string
  logicalTime: string
  blockNumber: number
}

@Table({
  modelName: 'balance',
  indexes: [
    {
      fields: ['asset'],
    },
    {
      fields: ['asset', 'walletId'],
      unique: true,
    },
  ],
})
export default class Balance extends Model {
  @AllowNull(false)
  @Column(DataType.CHAR(12))
  get asset(): string {
    return this.getDataValue('asset')
  }

  @AllowNull(false)
  @Default(0)
  @Column(DataType.BIGINT)
  get amount(): string {
    return this.getDataValue('amount')
  }

  @AllowNull(false)
  @Default(9)
  @Column(DataType.INTEGER)
  get decimals(): number {
    return this.getDataValue('decimals')
  }

  get humanBalance(): string {
    return tokenHumanAmount(this.amount.toString(), 9, 2)
  }

  @ForeignKey(() => Wallet)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  get walletId(): number {
    return this.getDataValue('walletId')
  }

  @BelongsTo(() => Wallet)
  wallet!: Wallet

  @BeforeUpdate
  @BeforeCreate
  static makeLowerCase(instance: Balance): void {
    // instance.setDataValue('owner', instance.owner.toLowerCase())
    // instance.setDataValue('checksum', instance.checksum.toLowerCase())
  }

  async createDeposit(
    payload: CreateDepositPayload,
    transaction?: Transaction
  ): Promise<Deposit> {
    const amountBefore = this.amount
    const deposit = await Deposit.create(
      {
        ...payload,
        amountBefore,
        balanceId: this.id,
      },
      {
        transaction,
      }
    )
    await this.incrementAmount(payload.amount, transaction)
    return deposit
  }

  async incrementAmount(
    amount: string,
    transaction?: Transaction
  ): Promise<void> {
    await this.increment('amount', { by: amount, transaction })
  }
}

@Table({
  modelName: 'deposit',
  indexes: [
    {
      fields: ['balanceId'],
    },
    {
      fields: ['hash'],
    },
  ],
})
export class Deposit extends Model {
  @ForeignKey(() => Balance)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  get balanceId(): number {
    return this.getDataValue('balanceId')
  }

  @BelongsTo(() => Balance)
  balance!: Balance

  @AllowNull(false)
  @Column(DataType.BIGINT)
  get amount(): string {
    return this.getDataValue('amount')
  }

  @AllowNull(false)
  @Column(DataType.BIGINT)
  get amountBefore(): string {
    return this.getDataValue('amountBefore')
  }

  @AllowNull(false)
  @Column(DataType.CHAR(48))
  get from(): string {
    return this.getDataValue('from')
  }

  @AllowNull(false)
  @Column(DataType.CHAR(48))
  get to(): string {
    return this.getDataValue('to')
  }

  @AllowNull(false)
  @Column(DataType.CHAR(64))
  get hash(): string {
    return this.getDataValue('hash')
  }

  @AllowNull(false)
  @Column(DataType.CHAR(64))
  get logicalTime(): string {
    return this.getDataValue('logicalTime')
  }

  @AllowNull(false)
  @Column(DataType.INTEGER)
  get blockNumber(): number {
    return this.getDataValue('blockNumber')
  }

  @BeforeUpdate
  @BeforeCreate
  static makeLowerCase(instance: Balance): void {
    // instance.setDataValue('owner', instance.owner.toLowerCase())
    // instance.setDataValue('checksum', instance.checksum.toLowerCase())
  }
}
