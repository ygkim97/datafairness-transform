<template>
  <v-flex class="rule-buttons">
    <div>
      <v-btn 
        color="blue-grey darken-3" 
        small 
        @click="gotoRouter('viewRule')" class="white--text"
      >RULE
      </v-btn>
      <v-btn 
        color="blue-grey darken-3"
        small 
        @click="gotoRouter('viewResult')" class="white--text"
      >RESULT
      </v-btn>
    </div>
  </v-flex>
</template>

<script>
import { api_dataDqiRule } from "@/apis/rules.js";

export default {
  methods: {
    gotoRouter(val) {
      // /test url에서 다시 /test 를 호출할때 발생 하는 에러 메시지를 무시하기 위한 코드
      this.$router.push({ name: val }).catch(() => {});
    },

    save() {
      const _vm = this;

      this.EventBus.$emit("modalConfirm", {
        title: "Rule 저장",
        text: `[ ${this.tableName} ] 테이블의 Rule을 저장하시겠습니까?  <br>(* 기존의 Rule은 삭제되며, 이전 Rule 정보를 복구 할 수 없습니다.)`,
        okTitle: "확인",
        cancelTitle: "취소",
        okRes: function() {
          // save를 실행하기 전에, Action값을 부여해준다.
          // _vm.$store.dispatch("setAction", _vm.$store.getters.CONSTANTS.actions.CREATE);
          _vm.saveRule();
        }
      });
    },

    async saveRule() {
      // api를 호출 할때 param은 store에 저장되어있는 값을 사용하기 때문에, param를 전달하지 않음.

      const _vm = this;
      await api_dataDqiRule().then((response) => {
        if (response.result === "SUCCESS") {
          setTimeout(function() {
            _vm.EventBus.$emit("modalAlert", {
              title: "알림",
              text: "저장되었습니다.",
              okTitle: "확인",
              okRes: function() {
                // viewRule로 이동시키지 않고, vuex의 데이터를 삭제한 후에 화면을 다시 그리는 방안으로 해야함.
                // 같은 url을 router를 통해서 다시 실행하게 되면, 에러가 발생하기 때문.
                // _vm.$router.push({name: 'viewRule'})
              }
            });
          }, 500);
        } else {
          _vm.EventBus.$emit("modalAlert", {
            title: "경고",
            text: "저장되지 않았습니다.. <br>잠시 후 다시 시도해 주세요.",
            okTitle: "확인"
          });
        }
      });
    },
    remove() {
      const _vm = this;

      this.EventBus.$emit("modalConfirm", {
        title: "Rule 삭제",
        text: `[ ${this.tableName} ] 테이블의 Rule을 삭제하시겠습니까?  <br>(* 삭제가 완료되면 이전 Rule 정보를 복구 할 수 없습니다.)`,
        okTitle: "확인",
        cancelTitle: "취소",
        okRes: function() {
          // _vm.$store.dispatch("setAction", _vm.$store.getters.CONSTANTS.actions.DELETE);
          _vm.removeRule();
        }
      });
    },
    async removeRule() {
      const _vm = this;

      await api_dataDqiRule({ tableName: this.tableName }).then((response) => {
        // 테스트 backend API에서 return해주는 success값으로,
        // 추후에 실 API에서 return 해주는 값으로 변경해서 처리해야함.
        if (response.result === "SUCCESS") {
          setTimeout(function() {
            _vm.EventBus.$emit("modalAlert", {
              title: "알림",
              text: "삭제되었습니다.",
              okTitle: "확인",
              okRes: function() {
                // viewRule로 이동시키지 않고, vuex의 데이터를 삭제한 후에 화면을 다시 그리는 방안으로 해야함.
                // 같은 url을 router를 통해서 다시 실행하게 되면, 에러가 발생하기 때문.
                // _vm.$router.push({name: 'viewRule'})
              }
            });
          }, 500);
        } else {
          _vm.EventBus.$emit("modalAlert", {
            title: "경고",
            text: "삭제되지 않았습니다. <br>잠시 후 다시 시도해 주세요.",
            okTitle: "확인"
          });
        }
      });
    }
  },

  name: "ruleButtons",

  computed: {
    tableName() {
      return this.$store.getters.tableName;
    }
  }
};
</script>

<style></style>
