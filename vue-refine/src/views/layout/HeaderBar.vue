<template>
  <v-app-bar app>
    <v-toolbar-title class="title left">
      <span class="transition-swing text-h5 mb-1">
        TABLE NAME :
      </span>
      <span class="transition-swing text-h4 mb-1">
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
