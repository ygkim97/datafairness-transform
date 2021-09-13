const state = {
    TABLE_NAME: null
}
const mutations = {
    setTableName(state, { tableName }) {
        state.TABLE_NAME = tableName;
    }
}
const getters = {
    TABLE_NAME: state => {
        return state.TABLE_NAME
    }
    // CONSTANTS: state => {
    //     return state.constants;
    // }
}
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