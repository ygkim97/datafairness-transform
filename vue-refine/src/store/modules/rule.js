// API function 
import {
    // api_getRuleInfo,
    api_getRuleInfo_temp
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
    changeRows(state, param) {
        // dependOn의 컬럼 값이 변경 되면, row의 값을 변경해준다.
        state.ruleJson[param.key].forEach((obj) => {
            console.log(obj)
        })
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
    ruleParam: state => {
        state.ruleJson.action = state.action;
        return state.ruleJson;
    }
}
// 비동기 처리
const actions = {
    setTableName({ commit }, tableName) {
        commit('setTableName', { tableName: tableName });
    },
    setAction({ commit }, action) {
        commit('setAction', action);
    },
    async getJsonRules({commit}, tableName) {
        try {
            // action값을 Display로 설정해준다.
            commit('setAction', this.getters.CONSTANTS.actions.DISPLAY);
            // API 서버에서 Rule Data를 호출해서 vuex에 저장한다.
            const response = await api_getRuleInfo_temp({tableName:tableName});

            if (response !== undefined && Object.prototype.hasOwnProperty.call(response, 'rules')) {
                commit("setRuleJson", response.rules);
            }
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
    changeRows({ commit }, param) {
        commit('changeRows', param);
    },
}

export default {
    state,
    mutations,
    getters,
    actions
}