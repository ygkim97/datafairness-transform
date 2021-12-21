<template>
  <tui-grid
    id="tuiGrid_total"
    ref="tuiGrid_total"
    :data="gridData"
    :columns="gridProps.total.columns"
    :options="gridProps.total.options"
    :theme="gridProps.theme"
  ></tui-grid>
</template>

<script>
export default {
  name: "dqi-grid",
  props: ["gridData", "resultTemplate"],
  computed: {
    gridInfo() {
      return this.$store.getters.GRID;
    }
  },
  data() {
    return {
      gridProps: {
        theme: null,
        total: {
          columns: [],
          options: {},
          gridData: []
        }
      }
    };
  },
  watch: {
    gridData(obj) {
      this.$refs[`tuiGrid_total`].invoke("resetData", obj);
    }
  },

  created() {
    this.createGrid();
    // this.setTest();
  },
  methods: {
    setTest() {
      const total_data = {
        table_dqi: {
          missing_rate: "14.546 %",
          type_missmatch_rate: "16.221 %",
          pattern_mismatch_rate: "19.541 %",
          consistency_violation_rate: "3.840 %",
          outlier_ratio: "1.307 %",
          uniqueness_violation_rate: "0.000 %"
        }
      };

      this.$store.dispatch("setResultResponse", {
        response: total_data,
        mode: "auto"
      });
    },
    createGrid() {
      // theme
      this.gridProps.theme = this.gridInfo.theme;

      const vm = this;
      const gridColumns = [
        {
          header: "Key",
          name: "key",
          align: "center",
          formatter: (r) => {
            return vm.resultTemplate[r.value];
          }
        },
        {
          header: "Value",
          name: "value",
          align: "center"
        }
      ];

      this.gridProps.total = {
        options: {
          scrollX: false
        },
        columns: gridColumns,
        gridData: []
      };
    }
  }
};
</script>

<style scoped></style>
