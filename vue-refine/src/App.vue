<template>
  <v-app>
    <menu-bar />
    <header-bar />
    <main-panel />
  </v-app>
</template>

<script>
export default {
  name: 'App',
  
  components : {
    MenuBar: () => import('@/views/layout/MenuBar.vue'),
    HeaderBar: () => import('@/views/layout/HeaderBar.vue'),
    MainPanel: () => import('@/views/layout/MainPanel.vue'),
  },

  created() {
    // console.log(process.env);
    // console.log(process.env.VUE_APP_REST_SERVER_URL+':'+process.env.VUE_APP_REST_SERVER_PORT);    
  },

  data : () => ({
    tableName : null
  }),
  
  methods: {
  }
};
</script>

<style lang="scss">
  @import './assets/css/dev.css';
</style>

