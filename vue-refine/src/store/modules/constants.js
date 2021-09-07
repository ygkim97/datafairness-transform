const state = {
    constants : {
        TABLE_NAME : null
    }
    // constants: Object.freeze({
    //     TABLE_NAME : null
    // })
}
const mutations = {
    setTableName(state, tableName) {
        console.log(tableName);
        state.constants.TABLE_NAME = tableName;
    }
}
const getters = {
    CONSTANTS: state => {
        return state.constants;
    }
}
const actions = {
}

export default {
    state,
    mutations,
    getters,
    actions
}