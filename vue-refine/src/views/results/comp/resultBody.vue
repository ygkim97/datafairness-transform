<template>
  <div>
    <!--        <template v-for="(row, idx) in Object.keys(resultResponse)">-->
    <!--            <div :key="'div_label_' + idx">-->
    <!--                {{getRow(row)}}-->
    <!--            </div>-->
    <!--            -->

    <!--        </template>-->
    <!--    <tui-grid-->
    <!--      id="tuiGrid"-->
    <!--      ref="tuiGrid"-->
    <!--      :data="ruleObj"-->
    <!--      :columns="gridProps.columns"-->
    <!--      :options="gridProps.options"-->
    <!--      :theme="gridProps.theme"-->
    <!--    ></tui-grid>-->
  </div>
</template>

<script>
export default {
  name: "resultBody",

  props: ["resultType", "params"],

  computed: {
    resultResponse() {
      return this.$store.getters.resultResponse;
    },
    resultResponseStr() {
      return this.$store.getters.CONSTANTS.result_str;
    },
    gridInfo() {
      return this.$store.getters.GRID;
    }
  },
  watch: {
    resultResponse(obj) {
      // ruleObj가 업데이트 되면, grid를 리셋한다.
      this.setGridData(obj);
      // this.$refs[`tuiGrid_${this.ruleKey}`].invoke("resetData", obj);
    }
  },
  created() {
    // this.createGrid();
  },
  data: () => ({
    mode: null,
    selectedRule: [],
    gridProps: {
      columns: [],
      options: {},
      theme: null
    }
  }),
  methods: {
    createGrid() {
      this.gridProps = {
        theme: this.gridInfo.theme,
        options: {
          rowHeight: "auto",
          draggableRow: true,
          scrollX: false,
          scrollY: false
        },
        columns: this.gridColumns
      };
    },
    setGridData(gridData) {
      // console.log(gridData);
    },
    getRow(row) {
      return this.resultResponseStr[row];
    }
  }
};
</script>

<style scoped></style>
