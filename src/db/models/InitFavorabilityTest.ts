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
import Status from './Status'
import User from './User'

export const CHAR_UNDO = '_'
export const CHAR_WIN = '+'
export const CHAR_LOSE = '-'

export interface InitFavorabilityTestResult {
  change: number
}

@Table({
  modelName: 'initFavorabilityTest',
})
export default class InitFavorabilityTest extends Model {
  @AllowNull(false)
  @Default(10)
  @Column(DataType.INTEGER)
  get questionCount(): number {
    return this.getDataValue('questionCount')
  }

  @AllowNull(false)
  @Default('')
  @Column(DataType.CHAR(64))
  get result(): string {
    return this.getDataValue('result')
  }

  get resultArray(): InitFavorabilityTestResult[] {
    const rs = this.result.split('')
    const ret = rs.map((r) => {
      if (r === CHAR_WIN) return 1
      if (r === CHAR_LOSE) return -1
      return 0
    })
    return ret.map((change) => ({ change }))
  }

  get score(): number {
    const ra = this.resultArray
    return ra.map((r) => r.change).reduce((a, b) => a + b, 0)
  }

  get finished(): boolean {
    return !this.result.endsWith(CHAR_UNDO)
  }

  get getFirstUndoQuestionIndex(): number {
    const ra = this.resultArray
    return ra.findIndex((r) => r.change === 0)
  }

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  get userId(): number {
    return this.getDataValue('userId')
  }

  @BelongsTo(() => User)
  user?: User

  @BeforeUpdate
  @BeforeCreate
  static standardResult(instance: InitFavorabilityTest): void {
    const { questionCount, result } = instance
    const sdResult = (result + CHAR_UNDO.repeat(questionCount)).slice(
      0,
      questionCount
    )
    instance.setDataValue('result', sdResult)
  }

  async setAnswer(index: number, answer: '+' | '-'): Promise<void> {
    const { result } = this
    const ra = result.split('')
    ra.splice(index, 1, answer)
    this.setDataValue('result', ra.join(''))
    await this.save()
  }

  async onFinish(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const user = (await User.findByPk(this.userId, { include: [Status] }))!
    user.status.setDataValue('initFavorability', this.score)
    await user.status.save()
    // addMovement
    await user.addAddMovementTask()
    // startTravel
    if (this.score >= 6) {
      await user.addStartTravelTask()
    }
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
