<template>
  <v-card-actions class="custom-card-wrapper">
    <v-card v-for="(rd, key, i) in afiRowData" :key="'card_' + i">
      <v-card-title>{{ defaultData[key].text }}</v-card-title>
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
  display: inherit !important;
  width: 80%;
}
.custom-card-wrapper > div {
  margin: 10px 0;
}
.custom-card-content {
  padding: 5px;
  margin: 3px 20px 10px 20px;
  border: 1px solid lightblue;
  width: auto !important;
}
.custom-card-content.none-border {
  border: none !important;
}
.custom-card-content > div {
  padding: 5px;
}
.custom-card-content .v-card__text {
  padding: 5px !important;
}
.button-wrap button {
  margin: 0 50%;
}
.add-button-wrap button {
  position: absolute;
  right: 20px;
  top: 40px;
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
