<template>
  <div class="text-body-1 set-result-rule-wrap">
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <span>결과 조회 Rule 지표 설정</span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-layout row>
            <v-flex>
              <v-autocomplete
                dense
                autocomplete="off"
                persistent-hint
                outlined
                label="Column Name"
                v-model="column"
                :items="params.columnList"
                required
                hint="Rule을 적용할 Column을 선택해 주세요"
              ></v-autocomplete>
            </v-flex>
            <v-flex>
              <v-autocomplete
                dense
                autocomplete="off"
                persistent-hint
                outlined
                label="Regex Set Rule Names"
                v-model="rule"
                :items="params.regexSetNames"
                required
                hint="Rule을 선택해 주세요"
              ></v-autocomplete>
            </v-flex>
            <v-flex align-self-start>
              <v-btn
                color="grey lighten-5"
                class=""
                small
                bottom
                @click="addRule"
                >추가</v-btn
              >
            </v-flex>
          </v-layout>

          <v-layout row><v-divider></v-divider> </v-layout>
          <v-layout row>
            <v-flex class="">
              <tui-grid
                id="tuiGrid_popup"
                ref="tuiGrid_popup"
                :data="gridData"
                :columns="gridProps.columns"
                :options="gridProps.options"
                :theme="gridProps.theme"
              ></tui-grid>
            </v-flex>
          </v-layout>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  name: "",
  props: ["params"],

  computed: {
    gridInfo() {
      return this.$store.getters.GRID;
    }
  },

  data() {
    return {
      column: null,
      rule: null,
      gridProps: {
        columns: [],
        options: {},
        theme: null
      },
      gridData: []
    };
  },
  watch: {
    gridData(obj) {
      this.$refs[`tuiGrid_popup`].invoke("resetData", obj);

      this.$store.commit("setResultRuleParam", obj);
    }
  },
  created() {
    this.createGrid();
  },
  methods: {
    addRule() {
      // 1. ColumnName이나 RuleName 중 하나라도 선택하지 않은 경우, 추가하지 않는다.
      if (this.column === null || this.rule === null) {
        this.EventBus.$emit("modalAlert", {
          title: "경고",
          text: `Column Name과 Rule Name을 선택 해 주세요.`,
          okTitle: "확인"
        });
        return;
      }
      // 2. 중복된 값이 있을 경우 추가 하지 않는다.
      const idx = this.gridData.findIndex((e) => e.column === this.column);
      if (idx >= 0) {
        this.EventBus.$emit("modalAlert", {
          title: "경고",
          text: `Column 명 [${this.column}] 은/는 이미 추가되어있습니다.<br>(*Column 하나당 한개의 Rule만 적용 할 수 있습니다.)`,
          okTitle: "확인"
        });
        return;
      }

      this.gridData.push({
        column: this.column,
        rule: this.rule
      });

      this.column = null;
      this.rule = null;
    },
    createGrid() {
      const gridColumns = [
        {
          header: "Column Name",
          name: "column",
          align: "center"
        },
        {
          header: "Regex Set Name",
          name: "rule",
          align: "center"
        },
        {
          header: "",
          name: "",
          align: "center",
          width: 40, // pixel
          renderer: {
            type: this.gridInfo.renderer.buttonColumn,
            options: {
              btnText: "view",
              vueIns: this,
              iClass: "fas fa-minus-circle",
              keycolumn: "column"
            }
          }
        }
      ];

      this.gridProps = {
        theme: this.gridInfo.theme,
        options: {
          bodyHeight: "fitToParent",
          rowHeight: "auto",
          scrollX: false
        },
        columns: gridColumns
      };
    },
    buttonColumnClick(attr) {
      const rowParams = JSON.parse(attr.getAttribute("params"));
      const keyRow = JSON.parse(rowParams.row);

      const gridIdx = this.gridData.findIndex(
        (e) => e.column === keyRow.column
      );

      this.gridData.splice(gridIdx, 1);
    },
    confirm() {
      // vuex에 저장한다.
      this.$store.commit("setResultRuleParam", this.gridData);
      this.EventBus.$emit("modalClose");
    }
  }
};
</script>

<style scoped>
.custom-select-body {
  padding: 30px;
  border: 1px solid lightgray;
  border-radius: 10px;
  margin-bottom: 20px;
  width: 800px;
}
.custom-select-body * {
  font-size: 15px;
}
.grid-wrap {
  height: 150px;
}
.v-divider {
  margin: 10px 0 10px 0;
}
.layout .flex {
  margin-right: 20px;
}
</style>
