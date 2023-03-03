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
import { KeyPair, mnemonicNew, mnemonicToWalletKey } from 'ton-crypto'
import { WalletContractV4 } from 'ton'
import User from './user'

// EQCjrNjgzRowoSpiQO7b7qzVK9PIXNGDep6Z6ALo5mMF1ibf

const { WALLET_PASSWORD } = process.env

@Table({
  modelName: 'wallet',
})
export default class Wallet extends Model {
  @AllowNull(false)
  @Column(DataType.CHAR(64))
  get publicKey(): number {
    return this.getDataValue('publicKey')
  }

  @AllowNull(false)
  @Column(DataType.CHAR(128))
  get secretKey(): number {
    return this.getDataValue('secretKey')
  }

  @AllowNull(false)
  @Column(DataType.CHAR(48))
  get address(): number {
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
    const password = WALLET_PASSWORD ?? null
    const mnemonics: string[] = await mnemonicNew(24, password)

    const key: KeyPair = await mnemonicToWalletKey(mnemonics, password)

    const wallet = WalletContractV4.create({
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
