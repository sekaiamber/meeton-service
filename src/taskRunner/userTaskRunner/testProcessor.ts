import { UserInnerTask } from '../../db/models'
import { TaskState } from '../../db/models/UserInnerTask'
import { debug } from '../../utils'

export default async function testProcessor(
  task: UserInnerTask
): Promise<void> {
  debug(`task test: ${task.id as number}`)
  task.setDataValue('result', task.id.toString())
  task.setDataValue('state', TaskState.done)
  await task.save()
}
