<template>
  <div class="card-box">
    <div class="flex justify-between">
      <div class="flex items-center">
        <svg-icon icon-class="dashboard" class="title-img"></svg-icon>
        <div class="title">Space</div>
      </div>
    </div>
    <div class="flex justify-around">
      <div class="dashboard-item">
        <div class="chart-box">
          <div class="chart-value-title">
            <div class="chart-value">{{ spaceAvailable }} GB</div>
            <div>Available</div>
          </div>
          <MyEcharts
            style="width: 220px; height: 220px"
            :options="spacePieOption.data"
          ></MyEcharts>
        </div>
        <div class="use-rate">
          Use Rate: {{ (spaceUseRate * 100).toFixed(2) || 0 }}%
        </div>
        <div class="total">Total space {{ spaceTotal || 0 }}GB</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ref,
  reactive,
  onMounted,
  toRefs,
  watch,
  inject,
  watchEffect,
} from "vue";
import MyEcharts from "@/components/echarts/myEcharts";
import { oodMonitor } from "@/utils/api.js";
import { pieOption } from "@/components/echarts/util";
export default {
  name: "DashBoard",
  components: { MyEcharts },
  props: {
    currentOODItem: {
      type: Object,
      default: false,
    },
    spaceUseRate: {
      type: Number,
      default: 0,
    },
    spaceTotal: {
      type: Number,
      default: 0,
    },
    spaceUseSize: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const deviceData = inject("deviceData");
    const { currentOODItem, spaceUseRate, spaceTotal, spaceUseSize } =
      toRefs(props);
    const spaceAvailable = ref(0);
    const bandwidthAvailable = ref(0);
    const bandwidthUseRate = ref(0);
    const bandwidthTotal = ref(0);
    // const spacePieOption = reactive({});
    const spacePieOption = reactive({
      data: JSON.parse(JSON.stringify(pieOption)),
    });
    //   spacePieOption.series[0].label.formatter=[`{value|${spaceAvailable.value}GB}`,'{title|Available}'].join('\n')
    const bandwidthOption = reactive(JSON.parse(JSON.stringify(pieOption)));
    //   bandwidthOption.series[0].label.formatter=[`{value|${bandwidthAvailable.value}GB}`,'{title|Available}'].join('\n')

    const initDashboaard = async (newVal) => {
      spaceAvailable.value =
        (+spaceTotal.value - +spaceUseSize.value).toFixed(2) || 0;
      let pipData = JSON.parse(JSON.stringify(pieOption));
      pipData.series[0].data = [
        { value: +spaceUseRate.value.toFixed(4) || 0 },
        { value: 1 - (+spaceUseRate.value).toFixed(4) || 1 },
      ];
      spacePieOption.data = pipData;
      // }
    };
    watchEffect(() => {
      initDashboaard();
    });
    return {
      spaceAvailable,
      spaceUseRate,
      spaceTotal,
      bandwidthAvailable,
      bandwidthUseRate,
      bandwidthTotal,
      spacePieOption,
      bandwidthOption,
      initDashboaard,
    };
  },
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}
.justify-around {
  justify-content: space-around;
}
.items-center {
  align-items: center;
}

.card-box {
  min-width: 380px;
  display: flex;
  flex-direction: column;
  height: 350px;

  color: #000;

  @include card-box;
  background: var(--bg-color);

  .title {
    font-size: 30px;
  }

  .title-img {
    font-size: 30px;
    color: var(--text-color);
    margin-right: 10px;
    object-fit: contain;
  }
  .dashboard-item {
    align-items: center;
    justify-content: center;
    text-align: center;
    .dashboard-name {
      margin-top: 5px;
      margin-bottom: 5px;
      font-size: 24px;
      font-weight: 700;
    }
    .chart-box {
      position: relative;
      display: flex;
      justify-content: center;
      .chart-value-title {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        div {
          color: var(--text-color-777);
          font-size: 16px;
        }
        .chart-value {
          font-size: 24px;
          color: var(--text-color);
          font-weight: 700;
        }
      }
    }
    .use-rate {
      margin-top: 5px;
      font-size: 18px;
      font-weight: 700;
    }
    .total {
      margin-top: 5px;
      color: var(--text-color-777);
      font-size: 14px;
    }
  }
}
</style>
