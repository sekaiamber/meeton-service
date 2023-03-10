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
  HasMany,
} from 'sequelize-typescript'
import { KeyPair, mnemonicNew, mnemonicToWalletKey } from 'ton-crypto'
import { WalletContractV3R2 } from 'ton'
import User from './User'
import Balance, {
  BalanceAssets,
  CreateDepositPayload,
  Deposit,
} from './Balance'
import { Transaction } from 'sequelize'

// EQCjrNjgzRowoSpiQO7b7qzVK9PIXNGDep6Z6ALo5mMF1ibf

@Table({
  modelName: 'wallet',
  indexes: [
    {
      fields: ['address'],
    },
    {
      fields: ['userId'],
    },
  ],
})
export default class Wallet extends Model {
  @AllowNull(false)
  @Column(DataType.CHAR(64))
  get publicKey(): string {
    return this.getDataValue('publicKey')
  }

  @AllowNull(false)
  @Column(DataType.CHAR(128))
  get secretKey(): string {
    return this.getDataValue('secretKey')
  }

  @AllowNull(false)
  @Column(DataType.CHAR(48))
  get address(): string {
    return this.getDataValue('address')
  }

  @AllowNull(false)
  @Column(DataType.TEXT)
  get mnemonics(): string {
    return this.getDataValue('mnemonics')
  }

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  get active(): boolean {
    return this.getDataValue('active')
  }

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  get userId(): number {
    return this.getDataValue('userId')
  }

  @BelongsTo(() => User)
  user?: User

  @HasMany(() => Balance)
  balances?: Balance[]

  static async getUnusedWallet(userId?: number): Promise<Wallet> {
    const wallet = await Wallet.findOne({ where: { userId: null } })
    if (wallet) {
      wallet.setDataValue('userId', userId)
      await wallet.save()
      return wallet
    }
    return await Wallet.generateWallet(userId)
  }

  static async generateWallet(userId?: number): Promise<Wallet> {
    const mnemonics: string[] = await mnemonicNew(24)

    const key: KeyPair = await mnemonicToWalletKey(mnemonics)

    const wallet = WalletContractV3R2.create({
      publicKey: key.publicKey,
      workchain: 0,
    })

    return await Wallet.create({
      publicKey: key.publicKey.toString('hex'),
      secretKey: key.secretKey.toString('hex'),
      address: wallet.address.toString(),
      mnemonics: mnemonics.join(' '),
      userId,
    })
  }

  @BeforeUpdate
  @BeforeCreate
  static makeLowerCase(instance: User): void {
    // instance.setDataValue('owner', instance.owner.toLowerCase())
    // instance.setDataValue('checksum', instance.checksum.toLowerCase())
  }

  async updateAllBalances(transaction?: Transaction): Promise<void> {
    await this.reload({
      include: [Balance],
      transaction,
    })
  }

  async getBalance(
    asset: BalanceAssets,
    defaultDecimals = 9,
    transaction?: Transaction
  ): Promise<Balance> {
    await this.updateAllBalances()
    const balances = this.balances ?? []
    let balance = balances.find((b) => b.asset === asset)
    if (!balance) {
      balance = await Balance.create(
        {
          asset,
          decimals: defaultDecimals,
          walletId: this.id,
        },
        {
          transaction,
        }
      )
    }
    return balance
  }

  async createDeposit(
    payload: CreateDepositPayload & {
      asset: BalanceAssets
    }
  ): Promise<Deposit | null> {
    const t = await this.sequelize.transaction()
    try {
      const balance = await this.getBalance(payload.asset, 9, t)
      const deposit = await balance.createDeposit(payload, t)
      await t.commit()
      return deposit
    } catch (error) {
      await t.rollback()
    }
    return null
  }

  // static async findByUserId(id: number): Promise<User | null> {
  //   return await Bot.findByPk(id)
  // }

  // getData<T extends SandbagsBotBaseTrigger = any>(): SandbagsBot<T> {
  //   let trigger: any

  //   if (this.trigger) {
  //     trigger = this.trigger.getData()
  //   }

  //   return {
  //     id: this.id,
  //     owner: toChecksumAddress(this.owner),
  //     trigger,
  //     code: this.code,
  //   }
  // }
}
