/* eslint-disable @typescript-eslint/no-floating-promises */
import i18next from 'i18next'
import en from './resources/en'
import zhCn from './resources/zh-cn'

i18next.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en,
    'zh-cn': zhCn,
  },
})

const enI18n = i18next.cloneInstance()

const zhCnI18n = i18next.cloneInstance()
zhCnI18n.changeLanguage('zh-cn')

const i18n = {
  en: enI18n,
  'zh-cn': zhCnI18n,
}

export default i18n
