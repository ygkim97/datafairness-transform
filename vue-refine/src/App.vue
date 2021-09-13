<template>
  <v-app id="app">    
      <router-view></router-view>

    <!-- Global Component -->
    <modals></modals>
  </v-app>  
</template>

<script>
export default {
  name: 'App',
  
  components : {
  },

  created() {
  },
  
  methods: {
  }
}
</script>

<style lang="scss">
  @import './assets/css/dev.scss';
</style>

