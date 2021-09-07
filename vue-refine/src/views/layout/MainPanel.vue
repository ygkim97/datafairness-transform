<template>
    <v-main>
      <router-view />
    </v-main>
</template>

<script>
  export default {
    name: 'mainPanel',

    created() {      
      // set TableName
      this.$store.commit('setTableName', this.$route.params.tableName);
    },

    data: () => ({ 
    }),

    methods: {
    }
  }
    
</script>