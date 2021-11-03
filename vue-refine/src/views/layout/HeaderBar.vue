<template>
  <v-app-bar color="blue-grey darken-3" app style="z-index: 17 !important;">
    <v-toolbar-title class="title left">
      <span class="transition-swing mb-1 white--text" style="font-size: 1.8rem">
        {{ tableName }}
      </span>
    </v-toolbar-title>
  </v-app-bar>
</template>

<script>
export default {
  name: "menuBar",

  computed: {
    tableName() {
      return this.$store.getters.tableName;
    }
  },

  created() {},

  data: () => ({}),

  methods: {}
};
</script>

<style scoped>
.title {
  margin: 0 30px 0 30px;
}
.title.left {
}

.right {
  margin-right: 1%;
  right: 10px;
  float: right;
}
</style>
