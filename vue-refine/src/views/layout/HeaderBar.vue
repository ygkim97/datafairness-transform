<template>
      <v-app-bar app>

      <v-toolbar-title>
        <span class="transition-swing text-h5 mb-1">
          TABLE NAME : 
        </span>
        <span class="transition-swing text-h4 mb-1">
          {{tableName}}
        </span>
      </v-toolbar-title>
    </v-app-bar>
</template>

<script>
  export default {
    name: 'menuBar',

    computed : {
      tableName() {
        return this.$store.getters.tableName
      }
    },
    
    created() {
    },

    data: () => ({
    }),

    methods: {
    }
  }
    
</script>