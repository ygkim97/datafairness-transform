// API function
import { api_dataDqiRule, api_dataDqiRule_temp } from "@/apis/rules.js";

// Data Type 정의
const state = {
  selectList: null,
  ruleJson: {
    regex: [],
    regex_set: [],
    bin_regex_set: [],
    unique_regex_set: [],
    range: []
  },
  ruleDataSet: {
    regex: { name: null, expression: null },
    regex_set: { name: null, regex_name: null },
    bin_regex_set: { set_name: null },
    unique_regex_set: { set_name: null },
    range: { name: null, min: null, max: null }
  },
  ruleSample: {
    regex: {
      columnKey: "name",
      dataSet: {
        name: {
          // column option
          align: "left",
          width: 200,
          // editor option
          editorUse: false,
          type: "text"
        },
        expression: {
          align: "left",
          editorUse: true,
          type: "text"
        }
      }
    },
    regex_set: {
      columnKey: "name",
      dataSet: {
        name: {
          align: "left",
          width: 200,
          editorUse: false,
          type: "text"
        },
        regex_name: {
          align: "left",
          editorUse: true,
          type: "select",
          dependOn: "regex.name"
        }
      }
    },
    bin_regex_set: {
      columnKey: "set_name",
      dataSet: {
        set_name: {
          editorUse: false,
          type: "select",
          dependOn: "regex_set.name" // select 구성 기준값
        }
      }
    },
    unique_regex_set: {
      columnKey: "set_name",
      dataSet: {
        set_name: {
          editorUse: false,
          type: "select",
          dependOn: "regex_set.name" // select 구성 기준값
        }
      }
    },
    range: {
      columnKey: "name",
      dataSet: {
        name: {
          editorUse: false,
          type: "text"
        },
        min: {
          editorUse: false,
          type: "number"
        },
        max: {
          editorUse: false,
          type: "number"
        }
      }
    }
  }
};
// 동기 처리
const mutations = {
  setRuleJson(state, param) {
    state.ruleJson = param;
  },
  addEmptyRow(state, param) {
    // rule dataSet에 값이 들어가버리기 때문에, deep copy를 해준다.
    const emptyRow = JSON.parse(JSON.stringify(state.ruleDataSet[param.key]));
    state.ruleJson[param.key].push(emptyRow);
  },
  deleteRow(state, param) {
    // 삭제하려는 rule이 다른 properties에 연결되어있는 경우, 값을 변경해주어야 함.
    console.log(param);

    state.ruleJson[param.key].splice(Number(param.keyParam.rowIdx), 1);
  },
  changeRow(state, param) {
    // API 서버에서 Validation을 모두 체크해주기 때문에, 여기서는 그냥 변경 처리만 한다.
    state.ruleJson[param.key][param.rowIdx][param.columnName] = param.value;
  },

  // 각 rule grid component에서 사용하는 editor 컬럼값을 여기서 만들어준다.
  async getJsonRules(state) {
    let env = process.env.VUE_APP_REST_SERVER_URL;
    try {
      // Local Test 서버와 테스트 서버 일때, 코드 분리
      let response = null;

      if (env.indexOf("localhost") < 0) {
        response = await api_dataDqiRule({
          action: this.getters.CONSTANTS.actions.DISPLAY
        });
      } else {
        response = await api_dataDqiRule_temp({
          action: this.getters.CONSTANTS.actions.DISPLAY
        });
      }

      if (
        response !== undefined &&
        Object.prototype.hasOwnProperty.call(response, "rules")
      ) {
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
    state.ruleJson.regex.forEach((r) => {
      arr.push({ text: r.name, value: r.name });
    });
    newSelectList.regex = {};
    newSelectList.regex.name = arr;

    arr = [];
    state.ruleJson.regex_set.forEach((r) => {
      arr.push({ text: r.name, value: r.name });
    });
    newSelectList.regex_set = {};
    newSelectList.regex_set.name = arr;

    state.selectList = newSelectList;
  }
};

const getters = {
  ruleJson: (state) => {
    return JSON.parse(JSON.stringify(state.ruleJson));
  },
  ruleSample: (state) => {
    return JSON.parse(JSON.stringify(state.ruleSample));
  },
  ruleDataSet: (state) => {
    return JSON.parse(JSON.stringify(state.ruleDataSet));
  },
  ruleParam: (state) => {
    state.ruleJson.action = state.action;
    return state.ruleJson;
  },
  selectList: (state) => {
    return state.selectList;
  }
};
// 비동기 처리
const actions = {
  addEmptyRow({ commit }, param) {
    commit("addEmptyRow", param);
  },
  deleteRow({ commit }, param) {
    commit("deleteRow", param);
  },
  changeRow({ commit }, param) {
    commit("changeRow", param);
  }
};

export default {
  state,
  mutations,
  getters,
  actions
};
