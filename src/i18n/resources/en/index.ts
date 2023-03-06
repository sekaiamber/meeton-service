import { arr2obj, getI18nOptionQuestionData } from '../../utils'
import favorabilityQuestions from './favorabilityQuestions'

const tokenTemplate = `<b>Your TON address is:</b>

<code>{{address}}</code>

`

const statusTemplate = `<b>💓 Favorability: {{favorability}}(lv.{{lv}})</b>
<code>[{{favorabilityProcess}}]</code>
Next Level: {{favorabilityNext}}

<b>♨️ Movement: {{movement}}/{{movementMax}}</b>
<code>[{{movementProcess}}]</code>

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
      success: 'Great! You have finish the test. [TBE]',
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
      admin: 'Admin',
    },
    coming: {
      template: '<b>🚧 Coming Soon 🚧</b>',
    },
    token: {
      template: tokenTemplate,
    },
    status: {
      template: statusTemplate,
    },
  },
}

export default ret
