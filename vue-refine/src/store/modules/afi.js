// API function
// import { api_dataDqi } from "@/apis/results.js";

// Data Type 정의
const state = {
  // card 컴포넌트를 구성하는데 필요한 데이터
  stepper: [
    {
      key: "data-set",
      text: "Dataset",
      title: "1. Dataset",
      subtitle: "",
      params: {}
    },
    {
      key: "check-metrics",
      text: "Bias Metric",
      title: "2. Bias Metric",
      params: {}
    },
    {
      key: "set-mitigate",
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
            dataType: "label"
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
            dataType: "label"
          },
          privileged_class: {
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
        text: "features to keep (optional)",
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
    }
  },
  afiRowData: {
    dataset: {
      label: {
        name: "credit",
        favorable_classes: [1]
      },
      protected_attributes: [
        {
          name: "name",
          privileged_class: "male"
        },
        {
          name: "age",
          privileged_class: "eval: x > 25"
        }
      ],
      categorical_features: [
        "status",
        "credit_history",
        "purpose",
        "savings",
        "employment",
        "other_debtors",
        "property",
        "installment_plans",
        "housing",
        "skill_level",
        "telephone",
        "foreign_worker"
      ],
      features_to_keep: [],
      features_to_drop: ["personal_status"],
      custom_preprocessing:
        "def custom_preprocessing(df):" +
        "status_map = {'A91': 'male', 'A93': 'male', 'A94': 'male', 'A92': 'female', 'A95': 'female'}" +
        "df['sex'] = df['personal_status'].replace(status_map) " +
        "return df"
    }
  }
};
// 동기 처리
const mutations = {
  setAfiRowData(state, param) {
    console.log(param);
    state.afiRowData[param.key] = param.data;
  }
};

const getters = {
  stepper: (state) => state.stepper,
  fairnessRequest: (state) => {
    return {};
  },
  defaultData: (state) => state.defaultData,
  afiRowData: (state) => state.afiRowData
};
// 비동기 처리
const actions = {};

export default {
  state,
  mutations,
  getters,
  actions
};
