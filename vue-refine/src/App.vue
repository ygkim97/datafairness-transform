<template>
  <v-app>
    <menu-panel />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
    
  components : {
    MenuPanel: () => import('@/views/components/MenuBar.vue')
  },
  
  created() {
    console.log(process.env);
    // console.log(process.env.VUE_APP_REST_SERVER_URL+':'+process.env.VUE_APP_REST_SERVER_PORT);
  }
};
</script>
