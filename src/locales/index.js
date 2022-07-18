import { createI18n } from 'vue-i18n'
import en from './en-US'
import zh from './zh-CN'
// export default {
//   en,
//   zh,
// }

const messages = {
  en:{
    ...en,
  },
  'zh-cn':{
    ...zh,
  }
}
// 创建 i18n
const i18n = createI18n({
  legacy: false,
  globalInjection:true,  // 全局模式，可以直接使用 $t
  locale: 'zh-cn',
  messages: messages
})

export default i18n