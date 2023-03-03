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
import { i18n as i18nInterface } from 'i18next'
import i18n from '../../i18n'
import Wallet from './wallet'

// EQCjrNjgzRowoSpiQO7b7qzVK9PIXNGDep6Z6ALo5mMF1ibf

export enum UserLanguage {
  en = 'en',
  'zh-cn' = 'zh-cn',
}

@Table({
  modelName: 'user',
})
export default class User extends Model {
  @AllowNull(false)
  @Column({ primaryKey: true, type: DataType.INTEGER })
  get id(): number {
    return this.getDataValue('id')
  }

  set id(v: number) {
    this.setDataValue('id', v)
  }

  @AllowNull(false)
  @Default('en')
  @Column(DataType.ENUM('en', 'zh-cn'))
  get language(): UserLanguage {
    return this.getDataValue('language')
  }

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  get languageInited(): boolean {
    return this.getDataValue('languageInited')
  }

  @HasOne(() => Wallet)
  get wallet(): Wallet {
    return this.getDataValue('wallet')
  }

  set wallet(w: Wallet) {
    //
  }

  @BeforeUpdate
  @BeforeCreate
  static makeLowerCase(instance: User): void {
    // instance.setDataValue('owner', instance.owner.toLowerCase())
    // instance.setDataValue('checksum', instance.checksum.toLowerCase())
  }

  static async findOrCreateUser(id: number): Promise<User> {
    let user = await User.findByPk(id, { include: [Wallet] })
    if (!user) {
      user = await User.create({ id })
    }
    if (!user.wallet) {
      await Wallet.getUnusedWallet(id)
    }
    await user.reload({
      include: [Wallet],
    })
    return user
  }

  get i18n(): i18nInterface {
    return i18n[this.language]
  }

  async setLanguage(language: UserLanguage): Promise<void> {
    this.setDataValue('language', language)
    // this.setDataValue('languageInited', true)
    await this.save()
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
