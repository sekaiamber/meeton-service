import { Telegraf } from 'telegraf'
import { drawProgressBar } from '../../utils'
import { MeetonContext } from '../types'
import replyMenu from '../utils/replyMenu'
import Reply from './base'

export class StatusReply extends Reply {
  register(bot: Telegraf): void {
    //
  }

  async reply(ctx: MeetonContext): Promise<void> {
    const { i18n, status } = ctx.userModel

    const favorabilityProgress = drawProgressBar(
      status.nextLevelFavorability,
      status.favorability
    )

    const movementProgress = drawProgressBar(
      status.maxMovement,
      status.movement
    )

    const msg = i18n.t('status.template', {
      favorability: status.favorability,
      lv: status.favorabilityLevel,
      favorabilityProcess: favorabilityProgress,
      favorabilityNext: status.nextLevelFavorability,
      movement: status.movement,
      movementMax: status.maxMovement,
      movementProcess: movementProgress,
    })
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
