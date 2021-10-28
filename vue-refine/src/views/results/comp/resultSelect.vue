<template>
  <div>
    <v-layout row>
      <v-flex xs5>
        <v-radio-group mandatory v-model="mode" row>
          <template v-for="(radio, idx) in resultMode">
            <v-radio
              :key="'radio_' + idx"
              :label="radio.text"
              :value="radio.mode"
            ></v-radio>
          </template>
        </v-radio-group>
      </v-flex>
      <v-flex align-self-center v-if="mode === `rule`">
        <v-btn elevation="1" small plain @click="setRules">RULE 설정</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex align-self-center>
        <v-btn elevation="1" small plain @click="getResult">RESULT</v-btn>
      </v-flex>
    </v-layout>

    <!--    <v-autocomplete-->
    <!--      dense-->
    <!--      multiple-->
    <!--      persistent-hint-->
    <!--      chips-->
    <!--      small-chips-->
    <!--      v-if="mode === `rule`"-->
    <!--      v-model="selectedRule"-->
    <!--      :items="regexSet"-->
    <!--      item-text="name"-->
    <!--      item-value="regex_name"-->
    <!--      return-object-->
    <!--      required-->
    <!--      hint="Regex Set의 목록에서 선택가능합니다. (0개선택 가능)"-->
    <!--    ></v-autocomplete>-->
  </div>
</template>

<script>
import { api_dataDqi } from "@/apis/results.js";

export default {
  name: "resultSelect",

  computed: {
    resultMode() {
      return this.$store.getters.resultMode;
    },
    regexSet() {
      return this.$store.getters.ruleJson.regex_set;
    },
    ruleNodeParam() {
      return this.$store.getters.ruleModeParam;
    }
  },

  watch: {
    mode(mode) {
      this.$store.commit("setMode", mode);
    }
  },

  created() {
    // this.getRuleData();
  },

  mounted() {},

  data: () => ({
    mode: null,
    selectedRule: []
  }),

  methods: {
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
    setRules() {
      console.log("rules");
    },
    async getResult() {
      // this.$store.commit("setTableName", {
      //   tableName: "DQI_DATA"
      // });

      if (this.mode === this.$store.getters.CONSTANTS.mode.RULE) {
        this.ruleSelected();
      }

      console.log(JSON.stringify(this.ruleNodeParam));
      const vm = this;
      await api_dataDqi(this.ruleNodeParam).then((response) => {
        vm.$store.commit("setResultResponse", response.data_dqi);
      });

      this.setResultResponse();
    },
    // TEST CODE
    setResultResponse(_response) {
      let response = {
        column_name: "STATUS",
        column_type: "NUMBER",
        column_pattern: null,
        named_entity_recoginition: null,
        row_count: 102,
        missing_count: 0,
        pattern: {},
        type: {
          NUMBER: "102 (100%)",
          STRING: "0 (0%)",
          DATETIME: "0 0%)"
        },
        mode_key: {
          key: 0.0,
          count: 102
        },
        column_dqi: {}
      };

      // let typeTag = response.column_type;

      let typeTag = "string";

      if (typeTag === "string") {
        response["number_stat"] = {
          min: 0.0,
          max: 0.0,
          mean: 0.0,
          std: 0.0,
          median: 0.0,
          quartile: {
            "-0.001 ~ 0.00": 102
          }
        };
      } else if (typeTag === "string") {
        response["string_stat"] = {
          "len mean": 3.596849403,
          "len std": 2.29384759,
          "len median": 3.0,
          "len min": {
            key: "김상규",
            len: 3
          },
          "len max": {
            key: "Robert J.Therrien",
            len: 18
          }
        };

        // console.log(response);
      }
      this.$store.commit("setResultResponse", response);
    }
  }
};
</script>
