<template>
  <div>
    <canvas id="chart_bar" :width="chartWidth" height="250"></canvas>
  </div>
</template>

<script>
import { Chart } from "chart.js";

export default {
  name: "chart-bar",
  props: ["params", "resultTemplate"],
  data() {
    return {
      chartObj: null,
      chartWidth: 400,
      datasets: []
    };
  },
  watch: {
    params() {
      this.createDatasets();
      this.setLabels();
      this.chartObj.data.datasets = this.datasets;
      this.chartObj.update();
    }
  },
  created() {
    this.createDatasets();
    this.setLabels();
  },
  mounted() {
    this.setCanvasWidth();

    const me = this;
    this.$nextTick(function() {
      me.createChart();
    });
  },
  methods: {
    setLabels() {
      if (this.chartObj === null) {
        return;
      }
      this.chartObj.data.labels = Object.keys(this.params).map((e) => {
        return this.resultTemplate[e];
      });
    },
    init() {
      this.setCanvasWidth();

      this.createDatasets();
      this.createChart();
    },
    setCanvasWidth() {
      this.chartWidth =
        document.getElementsByClassName("total-wrap")[0].offsetWidth * 0.9;
    },
    createDatasets() {
      this.datasets = [];

      const me = this;
      let obj = {
        data: [],
        borderColor: "#ffb2c1",
        backgroundColor: [
          "#FFAFAF",
          "#B1D0E0",
          "#FFEBCC",
          "#95D1CC",
          "#F6F2D4",
          "#FF9999"
        ],
        barPercentage: 0.7
      };

      Object.keys(this.params).forEach((e) => {
        obj.data.push(Number(me.params[e].replaceAll("%", "")));
      });

      this.datasets.push(obj);
    },
    createChart() {
      let ctx = document.getElementById("chart_bar").getContext("2d");

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
              display: false
            },
            datalabels: {
              formatter: (value) => {
                return `${value}%`;
              }
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return `${tooltipItem.raw}%`;
                }
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
              max: 100,
              min: 0,
              ticks: {
                stepSize: 10
              },
              title: {
                text: "%"
              }
            }
          }
        }
      };

      config.data = {
        labels: Object.keys(this.params),
        datasets: this.datasets
      };
      this.chartObj = new Chart(ctx, config);
    }
  }
};
</script>

<style scoped></style>
