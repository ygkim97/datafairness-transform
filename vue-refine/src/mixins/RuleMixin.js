import { api_dataDqiRuleChange } from "@/apis/rules.js";
export default {
  methods: {
    /**
     * @param mode need:{ruleKey, ruleSample, selectList}
     * @returns {{columns: *[], title: string, ruleKey: default.methods.ruleKey}}
     */
    createRuleParamPopup({ mode, selectedRow }) {
      const modeStr =
        mode === this.$store.getters.CONSTANTS.popupType.CREATE
          ? "추가"
          : "수정";
      let ruleParams = {
        mode: mode,
        ruleKey: this.ruleKey,
        title: "[" + this.ruleKey + "]" + " Rule " + modeStr,
        columns: []
      };

      let columnKeyObj = null;
      const keyDataSet = this.ruleSample.dataSet;
      // not allowed editable
      const columnKey = this.ruleSample.columnKey;
      let obj = {};

      const vm = this;
      Object.keys(keyDataSet).forEach((ds) => {
        columnKeyObj = keyDataSet[ds];
        obj = {
          type: columnKeyObj.type,
          label: ds,
          isEditable: !(
            mode === this.$store.getters.CONSTANTS.popupType.EDIT &&
            ds === columnKey
          ),
          value: selectedRow !== undefined ? selectedRow[ds].split(",") : ""
        };

        if (
          columnKeyObj.type === this.$store.getters.CONSTANTS.inputType.SELECT
        ) {
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
      return ruleParams;
    },
    openRulePopup(ruleParams, modalComponent) {
      this.EventBus.$emit("setModalComponent", {
        wrapType: "dialog",
        component: modalComponent,
        styleObj: {
          minWidth: 400,
          minHeight: 400
        },
        btnName: {
          ok: "저장",
          cancel: "취소"
        },
        params: ruleParams
      });
    },

    isInValid(params) {
      let inValid = false;

      // params가 배열로 전달됨.
      // 모든 경우에서 params는 단일로 처리되고 있기 때문에 첫번째 배열의 값만 유효함.
      // 그러힉 때문에 첫번째 배열의 값만 validation 체크를 해준다.
      params = params[0];
      Object.keys(params).forEach((e) => {
        if (this.isStringEmpty(e) || this.isStringEmpty(params[e])) {
          // true 일때만 저장해준다.
          inValid = true;
        }
      });
      // validationCheck
      return inValid;
    },
    removeEnter(str) {
      str = str.replace(/\n/g, ""); //행바꿈제거
      str = str.replace(/\r/g, ""); //엔터제거
      return str;
    },
    ruleChange(params) {
      params.action = this.$store.getters.CONSTANTS.actions.CREATE;
      return this._ruleUpdate(params);
    },
    ruleDelete(params) {
      params.action = this.$store.getters.CONSTANTS.actions.DELETE;
      return this._ruleUpdate(params);
    },
    async _ruleUpdate(params) {
      const vm = this;
      let _response = null;

      await api_dataDqiRuleChange(params).then((response) => {
        _response = response;
      });

      let tagName =
        params.action === this.$store.getters.CONSTANTS.actions.CREATE
          ? "저장"
          : "삭제";
      if (_response.result === "SUCCESS") {
        vm.EventBus.$emit("modalAlert", {
          title: "확인",
          text: tagName + "되었습니다.",
          okTitle: "확인"
        });
        // 데이터를 리로드해준다.
        this.$store.commit("getJsonRules");
        return true;
      } else {
        // alert msg
        vm.EventBus.$emit("modalAlert", {
          title: "경고",
          text:
            "아래의 이유로 " +
            tagName +
            "에 실패하였습니다. <br>" +
            _response.reason +
            "<br>메시지 확인 후 다시 시도해 주세요.",
          okTitle: "확인"
        });
        return false;
      }
    }
  }
};
