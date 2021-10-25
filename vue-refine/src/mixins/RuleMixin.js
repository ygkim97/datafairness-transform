import { api_dataDqiRuleChange } from "@/apis/rules.js";

export default {
  methods: {
    isRuleValid(params) {
      // validationCheck
      return true;
    },
    async ruleChange(params) {
      const vm = this;
      let _response = null;

      await api_dataDqiRuleChange(params).then((response) => {
        _response = response;
      });

      // TEST CODE
      // _response = {
      //     reason: "[REGEX_SET] not exist REGEX Key : PHONE_1,PHONE_2",
      //     result: "FAIL",
      //     status: false
      // }

      if (_response.result === "SUCCESS") {
        vm.EventBus.$emit("modalAlert", {
          title: "확인",
          text: "저장되었습니다.",
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
            "아래의 이유로 저장에 실패하였습니다. <br>" +
            _response.reason +
            "<br>데이터를 확인 후 다시 시도해 주세요.",
          okTitle: "확인"
        });
        return false;
      }
    }
  }
};
