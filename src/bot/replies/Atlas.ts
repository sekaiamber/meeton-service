import { Telegraf, Context, Markup } from 'telegraf'
import { Travel, TravelTreasure } from '../../db/models'
import { tokenHumanAmount } from '../../utils'
import { MeetonContext } from '../types'
import replyMenu, { Menu } from '../utils/replyMenu'
import Reply from './base'
import { i18n } from 'i18next'
import { Op } from 'sequelize'

const COUNT_PER_PAGE = 9
const { TRAVEL_TREASURES_BASE_URL } = process.env

interface WizzardOption {
  url: string
  caption?: string
  totalPage: number
  currentPage: number
}

const emojis = {
  empty: '\u26AA', // ⚪
  star: '\u2B50', // ⭐
  diamond: '\u{1F4A0}', // 💠
}

const empty = emojis.empty.repeat(5)
function getRankString(rank: number, iconRank: string): string {
  return [...(iconRank.repeat(rank) + empty)].slice(0, 5).join('')
}

const emptyButton = Markup.button.callback(' ', 'd')
function getItemMenu(
  items: TravelTreasure[],
  currentPageIndex: number,
  i18n: i18n
): Menu {
  const e = {
    label: ' ',
    value: 'd',
  }
  const menu: Menu = [
    [e, e, e],
    [e, e, e],
    [e, e, e],
  ]
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    menu[Math.floor(i / 3)][i % 3] = {
      label: i18n.t(`treasures.${item.key}.name`),
      value: `AtlasItemDetail::${item.key},${currentPageIndex}`,
    }
  }
  return menu
}

async function replyWizzardMenu(
  ctx: Context,
  option: WizzardOption,
  data: Menu
): Promise<void> {
  const { currentPage, totalPage } = option

  const wizzard = [
    [
      currentPage === 0
        ? emptyButton
        : Markup.button.callback('⬅️', `AtlasItem::${currentPage - 1}`),
      currentPage === totalPage - 1
        ? emptyButton
        : Markup.button.callback('➡️', `AtlasItem::${currentPage + 1}`),
    ],
  ]
  const v = totalPage === 1 ? [] : wizzard

  await ctx.replyWithPhoto(
    {
      url: option.url,
    },
    {
      caption: option.caption,
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        ...v,
        ...data.map((row) =>
          row.map((item) => Markup.button.callback(item.label, item.value))
        ),
      ]),
    }
  )
}

// AtlasItem::1
const atlasItemReg = /AtlasItem::[0-9]+/
interface AtlasItemData {
  index: number
}
function parseAtlasItemData(callbackData: string): AtlasItemData {
  const [, index] = callbackData.split('::')
  return {
    index: parseInt(index),
  }
}

// AtlasItemDetail::{key},{backIndex}
const atlasItemDetailReg = /AtlasItemDetail::[a-zA-Z0-9]+,[0-9]+/
interface AtlasItemDetailData {
  key: string
  backIndex: number
}
function parseAtlasItemDetailData(callbackData: string): AtlasItemDetailData {
  const [, data] = callbackData.split('::')
  const [key, backIndex] = data.split(',')
  return {
    key,
    backIndex: parseInt(backIndex),
  }
}

export class AtlasReply extends Reply {
  register(bot: Telegraf): void {
    bot.action(atlasItemReg, async (ctx) => {
      const data = parseAtlasItemData(ctx.match[0])
      const mctx = ctx as unknown as MeetonContext
      await ctx.deleteMessage()
      await this.replyItemsByPageIndex(mctx, data.index)
    })
    bot.action(atlasItemDetailReg, async (ctx) => {
      const data = parseAtlasItemDetailData(ctx.match[0])
      const mctx = ctx as unknown as MeetonContext
      await this.replyItemDetailByKey(mctx, data)
    })
  }

  async replyItemDetailByKey(
    ctx: MeetonContext,
    data: AtlasItemDetailData
  ): Promise<void> {
    const { i18n, id: userId } = ctx.userModel
    const item = await TravelTreasure.findOne({
      where: {
        key: data.key,
      },
    })
    if (!item) return
    await ctx.deleteMessage()
    const menu: Menu = [
      [
        {
          label: i18n.t('menu.back'),
          value: `AtlasItem::${data.backIndex}`,
        },
      ],
    ]
    const youhave = await Travel.count({
      where: {
        userId,
        treasureId: item.id,
        endAt: {
          [Op.lt]: new Date(),
        },
      },
    })
    const caption = i18n.t('atlas.template', {
      name: i18n.t(`treasures.${item.key}.name`),
      description: i18n.t(`treasures.${item.key}.description`),
      level: getRankString(item.level + 1, emojis.star),
      rarity: getRankString(item.rarity + 1, emojis.diamond),
      have: youhave,
    })
    console.log(caption)
    await ctx.replyWithPhoto(
      {
        url: item.iconUrl,
      },
      {
        caption,
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          ...menu.map((row) =>
            row.map((item) => Markup.button.callback(item.label, item.value))
          ),
        ]),
      }
    )
  }

  async replyItemsByPageIndex(ctx: MeetonContext, index = 0): Promise<void> {
    const { i18n } = ctx.userModel
    const total = await TravelTreasure.count()
    const totalPages = Math.ceil(total / COUNT_PER_PAGE)
    const items = await TravelTreasure.findAll({
      order: [['order', 'desc']],
      limit: COUNT_PER_PAGE,
      offset: index * COUNT_PER_PAGE,
    })

    await replyWizzardMenu(
      ctx,
      {
        url: `${TRAVEL_TREASURES_BASE_URL!}/${index}.png`,
        caption: `${index + 1}/${totalPages}`,
        totalPage: totalPages,
        currentPage: index,
      },
      [
        ...getItemMenu(items, index, i18n),
        [
          {
            label: i18n.t('menu.back'),
            value: `BackMenu::${ctx.userModel.id},1`,
          },
        ],
      ]
    )
  }

  async reply(ctx: MeetonContext): Promise<void> {
    await this.replyItemsByPageIndex(ctx)
  }
}

const atlasReply = new AtlasReply()
export default atlasReply
