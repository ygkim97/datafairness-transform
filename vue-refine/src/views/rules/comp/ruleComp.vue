<template>
  <v-card elevation="2">
    <v-toolbar
      color="blue-grey darken-3"
      dark
      height="40"
      flat
    >{{ ruleKey }}
    </v-toolbar>

    <div class="grid-wrap">
      <div class="float-right my-2 mr-n4">
        <div class="float-left grid-button">
          <component
            :is="vBtn"
            :eventType="'add'"
            :iconName="'mdi-plus-circle'"
            :ruleKey="ruleKey"
            :selectList="selectList"
            :ruleSample="ruleSample"
          ></component>
        </div>
      </div>

      <tui-grid
        :id="`tuiGrid_` + ruleKey"
        :ref="`tuiGrid_` + ruleKey"
        :data="ruleObj"
        :columns="gridProps.columns"
        :options="gridProps.options"
        :theme="gridProps.theme"
      ></tui-grid>
    </div>
  </v-card>
</template>

<script>
import vBtn from "./rowBtn.vue";

import RuleMixin from "@/mixins/RuleMixin.js";
import modalComponent from "@/common/modal/modals/modalComp/add-rule-modal.vue";

export default {
  name: "ruleComp",

  mixins: [RuleMixin],
  props: ["ruleKey", "selectList", "allRuleObj"],

  computed: {
    ruleObj() {
      return this.$store.getters.ruleJson[this.ruleKey];
    },
    ruleSample() {
      return this.$store.getters.ruleSample[this.ruleKey];
    },
    gridInfo() {
      return this.$store.getters.GRID;
    }
  },

  watch: {
    ruleObj(obj) {
      // ruleObj가 업데이트 되면, grid를 리셋한다.
      this.$refs[`tuiGrid_${this.ruleKey}`].invoke("resetData", obj);
    }
  },
  created() {
    this.setColumn();
    this.createGrid();

    const me = this;
    this.$nextTick(function() {
      me.gridHighlight();

      /**
       * 1026
       * Backend 서버와 상의해서 수정 기능은 사용하지 않는걸로 함. (주석처리)
       * 추후에 필요해질 경우 주석 해제 하고 사용.
       */
      // me.gridDblClick();
    });
  },

  data: () => ({
    vBtn: vBtn,
    gridProps: {
      columns: [],
      options: {},
      theme: null
    },
    gridData: [],
    gridColumns: []
  }),

  methods: {
    setColumn() {
      let ruleParam = null;
      const me = this;

      if (Object.keys(me.selectList).length === 0) {
        return;
      }
      Object.keys(this.ruleSample.dataSet).forEach((rs) => {
        ruleParam = this.ruleSample.dataSet[rs];

        me.gridColumns.push({
          header: rs,
          name: rs,
          align: Object.prototype.hasOwnProperty.call(ruleParam, "align")
            ? ruleParam.align
            : "center",
          width: Object.prototype.hasOwnProperty.call(ruleParam, "width")
            ? ruleParam.width
            : "",
          sortable: false,
          whiteSpace: "pre-wrap"
        });
      });

      // add delete button column
      me.gridColumns.push({
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
            keyColumnName: this.ruleSample.columnKey
          }
        }
      });
    },
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
    buttonColumnClick(attr) {
      // Click the delete button for each row
      const rowParams = JSON.parse(attr.getAttribute("params"));
      const keyRow = JSON.parse(rowParams.row);

      let params = {
        [this.ruleKey]: []
      };
      let obj = {};
      Object.keys(this.ruleSample.dataSet).forEach((ds) => {
        obj[ds] = keyRow[ds];
      });
      params[this.ruleKey].push(obj);
      this.ruleDelete(params);
    },

    gridDblClick() {
      const vm = this;

      this.$refs[`tuiGrid_${this.ruleKey}`].gridInstance.on(
        "dblclick",
        (ev) => {
          const grid = ev.instance;

          // 데이터 추가
          // 추가 popup을 표시한다.
          const ruleParams = vm.createRuleParamPopup({
            mode: vm.$store.getters.CONSTANTS.popupType.EDIT,
            selectedRow: grid.getRow(ev.rowKey)
          });
          vm.openRulePopup(ruleParams, modalComponent);
        }
      );
    },

    gridHighlight() {
      let selectedRowKey = null;
      this.$refs[`tuiGrid_${this.ruleKey}`].gridInstance.on(
        "focusChange",
        (ev) => {
          console.log("highlight");
          const grid = ev.instance;
          if (selectedRowKey !== null) {
            grid.removeRowClassName(
              selectedRowKey,
              "custom-grid-row-highlight"
            );
          }
          selectedRowKey = ev.rowKey;
          grid.addRowClassName(selectedRowKey, "custom-grid-row-highlight");
        }
      );
    }
  }
};
</script>

<style scoped>
/* row를 선택 했을때, 선택한 cell만 blue/grey색의 border가 표시되는 현상 삭제 */
.tui-grid-layer-focus,
.tui-grid-layer-focus-deactive {
  display: none !important;
}
.custom-grid-row-highlight {
  background-color: #e9f6ff !important;
}
.grid-wrap{
    padding: 40px;
}
</style>
