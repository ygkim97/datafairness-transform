<template>
  <div>
    <v-layout>
      <v-flex xs5>
        <v-tabs v-model="tab" color="blue-grey darken-4" class="mx-3">
          <v-tabs-slider color="blue-grey darken-4"></v-tabs-slider>
          <v-tab v-for="(mode, idx) in resultMode" :key="'mode_' + idx" class="font-weight-bold">
            {{ mode.text }}
          </v-tab>
        </v-tabs>
      </v-flex>
    </v-layout>
    <v-layout class="custom-result-body mt-0">
      <v-flex>
        <template v-if="tab > 0">
          <rule-select-body v-bind:params="getRuleParams()"></rule-select-body>
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
    RuleSelectBody: () => import("./comp/set-result-rule.vue")
  },

  computed: {
    resultMode() {
      return this.$store.getters.resultMode;
    },
    regexSet() {
      return this.$store.getters.ruleJson.regex_set.map((rs) => rs.name);
    },
    ruleNodeParam() {
      return this.$store.getters.ruleModeParam;
    },
    columnList() {
      return this.$store.getters.columnList;
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

    this.$store.commit("getColumnName");

    this.createGrid();
  },

  mounted() {},

  data: () => ({
    tab: -1,
    expandRule: false,
    mode: null,
    selectedRule: [],

    gridProps: {
      columns: [],
      options: {},
      theme: null
    }
  }),

  methods: {
    createGrid() {
      // 데이터 초기값 설정
      this.mode = this.$store.getters.CONSTANTS.mode.AUTO;
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
    getRuleParams() {
      return {
        columnList: this.columnList,
        regexSetNames: this.regexSet
      };
    },
    async getResult() {
      if (this.mode === this.$store.getters.CONSTANTS.mode.RULE) {
        this.ruleSelected();
      }

      const vm = this;
      await api_dataDqi(this.ruleNodeParam).then((response) => {
        vm.$store.dispatch("setResultResponse", {
          response: response.data_dqi,
          mode: vm.mode
        });
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
</style>
