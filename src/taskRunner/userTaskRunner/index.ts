import { Op } from 'sequelize'
import { UserInnerTask } from '../../db/models'
import { TaskState, TaskType } from '../../db/models/UserInnerTask'
import addMovementProcessor from './addMovementProcessor'
import cooldownTravelProcessor from './cooldownTravelProcessor'
import endTravelProcessor from './endTravelProcessor'
import recoverTalkPointsProcessor from './recoverTalkPointsProcessor'
import startTravelProcessor from './startTravelProcessor'
import testProcessor from './testProcessor'
import tryStartTravelProcessor from './tryStartTravelProcessor'

export default class UserTaskRunner {
  async init(): Promise<void> {
    //
  }

  async start(): Promise<void> {
    const handler = setInterval(() => {
      this.findUndoTask().catch((e) => console.log(e))
    }, 1000)

    process.once('SIGINT', () => clearInterval(handler))
    process.once('SIGTERM', () => clearInterval(handler))
  }

  private async findUndoTask(): Promise<void> {
    const tasks = await UserInnerTask.findAll({
      where: {
        state: TaskState.wait,
        runAt: {
          [Op.lt]: new Date(),
        },
      },
    })
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i]
      this.processUndoTask(task).catch(async (e) => {
        await task.appendError(e.message)
      })
    }
  }

  private async processUndoTask(task: UserInnerTask): Promise<void> {
    // 1. set state to process
    task.setDataValue('state', TaskState.process)
    await task.save()
    // 2. route all task
    const { type } = task
    switch (type) {
      case TaskType.test: {
        await testProcessor(task)
        return
      }
      case TaskType.startTravel: {
        await startTravelProcessor(task)
        return
      }
      case TaskType.tryStartTravel: {
        await tryStartTravelProcessor(task)
        return
      }
      case TaskType.endTravel: {
        await endTravelProcessor(task)
        return
      }
      case TaskType.addMovement: {
        await addMovementProcessor(task)
        return
      }
      case TaskType.cooldownTravel: {
        await cooldownTravelProcessor(task)
        return
      }
      case TaskType.recoverTalkPoints: {
        await recoverTalkPointsProcessor(task)
        return
      }
      default:
        break
    }
    // 3. not found task.type
    throw new Error(
      `cannot found task.type = ${(
        type as unknown as TaskState
      ).toString()} or processor`
    )
  }
}
