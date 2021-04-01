<template>
  <div class="common-form common-box-shadow">
    <el-form
      :class="{ cusClass: 'fill-row' }"
      @keyup.enter.native="submitForm()"
      :model="dataForm"
      :rules="rules"
      label-position="left"
      ref="ruleForm"
    >
      <el-row>
        <el-col :span="queryWidth || 20">
          <!--index1<6 || shwo 可现实两行-->
          <el-col
            :span="item1.col || 8"
            v-for="(item1, index1) in formColumn"
            :key="index1"
            v-show="columnShow(item1, index1) || queryIsShowing"
          >
            <el-form-item
              size="mini"
              :label="item1.label"
              :key="index1"
              :label-width="item1.width"
              :class="
                item1.col === 16
                  ? sidebarFold
                    ? 'width16-open'
                    : 'width16'
                  : ''
              "
            >
              <!--单行input-->
              <el-input
                size="mini"
                v-if="item1.type === 'input'"
                v-model="dataForm[item1.name]"
                :disabled="item1.disabled || false"
                :placeholder="item1.placeholder || 'Please Enter'"
                :clearable="item1.clearable === false ? false : true"
              ></el-input>
              <!--select-->
              <el-select
                v-if="item1.type === 'select'"
                v-model.trim="dataForm[item1.name]"
                filterable
                :multiple="item1.multiple || false"
                collapse-tags
                size="mini"
                :disabled="item1.disabled || false"
                placeholder="Please Select"
                :clearable="item1.clearable === false ? false : true"
              >
                <el-option
                  v-for="(itme2, index2) in item1.option"
                  :label="itme2.name"
                  :value="itme2.code"
                  :key="index2"
                ></el-option>
              </el-select>
              <!--remote select multiple-->
              <!--<div v-else-if="item1.type==='remoteSelect'">{{ item1.options }}</div>-->
              <el-select
                @change="value => item1.changeHandler(value, item1.name)"
                v-else-if="item1.type === 'remoteSelect'"
                v-model="dataForm[item1.name]"
                :multiple="item1.multiple || false"
                :collapseTags="item1.collapseTags || false"
                filterable
                remote
                :remote-method="query => item1.method(query, item1)"
                :loading="item1.loading || false"
                placeholder="Please Remote Select"
                :disabled="item1.disabled || false"
              >
                <el-option
                  v-for="sub in item1.options"
                  :key="sub.code"
                  :label="sub.name"
                  :value="sub.code"
                ></el-option>
              </el-select>
              <!--doubleInput-->
              <div class="double-input" v-if="item1.type === 'doubleInput'">
                <el-input
                  size="mini"
                  v-model.trim="dataForm[item1.startName]"
                  clearable
                  placeholder="Please Enter"
                ></el-input>
                <!--可配置分隔符-->
                <span class="double-input-delimiter">
                  {{ item1.delimiter || '一' }}
                </span>
                <el-input
                  size="mini"
                  placeholder="Please Enter"
                  v-model.trim="dataForm[item1.endName]"
                  clearable
                ></el-input>
                <!--后面跟的单位-->
                <span v-if="item1.unit">{{ item1.unit }}</span>
              </div>
              <!--autocomplete Input-->
              <el-autocomplete
                v-if="item1.type === 'autocomplete'"
                size="mini"
                placeholder="Please Enter"
                :popper-class="item1.popperClass || ''"
                :select-when-unmatched="true"
                v-model="dataForm[item1.name]"
                @select="item => handleSelect(item, item1.name)"
                :fetch-suggestions="
                  (queryString, cb) => {
                    item1.querySearchAsync(
                      queryString,
                      cb,
                      item1.api,
                      item1.limitValue
                    )
                  }
                "
                @blur="() => item1.blurHandle(dataForm[item1.name], item1.name)"
              ></el-autocomplete>
              <el-date-picker
                v-if="item1.type === 'date'"
                v-model="dataForm[item1.name]"
                :type="item1.dateType || 'date'"
                :placeholder="item1.placeholder || 'Please Select'"
                :format="item1.format || 'yyyy-MM-dd'"
                :value-format="item1.valueFormat || 'yyyy-MM-dd hh:mm:ss'"
                :clearable="item1.clearable === false ? false : true"
              ></el-date-picker>
              <el-date-picker
                size="mini"
                v-if="item1.type === 'time'"
                v-model="timeRange"
                type="daterange"
                range-separator="To"
                start-placeholder="Start Date"
                end-placeholder="End Date"
                format="yyyy - MM - dd"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
              <!--时间区间 精确时分秒-->
              <el-date-picker
                size="mini"
                v-if="item1.type === 'timeRange'"
                v-model="timeRange"
                type="datetimerange"
                range-separator="To"
                start-placeholder="Start Time"
                end-placeholder="End Time"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="item1.defaultTime || ['00:00:00', '23:59:59']"
              ></el-date-picker>
              <i
                v-if="item1.name == 'recordNo'"
                class="el-icon-edit-outline"
                style="position:absolute;top:7px"
                @click="open(dataForm[item1.name])"
              ></i>
              <i
                v-if="item1.name == 'qmnum'"
                class="el-icon-edit-outline"
                style="position:absolute;top:7px"
                @click="openQmnum(dataForm[item1.name])"
              ></i>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col v-if="queryWidth" :span="24 - queryWidth">
          <slot name="btn"></slot>
        </el-col>
        <el-col v-else class="filter-btn" :span="4" style="text-align: right;">
          <el-button size="mini" type="primary" @click="submitForm()">
            <svg-icon icon-class="search" />
            Search
          </el-button>
          <el-button size="mini" type="info" @click="resetForm()">
            <i class="el-icon-refresh-left" />
            Reset
          </el-button>
        </el-col>
      </el-row>
      <el-row v-if="isCollapse" style="padding-right:0">
        <el-col align="center" class="queryBoxLine">
          <div @click="queryToggle" ref="queryBox">
            <span
              :class="
                queryIsShowing ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
              "
            ></span>
            Advanced Search
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'baseSearch',
  data() {
    return {
      timeRange: [],
      isCollapse: false,
      queryIsShowing: false
    }
  },
  props: {
    queryWidth: {
      type: Number
    },
    cusClass: {
      type: Boolean,
      default: false
    },
    btnList: {
      type: Array,
      default: () => {
        return []
      }
    },
    dataForm: {
      type: Object,
      default: function() {
        return {}
      }
    },
    formColumn: {
      type: Array,
      default: function() {
        return []
      }
    },
    rules: {
      type: Object,
      default: function() {
        return {}
      }
    },
    shwo: {
      type: Boolean,
      default: false
    },
    timeControl: {
      // 控制时间监听清空
      type: Boolean,
      default: true
    }
  },
  watch: {
    'dsataForm.tableType': {
      handler(nv, ov) {
        // tab切换清空时间选择
        this.timeRange = []
      },
      immediate: true
    },
    timeRange: {
      handler(nv, ov) {
        if (nv && nv.length) {
          this.dataForm.startDate = nv[0]
          this.dataForm.endDate = nv[1]
        } else {
          this.dataForm.startDate = ''
          this.dataForm.endDate = ''
        }
      },
      deep: true
    },
    dataForm: {
      handler(nv, ov) {
        if (this.timeControl) {
          if (nv.startDate && nv.endDate) {
            this.timeRange = [nv.startDate, nv.endDate]
          } else {
            this.timeRange = []
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapState(['sidebarFold'])
  },
  methods: {
    queryToggle(e) {
      this.queryIsShowing = !this.queryIsShowing
    },
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.$emit('getDataList')
        } else {
          return false
        }
      })
    },
    resetForm() {
      for (var key in this.dataForm) {
        if (key !== 'tableType') {
          this.dataForm[key] = ''
        }
      }
      // 清空时间选择的值
      this.timeRange = []
      this.$emit('reform')
    },
    columnShow(item, index) {
      var cols = 0
      for (let i = 0; i <= index; i++) {
        cols +=
          this.formColumn && this.formColumn[i].col
            ? this.formColumn[i].col
            : 16
        if (cols > 48) {
          return false
        }
      }
      return true
    },
    querySearchAsync(queryString, cb, api, limitValue = 15, name) {
      let restaurants = []
      let params = {
        page: 1,
        limit: limitValue,
        input: queryString ? queryString : ''
      }
      this.$http
        .post(api, params)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          if (res.data.records && res.data.records.length) {
            restaurants = res.data.records.map(item => {
              return { value: `${item.supplier}`, item }
            })
            cb(restaurants)
          } else {
            cb(restaurants)
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    handleSelect(item, name) {},
    blurHandle(value, type) {
      if (type === 'qmnum' || type === 'notification' || type === 'groupNo') {
        // if (value.indexOf(',') === -1) {
        //   let s = value.split('-')
        //   this.dataForm[type] = s[0]
        // }
        this.dataForm[type] = this.multipleValues(value)
      }
    },
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
    }
  },
  mounted() {
    var cols = 0
    if (this.formColumn && this.formColumn.length) {
      for (let i = 0; i < this.formColumn.length; i++) {
        cols += this.formColumn[i] && this.formColumn[i].col
        if (cols > 48) {
          this.isCollapse = true
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
.common-form {
  padding: 10px;
  margin-bottom: 10px;
}
</style>
