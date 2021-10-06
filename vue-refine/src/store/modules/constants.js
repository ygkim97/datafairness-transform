const state = {
    constants: Object.freeze({
        compList: [
            'regex', 
            'regex_set', 
            'bin_regex_set', 
            'unique_regex_set', 
            'range'
        ],
        actions : {
            CREATE : 'create',
            DELETE : 'delete',
            DISPLAY : 'display'
        },
        result : {
            SUCCESS : 'success',
            FAIL : 'fail'
        },
        gridNoData : '데이터가 없습니다.'
    })
}
const mutations = {
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