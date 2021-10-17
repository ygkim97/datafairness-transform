// API function 
import {
    api_dataDqiRule, api_dataDqiRule_temp,
} from "@/apis/rules.js";

// Data Type 정의
const state = {
    tableName: null,
    action : null,
    selectList : {},
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

    // 각 rule grid component에서 사용하는 editor 컬럼값을 여기서 만들어준다.
    async getJsonRules(state, param) {
        let env = process.env.VUE_APP_REST_SERVER_URL;
        try {
            // action값을 Display로 설정해준다.
            this.commit('setAction', this.getters.CONSTANTS.actions.DISPLAY);
            // Local Test 서버와 테스트 서버 일때, 코드 분리
            let response = null;

            if (env.indexOf("localhost") < 0) {
                response = await api_dataDqiRule();
            } else {
                response = await api_dataDqiRule_temp();
            }
            if (response !== undefined && Object.prototype.hasOwnProperty.call(response, 'rules')) {
                this.commit("setRuleJson", response.rules);
                this.commit("setSelectList");
            }
        } catch (error) {
            console.log(error);
        }
    },
    setSelectList(state, param) {
        let newSelectList = {};

        /**
         * state의 ruleJson의 regex의 데이터를 가지고
         *
         */
        let arr = [];
        state.ruleJson.regex.forEach( r => {
            arr.push({ text: r.name, value: r.name});
        })
        newSelectList.regex = {};
        newSelectList.regex.name = arr;

        arr = [];
        state.ruleJson.regex_set.forEach( r => {
            arr.push({ text: r.name, value: r.name});
        })
        newSelectList.regex_set = {};
        newSelectList.regex_set.name = arr;

        state.selectList = newSelectList;
    }
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
    },
    selectList : state => {
        return state.selectList;
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