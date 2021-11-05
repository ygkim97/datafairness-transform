<template>
  <v-card-actions class="custom-card-wrapper">
      <pre>{{response}}</pre>
  </v-card-actions>
</template>

<script>
import { api_getAFIResponse } from "@/apis/afi.js";

export default {
  name: "set-mitigate",
  props: ["step", "pageKey"],
  components: {
  },
  computed: {
    defaultData() {
      return this.$store.getters.defaultData[this.pageKey];
    },
    afiRowData() {
      return this.$store.getters.afiRowData[this.pageKey];
    }
  },
  created() {
    this.getBeforeData();
    // card1, card2에서 설정한 파라메터를 전송하여, BEFORE 데이터를 조회한다.
  },
  data() {
    return {
        response : null
    };
  },
  methods: {
    async getBeforeData() {
      console.log("data");
      const faiReq = JSON.parse(JSON.stringify(this.$store.getters.afiRowData));
      // get Request Param Data
      const requestData = this.convertFAIData(faiReq, false);

      // console.log(this.$store.getters.afiRowData);

      console.log(JSON.stringify(requestData))
        const _req = {
            "input": {
                "type": "iris",
                "target": "test_data_german"
            },
            "dataset": {
                "label": {
                    "name": "credit",
                    "favorable_classes": [
                        1
                    ]
                },
                "protected_attributes": [
                    {
                        "name": "sex",
                        "privileged_classes": "male"

                    },
                    {
                        "name": "age",
                        "privileged_classes": "eval: x > 25"
                    }
                ],
                "categorical_features": [
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
                "features_to_keep": [],
                "features_to_drop": [
                    "personal_status"
                ],
                "custom_preprocessing": "def custom_preprocessing(df):\n    status_map = {'A91': 'male', 'A93': 'male', 'A94': 'male', 'A92': 'female', 'A95': 'female'}\n    df['sex'] = df['personal_status'].replace(status_map)\n    return df"
            },
            "metric": {
                "privileged_groups": [
                    {
                        "age": 1
                    }
                ],
                "unprivileged_groups": [
                    {
                        "age": 0
                    }
                ],
                "metrics": [
                    "statistical_parity_difference",
                    "disparate_impact"
                ]
            }
        }
        const vm = this;
      await api_getAFIResponse(_req).then((response) => {
        console.log(response);
        vm.response = response;
      });
    }
  }
};
</script>

<style scoped>
div.noty {
  padding: 0 20px;
}
</style>
