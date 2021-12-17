<template>
  <!-- 추후에 chart로 변경-->
  <div class="metrics-wrap">
    <div class="metrics-body">
      <template v-for="(_, i) in Object.keys(chartData.datasets)">
        <canvas
          :key="'chart_' + i"
          :id="'chart_' + i"
          width="200"
          height="200"
        ></canvas>
      </template>
    </div>
  </div>
</template>

<script>
import { Chart } from "chart.js";

export default {
  name: "data-set-chart",
  props: ["params", "stepKey"],
  computed: {},
  watch: {},
  data() {
    return {
      colors: ["#ffb2c1", "#a0d0f5"],
      chartData: {
        keys: [],
        datasets: []
      },
      vueChart: null
    };
  },
  created() {
    this.convertChartData();
  },
  mounted() {
    const me = this;
    this.$nextTick(function() {
      Object.keys(me.chartData.datasets).forEach((key, i) => {
        me.createChart(i);
      });
    });
  },
  methods: {
    getToFixed(type, key, no) {
      let fixedNo =
        type === "before"
          ? this.params.before[key].toFixed(no)
          : this.params.after[key].toFixed(no);
      return Number(fixedNo) === 0 ? 0 : fixedNo;
    },
    convertChartData() {
      let datasetArr = [];
      let barPercentage = this.stepKey === "compare" ? 0.8 : 0.4;
      const me = this;

      Object.keys(this.params.before).forEach((e) => {
        // e = key
        me.chartData.keys.push(e);

        datasetArr.push({
          label: "before",
          data: [me.getToFixed("before", e, 3)],
          borderColor: [me.colors[0]],
          backgroundColor: [me.colors[0]],
          barPercentage: barPercentage
        });

        if (me.stepKey === "compare") {
          datasetArr.push({
            label: "after",
            data: [me.getToFixed("after", e, 3)],
            borderColor: [me.colors[1]],
            backgroundColor: [me.colors[1]],
            barPercentage: barPercentage
          });
        }
        me.chartData.datasets[e] = datasetArr;
        datasetArr = [];
      });
    },

    createChart(cnt) {
      let key = this.chartData.keys[cnt];

      let ctx = document.getElementById("chart_" + cnt).getContext("2d");
      let opts = {
        type: "bar",
        options: {
          responsive: false,
          plugins: {
            legend: {
              display: false,
              position: "top"
            },
            title: {
              display: true,
              position: "bottom",
              text: key,
              padding: 30,
              fullSize: true,
              font: {
                size: 15
              }
            }
          },
          scales: {
            x: {
              display: false
            },
            y: {
              max: 1,
              min: -1,
              ticks: {
                stepSize: 0.5
              }
            }
          }
        }
      };
      opts.data = {
        labels: [key],
        datasets: this.chartData.datasets[key]
      };
      new Chart(ctx, opts);
    }
  }
};
</script>

<style scoped>
.metrics-wrap {
  padding: 10px;
}
.metrics-body {
  display: flex;
}
.metrics-body canvas {
  margin: auto;
}
</style>
