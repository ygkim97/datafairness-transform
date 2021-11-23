// Data Type 정의
const state = {
  labelColumnList: [],
  // card 컴포넌트를 구성하는데 필요한 데이터
  stepper: [
    {
      key: "dataset",
      text: "Dataset",
      title: "1. Dataset",
      subtitle: "",
      params: {}
    },
    {
      key: "metric",
      text: "Bias Metric",
      title: "2. Bias Metric",
      params: {}
    },
    {
      key: "metrics",
      text: "Bias Metrics",
      title: "3. Bias Metrics, Mitigate",
      params: {}
    },
    {
      key: "compare",
      text: "compare data",
      title: "4. Compare original vs.mitigated results.",
      params: {}
    }
  ],

  defaultData: {
    dataset: {
      title: "DataSet",
      label: {
        text: "Label",
        dataType: "object", // api required data type
        params: {
          name: {
            text: "Name",
            desc: "Name of the label column in table",
            dataType: "array"
          },
          favorable_classes: {
            text: "favorable Classes",
            desc: "Label values which are considered favorable",
            dataType: "stringArray"
          }
        }
      },
      protected_attributes: {
        text: "Protected attributes",
        dataType: "array",
        params: {
          name: {
            text: "Name",
            desc: "Name of the protected attribute column in table",
            dataType: "array"
          },
          privileged_classes: {
            text: "privileged classes",
            desc:
              "value which is considered privileged or a boolean function which return `True` if privileged for the corresponding column in `protected_attribute`",
            dataType: "text"
          }
        }
      },
      categorical_features: {
        text: "categorical features (optional)",
        desc:
          "column names in the DataFrame which are to be expanded into one-hot vectors",
        dataType: "stringArray"
      },
      features_to_keep: {
        text: "features to keep (optional)",
        desc:
          "Column names to keep. All others are dropped except those present in `protected_attribute_names`, `categorical_features`, `label_name`",
        dataType: "stringArray"
      },
      features_to_drop: {
        text: "features to drop (optional)",
        desc:
          "Column names to drop. *Note: this overrides* `features_to_keep`.",
        dataType: "stringArray"
      },
      custom_preprocessing: {
        text: "custom preprocessing (optional)",
        desc:
          "Python function object which acts on and returns a DataFrame \n" +
          "(f: DataFrame -> DataFrame)\n" +
          "Function name must be `custom_preprocessing`",
        dataType: "textarea"
      }
    },
    metric: {
      title: "Bias Metric",
      privileged_groups: {
        text: "Privileged Groups",
        desc:
          "Each element describes a single group. (must be disjoint)\n" +
          "See examples for more details.\n" +
          "    example)\n" +
          "    * privileged groups\n" +
          "        - element1: name=sex, value=1        name=age, value=0\n" +
          "    * unprivileged groups\n" +
          "        - element2: name=sex, value=1        name=age, value=1\n" +
          "        - element3: name=sex, value=0",
        dataType: "array",
        params: {
          name: {
            text: "Name",
            desc: "name in `protected attributes`",
            dataType: "array"
          },
          value: {
            text: "Value",
            desc:
              "value in `protected_attributes`\n" +
              "(value: `privileged class` is 1 the other is 0)",
            dataType: "text"
          }
        }
      },
      unprivileged_groups: {
        text: "Unprivileged Groups",
        desc: "Same format as `privileged groups`",
        dataType: "array",
        params: {
          name: {
            text: "Name",
            desc: "name in `protected attributes`",
            dataType: "array"
          },
          value: {
            text: "Value",
            desc:
              "value in `protected_attributes`\n" +
              "(value: `privileged class` is 1 the other is 0)",
            dataType: "text"
          }
        }
      },
      metrics: {
        text: "Metrics",
        dataType: "grid",
        params: {
          statistical_parity_difference: {
            text: "Statistical Parity Difference",
            desc:
                "Computed as the difference of the rate of favorable outcomes received by the unprivileged group to the privileged group.\n" +
                "The ideal value of this metric is 0.\n" +
                "Fairness for this metric is between -0.1 and 0.1.",
            dataType: "checkbox"
          },
          disparate_impact: {
            text: "Disparate Impact",
            desc:
                "Computed as the ratio of rate of favorable outcome for the unprivileged group to that of the privileged group.\n" +
                "The ideal value of this metric is 1.0 A value < 1 implies higher benefit for the privileged group and a value >1 implies a higher benefit for the unprivileged group.\n" +
                "Fairness for this metric is between 0.8 and 1.25",
            dataType: "checkbox"
          }
        }
      },
    },
    metrics : {
      text : 'Protected Attribute',
      desc : ''
    },
    mitigate: {
      text: "Mitigate",
      subText: "Reweighing",
      desc:
        "Reweighing is a preprocessing technique that Weights the examples in each (group, label) combination differently to ensure fairness before classification.\n"
    }
  },
  afiRowData: {
    // table 데이터 셋팅해줘야함.
    input: {
      type: "iris",
      target: null
    },
    dataset: {
      label: {
        name: "credit",
        // array 형식으로 바꿔줘야함.
        favorable_classes: "1"
      },
      protected_attributes: [
        {
          name: "credit",
          privileged_classes: "1"
        },
        {
          name: "age",
          privileged_classes: "eval: x > 25"
        }
      ],
      // array 형식으로 바꿔줘야함.
      categorical_features:
        "status,credit_history,purpose,savings,employment,other_debtors,property,installment_plans,housing,skill_level,telephone,foreign_worker",
      // array 동일
      features_to_keep: "",
      // arry 동일
      features_to_drop: "personal_status",
      custom_preprocessing:
        "def custom_preprocessing(df):\n" +
        "    status_map = {'A91': 'male', 'A93': 'male', 'A94': 'male', 'A92': 'female', 'A95': 'female'}\n" +
        "    df['sex'] = df['personal_status'].replace(status_map)\n" +
        "    return df"
    },
    metric: {
      // name:value 형식으로 convert 해줘야함.
      privileged_groups: [
        {
          name: "age",
          value: 1
        }
      ],
      unprivileged_groups: [
        {
          name: "age",
          value: 0
        }
      ],
      metrics: {
        // array 형식으로 배꿔좌야함.
        statistical_parity_difference: true,
        disparate_impact: true
      }
    },
    mitigate: {
      algorithmList: {
        list: ["reweighing"],
        label: "algorithm",
        value: "reweighing"
      },
      algorithm: "reweighing"
    }
  }
};
// 동기 처리
const mutations = {
  setAfiRowData(state, param) {
    state.afiRowData[param.key] = param.data;
  },
  setColumnList(state, param) {
    state.labelColumnList= param;
  }
};

const getters = {
  stepper: (state) => state.stepper,
  defaultData: (state) => state.defaultData,
  afiRowData: (state, _, rootState) => {
    state.afiRowData.input.target = rootState.tableName.tableName;
    return state.afiRowData;
  },
  labelColumnList: (state) => state.labelColumnList
};
// 비동기 처리
const actions = {};

export default {
  state,
  mutations,
  getters,
  actions
};
