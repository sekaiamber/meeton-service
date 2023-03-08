import { Telegraf } from 'telegraf'
import { UserInnerTask } from '../../db/models'
import { TaskState, TaskTypeDesc } from '../../db/models/UserInnerTask'
import { drawProgressBar } from '../../utils'
import { MeetonContext } from '../types'
import replyMenu from '../utils/replyMenu'
import Reply from './base'

export class StatusReply extends Reply {
  register(bot: Telegraf): void {
    //
  }

  async reply(ctx: MeetonContext): Promise<void> {
    const { i18n, status, isAdmin, id } = ctx.userModel

    const favorabilityProgress = drawProgressBar(
      status.nextLevelFavorability,
      status.favorability
    )

    const movementProgress = drawProgressBar(
      status.maxMovement,
      status.movement
    )

    let msg = i18n.t('status.template', {
      favorability: status.favorability,
      lv: status.favorabilityLevel,
      favorabilityProcess: favorabilityProgress,
      favorabilityNext: status.nextLevelFavorability,
      movement: status.movement,
      movementMax: status.maxMovement,
      movementProcess: movementProgress,
    })

    if (isAdmin) {
      const adminMsgs = ['---------', '[ADMIN]']
      adminMsgs.push(
        `<b>isSleeping</b>: ${status.isSleeping ? 'true' : 'false'}`
      )
      adminMsgs.push(
        `<b>travelInWaiting</b>: ${status.travelInWaiting ? 'true' : 'false'}`
      )
      adminMsgs.push(
        `<b>lastTravelEndAt</b>: ${
          status.lastTravelEndAt ? status.lastTravelEndAt.toISOString() : 'null'
        }`
      )
      const tasks = await UserInnerTask.findAll({
        where: {
          state: TaskState.wait,
          userId: id,
        },
      })
      adminMsgs.push('<b>future events</b>:')
      tasks.forEach((task) => {
        adminMsgs.push(
          `<b>${task.runAt.toISOString()}</b>: ${TaskTypeDesc[task.type]}`
        )
      })
      msg += adminMsgs.join('\n')
    }
    await replyMenu(ctx, msg, [
      [
        {
          label: i18n.t('menu.back'),
          value: `BackMenu::${ctx.userModel.id},1`,
        },
      ],
    ])
  }
}

const statusReply = new StatusReply()
export default statusReply
