import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css'
import Element from 'element-ui'
import i18n from './lang' // 前端国际化
import './styles/element-variables.scss'
import enLang from 'element-ui/lib/locale/lang/en' // 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
import '@/assets/iconfont/iconfont.js' // iconfont 字体图标引入
import '@/styles/index.scss'
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
// import './enum' // sys enum
import BaseTable from '@/components/BaseTable'
import BaseSearch from '@/components/BaseSearch'

// 全局注册table组件
Vue.component('base-table', BaseTable)
Vue.component('base-search', BaseSearch)

console.log(process.env, 'nihaoma ')
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value), // use添加i18n
  locale: enLang // 如果使用中文，无需设置，请删除
})

let _message = Vue.prototype.$message
// let _errorVisible = false
// type: success/warning/info/error
let proxyMessage = function(opt, type) {
  if (typeof opt === 'string') {
    let tmp = opt
    opt = {
      message: tmp,
      duration: 8000 // 根据需求全局传string过来时增加显示时长
    }
    if (typeof type !== 'undefined') {
      opt.type = type
    } else {
      opt.type = 'info'
    }
  }
  let userOnClose = opt.onClose

  opt.onClose = function(obj) {
    // _errorVisible = false
    _message.close(obj.id, userOnClose)
  }
  opt.showClose = true
  // if (_errorVisible === false) {
  //     _errorVisible = true
  //     _message(opt)
  // }
  _message(opt)
}
proxyMessage.message = _message
proxyMessage.success = function(opt) {
  proxyMessage(opt, 'success')
}

proxyMessage.warning = function(opt) {
  proxyMessage(opt, 'warning')
}

proxyMessage.info = function(opt) {
  proxyMessage(opt, 'info')
}

proxyMessage.error = function(opt) {
  proxyMessage(opt, 'error')
}

Vue.prototype.$message = proxyMessage
Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
