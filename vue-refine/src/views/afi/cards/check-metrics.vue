<template>
  <v-card-actions class="custom-card-wrapper">
    <v-card v-for="(rd, key, i) in afiRowData" :key="'card_' + i" class="mb-12">
      <v-toolbar
        color="blue-grey darken-2"
        dark
        height="40"
        flat
      >{{ defaultData[key].text }}
      </v-toolbar>
      <template
        v-if="Object.prototype.hasOwnProperty.call(defaultData[key], 'desc')"
      >
        <div
          class="text-caption noty"
          v-html="getHtmlDesc(defaultData[key].desc)"
        ></div>
      </template>

      <template v-if="defaultData[key].dataType === 'array'">
        <!-- array component-->
        <data-set-array
          :pageKey="pageKey"
          :rd="rd"
          :compKey="key"
          :afiRowData="afiRowData"
          :defaultData="defaultData"
        >
        </data-set-array>
      </template>

      <template v-if="defaultData[key].dataType === 'grid'">
        <data-set-grid
          :pageKey="pageKey"
          :rd="rd"
          :compKey="key"
          :afiRowData="afiRowData"
          :defaultData="defaultData"
        >
        </data-set-grid>
      </template>
    </v-card>
  </v-card-actions>
</template>

<script>
export default {
  name: "check-metrics",
  props: ["step", "pageKey"],
  components: {
    DataSetArray: () => import("../comp/data-set-array.vue"),
    DataSetGrid: () => import("../comp/data-set-grid.vue")
  },
  computed: {
    defaultData() {
      return this.$store.getters.defaultData[this.pageKey];
    },
    afiRowData() {
      return this.$store.getters.afiRowData[this.pageKey];
    }
  },
  data() {
    return {};
  }
};
</script>

<style scoped>
div.noty {
  padding: 10px 20px;
}
</style>
