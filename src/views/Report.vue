<template>
  <div class="rp">
    <Chart :options="chart1.chartOptions" :series="chart1.series"></Chart>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
const CSVToJSON = require("csvtojson");
import path from "path";

const progressFile = (name) =>
  `${path.join(process.cwd(), `/resources/yoloface/output/${name}.csv`)}`;
export default {
  name: "Report",
  components: {
    Chart: VueApexCharts,
  },
  mounted() {
    console.log(this.$route.params.name);
    CSVToJSON()
      .fromFile(progressFile(this.$route.params.name))
      .then((rd) => {
        this.reportData = rd;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  computed: {
    chart1() {
      let [lb, pt, sp, ce] = [[], [], [], []];
      this.reportData.forEach((item) => {
        lb.push(parseInt(item["field1"]));
        pt.push(
          (
            (parseInt(item["positive"]) /
              (parseInt(item["positive"]) + parseInt(item["negative"]))) *
            100
          ).toFixed(0)
        );
        sp.push(
          (
            (parseInt(item["sleepy"]) /
              (parseInt(item["sleepy"]) + parseInt(item["alert"]))) *
            100
          ).toFixed(0)
        );
        ce.push(
          (
            (parseInt(item["closed"]) /
              (parseInt(item["closed"]) + parseInt(item["open"]))) *
            100
          ).toFixed(0)
        );
      });
      let series = [
        {
          name: "正反馈",
          data: pt,
        },
        {
          name: "困倦比例",
          data: sp,
        },
        {
          name: "闭眼比例",
          data: ce,
        },
      ];
      let chartOptions = {
        chart: {
          type: "area",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        title: {
          text: "趋势",
        },
        subtitle: {
          text: "不同时间点里的数据趋势",
        },
        labels: lb,
        xaxis: {
          labels: {
            show: false,
          },
        },
      };
      return { series, chartOptions };
    },
  },
  data: () => ({
    reportData: [],
  }),
};
</script>

<style scoped>
@media (max-width: 600px) {
  .rp {
    padding-bottom: calc(env(safe-area-inset-bottom) + 56px);
  }
}
</style>
