<template>
  <!-- 추후에 chart로 변경-->
  <div class="metrics-wrap">
    <div class="metrics-body">
      <tui-grid
        id="tuiGrid_chart"
        ref="tuiGrid_chart"
        :data="gridData"
        :columns="gridProps.columns"
        :options="gridProps.options"
        :theme="gridProps.theme"
      ></tui-grid>
    </div>
  </div>
</template>

<script>
export default {
  name: "data-set-chart",
  props: ["params"],
  computed: {
    gridInfo() {
      return this.$store.getters.GRID;
    }
  },
  watch: {
    gridData(obj) {
      // ruleObj가 업데이트 되면, grid를 리셋한다.
      this.$refs[`tuiGrid_chart`].invoke("resetData", obj);
    }
  },
  data() {
    return {
      gridProps: {
        columns: [],
        options: {},
        theme: null
      },
      gridData: [],
      gridColumns: []
    };
  },
  created() {
    this.paramConvertGridData();
    this.createGrid();
  },
  methods: {
    hasParam(type) {
      return (
        Object.prototype.hasOwnProperty.call(this.params, type) > -1 &&
        this.params[type] !== null
      );
    },
    paramConvertGridData() {
      const hasAfter = this.hasParam("after");

      const vm = this;
      let obj = {};
      Object.keys(this.params.before).forEach((e) => {
        obj = {
          name: e,
          before: vm.params.before[e],
          after: "-"
        };
        if (hasAfter) {
          obj.after = vm.params.after[e];
        }
        vm.gridData.push(obj);
      });
    },
    createGrid() {
      // createColumn
      let columns = [
        {
          header: "Property",
          name: "name",
          align: "center",
          width: 200
        },
        {
          header: "Before",
          name: "before",
          align: "center"
        },
        {
          header: "After",
          name: "after",
          align: "center"
        }
      ];

      this.gridProps = {
        theme: this.gridInfo.theme,
        options: {
          bodyHeight: "auto",
          rowHeight: "auto",
          width: 700,
          scrollX: false,
          scrollY: false
        },
        columns: columns
      };
    }
  }
};
</script>

<style scoped>
.metrics-wrap {
    padding : 10px;
}
</style>
