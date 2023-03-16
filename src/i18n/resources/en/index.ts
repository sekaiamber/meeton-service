import { arr2obj, getI18nOptionQuestionData } from '../../utils'
import favorabilityQuestions from './favorabilityQuestions'
import treasures from './treasures'

const tokenTemplate = `<b>Your TON address is:</b>

<code>{{address}}</code>

<b>Your MEE balance:</b> {{meeBalance}}

`

const statusTemplate = `<b>💓 Favorability: {{favorability}}(lv.{{lv}})</b>
<code>[{{favorabilityProcess}}]</code>
Next Level: {{favorabilityNext}}

<b>♨️ Movement: {{movement}}/{{movementMax}}</b>
<code>[{{movementProcess}}]</code>

`

const adminTemplate = `<b>user id</b>: {{userId}}
<b>time scale</b>: {{timeScale}}({{speedUp}} times speed up)
`

const atlasTemplate = `<b>{{name}}</b>
{{description}}

<pre>Level    {{level}}</pre>
<pre>Rarity   {{rarity}}</pre>
<pre>You own  {{have}}</pre>
`

const ret = {
  translation: {
    setLanguage: {
      ...getI18nOptionQuestionData({
        question: 'Please set your favorite language',
        options: [
          {
            label: 'English',
            value: 'en',
          },
          {
            label: '简体中文',
            value: 'zh-cn',
          },
        ],
      }),
      success:
        'Congratulations! You got a MeeTon, which will be your faithful companion in space.',
    },
    initFavorabilityTest: {
      questions: arr2obj(
        favorabilityQuestions
          .slice(0, 10)
          .map((q) => getI18nOptionQuestionData(q))
      ),
      success: 'Great!',
    },
    menu: {
      title: '🛸',
      back: 'Back to menu',
      chat: 'MeeTon Chat',
      status: 'MeeTon Status',
      atlas: 'Universe Atlas',
      token: 'NFT & Token',
      document: 'Document',
      market: 'Market',
      admin: '[ADMIN] System',
      test: '[ADMIN] Test Callback',
    },
    coming: {
      template: '<b>🚧 Coming Soon 🚧</b>',
    },
    token: {
      template: tokenTemplate,
    },
    status: {
      template: statusTemplate,
      notAtHome: '<i>[MeeTon is not at home...]</i>\n',
      sleeping: '<i>[Zzzzz...]</i>\n',
      noTalkPoints: "<i>[MeeTon doesn't seem to want to talk to you]</i>\n",
    },
    admin: {
      template: adminTemplate,
    },
    chat: {
      questions: arr2obj(
        favorabilityQuestions.map((q) => getI18nOptionQuestionData(q))
      ),
    },
    market: {
      buy: 'Purchase (-{{cost}} {{asset}})',
      my: 'My Items',
      myEmpty: '<i>[You have no items]</i>\n',
      use: '<i>[Click items for using]</i>\n',
      backToMarket: 'Back to market',
    },
    treasures: treasures as any,
    atlas: {
      template: atlasTemplate,
    },
  },
}

export default ret
