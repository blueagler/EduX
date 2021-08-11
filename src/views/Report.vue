<template>
  <div>
    <Chart :options="options" :series="series" type="donut" width="380"></Chart>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  name: "Report",
  components: {
    Chart: VueApexCharts,
  },
  data: () => ({
    options: {},
    series: [44, 55, 41, 17, 15],
  }),
};
</script>

<style scoped></style>
