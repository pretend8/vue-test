import Cookies from 'js-cookie'
import qs from 'qs'
// import { Message } from 'element-ui'
export default {
  data() {
    /* eslint-disable */
    return {
      // 设置属性
      mixinViewModuleOptions: {
        activatedIsNeed: true, // 此页面是否在激活（进入）时，调用查询数据列表接口？
        getDataMethod: null, // 数据请求方法包含了url和请求方式
        getDataListMethod: 'get',
        getDataListURL: '', // 数据列表接口，API地址
        getDataListIsPage: false, // 数据列表接口，是否需要分页？
        deleteURL: '', // 删除接口，API地址
        deleteIsBatch: false, // 删除接口，是否需要批量？
        deleteIsBatchKey: 'id', // 删除接口，批量状态下由那个key进行标记操作？比如：pid，uid...
        exportURL: '' // 导出接口，API地址
      },
      // 默认属性
      dataForm: {}, // 查询条件
      dataList: [], // 数据列表
      order: '', // 排序，asc／desc
      orderField: '', // 排序，字段
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0, // 总条数
      dataListLoading: false, // 数据列表，loading状态
      dataListSelections: [], // 数据列表，多选项
      addOrUpdateVisible: false // 新增／更新，弹窗visible状态
    }
    /* eslint-enable */
  },
  activated() {
    if (this.mixinViewModuleOptions.activatedIsNeed) {
      this.getDataList()
    }
  },
  methods: {
    // 获取数据列表
    /*stamp为有切换tab按钮的list页，点击切换tab时，传递点击按钮时的时间戳进行比较，
        仅展示最后一次请求的值，防止因为请求时间长短引起的列表数据与tab标题不符的问题*/
    async getDataList(stamp) {
      //保存点击时的时间戳stamp
      if (stamp && typeof this.stamp === 'string') {
        this.stamp = String(stamp)
      }
      this.dataListLoading = true
      //把数组 变成字符串
      let obj = {}
      if (this.queryForm) {
        obj = this.queryForm
      } else {
        obj = this.dataForm
      }

      let dataNew = JSON.parse(JSON.stringify(obj))
      for (var key in dataNew) {
        if (Object.prototype.toString.call(dataNew[key]) == '[object Array]') {
          if (dataNew[key].length > 0) {
            dataNew[key] = dataNew[key].toString()
          } else {
            dataNew[key] = ''
          }
        }
      }
      let p = {}
      p = {
        order: this.order,
        orderField: this.orderField,
        page: this.mixinViewModuleOptions.getDataListIsPage ? this.page : null,
        limit: this.mixinViewModuleOptions.getDataListIsPage
          ? this.limit
          : null,
        ...dataNew
      }

      // if (this.mixinViewModuleOptions.getDataListMethod === 'post') {

      // } else {
      //   p = {
      //     params: {
      //       order: this.order,
      //       orderField: this.orderField,
      //       page: this.mixinViewModuleOptions.getDataListIsPage
      //         ? this.page
      //         : null,
      //       limit: this.mixinViewModuleOptions.getDataListIsPage
      //         ? this.limit
      //         : null,
      //       ...dataNew
      //     }
      //   }
      // }
      try {
        const res = await this.mixinViewModuleOptions.getDataMethod(p)
        console.log(res, 'res')
        if (res.code !== 0 && res.code !== 20000) {
          this.dataList = []
          this.total = 0
          console.log('jinlaile1')

          this.dataListLoading = false
          return this.$message.error(res.msg)
        }
        //传递了时间戳的请求，结束请求时如果当前时间戳与页面保存的时间戳不一致，放弃本次请求的所有数据
        if (
          stamp &&
          typeof this.stamp === 'string' &&
          Number(this.stamp) > Number(stamp)
        ) {
          console.log('jinlaile2')
          return
        }
        this.dataList = this.mixinViewModuleOptions.getDataListIsPage
          ? [...res.data.items]
          : [...res.data]
        this.total = this.mixinViewModuleOptions.getDataListIsPage
          ? res.data.total
          : 0
        this.dataListLoading = false
      } catch (e) {
        console.log(e, '请求接口 error')
        this.dataListLoading = false
      }
      // this.$http[this.mixinViewModuleOptions.getDataListMethod](
      //   this.mixinViewModuleOptions.getDataListURL,
      //   p
      // )
      //   .then(({ data: res }) => {

      // })
      // .catch(() => {

      // })
    },
    // 多选
    dataListSelectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 排序
    dataListSortChangeHandle(data) {
      if (!data.order || !data.prop) {
        this.order = ''
        this.orderField = ''
        return false
      }
      this.order = data.order.replace(/ending$/, '')
      this.orderField = data.prop.replace(/([A-Z])/g, '_$1').toLowerCase()
      this.getDataList()
    },
    // 分页, 每页条数
    pageSizeChangeHandle(val) {
      console.log(val, 'val')
      this.page = 1
      this.limit = val
      this.getDataList()
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val) {
      console.log(val, 'val1')
      this.page = val
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.id = id
        this.$refs.addOrUpdate.init()
      })
    },
    // 删除
    deleteBatchHandle(id) {
      if (
        this.mixinViewModuleOptions.deleteIsBatch &&
        !id &&
        this.dataListSelections.length <= 0
      ) {
        return this.$message({
          message: 'Please select delete item',
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm('Confirm to carry out [{handle}] operation?', 'Prompt', {
        confirmButtonText: 'confirm',
        cancelButtonText: 'cancel',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .delete(
              `${this.mixinViewModuleOptions.deleteURL}${
                this.mixinViewModuleOptions.deleteIsBatch ? '' : '/' + id
              }`,
              this.mixinViewModuleOptions.deleteIsBatch
                ? {
                    data: id
                      ? [id]
                      : this.dataListSelections.map(
                          item =>
                            item[this.mixinViewModuleOptions.deleteIsBatchKey]
                        )
                  }
                : {}
            )
            .then(({ data: res }) => {
              if (res.code !== 0 && res.code !== 20000) {
                return this.$message.error(res.msg)
              }
              this.$message({
                message: 'Succeeded',
                type: 'success',
                duration: 500,
                onClose: () => {
                  this.getDataList()
                }
              })
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    // 删除
    deleteHandle(id) {
      if (id === undefined) {
        id = ''
      }
      if (
        this.mixinViewModuleOptions.deleteIsBatch &&
        !id &&
        this.dataListSelections.length <= 0
      ) {
        return this.$message({
          message: 'Please select delete item',
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm('Confirm to carry out delete operation?', 'Prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .delete(
              `${this.mixinViewModuleOptions.deleteURL}${
                this.mixinViewModuleOptions.deleteIsBatch ? '/' + id : '/' + id
              }`,
              this.mixinViewModuleOptions.deleteIsBatch
                ? {
                    data: id
                      ? [id]
                      : this.dataListSelections.map(
                          item =>
                            item[this.mixinViewModuleOptions.deleteIsBatchKey]
                        )
                  }
                : {}
            )
            .then(({ data: res }) => {
              if (res.code !== 0 && res.code !== 20000) {
                return this.$message.error(res.msg)
              }
              this.$message({
                message: 'Succeeded',
                type: 'success',
                duration: 500,
                onClose: () => {
                  this.getDataList()
                }
              })
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    // 导出
    exportHandle() {
      let obj = {}
      if (this.queryForm) {
        obj = this.queryForm
      } else {
        obj = this.dataForm
      }

      let dataNew = JSON.parse(JSON.stringify(obj))
      for (var key in dataNew) {
        if (Object.prototype.toString.call(dataNew[key]) == '[object Array]') {
          if (dataNew[key].length > 0) {
            dataNew[key] = dataNew[key].toString()
          }
        }
      }
      var params = qs.stringify({
        token: Cookies.get('token'),
        ...dataNew
      })
      window.location.href = `${window.SITE_CONFIG['apiURL']}${this.mixinViewModuleOptions.exportURL}?${params}`
    },
    //重置按钮
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    // 多参数输入框拼接，去掉-
    multipleValues(value) {
      value = value.replace(/\s+/g, ',')
      value = value.replace(/,+$/, '')
      let values = value.split(',')
      if (values.length > 200) {
        this.$message.warning(
          'More than 200 receipt numbers cannot be inquired'
        )
        return values.splice(0, 200).toString()
      }
      let r = ''
      for (let i = 0; i < values.length; ++i) {
        let v = values[i].split('-')
        r += v[0]
        if (i + 1 < values.length) {
          r += ','
        }
      }
      return r
    },
    qmnMaxNumber(value) {
      let values = value.split(',')
      if (values.length > 200) {
        this.$message.warning(
          'More than 200 receipt numbers cannot be inquired'
        )
        return values.splice(0, 200).toString()
      }
      return value
    }
  }
}
