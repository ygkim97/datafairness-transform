<template>
      <v-app-bar app>
      <!-- <v-app-bar-nav-icon @click="setDrawer()"></v-app-bar-nav-icon> -->

      <v-toolbar-title>TABLE : {{tableName}}</v-toolbar-title>
    </v-app-bar>
</template>

<script>
  export default {
    name: 'menuBar',

    computed : {
      tableName() {
        return this.$store.getters.CONSTANTS.TABLE_NAME
      }
    },
    
    created() {
    },

    data: () => ({ 
      links: [
        ['mdi-alert-octagon', 'Get Rule', '/view'],
        ['mdi-send', 'Update Rule', '/update'],
        // ['mdi-delete', 'Delete Rule', '/delete']
      ],
    }),

    methods: {
      getLinkTo : (link, tableName) => {
        return `${link}/${tableName}`;
      },

      // this.EventBus를 사용해야 하기 때문에, 화살표 함수를 사용할수 없음
      setDrawer() {
        this.EventBus.$emit('setDrawer')
      }
    }
  }
    
</script>