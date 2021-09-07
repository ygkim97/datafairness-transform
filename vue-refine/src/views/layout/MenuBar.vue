<template>
  <v-navigation-drawer    
    permanent
    expand-on-hover
    app
  >
    <!-- <v-sheet
      color="grey lighten-4"
      class="pa-4"
    >
    <div class="transition-swing text-h4"> {{ $route.params.tableName }}</div>
      
    </v-sheet>

    <v-divider></v-divider> -->

    <v-list>        
      <v-list-item
        v-for="[icon, text, linkTo] in links"
        :key="icon"
        link>

        <router-link 
        tag="div" 
        v-bind:class="{'display-flex':true, 'width-p-100' : true}"
        v-bind:to="getLinkTo(linkTo, tableName)">
          <v-list-item-icon>
            <v-icon>{{ icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>                      
            <v-list-item-title>{{ text }}</v-list-item-title>            
          </v-list-item-content>
        </router-link>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>

  export default  {
    name: 'menuBar',

    computed : {
      tableName() {
        return this.$store.getters.CONSTANTS.TABLE_NAME
      }
    },
    
    created() {
      this.EventBus.$on('setDrawer', this.setDrawer);
    },

    data: () => ({ 
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
      },
      setDrawer() {
        console.log('here')
        this.drawer = !this.drawer
      }
    }
  }
    
</script>