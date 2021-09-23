// Data Type 정의
const state = {
    tableName: null
}
// 동기 처리
const mutations = {
    setTableName(state, { tableName }) {
        state.tableName = tableName;
    }
}
const getters = {
    tableName: state => state.tableName    
}
// 비동기 처리
const actions = {
    setTableName({ commit }, tableName) {
        commit('setTableName', { tableName: tableName });
    }
}

export default {
    state,
    mutations,
    getters,
    actions
}