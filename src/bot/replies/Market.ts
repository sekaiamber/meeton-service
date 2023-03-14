import { Telegraf, Context, Markup } from 'telegraf'
import { MarketItem, UserMarketItem } from '../../db/models'
import { tokenHumanAmount } from '../../utils'
import { MeetonContext } from '../types'
import replyMenu, { Menu } from '../utils/replyMenu'
import Reply from './base'

const COUNT_PER_PAGE = 9
const { MARKET_ITEM_BASE_URL } = process.env

interface WizzardOption {
  url: string
  caption?: string
  totalPage: number
  currentPage: number
}

const emptyButton = Markup.button.callback(' ', 'd')
function getItemMenu(items: MarketItem[], currentPageIndex: number): Menu {
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
      label: `${i + 1}. ${tokenHumanAmount(item.cost)} ${item.costAsset}`,
      value: `MarketItemDetail::${item.key},${currentPageIndex}`,
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
        : Markup.button.callback('⬅️', `MarketItem::${currentPage - 1}`),
      currentPage === totalPage - 1
        ? emptyButton
        : Markup.button.callback('➡️', `MarketItem::${currentPage + 1}`),
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

// MarketItem::1
const marketItemReg = /MarketItem::[0-9]+/
interface MarketItemData {
  index: number
}
function parseMarketItemData(callbackData: string): MarketItemData {
  const [, index] = callbackData.split('::')
  return {
    index: parseInt(index),
  }
}

// MarketItemDetail::{key},{backIndex}
const marketItemDetailReg = /MarketItemDetail::[a-zA-Z0-9]+,[0-9]+/
interface MarketItemDetailData {
  key: string
  backIndex: number
}
function parseMarketItemDetailData(callbackData: string): MarketItemDetailData {
  const [, data] = callbackData.split('::')
  const [key, backIndex] = data.split(',')
  return {
    key,
    backIndex: parseInt(backIndex),
  }
}

// BuyMarketItem::{key}
const buyMarketItemReg = /BuyMarketItem::[a-zA-Z0-9]+/
interface BuyMarketItemData {
  key: string
}
function parseBuyMarketItemData(callbackData: string): BuyMarketItemData {
  const [, key] = callbackData.split('::')
  return {
    key,
  }
}

// MyMarketItems::

export class MarketReply extends Reply {
  register(bot: Telegraf): void {
    bot.action(marketItemReg, async (ctx) => {
      const data = parseMarketItemData(ctx.match[0])
      const mctx = ctx as unknown as MeetonContext
      await ctx.deleteMessage()
      await this.replyItemsByPageIndex(mctx, data.index)
    })
    bot.action(marketItemDetailReg, async (ctx) => {
      const data = parseMarketItemDetailData(ctx.match[0])
      const mctx = ctx as unknown as MeetonContext
      await this.replyItemDetailByKey(mctx, data)
    })
    bot.action(buyMarketItemReg, async (ctx) => {
      const data = parseBuyMarketItemData(ctx.match[0])
      const mctx = ctx as unknown as MeetonContext

      await this.replyBuyItem(mctx, data)
    })
    bot.action('MyMarketItems::', async (ctx) => {
      const mctx = ctx as unknown as MeetonContext
      await ctx.deleteMessage()
      await this.replyMyMarketItems(mctx)
    })
  }

  async replyMyMarketItems(ctx: MeetonContext): Promise<void> {
    const { i18n, id } = ctx.userModel
    const items = await UserMarketItem.findAll({
      where: {
        userId: id,
        used: false,
      },
      order: [['createdAt', 'desc']],
      include: [MarketItem],
    })
    if (items.length === 0) {
      await replyMenu(ctx, i18n.t('market.myEmpty'), [
        [
          {
            label: i18n.t('menu.back'),
            value: 'MarketItem::0',
          },
        ],
      ])
    } else {
      await replyMenu(ctx, i18n.t('market.use'), [
        ...items.map((item) => [
          {
            label: `${item.marketItem.key}: some effect`,
            value: `UseMarketItem::${(item.id as number).toString()}`,
          },
        ]),
        [
          {
            label: i18n.t('market.backToMarket'),
            value: 'MarketItem::0',
          },
        ],
      ])
    }
  }

  async replyBuyItem(
    ctx: MeetonContext,
    data: BuyMarketItemData
  ): Promise<void> {
    const { i18n } = ctx.userModel
    const buyment = await MarketItem.buy(ctx.userModel, data.key)
    if (buyment) {
      await ctx.deleteMessage()
      await ctx.answerCbQuery('Success')
      await this.replyMyMarketItems(ctx)
    }
  }

  async replyItemDetailByKey(
    ctx: MeetonContext,
    data: MarketItemDetailData
  ): Promise<void> {
    const { i18n } = ctx.userModel
    const item = await MarketItem.findOne({
      where: {
        key: data.key,
      },
    })
    if (!item) return
    await ctx.deleteMessage()
    const menu: Menu = [
      [
        {
          label: i18n.t('market.buy', {
            cost: tokenHumanAmount(item.cost),
            asset: item.costAsset,
          }),
          value: `BuyMarketItem::${item.key}`,
        },
      ],
      [
        {
          label: i18n.t('menu.back'),
          value: `MarketItem::${data.backIndex}`,
        },
      ],
    ]
    await ctx.replyWithPhoto(
      {
        url: item.iconUrl,
      },
      {
        caption: `${item.key}: [some effect]`,
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
    const total = await MarketItem.count()
    const totalPages = Math.ceil(total / COUNT_PER_PAGE)
    const items = await MarketItem.findAll({
      order: [['order', 'desc']],
      limit: COUNT_PER_PAGE,
      offset: index * COUNT_PER_PAGE,
    })

    await replyWizzardMenu(
      ctx,
      {
        url: `${MARKET_ITEM_BASE_URL!}/${index}.png`,
        caption: `${index + 1}/${totalPages}`,
        totalPage: totalPages,
        currentPage: index,
      },
      [
        ...getItemMenu(items, index),
        [
          {
            label: i18n.t('market.my'),
            value: 'MyMarketItems::',
          },
        ],
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

const marketReply = new MarketReply()
export default marketReply
