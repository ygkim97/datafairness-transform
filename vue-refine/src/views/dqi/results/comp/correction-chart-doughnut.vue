<template>
  <div>
    <div class="d-flex justify-center py-4">
      <h3>{{chartType.toUpperCase()}}</h3>
    </div>
    <div class="d-flex justify-center">
      <div class="doughnut-wrap d-flex justify-center pt-10">
        <canvas :id="'chart_doughnut_'+ chartType" width="200" height="300" class="d-flex"></canvas>
        <div class="donut-inner">
          <span>{{ strTemplate[dataIndex] }}</span>
          <h3>{{ correctionData }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from "chart.js";

export default {
  props: ["chartType", "correctionData", "dataIndex"],
    data() {
      return{
        chartObj: null,
        datasets: [],
        index: this.dataIndex,
      }
    },
    methods: {
      setLabels() {
        let labels = [];
        if(this.dataIndex === "missing_rate"){
          labels = ["null", "not null"];
        } else {
          labels = [this.dataIndex, this.dataIndex.replaceAll("miss", "")];
        }
        return labels;
      },
      createDatasets() {
        this.datasets = [];

        let obj = {
          data: [],
          backgroundColor: [
            "#F5A0A0",
            "#577B91"
          ]
        };
        const dataNum = Number(this.correctionData.replaceAll("%", ""));
        obj.data.push(dataNum);
        obj.data.push(100-dataNum);

        this.datasets.push(obj);
      }
      ,
      createChart() {
        let ctx = document.getElementById(`chart_doughnut_${this.chartType}`).getContext("2d");

        let config = {
          type: "doughnut",
          options: {
            responsive: false,
            plugins: {
              legend: {
                display: true,
                position: "bottom"
              },
              title: {
                display: false,
                position: "bottom",
                text: "Doughnut Chart"
              },
              datalabels: {
                display: false,
                backgroundColor: "white" ,
                formatter: (value) => {
                  return `${value}%`;
                }
              },
              tooltip: {
                callbacks: {
                  label: function(tooltipItem) {
                    return `${tooltipItem.label} : ${tooltipItem.raw}%`
                  }
                }
              }
            }
          },
        }

        config.data = {
          labels: this.setLabels(),
          datasets: this.datasets
        };

        this.chartObj = new Chart(ctx, config);
      }     
    },
    mounted() {
      const me =this;
      this.$nextTick(() => {
        me.createChart();
      });
    },
    created() {
      this.setLabels();
    },
    watch: {
      correctionData() {
        this.createDatasets();
        this.chartObj.data.labels = this.setLabels();
        this.chartObj.data.datasets = this.datasets;
        this.chartObj.update();
      }
    },
    computed: {
      strTemplate() {
        return this.$store.getters.CONSTANTS.result_str;
      }
    }
}
</script>

<style scoped>
.doughnut-wrap {
  position: relative;
  width: 330px;
  height: 350px;
  border: solid lightgrey 1px;
}
.donut-inner {
  position: absolute;
  top: 43.5%;
  left: 35%;
  text-align: center;
  font-weight: bold;
  width: 100px;
  height: 50px;
}
</style>