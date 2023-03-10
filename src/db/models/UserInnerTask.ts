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
import CONSTANTS from '../../constants'
import { scaleTime } from '../../utils/time'
import User from './User'

const { timeScale } = CONSTANTS

export enum TaskType {
  test = 0,
  startTravel = 1,
  tryStartTravel = 2,
  endTravel = 3,
  addMovement = 4,
  cooldownTravel = 5,
  recoverTalkPoints = 6,
}

export const TaskTypeDesc = {
  [TaskType.test]: 'Test event',
  [TaskType.startTravel]: 'Determining whether to start a new travel',
  [TaskType.tryStartTravel]: 'Retry `startTravel` event',
  [TaskType.endTravel]: 'Finish a travel',
  [TaskType.addMovement]: 'Add 2 movement',
  [TaskType.cooldownTravel]: 'Finish sleeping',
  [TaskType.recoverTalkPoints]: 'Recover TalkPoints to 5',
}

export enum TaskState {
  wait = 'wait',
  process = 'process',
  done = 'done',
  canceled = 'canceled',
  error = 'error',
}

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
    const realRunAt = scaleTime(runAt, timeScale, from)
    return await UserInnerTask.create({
      userId,
      type,
      runAt: realRunAt,
    })
  }
}
