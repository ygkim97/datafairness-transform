<template>
  <v-card-actions class="custom-card-wrapper">
    <data-set-metrics compKey="metrics" :params="response"> </data-set-metrics>
    <!--      <pre>{{ response }}</pre>-->
  </v-card-actions>
</template>

<script>
import { api_getAFIResponse } from "@/apis/afi.js";
import afiMixin from "@/mixins/afiMixin.js";

export default {
  name: "compare",
  props: ["params"],
  mixins: [afiMixin],
  components: {
    DataSetMetrics: () => import("../comp/data-set-metrics.vue")
  },
  computed: {},
  created() {
    this.getAfterData();
  },
  data() {
    return {
      response: null
    };
  },
  methods: {
    async getAfterData() {
      const faiReq = JSON.parse(JSON.stringify(this.$store.getters.afiRowData));
      // get Request Param Data
      const requestData = this.convertAFIData(faiReq, true);

      const vm = this;
      await api_getAFIResponse(requestData).then((response) => {
        if (response.result === "SUCCESS") {
          vm.response = response;
        } else {
          vm.EventBus.$emit("modalAlert", {
            title: "경고",
            text:
              "아래의 이유로 데이터 조회에 실패하였습니다. <br><br>" +
              response.reason +
              "<br><br>메시지 확인 후 다시 시도해 주세요. <br>" +
              "이전 페이지로 이동합니다.",
            okTitle: "확인",
            okRes: function() {
              vm.EventBus.$emit("clickStep", 2);
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
/deep/ .comp_wrap {
  padding: 10px;
  border: 1px solid lightblue;
  margin: 0 20px 20px 20px;
}
</style>
