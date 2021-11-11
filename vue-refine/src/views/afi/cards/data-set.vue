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
      <template v-if="defaultData[key].dataType === 'array'">
        <!-- array component-->
        <data-set-array
          :pageKey="pageKey"
          :rd="rd"
          :compKey="key"
          :afiRowData="afiRowData"
          :defaultData="defaultData"
          class="mt-16"
        >
        </data-set-array>
      </template>

      <template v-else-if="defaultData[key].dataType === 'object'">
        <!-- object component-->
        <data-set-object
          :pageKey="pageKey"
          :rd="rd"
          :compKey="key"
          :afiRowData="afiRowData"
          :defaultData="defaultData"
        >
        </data-set-object>
      </template>

      <!-- string Array 일 경우-->
      <template v-else-if="defaultData[key].dataType === 'stringArray'">
        <data-set-html
          :pageKey="pageKey"
          :rd="rd"
          :compKey="key"
          :afiRowData="afiRowData"
          :defaultData="defaultData"
          class="px-0"
        ></data-set-html>
      </template>

      <!-- textarea 일 경우 = python code panel-->
      <template v-else-if="defaultData[key].dataType === 'textarea'">
        <data-set-html
          :pageKey="pageKey"
          :rd="rd"
          :compKey="key"
          :afiRowData="afiRowData"
          :defaultData="defaultData"
          class="px-0"
        ></data-set-html>
      </template>
      <template v-else> </template>
    </v-card>
  </v-card-actions>
</template>

<script>
export default {
  name: "dataSet",
  props: ["step", "pageKey"],
  components: {
    DataSetArray: () => import("../comp/data-set-array.vue"),
    DataSetObject: () => import("../comp/data-set-object.vue"),
    DataSetHtml: () => import("../comp/data-set-html.vue")
  },
  computed: {
    defaultData() {
      return this.$store.getters.defaultData[this.pageKey];
    },
    afiRowData() {
      return this.$store.getters.afiRowData[this.pageKey];
    }
  },
  watch: {},
  data() {
    return {};
  },
  created() {},
  methods: {
    getHtmlCode(obj) {
      return obj.split("\n").join("<br>");
    }
  }
};
</script>

<style>
.custom-card-wrapper {
  display: inline-block;
  width: 100%;
}
.custom-card-wrapper > div {
  margin: 10px 0;
}
.custom-card-content {
  padding: 20px;
  margin: 40px 24px 16px 24px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  width: auto !important;
}
.custom-card-content.none-border {
  border: none !important;
}
.custom-card-content .v-card__text {
  padding: 5px !important;
}
.button-wrap{
  position: relative;
}
.button-wrap button {
  position: absolute;
  top: -14px;
  right: -14px;
}
.add-button-wrap{
  position: absolute;
  width: 100%;
}
.add-button-wrap button{
  position: absolute;
  right: 25px;
  bottom: 10px;
}
.v-card {
  padding-bottom: 1px;
}
.label-col p,
.value-col p {
  margin-bottom: 0;
}
.template-array {
  padding: 20px;
}
</style>
