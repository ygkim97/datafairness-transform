<template>
  <div>
    <v-chip class="ma-2 text-h5" label outlined>{{ ruleKey }}</v-chip>

    <div class="grid-wrap">
      <div class="float-right">
        <div class="float-left grid-button">
          <component
            :is="vBtn"
            :eventType="'add'"
            :iconName="'mdi-plus-circle'"
            :ruleKey="ruleKey"
            :selectList="selectList"
            :ruleSample="ruleSample"
          ></component>
          <!--            @addRow="addRow"-->
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
  </div>
</template>

<script>
import RuleMixin from "@/mixins/RuleMixin.js";
import vBtn from "./rowBtn.vue";

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
    allRuleSample() {
      return this.$store.getters.ruleSample;
    },
    ruleDataSet() {
      return this.$store.getters.ruleDataSet[this.ruleKey];
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
    const me = this;
    me.setColumn();

    try {
      me.createGrid();
      // 화면이 모두 렌더링 된 후에 이벤트를 걸어준다.
      this.$nextTick(function() {
        me.gridAfterChange();
      });
    } catch {
      console.log("err");
    }
  },

  data: () => ({
    btnElement: null,
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
      let editorParam = null;

      const me = this;

      if (Object.keys(me.selectList).length === 0) {
        return;
      }
      Object.keys(this.ruleSample.dataSet).forEach((rs) => {
        ruleParam = this.ruleSample.dataSet[rs];

        if (ruleParam.editorUse) {
          editorParam = {};
          editorParam.type = ruleParam.type;

          if (editorParam.type !== "text") {
            editorParam.options = {
              listItems:
                me.selectList[ruleParam.dependOn.split(".").shift()][
                  ruleParam.dependOn.split(".").pop()
                ]
            };
          }
        }

        me.gridColumns.push({
          header: rs,
          name: rs,
          align: Object.prototype.hasOwnProperty.call(ruleParam, "align")
            ? ruleParam.align
            : "center",
          width: Object.prototype.hasOwnProperty.call(ruleParam, "width")
            ? ruleParam.width
            : "",
          sortable: false
          // editor: editorParam
          // whiteSpace: 'pre-wrap'
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
          draggableRow: true,
          scrollX: false,
          scrollY: false
        },
        columns: this.gridColumns
      };
    },
    deleteRow(keyParam) {
      this.$store.dispatch("deleteRow", {
        key: this.ruleKey,
        keyParam: keyParam
      });
    },
    buttonColumnClick(attr) {
      const keyParam = JSON.parse(attr.getAttribute("params"));
      this.deleteRow(keyParam);
    },
    gridAfterChange() {
      const vm = this;
      this.$refs[`tuiGrid_${this.ruleKey}`].gridInstance.on(
        "afterChange",
        (ev) => {
          const newRow = ev.changes[0];
          // 변경한 내용을 Backend 서버로 보내서 반영 한 후에, grid를 다시 그려준다.
          let obj = {};
          obj[newRow.columnName] = newRow.value;
          let params = {
            action: "create"
          };
          params[vm.ruleKey] = obj;

          // 변경한 내용을 vuex에 반영해준다.
          // vm.$store.dispatch("changeRow", {
          //   key: vm.ruleKey,
          //   columnName: newRow.columnName,
          //   rowIdx: newRow.rowKey,
          //   value: newRow.value
          // });

          // vm.updateDependOnData({
          //   dependOnVal: `${vm.ruleKey}.${newRow.columnName}`,
          //   previousVal: newRow.prevValue,
          //   newVal: newRow.value
          // });
          // 만약 연결되어있는 값이 있을 경우, 해당 값들도 변경해주어야 한다.
          // sampleRule의 dependOn 값에 따라 처리한다.
          // 일단 dependOn의 값들이 있는지 확인한다.
        }
      );
    },

    ruleChange() {
      this.$emit("ruleChange");
    },

    // updateDependOnData({ dependOnVal, previousVal, newVal }) {
    //   // get dependOn data
    //   let rs = null;
    //   let dataSet = null;
    //   let ds = null;
    //   let results = [];
    //
    //   for (rs in this.allRuleSample) {
    //     dataSet = this.allRuleSample[rs].dataSet;
    //     for (ds in dataSet) {
    //       if (Object.prototype.hasOwnProperty.call(dataSet[ds], "dependOn")) {
    //         if (dataSet[ds].dependOn === dependOnVal) {
    //           results.push({ key: rs, columnName: ds });
    //         }
    //       }
    //     }
    //   }
    //
    //   // set new value data
    //   const vm = this;
    //   results.forEach((r) => {
    //     vm.$store.dispatch("changeRows", {
    //       key: r.key,
    //       columnName: r.columnName,
    //       previousValue: previousVal,
    //       newVal: newVal
    //     });
    //   });
    // },
    test() {
      console.log("test");
      this.EventBus.$emit("loaderOpen");
    }
  }
};
</script>
