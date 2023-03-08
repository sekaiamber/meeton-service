import { Status, User, UserInnerTask } from '../../db/models'
import { TaskState } from '../../db/models/UserInnerTask'

export default async function addMovementProcessor(
  task: UserInnerTask
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = (await User.findByPk(task.userId, { include: [Status] }))!
  await user.addMovement(4)
  await user.addAddMovementTask(task.createdAt)
  task.setDataValue('result', task.id.toString())
  task.setDataValue('state', TaskState.done)
  await task.save()
}
