import request from '@/utils/request'
import Vue from 'vue'
// 创建缓存
function createCache(url, name, func) {
  console.log(4, url, name, func)
  url,
    name,
    ajax => {
      console.log(5, ajax.responseText)
      func(JSON.parse(ajax.responseText))
    }
  request({
    url: url,
    method: 'get'
  }).then(func)
}

let key = 'Cn'

// 初始化创建缓存
function init() {
  // 判断中英文
  //   if (language === 'zh-CN') {
  //     key = 'Cn'
  //   } else {
  key = 'En'
  //   }
  setTimeout(() => {
    console.log(2)
    createCache('/vue-element-admin/sys/list', 'enums', ajax => {
      console.log(3, ajax.data)
      let data = ajax.data
      let enmu = {}
      if (data instanceof Array) {
        for (var i in data) {
          if (data[i].pid === '0') {
            enmu[data[i].dictType] = []
          }
        }
        for (var j in data) {
          if (data[j].pid !== '0') {
            let eachEnum = {
              name: data[j]['dictName' + key],
              code: data[j].dictValue
            }
            console.log(eachEnum, 'eachEnum')
            console.log(enmu[data[j].dictType], 'dictType')
            if (enmu[data[j].dictType]) {
              enmu[data[j].dictType].push(eachEnum)
            }
          }
        }
      }
      Vue.prototype.enums = enmu
      console.log(Vue.prototype, 'haha')
      console.log(enmu, 'enmu')
    })
  }, 1)
}

init()
