<template>
  <div class="app-container">
    <base-table
      border
      :options="options"
      :value="formVal"
      :rules="rules"
      :columns="columns"
      :dataSource="list"
      :exportBut="exportBut(this)"
      :operates="operates(this)"
      :pagination="listQuery"
    >
      <template #content_context>
        <base-search
          @getDataList="handleSearch"
          @reform="handleReset"
          :dataForm="dataForm"
          :formColumn="formColumn"
        ></base-search>
      </template>
    </base-table>
  </div>
</template>

<script>
// 表格头设置
const columns = [
  {
    label: '姓名',
    prop: 'name',
    props: {
      sortable: 'sortable'
    }
  },
  {
    label: '性别',
    prop: 'sex',
    formatter: (row, column, index) => {
      return row.sex === 0 ? '男' : '女'
    }
  },
  {
    label: '住址',
    prop: 'address',
    newjump: (row, columns, index) => {
      return `www.baidu.com/studentInfo/index/${row.accountId}`
    }
  },
  {
    label: '手机号',
    render: (h, parmas) => {
      return [
        h('i', {
          class: 'el-icon-phone-outline',
          style: 'fontSize: 16px; color: red'
        }),
        h('span', parmas.row.mobileNum)
      ]
    }
  }
]

// 表格操作按钮
const operates = that => [
  {
    label: '编辑',
    isShow: row => {
      return row.status !== 2
    },
    disabled: row => {
      return row.disabled === 2
    },
    method: row => {
      that.handleNewJump(row)
    }
  },
  {
    label: '查看',
    isShow: row => {
      return row.status !== 2
    },
    disabled: row => {
      return true
    },
    method: row => {
      that.handleNewJump(row)
    }
  },
  {
    label: '删除',
    isShow: row => {
      return row.status !== 2
    },
    disabled: row => {
      return row.disabled === 2
    },
    method: row => {
      that.handleNewJump(row)
    }
  }
]

// 服务器请求返回值
const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    sex: 0,
    address: '西湖区湖底公园1号'
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    sex: 1,
    disabled: 2,
    address: '西湖区湖底公园1号'
  }
]

// 表格扩展按钮
const exportBut = that => [
  {
    title: '新增',
    method: () => that.handleCreate()
  },
  {
    title: '批量导入',
    method: () => that.handleBatchCourse()
  }
]
import { fetchList } from '@/api/article'
import mixinViewModule from '@/mixins/view-module'

export default {
  name: 'InlineEditTable',
  mixins: [mixinViewModule],
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      // mixinViewModuleOptions: {
      //   getDataListURL: 'qmnreport/reportblockbbt5/page',
      //   getDataListIsPage: true,
      //   deleteURL: 'qmnreport/reportblockbbt5',
      //   deleteIsBatch: true,
      //   exportURL: ''
      // },
      columns,
      operates,
      dataSource,
      exportBut,
      dataForm: {
        plant: '',
        status: '',
        runTime: '',
        problemType: '',
        model: '',
        owner: '',
        currentWeek: '',
        startDate: '',
        endDate: ''
      },
      formVal: {
        name: 18335
      },
      options: {
        index: true,
        labelIndex: '序号'
      },
      rules: {
        name: [{ required: true, message: '请填写学生ID', trigger: 'blur' }]
      },
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        test: [1, 2, 34]
      },
      dataTotal: null
    }
  },
  computed: {
    tableColumn() {
      return [
        {
          prop: 'id',
          label: 'ID',
          width: 80,
          align: 'center'
        },
        {
          prop: 'timestamp',
          label: 'Date',
          width: 180,
          align: 'center'
        },
        {
          prop: 'author',
          label: 'Author',
          width: 120,
          align: 'center'
        },
        {
          prop: 'importance',
          label: 'Importance',
          width: 100,
          align: 'center'
        },
        {
          prop: 'status',
          label: 'Status',
          width: 110,
          align: 'center'
        },
        {
          prop: 'title',
          label: 'Title',
          minWidth: 300,
          align: 'center'
        },
        {
          type: 'right',
          prop: 'option',
          option: [
            {
              name: 'Edit'
            },
            {
              name: 'Preview'
            }
          ],
          label: 'Action',
          width: 150,
          align: 'center'
        }
      ]
    },
    formColumn() {
      return [
        {
          name: 'select',
          label: 'Select',
          width: '90px',
          type: 'select',
          col: 6,
          option: [
            { name: 'Yes', code: 'Yes' },
            { name: 'No', code: 'No' }
          ]
        },
        {
          name: 'input',
          label: 'Input',
          type: 'input',
          width: '90px',
          col: 6
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 新增
    handleCreate() {},
    // search handle
    handleSearch() {
      this.listQuery.page = 1
      this.getList()
    },
    // reset handle
    handleReset() {
      this.listQuery.page = 1
      this.listQuery.limit = 1
      this.getList()
    },
    handleBatchCourse() {
      console.log('点击批量导入按钮')
    },
    async getList() {
      this.listLoading = true
      const res = await fetchList(this.listQuery)
      const { data } = await fetchList(this.listQuery)
      const items = data.items
      this.list = items.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalTitle = v.title //  will be used when user click the cancel botton
        return v
      })
      this.listLoading = false
    },
    cancelEdit(row) {
      row.title = row.originalTitle
      row.edit = false
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalTitle = row.title
      this.$message({
        message: 'The title has been edited',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
