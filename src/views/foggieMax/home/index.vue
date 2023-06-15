<template>
  <div class="top-between" v-if="haveNet">
    <MyAssets :currentOODItem="currentOODItem.data"></MyAssets>
    <DashBoard
      :currentOODItem="currentOODItem.data"
      :spaceTotal="spaceTotal"
      :spaceUseRate="spaceUseRate"
      :spaceUseSize="spaceUseSize"
    ></DashBoard>
  </div>
  <FileComponent :orderId="deviceData.order_id" @getUseSize="getUseSize">
    <!-- <MyFiles
      v-model:checkedData="checkedData"
      :currentOODItem="currentOODItem.data"
      :orderId="deviceData.order_id"
      @getUseSize="getUseSize"
    ></MyFiles> -->
  </FileComponent>
</template>

<script>
import FileComponent from "@/components/fileComponent";
import MyAssets from "./_modules/myAssets/myAssets";
import DashBoard from "./_modules/myAssets/dashBoard";
import MyFiles from "./_modules/myFiles";
import { getActivationVood, getSummary } from "@/utils/api.js";
import {
  ref,
  reactive,
  onMounted,
  computed,
  provide,
  toRefs,
  inject,
} from "vue";
import { useStore } from "vuex";
export default {
  name: "Layout",
  props: {
    haveNet: {
      type: Boolean,
      default: false,
    },
    deviceData: {
      type: Object,
      default: {},
    },
  },
  components: {
    MyAssets,
    DashBoard,
    MyFiles,
    FileComponent,
  },
  setup(props) {
    const { haveNet, deviceData } = toRefs(props);
    const spaceTotal = ref(0);
    const spaceUseRate = ref(0);
    const spaceUseSize = ref(0);
    const store = useStore();
    const currentOODItem = ref({
      data: {
        device_id: "",
      },
    });
    // const checkedData = ref([]);
    const tokenMap = computed(() => store.getters.tokenMap);
    provide("currentOODItem", currentOODItem);
    spaceTotal.value = +deviceData.value.total_disk_size;

    const getUseSize = () => {
      getSummary(
        deviceData.value,
        tokenMap.value[deviceData.value.device_id]
      ).then((res) => {
        spaceUseSize.value = +(
          +res.contents[0]?.total /
          1024 /
          1024 /
          1024
        ).toFixed(2);
        spaceUseRate.value = +(
          +res.contents[0]?.total /
          1024 /
          1024 /
          1024 /
          spaceTotal.value
        ).toFixed(4);
      });
    };
    const requestTarget = inject("requestTarget");
    const initFoggieDate = async () => {
      // get is have net

      let data = {
        pn: 1,
        ps: 50,
      };
      let oodData = await getActivationVood(data, requestTarget);
      currentOODItem.value.data = oodData.result;
    };
    onMounted(() => {
      initFoggieDate();
      getUseSize();
    });
    return {
      currentOODItem,
      haveNet,
      spaceUseRate,
      spaceTotal,
      spaceUseSize,
      // checkedData,
      getUseSize,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 1200px;
  padding: 0 40px;
  margin: 0 auto;
  box-sizing: border-box;
  main {
    z-index: 1;
  }
}
.top-between {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}
</style>
