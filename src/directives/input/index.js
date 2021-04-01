import anyNumber from './number'

const install = function(Vue) {
  Vue.directive('any-number', anyNumber)
}

if (window.Vue) {
  window['anyNumber'] = anyNumber
  //   window.clipboard = Clipboard
  Vue.use(install) // eslint-disable-line
}

anyNumber.install = install
export default anyNumber
