<template>
  <div class="custom-json-body">
    <div class="py-3">
      <v-btn
        color="blue-grey lighten-1"
        class="float-right"
        dark
        small
        @click="getResult"
        >데이터 조회</v-btn
      >
    </div>

    <div class="py-7">
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
    <div class="py-4">
      <v-card elevation="2" min-height="200">
        <v-toolbar color="blue-grey darken-2" dark height="40" flat
          >전체 통계
        </v-toolbar>
        <template class="all-grid-wrap">
          <tui-grid
            id="tuiGrid_total"
            ref="tuiGrid_total"
            :data="gridProps.total.gridData"
            :columns="gridProps.total.columns"
            :options="gridProps.total.options"
            :theme="gridProps.theme"
          ></tui-grid>
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
      this.expansionAll(false);
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
      expansionPanels: [],
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
</style>
