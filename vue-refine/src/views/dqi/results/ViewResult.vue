<template>
  <div>
    <v-layout>
      <v-flex xs11>
        <v-tabs v-model="tab" color="blue-grey darken-4" class="mx-3">
          <v-tabs-slider color="blue-grey darken-4"></v-tabs-slider>
          <v-tab
            :disabled="!isAvailableTab(idx)"
            v-for="(mode, idx) in resultMode"
            :key="'mode_' + idx"
            class="font-weight-bold"
          >
            {{ mode.text }}
          </v-tab>
        </v-tabs>
      </v-flex>
      <v-flex v-if="showBtn" class="button-wrap">
        <v-btn
          color="blue-grey lighten-1"
          dark
          class="float-right"
          small
          @click="gotoRouter('viewCorrection')"
        >
        보정
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout class="custom-result-body mt-0">
      <v-flex>
        <template v-if="tab > 0">
          <rule-select-body v-bind:regexSet="regexSet"></rule-select-body>
        </template>
        <result-body
          v-bind:resultBody="resultRuleParam"
          @getResult="getResult"
          v-bind:mode="this.mode"
        ></result-body>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { api_dataDqi } from "@/apis/results.js";

export default {
  name: "resultSelect",

  components: {
    ResultBody: () => import("./comp/result-body.vue"),
    RuleSelectBody: () => import("./comp/set-result-rules.vue")
  },

  computed: {
    resultMode() {
      return this.$store.getters.resultMode;
    },
    regexSet() {
      const regexSet = this.$store.getters.ruleJson.regex_set.map((rs) => {
        return { key: rs.name, value: rs.name };
      });
      const statsTag = this.$store.getters.CONSTANTS.resultDefault;
      return [{ key: `${statsTag} [Defaults]`, value: statsTag }].concat(
        regexSet
      );
    },
    ruleModeParam() {
      return this.$store.getters.ruleModeParam;
    },
    resultRuleParam() {
      return this.$store.getters.resultRuleParam;
    }
  },

  watch: {
    mode(mode) {
      this.$store.commit("setMode", mode);
    },
    tab(tabVal) {
      this.mode = this.resultMode[tabVal].mode;
    }
  },

  created() {
    this.$store.commit("resetData");

    // 초기값 설정
    this.mode = this.$store.getters.CONSTANTS.mode.AUTO;
  },

  mounted() {},

  data: () => ({
    tab: -1,
    useTab2: false,
    expandRule: false,
    mode: null,
    selectedRule: [],
    showBtn : false
  }),

  methods: {
    gotoRouter(val) {
      this.$router.push({ name: val }).catch(() => {});
    },
    isAvailableTab(idx) {
      if (idx === 0) {
        // tab1은 데이터 조회 여부와 상관 없이 클릭 가능하다.
        return true;
      } else {
        // tab2는 데이터 조회가 완료된 후에 클릭 할 수 있다.
        return this.useTab2;
      }
    },
    getRuleData() {
      // TEST CODE
      this.$store.commit("setTableName", {
        tableName: "DQI_COMPANY"
      });

      // Table Name 기반으로 Rule 정보를 조회한다.
      // 동기로 조회
      this.$store.commit("getJsonRules");
    },
    ruleSelected() {
      // selectbox에서 선택한 값들을 필터링 하여, array로 구성한다.
      const resultParams = this.selectedRule.map((rule) => {
        return { column: rule.name, rule: rule.regex_name };
      });
      // 필터링한 array를 vuex에 저장한다.
      this.$store.commit("setResultRules", resultParams);
    },
    async getResult() {
      if (this.mode === this.$store.getters.CONSTANTS.mode.RULE) {
        this.ruleSelected();
      }

      // console.log(this.ruleModeParam)

      const vm = this;
      await api_dataDqi(this.ruleModeParam).then((response) => {
        vm.useTab2 = true;

        if (response.data_dqi === null) {
          // 데이터 조회를 하지 못한 경우
          vm.EventBus.$emit("modalAlert", {
            title: "경고",
            text: "데이터 조회를 하지 못했습니다. 잠시후 다시 시도해 주세요",
            okTitle: "확인"
          });
        } else {
          vm.$store.dispatch("setResultResponse", {
            response: response.data_dqi,
            mode: vm.mode
          });
          this.showBtn = true;
        }
      });
    }
  }
};
</script>

<style scoped>
.custom-result-body {
  border: 1px solid lightgray;
  margin: 10px;
  padding: 20px;
  min-height: 100px;
}
.button-wrap{
  padding: 10px;
}
</style>
