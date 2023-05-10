<template>
  <div class="echart" ref="chartDom"></div>
</template>
<script setup>
import {
  ref,
  inject,
  onMounted,
  onBeforeUnmount,
  defineProps,
  watch,
} from "vue";
const echarts = inject("$echarts");
const chartDom = ref();
let myChart = null;
const props = defineProps({
  options: Object,
});
const resizeHandler = () => {
  myChart.resize();
};
const debounce = (fun, delay) => {
  let timer;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fun();
    }, delay);
  };
};
const cancalDebounce = debounce(resizeHandler, 500);
onMounted(() => {
  myChart = echarts.init(chartDom.value, null, { renderer: "svg" });
  // myChart = echarts.init(chartDom.value)
  myChart.setOption(props.options, true);
  window.addEventListener("resize", cancalDebounce);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", cancalDebounce);
  myChart.dispose();
});
watch(
  () => props.options,
  () => {
    myChart.setOption(props.options, true);
  },
  { deep: true }
);
</script>
