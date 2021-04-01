<template>
  <div>
    <el-button type="primary" v-debounce="handleTest">
      debounce
    </el-button>
  </div>
</template>

<script>
import debounce from '@/directives/debounce/index.js'
export default {
  directives: {
    debounce
  },
  mounted() {
    console.log(debounce, 'debounce fun')
  },
  methods: {
    handleTest() {
      console.log('test chufale')
    }
  }
}
</script>

<style></style>
