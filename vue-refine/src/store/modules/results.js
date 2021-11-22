// Data Type 정의
const state = {
  STATS: "STATS",
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
  setResultRuleParam(state, param) {
    state.resultRuleParam = param;
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
      returnParam["rules"] = state.resultRuleParam;
    }
    return returnParam;
  },
  resultResponse: (state) => state.resultResponse,
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
  },
  setResultRuleParam({ commit }, param) {
    commit("setResultRuleParam", param);
  }
};

export default {
  state,
  mutations,
  getters,
  actions
};
