import { Status, User, UserInnerTask, Location } from '../../db/models'
import { TaskState } from '../../db/models/UserInnerTask'

export default async function endTravelProcessor(
  task: UserInnerTask
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = (await User.findByPk(task.userId, {
    include: [Status, Location],
  }))!
  await user.location.reachHome()
  await user.addAddMovementTask()
  await user.addCooldownTravelTask()
  task.setDataValue('result', task.id.toString())
  task.setDataValue('state', TaskState.done)
  await task.save()
}
