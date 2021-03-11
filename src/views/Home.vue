<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import request from '@/utils/request'
import { getToken } from '@/utils/auth'
export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      console.log('chufale?')
      let token = getToken()
      console.log('token:', token)
      request({
        url: '/vue-element-admin/user/info',
        method: 'get',
        params: { token }
      })
    }
  }
}
</script>
