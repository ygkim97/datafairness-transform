<template>
  <v-card>
    <card-header :params="stepper[step]"></card-header>
    <!-- card-actions-->
    <component :is="component" :step="step" :pageKey="stepper[step].key"></component>
    <!-- // card-actions-->
  </v-card>
</template>

<script>
export default {
  name: "dataSet",
  props: ["step", "component"],
  components: {
    cardHeader: () => import("./card-header.vue")
  },
  computed: {
    tableName() {
      return this.$store.getters.tableName;
    },
    stepper() {
      return this.$store.getters.stepper;
    }
  },
  data() {
    return {};
  }
};
</script>

<style scoped>
.card-actions {
  size: 30px;
}
</style>
