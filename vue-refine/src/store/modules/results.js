// API function
import { api_dataDqi } from "@/apis/results.js";

// Data Type 정의
const state = {
  mode: null,
  // radio 구성 데이터
  resultMode: [
    {
      mode: "auto",
      text: "자동 지표 측정"
    },
    {
      mode: "rule",
      text: "Rule 기반 지표 측정"
    }
  ],

  // rule array
  resultRuleParam: [],
  // rule default obj
  // defaultRules: [{ column: "STATUS", rule: "STATS" }],

  resultResponse: {
    auto: {
      column_stats: [],
      table_dqi: {}
    },
    rule: {
      column_stats: [],
      table_dqi: {}
    }
  },
  columnList: []
};
// 동기 처리
const mutations = {
  // auto
  // rule
  setMode(state, mode) {
    state.mode = mode;
  },
  setResultRules(state, param) {
    state.rules = param;
  },
  setResultResponse(state, param) {
    state.resultResponse[param.mode] = param.response;
  },
  async getColumnName() {
    const response = await api_dataDqi({
      mode: this.getters.CONSTANTS.mode.GET_COLUMN,
      table_name: this.getters.tableName
    });

    this.commit("setColumnList", response.column_name);
  },
  setColumnList(state, param) {
    state.columnList = param;
  },
  setResultRuleParam(state, param) {
    state.resultRuleParam = param.map((e) => {
      return { column: e.column, rule: e.rule };
    });
  },
  resetData(state) {
    state.resultRuleParam = [];
    state.resultResponse = {
      auto: {
        column_stats: [],
        table_dqi: {}
      },
      rule: {
        column_stats: [],
        table_dqi: {}
      }
    };
  }
};

const getters = {
  mode: (state) => state.mode,
  resultMode: (state) => state.resultMode,
  ruleModeParam: (state, _, rootState) => {
    let returnParam = {
      mode: state.mode,
      table_name: rootState.tableName.tableName
    };

    if (state.mode === rootState.CONSTANTS.constants.mode.RULE) {
      const selectedRules = state.resultRuleParam.map((r) => r.column);

      // 결과조회 타입이 "rule"일 경우, rules object도 포함해줘야함.
      // columnList를 체크하면서 grid에서 설정되지 않은 rule은, 기본값을 셋팅해준다.
      state.columnList.forEach((c) => {
        if (selectedRules.indexOf(c) < 0) {
          state.resultRuleParam.push({ column: c, rule: "STATS" });
        }
      });
      returnParam["rules"] = state.resultRuleParam;
    }
    return returnParam;
  },
  resultResponse: (state) => state.resultResponse,
  columnList: (state) => state.columnList,
  resultRuleParam: (state) => state.resultRuleParam
};
// 비동기 처리
const actions = {
  setTableName({ commit }, { tableName }) {
    commit("setTableName", { tableName: tableName });
  },
  setMode({ commit }, mode) {
    commit("setMode", mode);
  },
  setResultRules({ commit }, param) {
    commit("setResultRules", param);
  },
  setResultResponse({ commit }, param) {
    commit("setResultResponse", param);
  }
};

export default {
  state,
  mutations,
  getters,
  actions
};
