<template>
  <div>
    <el-input type="number" v-model="value1"></el-input>
    <input type="text" v-model="value2" />
    <div>------------</div>
    <input type="text" v-any-number:positiveInteger />
    <input type="number" step="0.0000000001" v-any-number:positiveNumber />
    <input type="text" v-any-number />
  </div>
</template>

<script>
import anyNumber from '@/directives/input/index.js'
export default {
  data() {
    return {
      value1: null,
      value2: null
    }
  },
  directives: {
    anyNumber
  },
  mounted() {}
}
</script>

<style></style>
