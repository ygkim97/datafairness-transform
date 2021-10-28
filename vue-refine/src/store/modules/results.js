// API function
import { api_dataDqi } from "@/apis/results.js";

// Data Type 정의
const state = {
  mode: null,
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
  rules: [],
  defaultRules: [{ columns: "STATUS", rule: "STATS" }],
  resultResponse: null,
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
    state.resultResponse = param;
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
      // 결과조회 타입이 "rule"일 경우, rules object도 포함해줘야함.
      returnParam["rules"] =
        state.rules.length > 1 ? state.rules : state.defaultRules;
    }
    return returnParam;
  },
  resultResponse: (state) => state.resultResponse,
  columnList: (state) => state.columnList
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
