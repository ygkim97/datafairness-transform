<template>
  <div class="custom-json-body">
    <div class="option-wrap">
      <v-layout>
        <v-flex xs12>
          <span class="text-caption" v-if="mode === 'auto'"
            >'RULE 기반 지표 측정' 은 '자동 지표 측정' 에서 조회한 데이터를
            기반으로 표시됩니다. <br />'데이터 조회' 를 먼저 실행해주세요.</span
          >
        </v-flex>
        <v-flex class="button-wrap" xs3>
          <ner-checkbox :mode="mode"></ner-checkbox>
        </v-flex>
        <v-flex class="button-wrap">
          <v-btn
            color="blue-grey lighten-1"
            class="float-right"
            dark
            small
            @click="getResult"
            >데이터 조회</v-btn
          >
        </v-flex>
      </v-layout>
    </div>

    <div class="py-1">
      <v-card elevation="2" min-height="200">
        <v-toolbar color="blue-grey darken-2" dark height="40" flat
          >컬럼별 통계
        </v-toolbar>
        <v-card-text class="float-right buttons">
          <v-btn
            color="blue-grey lighten-1"
            small
            @click="expansionAll(true)"
            class="white--text"
            >Open All
          </v-btn>
          <v-btn
            color="blue-grey lighten-1"
            small
            @click="expansionAll(false)"
            class="white--text"
            >Close All
          </v-btn>
        </v-card-text>
        <v-card-text>
          <template v-if="resultResponse.column_stats.length > 0">
            <v-expansion-panels multiple v-model="expansionPanels" focusable>
              <v-expansion-panel
                v-for="(column, idx) in resultResponse.column_stats"
                :key="`expansion_panel_` + idx"
              >
                <v-expansion-panel-header>
                  {{ column.column_name }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <result-column-simple-table
                    v-bind:column="column"
                  ></result-column-simple-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>
          <template v-else>
            <p class="center">데이터가 없습니다.</p>
          </template>
        </v-card-text>
      </v-card>
    </div>

    <div class="py-2">
      <v-card elevation="2" min-height="200">
        <v-toolbar color="blue-grey darken-2" dark height="40" flat
          >전체 통계
        </v-toolbar>
        <template class="all-grid-wrap">
          <div class="chart-body-wrap">
            <div class="btn-wrap">
              <div class="float-left chart-title-wrap">
                <span class="text-overline">{{
                  chartTypeArr[chartTypeNo]
                }}</span>
              </div>
              <v-btn
                color="blue-grey lighten-1"
                class="float-right mr-7 float-right"
                dark
                x-small
                @click="chartChange"
              >
                {{
                  (chartTypeArr[chartTypeNo] === "GRID" ? "BAR" : "GRID") +
                    " view"
                }}
              </v-btn>
            </div>
            <div class="total-wrap">
              <dqi-grid
                v-show="chartTypeArr[chartTypeNo] === 'GRID'"
                :gridData="gridData"
                :resultTemplate="strTemplate"
              ></dqi-grid>
              <dqi-bar
                v-show="chartTypeArr[chartTypeNo] === 'BAR'"
                :params="resultResponse.table_dqi"
                :resultTemplate="strTemplate"
              ></dqi-bar>
              <div v-show="chartTypeArr[chartTypeNo] === 'GAUGE'">
                <dqi-gauge
                  :params="resultResponse.table_dqi"
                  :resultTemplate="strTemplate"
                ></dqi-gauge>
              </div>
            </div>
          </div>
        </template>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "result-body",
  props: ["mode"],
  components: {
    ResultColumnSimpleTable: () => import("./result-column-simple-table.vue"),
    NerCheckbox: () => import("./ner-checkbox.vue"),
    DqiGrid: () => import("./dqi-grid.vue"),
    DqiBar: () => import("./dqi-chart-bar.vue"),
    DqiGauge: () => import("./dqi-chart-gauge.vue")
  },
  computed: {
    resultResponse() {
      this.expansionAll(false);
      return this.$store.getters.resultResponse[this.mode];
    },
    strTemplate() {
      return this.$store.getters.CONSTANTS.result_str;
    }
  },
  data() {
    return {
      gridData: [],
      chartTypeNo: 0,
      chartTypeArr: ["GRID", "BAR"],
      expansionPanels: []
    };
  },
  watch: {
    resultResponse(obj) {
      this.gridData = Object.keys(obj.table_dqi).map((td) => {
        return { key: td, value: obj.table_dqi[td] };
      });
    }
  },
  created() {},
  methods: {
    chartChange() {
      this.chartTypeNo++;
      if (this.chartTypeNo >= this.chartTypeArr.length) {
        this.chartTypeNo = 0;
      }
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
          scrollX: false
        },
        columns: gridColumns,
        gridData: []
      };
    },
    getResult() {
      this.$emit("getResult");
    },
    expansionAll(bool) {
      if (bool) {
        // expansion
        this.expansionPanels = [
          ...Array(this.resultResponse.column_stats.length).keys()
        ].map((k, i) => i);
      } else {
        // reduction
        this.expansionPanels = [];
      }
    }
  }
};
</script>

<style scoped>
.custom-json-body {
  margin: 0 10px 10px 10px;
}
p.center {
  text-align: center;
}
div.buttons button {
  margin: 5px 5px;
}
.option-wrap .button-wrap {
  padding: 10px 5px;
}

.btn-wrap {
  margin: 10px 0;
  height: 30px;
}
.total-wrap {
  padding: 20px;
}

.chart-title-wrap {
  margin: 5px 20px;
}
</style>
