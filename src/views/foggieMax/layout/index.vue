<template>
  <div class="container" v-loading="loading">
    <Access
      v-if="!accessible"
      v-model:accessible="accessible"
      @accessCallback="accessCallback"
    ></Access>
    <template v-else>
      <Welcome v-if="!hasReady" :haveNet="haveNet"></Welcome>
      <div v-else>
        <div class="top-title">
          <span @click="isInSetup = false">
            {{ deviceData.device_name }}
          </span>
          <svg-icon icon-class="setup" class="setup" @click="toSet"></svg-icon>
        </div>
        <MaxHome
          v-if="!isInSetup"
          :haveNet="haveNet"
          :deviceData="deviceData"
        ></MaxHome>
        <Setting v-else></Setting>
      </div>
    </template>
  </div>
</template>

<script>
import MaxHome from "../home";
import Access from "./access";
import Welcome from "../welcome";
import Setting from "../setting";
import { useStore } from "vuex";
import { sync_device } from "@/api/order/orderList";
import { get_service_info, detected_net } from "@/utils/api.js";
import {
  ref,
  onMounted,
  reactive,
  watch,
  provide,
  toRefs,
  inject,
  readonly,
} from "vue";
export default {
  name: "FoggieMax",
  components: {
    MaxHome,
    Access,
    Setting,
    Welcome,
  },
  props: {
    deviceData: {
      type: Object,
      default: {},
    },
  },

  setup(props) {
    const deviceData = reactive(props.deviceData);

    provide("deviceData", deviceData);
    provide("requestTarget", deviceData);

    const accessible = ref(false);
    const loading = ref(false);
    const currentOODItem = ref({
      data: {
        device_id: "",
      },
    });

    const haveNet = ref(false);
    const hasReady = ref(false);
    const isInSetup = ref(false);
    const initFoggieDate = async () => {
      // if (!deviceData.device_type) {
      //   accessible.value = true;
      //   hasReady.value = true;
      //   haveNet.value = true;
      //   return;
      // }
      loading.value = true;
      detected_net(deviceData).then((res) => {
        if (res.result.detected_net) {
          haveNet.value = true;
        } else {
          haveNet.value = false;
        }
        loading.value = false;
      });
      // let data = {
      //   pn: 1,
      //   ps: 50,
      // };
      // let oodData = await getActivationVood(data);
      // currentOODItem.value.data = oodData.result;
      // if (oodData && oodData.data && oodData.data.length > 0) {
      //   currentOODItem.value.data = oodData.data[0];
      // }
    };
    onMounted(() => {
      initFoggieDate();
    });
    const toSet = () => {
      isInSetup.value = !isInSetup.value;
    };
    const getServiceInfo = () => {
      loading.value = true;
      get_service_info(deviceData)
        .then(async ({ result }) => {
          if (haveNet.value) {
            if (
              result.cbs_state === "finish" &&
              result.ipfs_state === "finish" &&
              result.cyfs_state === "finish"
            ) {
              hasReady.value = true;
            }
          } else {
            if (
              result.cbs_state === "finish" &&
              result.ipfs_state === "finish"
            ) {
              hasReady.value = true;
            }
          }
          accessible.value = true;
        })
        .catch(() => {})
        .finally(() => {
          loading.value = false;
        });
    };
    const accessCallback = () => {
      getServiceInfo();
    };
    const reset = () => {
      hasReady.value = false;
      isInSetup.value = false;
    };
    const goHome = () => {
      hasReady.value = true;
      isInSetup.value = false;
    };
    provide("reset", reset);
    provide("goHome", goHome);

    return {
      loading,
      currentOODItem,
      haveNet,
      accessible,
      deviceData,
      isInSetup,
      hasReady,
      toSet,
      accessCallback,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 1120px;
  // padding: 0 40px;
  min-height: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  z-index: 1;

  :deep {
    .el-loading-mask {
      background: transparent;
    }

    .access-box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .top-title {
    display: flex;
    justify-content: space-between;
    // margin: 20px 0;
    height: 60px;
    font-size: 30px;
    text-align: left;
    font-weight: 700;
    text-align: left;

    span {
      background: linear-gradient(to right, #3913b8 0%, #75e0e6 100%);
      background-clip: text;
      text-fill-color: transparent;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      cursor: pointer;
    }

    .setup {
      color: #29abff;
      cursor: pointer;
      transition: all 0.5s;

      &:hover {
        transform: rotate(90deg);
      }
    }
  }
}

.top-between {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}
</style>
