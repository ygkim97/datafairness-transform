<template>
  <div class="custom-json-body">
    <v-layout row wrap justify-end>
      <v-flex align-self-center shrink>
        <v-btn elevation="1" small plain @click="getResult">데이터 조회</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row justify-center class="result-body">
      <v-flex >
        <template>
          <v-layout row>
              <v-flex class="grid-wrap">
                  <p>전체 통계</p>
                <tui-grid
                  id="tuiGrid_total"
                  ref="tuiGrid_total"
                  :data="gridProps.total.gridData"
                  :columns="gridProps.total.columns"
                  :options="gridProps.total.options"
                  :theme="gridProps.theme"
                ></tui-grid>

<!--              <template v-for="(e, i) in Object.keys(resultResponse.table_dqi)">-->
<!--                <span :key="'span_' + i">-->
<!--                  {{ e }}-->
<!--                  &lt;!&ndash;                    {{strTemplate[e]}}&ndash;&gt;-->
<!--                </span>-->
<!--              </template>-->
            </v-flex>
          </v-layout>
            <v-flex class="grid-wrap">
                <p>컬럼별 통계</p>
                <v-expansion-panels >
                    <v-expansion-panel v-for="(column, idx) in resultResponse.column_stats" :key="`expansion_panel_` + idx">
                        <v-expansion-panel-header>
                            {{column.column_name}}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <result-column-simple-table v-bind:column="column"></result-column-simple-table>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-flex>
        </template>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "result-body",
  props: ["mode"],
    components: {
        ResultColumnSimpleTable: () => import("./result-column-simple-table.vue")
    },
  computed: {
    gridInfo() {
      return this.$store.getters.GRID;
    },
    strTemplate() {
      return this.$store.getters.CONSTANTS.result_str;
    },
    resultResponse() {
      return this.$store.getters.resultResponse[this.mode];
    }
  },
  watch: {
    resultResponse(obj) {
      const totalData = Object.keys(obj.table_dqi).map((td) => {
        return { key: td, value: obj.table_dqi[td] };
      });
      this.$refs[`tuiGrid_total`].invoke("resetData", totalData);
    }
  },
  data() {
    return {
      column: null,
      rule: null,
      gridProps: {
        theme: null,
        total: {
          columns: [],
          options: {},
          gridData: []
        },
        columns: {
          columns: [],
          options: {},
          gridData: []
        }
      }
    };
  },
  created() {
    this.createGrid();
  },
  methods: {
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
            return vm.strTemplate[r.value];
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
          bodyHeight: "fitToParent",
          rowHeight: "auto",
          scrollX: false
        },
        columns: gridColumns,
        gridData: []
      };
    },
    getResult() {
      this.$emit("getResult");
    }
  }
};
</script>

<style scoped>
.custom-json-body {
  margin: 30px 10px 10px 10px;
}
.result-body {
  margin-top: 30px;
  padding: 20px;
  /*border: 1px solid lightgray;*/
}
</style>
