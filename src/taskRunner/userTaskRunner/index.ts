import { Op } from 'sequelize'
import { UserInnerTask } from '../../db/models'
import { TaskState, TaskType } from '../../db/models/UserInnerTask'
import testProcessor from './testProcessor'

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
      default:
        break
    }
    // 3. not found task.type
    throw new Error(
      `cannot found task.type = ${(type as TaskState).toString()} or processor`
    )
  }
}
