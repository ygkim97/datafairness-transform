<template>
  <div>
    <v-btn elevation="1" icon x-small @click="btnClick()">
      <v-icon>{{ iconName }}</v-icon>
    </v-btn>
  </div>
</template>

<script>
import modalComponent from "@/common/modal/modals/modalComp/add-rule-modal.vue";

export default {
  name: "rowBtn",

  props: ["eventType", "iconName", "ruleKey", "selectList", "ruleSample"],

  created() {
    this.EventBus.$once("add", this.addRow);
  },

  methods: {
    btnClick() {
      if (this.eventType === "add") {
        this.addRow();
      } else if (this.eventType === "delete") {
        this.$emit("deleteRow", { key: this.eventType });
      }
    },
    addRow() {
      // 데이터 추가
      // 추가 popup을 표시한다.
      let ruleParams = {
        ruleKey: this.ruleKey,
        title: this.ruleKey + " Rule 추가",
        columns: []
      };

      let columnKeyObj = null;

      const keyDataSet = this.ruleSample.dataSet;
      let obj = {};

      const vm = this;
      Object.keys(keyDataSet).forEach((ds) => {
        columnKeyObj = keyDataSet[ds];
        obj = {
          type: columnKeyObj.type,
          label: ds
        };

        if (columnKeyObj.type === "select") {
          /**
           * ex) dependOn = regex.name
           * ~~.split('.').shift() = 'regex'
           * ~~.split('.').pop() = 'name'
           *
           * selectKey = {
           *    'regex' : {name:[]}, expression:[],
           *    'regex_set' : {name:[]}, regex_name:[]
           * }
           */

          obj["selectList"] =
            vm.selectList[columnKeyObj.dependOn.split(".").shift()][
              columnKeyObj.dependOn.split(".").pop()
            ];
        }
        ruleParams.columns.push(obj);
      });

      this.EventBus.$emit("setModalComponent", {
        wrapType: "dialog",
        component: modalComponent,
        styleObj: {
          minWidth: 400,
          minHeight: 200
        },
        btnName: {
          ok: "저장",
          cancel: "취소"
        },
        params: ruleParams
      });
    }
  }
};
</script>
