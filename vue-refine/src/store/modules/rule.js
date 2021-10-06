// API function 
import {
    api_getRuleInfo
} from "@/apis/rules.js";

// Data Type 정의
const state = {
    tableName: null,
    action : null,
    ruleJson : {
        regex : [],
        regex_set: [],
        bin_regex_set: [],
        unique_regex_set: [],
        range : []
    },
    ruleDataSet : {
        regex: { name: null, expression: null },
        regex_set: { name: null, regex_name: null },
        bin_regex_set: { set_name: null},
        unique_regex_set: { set_name: null},
        range: { name: null, min: null , max: null},
    },
    ruleSample: {
        regex: {
            columnKey: 'name',
            dataSet: {
                name: {
                    // column option
                    align : 'left',
                    width : 300,

                    // editor option
                    editorUse: true,
                    type: 'text',
                },
                expression: {
                    align: 'left',
                    editorUse: true,
                    type: 'text',
                }
            }
        },
        regex_set: {
            columnKey: 'name',
            dataSet: {
                name: {
                    align: 'left',
                    width: 300,
                    editorUse: true,
                    type: 'text',
                },
                regex_name: {
                    align: 'left',
                    editorUse: true,
                    type: 'checkbox',
                    dependOn : 'regex.name',
                }
            }
        },
        bin_regex_set: {
            columnKey: 'set_name',
            dataSet: {
                set_name: {
                    editorUse: false,
                    type: 'select',
                    dependOn: 'regex.name', // select 구성 기준값
                }
            }
        },
        unique_regex_set: {
            columnKey: 'set_name',
            dataSet: {
                set_name: {
                    editorUse: false,
                    type: 'select',
                    dependOn: 'regex.name', // select 구성 기준값
                }
            }
        },
        range: {
            columnKey: 'name',
            dataSet: {
                name: {
                    editorUse: false,
                    type: 'text',
                },
                min: {
                    editorUse: false,
                    type: 'number',
                },
                max: {
                    editorUse: false,
                    type: 'number',
                }
            }
        }
    }    
}
// 동기 처리
const mutations = {
    setTableName(state, { tableName }) {
        state.tableName = tableName;
    }, 
    // param : Object Array
    setAction(state, action) {
        state.action = action;
    },
    setRuleJson(state, param) {
        state.ruleJson = param;
    },
    addEmptyRow(state, param) {
        // rule dataSet에 값이 들어가버리기 때문에, deep copy를 해준다.
        const emptyRow = JSON.parse(JSON.stringify(state.ruleDataSet[param.key]));
        state.ruleJson[param.key].push(emptyRow);
    },
    deleteRow(state, param) {
        state.ruleJson[param.key].splice(Number(param.keyParam.rowIdx), 1)
    },
    changeRow(state, param) {
        state.ruleJson[param.key][param.rowIdx][param.columnName] = param.value
    },
}
const getters = {
    action: state => state.action,
    ruleJson: state => {
        return JSON.parse(JSON.stringify(state.ruleJson));
    },
    ruleSample: state => {
        return JSON.parse(JSON.stringify(state.ruleSample));        
    },
    ruleDataSet: state => {
        return JSON.parse(JSON.stringify(state.ruleDataSet));
    },
    
}
// 비동기 처리
const actions = {
    setTableName({ commit }, tableName) {
        commit('setTableName', { tableName: tableName });
    },
    setAction({ commit }, action) {
        // if (action === this.getters.CONSTANTS.actions.DISPLAY) {
        //     console.log('DISPLAY');
        // } else if (action === this.getters.CONSTANTS.actions.CREATE) {
        //     console.log('CREATE');
        //     this.setAction_Create({ commit });
        // } else if (action === this.getters.CONSTANTS.actions.DELETE) {
        //     console.log('DELETE')
        //     this.setAction_Delete({ commit });
        // } 
        commit('setAction', action);
    },
    // setAction_Create() {

    // },
    // setAction_Delete() {

    // },
    async getJsonRules({commit}, tableName) {
        try {
            // tableName은 고정이기 때문에 param에 추가하지 않는다.
            // API 서버에서 Rule Data를 호출해서 vuex에 저장한다.
            const response = await api_getRuleInfo({
                "action": "display"
            });
            
            // localStorage에 저장하고 있는 데이터를 리셋해준다.
            localStorage.vuex = null;
            if (response !== undefined && Object.prototype.hasOwnProperty.call(response, 'rules')) {
                commit("setRuleJson", response.rules);
            }
            // return response;
        } catch(error) {
            console.log(error);
        }
    },
    addEmptyRow({ commit }, param) {
        commit('addEmptyRow', param);
    },
    deleteRow({ commit }, param) {
        commit('deleteRow', param);
    },
    changeRow({ commit }, param) {
        commit('changeRow', param);
    },
}

export default {
    state,
    mutations,
    getters,
    actions
}