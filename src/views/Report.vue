<template>
  <div class="rp">
    <Chart :options="chart1.chartOptions" :series="chart1.series"></Chart>
    <Chart :options="chart2.chartOptions" :series="chart2.series"></Chart>
    <v-dialog transition="dialog-bottom-transition" max-width="600">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          large
          dark
          bottom
          right
          fixed
          class="rp"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-share</v-icon>
        </v-btn>
      </template>
      <template v-slot:default="dialog">
        <v-card>
          <v-toolbar color="primary" dark>分享报告</v-toolbar>
          <v-card-text>
            <vue-qrcode :value="shareUrl" class="qr" />
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="dialog.value = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
const CSVToJSON = require("csvtojson");
import path from "path";
const fs = require("fs");
import VueQrcode from "vue-qrcode";

const getCSV = (name) =>
  `${path.join(process.cwd(), `/resources/yoloface/outputs/${name}.csv`)}`;
const getJSON = (name) =>
  `${path.join(process.cwd(), `/resources/yoloface/outputs/${name}.json`)}`;
export default {
  name: "Report",
  components: {
    Chart: VueApexCharts,
    VueQrcode,
  },
  mounted() {
    CSVToJSON()
      .fromFile(getCSV(this.$route.params.name || "qazwsx"))
      .then((rd) => {
        this.reportData = rd;
      });
  },
  computed: {
    shareUrl() {
      let url = `https://cv.blueagle.top/qrcodeReport`;
      url += `?chart1=${encodeURIComponent(
        JSON.stringify(this.chart1.series)
      )}`;
      url += `&chart2=${encodeURIComponent(
        JSON.stringify(this.chart2.series)
      )}`;
      return url;
    },
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
          text: "课堂情绪变化趋势",
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
    chart2() {
      let series = [
        {
          name: "百分比",
          data: [],
        },
      ];
      try {
        const data = fs.readFileSync(
          getJSON(this.$route.params.name || "qazwsx"),
          "utf8"
        );
        series[0].data = [
          parseInt(JSON.parse(data)[0]["a"] * 100),
          parseInt(JSON.parse(data)[0]["b"] * 100),
          parseInt(JSON.parse(data)[0]["c"] * 100),
          parseInt(JSON.parse(data)[0]["d"] * 100),
          parseInt(JSON.parse(data)[0]["e"] * 100),
        ];
      } catch (err) {
        console.error(err);
      }
      let chartOptions = {
        chart: {
          type: "radar",
        },
        title: {
          text: "课堂综合评估",
        },
        xaxis: {
          categories: [
            "两级分化程度",
            "趣味性",
            "学生专注度",
            "难度",
            "活跃度",
          ],
        },
        dataLabels: {
          enabled: true,
          background: {
            enabled: true,
            borderRadius: 2,
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
.qr {
  max-width: 100%;
}
@media (max-width: 600px) {
  .rp {
    margin-bottom: 56px;
  }
}
</style>
