<template>
  <div v-if="params !== null">
    <v-card
      v-for="(pa, i) in params.protected_attributes"
      :key="'pa_card_' + i"
      class="mb-12"
    >
      <v-toolbar color="blue-grey darken-2" dark height="40" flat
        >{{ defaultData.text + ": " + pa }}
      </v-toolbar>
      <div class="comp_wrap mt-10 mb-4 mx-6">
        <div class="text-h6">
          Privileged Group:
        </div>
        <div>
          <span class="key"
            >{{ Object.keys(params.privileged_groups[0])[0] }}:
          </span>
          <span class="value"
            >{{ Object.values(params.privileged_groups[0])[0] }}:
          </span>
        </div>

        <v-divider></v-divider>
        <div class="text-h6">
          Unprivileged Group:
        </div>

        <div>
          <span class="key"
            >{{ Object.keys(params.unprivileged_groups[0])[0] }}:
          </span>
          <span class="value"
            >{{ Object.values(params.unprivileged_groups[0])[0] }}:
          </span>
        </div>

        <v-divider v-if="params.mitigation !== null"></v-divider>
        <div class="text-h6 mitigation-wrap" v-if="params.mitigation !== null">
          <span class="key">
            Mitigation:
          </span>
          <span class="value">{{ params.mitigation }}</span>
        </div>
        <v-divider></v-divider>
        <div class="w">
          <div class="text-h6">
            Metrics
          </div>
          <div class="chart-body-wrap">
            <div class="btn-wrap">
              <v-btn
                color="blue-grey lighten-1"
                class="float-right mr-7 float-right"
                dark
                x-small
                @click="chartChange"
                >{{
                  chartBtnText + (chartType === "BAR" ? "LINE" : "BAR")
                }}</v-btn
              >
            </div>
            <data-set-chart
              :params="params.metrics"
              :stepKey="stepKey"
              :chartType="chartType"
            ></data-set-chart>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "data-set-metrics",
  props: ["compKey", "params", "stepKey"],
  computed: {
    defaultData() {
      return this.$store.getters.defaultData[this.compKey];
    }
  },
  components: {
    DataSetChart: () => import("./data-set-chart.vue")
  },
  methods: {
    chartChange() {
      if (this.chartType === "BAR") {
        this.chartType = "LINE";
      } else {
        this.chartType = "BAR";
      }
    }
  },
  data() {
    return {
      chartType: "BAR",
      chartBtnText: "chart view : "
    };
  }
};
</script>

<style scoped>
.comp_wrap {
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 20px;
}
.v-divider {
  margin: 20px 0;
}
.comp_wrap > div:last-child {
  margin-bottom: 0;
}
span.key {
  font-weight: 700;
}
.mitigation-wrap {
  margin-top: 20px;
}
.btn-wrap {
  height: 30px;
}
</style>
