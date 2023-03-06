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
import Wallet from './Wallet'
import InitFavorabilityTest from './InitFavorabilityTest'
import Status from './Status'
import Location from './Location'
import UserInnerTask, { TaskType } from './UserInnerTask'
import { getNextRandomDatetime, timeNumber } from '../../utils/time'

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

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  get isAdmin(): boolean {
    return this.getDataValue('isAdmin')
  }

  @HasOne(() => Wallet)
  get wallet(): Wallet {
    return this.getDataValue('wallet')
  }

  set wallet(w: Wallet) {
    //
  }

  @HasOne(() => InitFavorabilityTest)
  get initFavorabilityTest(): InitFavorabilityTest {
    return this.getDataValue('initFavorabilityTest')
  }

  set initFavorabilityTest(w: InitFavorabilityTest) {
    //
  }

  @HasOne(() => Status)
  get status(): Status {
    return this.getDataValue('status')
  }

  set status(w: Status) {
    //
  }

  @HasOne(() => Location)
  get location(): Location {
    return this.getDataValue('location')
  }

  set location(w: Location) {
    //
  }

  @BeforeUpdate
  @BeforeCreate
  static makeLowerCase(instance: User): void {
    // instance.setDataValue('owner', instance.owner.toLowerCase())
    // instance.setDataValue('checksum', instance.checksum.toLowerCase())
  }

  static async findOrCreateUser(id: number): Promise<User> {
    let user = await User.findByPk(id, {
      include: [Wallet, InitFavorabilityTest, Status, Location],
    })
    let needUpdate = false
    if (!user) {
      user = await User.create({ id })
      needUpdate = true
    }
    if (!user.wallet) {
      await Wallet.getUnusedWallet(id)
      needUpdate = true
    }
    let initFavorabilityTest = user.initFavorabilityTest
    if (!user.initFavorabilityTest) {
      initFavorabilityTest = await InitFavorabilityTest.create({
        userId: user.id,
      })
      needUpdate = true
    }
    if (!user.status) {
      let initFavorability = 0
      if (initFavorabilityTest.finished) {
        initFavorability = initFavorabilityTest.score
      }
      await Status.create({
        userId: user.id,
        initFavorability,
      })
      needUpdate = true
    }
    if (!user.location) {
      await Location.create({
        userId: user.id,
      })
      needUpdate = true
    }
    if (needUpdate) {
      await user.reload({
        include: [Wallet, InitFavorabilityTest, Status, Location],
      })
    }
    return user
  }

  get i18n(): i18nInterface {
    return i18n[this.language]
  }

  async setLanguage(language: UserLanguage): Promise<void> {
    this.setDataValue('language', language)
    this.setDataValue('languageInited', true)
    await this.save()
  }

  // tasks
  async addTask(type: TaskType, runAt: Date): Promise<UserInnerTask> {
    return await UserInnerTask.addTask(this.id, type, runAt)
  }

  async addStartTravel(): Promise<UserInnerTask> {
    return await UserInnerTask.addTask(
      this.id,
      TaskType.startTravel,
      getNextRandomDatetime(new Date(), timeNumber.day)
    )
  }
}
