<template>
  
</template>

<script>
  export default {
    name: 'menuBar',
    created() {
      this.tableName = this.$route.params.tableName;
    },
    data: () => ({ 
      tableName : null,     
      drawer: null,
      links: [
        ['mdi-alert-octagon', 'Get Rule', '/view'],
        ['mdi-send', 'Update Rule', '/update'],
        // ['mdi-delete', 'Delete Rule', '/delete']
      ],
    }),
    methods: {
      getLinkTo : (link, tableName) => {
        return `${link}/${tableName}`;
      }
    }
  }
    
</script>