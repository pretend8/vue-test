const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: '@increment',
      dictType: '@first',
      dictValue: '@first',
      dictNameCn: '@first',
      dictNameEn: '@first',
      pid: '@integer(1000000000)',
      'level|1-2': 1
    })
  )
}

module.exports = [
  {
    url: '/vue-element-admin/sys/list',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: List
      }
    }
  }
]
