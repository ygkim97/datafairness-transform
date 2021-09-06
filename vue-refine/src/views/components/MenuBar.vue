<template>
  <v-navigation-drawer
    v-model="drawer"
    app
  >
    <v-sheet
      color="grey lighten-4"
      class="pa-4"
    >
    <!-- <router-link :to="getLinkTo('', tableName)"> -->
      <div class="transition-swing text-h4"> {{ $route.params.tableName }}</div>
    <!-- </router-link> -->
      
    </v-sheet>

    <v-divider></v-divider>

    <v-list>
      <v-list-item
        v-for="[icon, text, linkTo] in links"
        :key="icon"
        link
      >
        <v-list-item-icon>
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>          
          <router-link v-bind:to="getLinkTo(linkTo, tableName)">
            <v-list-item-title>{{ text }}</v-list-item-title>            
          </router-link>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
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