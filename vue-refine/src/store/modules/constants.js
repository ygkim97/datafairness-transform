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
        popupType : {
            CREATE : 'create',
            EDIT : 'edit'
        },
        inputType : {
            SELECT : 'select',
            TEXT : 'text',
            NUMBER : 'number'
        },
        mode : {
            AUTO : 'auto',
            RULE : 'rule'
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