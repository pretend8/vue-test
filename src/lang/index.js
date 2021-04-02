// index.js
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie' // 将语言类别存入cookie用
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui 国际化文件
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN' // element-ui 国际化文件
import enLocale from './en'
import zhLocale from './zh'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  }
}

const i18n = new VueI18n({
  // 设置语言 选项 en | zh
  locale: Cookies.get('language') || 'en',
  // 设置文本内容
  messages
})

export default i18n
