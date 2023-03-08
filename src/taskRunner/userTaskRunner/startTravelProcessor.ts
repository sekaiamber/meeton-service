import { Status, Travel, User, UserInnerTask } from '../../db/models'
import { TaskState } from '../../db/models/UserInnerTask'
import { randomGt } from '../../utils'

export default async function startTravelProcessor(
  task: UserInnerTask
): Promise<void> {
  const canStart = randomGt(-1)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = (await User.findByPk(task.userId, { include: [Status] }))!
  if (canStart) {
    const travel = await Travel.createByUserIdNow(task.userId)
    if (travel) {
      await user.cancelAllAddMovementTask()
      await user.addEndTravelTask(travel)
    }
  } else {
    await user.addTryStartTravelTask(task)
  }
  task.setDataValue('result', task.id.toString())
  task.setDataValue('state', TaskState.done)
  await task.save()
}
