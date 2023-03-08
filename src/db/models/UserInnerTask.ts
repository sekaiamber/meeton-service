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
import { timeScale } from '../../utils/time'
import User from './User'

export enum TaskType {
  test = 0,
  startTravel = 1,
  tryStartTravel = 2,
  endTravel = 3,
  addMovement = 4,
  cooldownTravel = 5,
}

export enum TaskState {
  wait = 'wait',
  process = 'process',
  done = 'done',
  canceled = 'canceled',
  error = 'error',
}

const TIMESCALE = process.env.DEV_TIMESCALE
  ? parseFloat(process.env.DEV_TIMESCALE)
  : 1

@Table({
  modelName: 'userInnerTask',
  indexes: [
    {
      fields: ['type'],
    },
    {
      fields: ['state'],
    },
    {
      fields: ['userId'],
    },
  ],
})
export default class UserInnerTask extends Model {
  @AllowNull(false)
  @Column(DataType.INTEGER)
  get type(): TaskType {
    return this.getDataValue('type')
  }

  @AllowNull(false)
  @Column(DataType.DATE)
  get runAt(): Date {
    return this.getDataValue('runAt')
  }

  @AllowNull(false)
  @Default('wait')
  @Column(DataType.ENUM('wait', 'process', 'done', 'canceled', 'error'))
  get state(): TaskState {
    return this.getDataValue('state')
  }

  @AllowNull(true)
  @Column(DataType.TEXT)
  get result(): string | null {
    return this.getDataValue('result')
  }

  @AllowNull(true)
  @Column(DataType.TEXT)
  get errorMessage(): string | null {
    return this.getDataValue('errorMessage')
  }

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  get userId(): number {
    return this.getDataValue('userId')
  }

  @BelongsTo(() => User)
  user?: User

  async appendError(message: string): Promise<void> {
    const { errorMessage } = this
    let msg = message
    if (errorMessage && errorMessage.length > 0) {
      msg = errorMessage + '\n' + '-----' + '\n' + message
    }
    this.setDataValue('errorMessage', msg)
    await this.save()
  }

  static async addTask(
    userId: number,
    type: TaskType,
    runAt: Date,
    from?: Date
  ): Promise<UserInnerTask> {
    const realRunAt = timeScale(runAt, TIMESCALE, from)
    return await UserInnerTask.create({
      userId,
      type,
      runAt: realRunAt,
    })
  }
}
