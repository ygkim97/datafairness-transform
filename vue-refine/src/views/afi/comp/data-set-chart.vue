<template>
  <!-- 추후에 chart로 변경-->
  <div class="metrics-wrap">
    <div class="metrics-body">
      <template v-for="(_, i) in Object.keys(chartData.datasets)">
        <canvas
          v-show="chartType === 'BAR'"
          :key="'chart_bar_' + i"
          :id="'chart_bar_' + i"
          :width="chartWidth"
          height="200"
        ></canvas>
        <canvas
          v-show="chartType === 'LINE'"
          :key="'chart_line_' + i"
          :id="'chart_line_' + i"
          :width="chartWidth"
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
  props: ["params", "stepKey", "chartType"],
  computed: {},
  watch: {},
  data() {
    return {
      chartWidth: 400,
      colors: ["#ffb2c1", "#a0d0f5"],
      chartData: {
        keys: [],
        datasets: {
          bar: [],
          line: []
        },
        lineLabels: ["before"]
      },
      vueChart: null
    };
  },
  created() {
    if (this.stepKey === "compare") {
      this.chartData.lineLabels.push("after");
    }
    this.convertChartData_bar();
    this.convertChartData_line();
  },
  mounted() {
    this.setCanvasWidth();

    const me = this;
    this.$nextTick(function() {
      Object.keys(me.chartData.datasets).forEach((key, i) => {
        me.createChart(i);
      });
    });
  },
  methods: {
    setCanvasWidth() {
      const totalWidth = document.getElementsByClassName("metrics-body")[0].offsetWidth;
      const chartCnt = this.chartData.keys.length;
      this.chartWidth = (totalWidth / chartCnt) * 0.9;
    },
    getToFixed(type, key, no) {
      let fixedNo =
        type === "before"
          ? this.params.before[key].toFixed(no)
          : this.params.after[key].toFixed(no);
      return Number(fixedNo) === 0 ? 0 : fixedNo;
    },
    convertChartData_bar() {
      // bar, line 둘다 datasets을 만들어줘야함.
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
        me.chartData.datasets.bar[e] = datasetArr;
        datasetArr = [];
      });
    },
    convertChartData_line() {
      // bar, line 둘다 datasets을 만들어줘야함.

      let datasetArr = [];
      let barPercentage = this.stepKey === "compare" ? 0.8 : 0.4;
      const me = this;
      let obj = {};

      Object.keys(this.params.before).forEach((e) => {
        // e = key
        // keys를 BAR chart data 생성할때, 이미 구성해줬기 때문에 여기서는 하지 않는다.
        // me.chartData.keys.push(e);
        obj = {
          data: [me.getToFixed("before", e, 3)],
          borderColor: [me.colors[0]],
          backgroundColor: [me.colors[0]],
          barPercentage: barPercentage,
          type: "line"
        };
        if (me.stepKey === "compare") {
          obj.data.push(me.getToFixed("after", e, 3));
        }
        me.chartData.datasets.line[e] = [obj];
        datasetArr = [];
      });
    },

    createChart(cnt) {
      let key = this.chartData.keys[cnt];
      let chartType = ["bar", "line"];

      chartType.forEach((ct) => {
        let ctx = document
          .getElementById("chart_" + ct + "_" + cnt)
          .getContext("2d");

        let config = {
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
                beginAtZero: true,
                barPercentage: 0.3,
                scaleStartValue: 20,
                display: true
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

        config.data = {
          labels: ct === "bar" ? [key] : this.chartData.lineLabels,
          datasets: this.chartData.datasets[ct][key]
        };
        new Chart(ctx, config);
      });
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
