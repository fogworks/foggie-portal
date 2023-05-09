<template>
  <div class="card-box">
    <div class="flex justify-between">
      <div class="flex items-center">
        <!-- <img class="title-img" src="@/assets/dashboard.png" alt="" /> -->
        <svg-icon icon-class="dashboard" class="title-img"></svg-icon>
        <div class="title">Space</div>
      </div>
    </div>
    <div class="flex justify-around">
      <div class="dashboard-item">
        <!-- <div class="dashboard-name">Space Usage</div> -->
        <div class="chart-box">
          <div class="chart-value-title">
            <div class="chart-value">{{ spaceAvailable }} GB</div>
            <div>Available</div>
          </div>
          <MyEcharts
            style="width: 180px; height: 180px"
            :options="spacePieOption.data"
          ></MyEcharts>
        </div>
        <div class="use-rate">Use Rate: {{ spaceUseRate }}%</div>
        <div class="total">Total space {{ spaceTotal }}GB</div>
      </div>
      <!-- <div class="dashboard-item">
            <div class="dashboard-name">
                Bandwidth Usage
            </div>
            <div class="chart-box">
                <div class="chart-value-title">
                    <div class="chart-value">{{bandwidthAvailable}} GB</div>
                    <div>Available</div>
                </div>
                <MyEcharts style="width: 180px;height: 180px;" :options="bandwidthOption"></MyEcharts>
            </div>
            <div class="use-rate">
                Use Rate: {{bandwidthUseRate}}%
            </div>
            <div class="total">
                Total bandwidth this month  {{bandwidthTotal}} GB
            </div>
        </div> -->
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, toRefs, watch, inject } from "vue";
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
  },
  setup(props, { emit }) {
    const deviceData = inject("deviceData");
    const { currentOODItem } = toRefs(props);
    const spaceAvailable = ref(0);

    const spaceUseRate = ref(0);
    const spaceTotal = ref(0);
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
      currentOODItem.value = newVal;
      const device_id = currentOODItem.value.device_id;

      spaceAvailable.value = currentOODItem.value.total_disk_size;
      spaceTotal.value = currentOODItem.value.total_disk_size < 50 ? 50 : 100;
      let item = {
        size: 10,
        field_value: '{"gt":"now-1w"}',
        miner_ids: device_id,
        metrics_type: "vood",
        date: "1h",
      };
      let data = await oodMonitor(item);
      let _data = data && data.value && data.value[device_id];
      if (_data) {
        let usageNum =
          _data.used_disk_space[_data.used_disk_space.length - 1].value;
        spaceUseRate.value = (
          (usageNum * 100) /
          1024 /
          1024 /
          spaceTotal.value
        ).toFixed(2);
        let pipData = JSON.parse(JSON.stringify(pieOption));
        pipData.series[0].data = [
          { value: (spaceUseRate.value / 100).toFixed(4) },
          { value: 1 - (spaceUseRate.value / 100).toFixed(4) },
        ];
        spacePieOption.data = pipData;
      }
    };
    watch(
      currentOODItem,
      (data) => {
        initDashboaard(data);
      },
      {
        immediate: true,
        deep: true,
      }
    );
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
        top: 65px;
        left: 60px;
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
