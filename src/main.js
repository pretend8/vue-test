import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css'
import Element from 'element-ui'
import './styles/element-variables.scss'
import enLang from 'element-ui/lib/locale/lang/en' // 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
import '@/assets/iconfont/iconfont.js' // iconfont 字体图标引入
import '@/styles/index.scss'
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import BaseTable from '@/components/BaseTable'
import BaseSearch from '@/components/BaseSearch'

// 全局注册table组件
Vue.component('base-table', BaseTable)
Vue.component('base-search', BaseSearch)

if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale: enLang // 如果使用中文，无需设置，请删除
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
