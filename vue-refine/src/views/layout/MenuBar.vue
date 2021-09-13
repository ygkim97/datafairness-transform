<template>
  <v-navigation-drawer    
    permanent
    expand-on-hover
    app
  >

    <v-list>        
      <v-list-item
        v-for="[name, icon, text, linkTo] in links"
        :key="name"
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

    created() {
      this.setLink();
    },

    computed : {
      tableName() {
        return this.$store.getters.TABLE_NAME
      }
    },

    data: () => ({ 
      links: [],
    }),

    methods: {
      getLinkTo : (link, tableName) => {
        return `${link}`;
        // return `${link}/${tableName}`;
      },

      setLink() {
        let path = '';

        this.links = [];
        this.$router.options.routes.forEach((r) => {
          if ((Object.prototype.hasOwnProperty.call(r, 'meta') && r.meta.useMain) 
          && Object.prototype.hasOwnProperty.call(r, 'children')) {
            r.children.forEach((c) => {
              path = (c.path.indexOf(':') > -1) ? c.path.split(':').shift() : c.path;  
              this.links.push([c.name, c.icon, c.text, c.path]); 
            })
          }  
        })
      }
    }
  }
    
</script>