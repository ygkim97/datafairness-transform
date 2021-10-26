// API function 
import {
    api_dataDqi, api_dataDqi_temp,
} from "@/apis/results.js";

// Data Type 정의
const state = {
    mode : null,
    rules : [
        {columns : "STATUS", rule : "STATS"}
    ]

}
// 동기 처리
const mutations = {
    // auto
    // rule
    setMode(state, mode) {
        state.mode = mode;
    },
}

const getters = {
    mode: state => state.mode,
    ruleModeParam : (state, _, rootState) => {
        return {
            "mode" : state.mode,
            "table_name" : rootState.tableName.tableName
        }
    }
}
// 비동기 처리
const actions = {
    setTableName({ commit }, {tableName}) {
        commit('setTableName', { tableName: tableName });
    },
    setMode({ commit }, mode) {
        commit('setMode', mode);
    }
}

export default {
    state,
    mutations,
    getters,
    actions
}