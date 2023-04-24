<template>
  <div class="container">
    <!-- <header>
      <LayoutHeader></LayoutHeader>
    </header> -->
    <main>
      <Access v-if="!accessible" v-model:accessible="accessible"></Access>
      <template v-else>
        <Welcome v-if="!hasReady"></Welcome>
        <div v-else>
          <div class="top-title">
            <span @click="isInSetup = false">
              {{ deviceData.device_name }}
            </span>
            <svg-icon
              icon-class="setup"
              class="setup"
              @click="toSet"
            ></svg-icon>
          </div>
          <MaxHome v-show="!isInSetup" :haveNet="haveNet"></MaxHome>
          <Setting v-show="isInSetup"></Setting>
        </div>
      </template>
    </main>
    <!-- <footer>
      <LayoutFooter></LayoutFooter>
    </footer> -->
  </div>
</template>

<script>
// import LayoutHeader from "./layoutHeader";
// import LayoutFooter from "./layoutFooter";
import MaxHome from "../home";
import Access from "./access";
import Welcome from "../welcome";
import Setting from "../setting";
import { useStore } from "vuex";
// import mainVue from './views/main/main.vue'
import {
  shareLink,
  pIN,
  getActivationVood,
  get_service_info,
  detected_net,
} from "@/utils/api.js";
import { ref, onMounted, reactive, watch, provide, toRefs, inject } from "vue";
export default {
  name: "FoggieMax",
  components: {
    MaxHome,
    Access,
    Setting,
    Welcome,
    // LayoutHeader,
    // LayoutFooter,
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
    const store = useStore();
    const accessible = ref(false);
    const currentOODItem = ref({
      data: {
        device_id: "",
      },
    });

    const haveNet = ref(false);
    const hasReady = ref(false);
    const isInSetup = ref(false);
    const initFoggieDate = async () => {
      detected_net().then((res) => {
        if (res.result.detected_net) {
          haveNet.value = true;
        } else {
          haveNet.value = true;
        }
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
    const loading = ref(false);
    const getServiceInfo = () => {
      loading.value = true;
      get_service_info()
        .then(async ({ result }) => {
          if (haveNet.value) {
            // 有外网
            if (
              result.cbs_state === "finish" &&
              result.ipfs_state === "finish" &&
              result.cyfs_state === "finish"
            ) {
              hasReady.value = true;
              return true;
            }
          } else {
            // 无外网
            if (
              result.cbs_state === "finish" &&
              result.ipfs_state === "finish"
            ) {
              hasReady.value = true;
              return true;
            }
          }
        })
        .catch(() => {})
        .finally(() => {
          loading.value = false;
        });
    };
    watch(
      accessible,
      (val) => {
        if (val) {
          getServiceInfo();
        }
      },
      {
        immediate: true,
      }
    );
    const reset = () => {
      hasReady.value = false;
      isInSetup.value = false;
      console.log("reset!!!!!!!!!!!!!");
    };
    const goHome = () => {
      hasReady.value = true;
      isInSetup.value = false;

      console.log("gothome!!!!!!!!!!!!!");
    };
    provide("reset", reset);
    provide("goHome", goHome);

    return {
      currentOODItem,
      haveNet,
      accessible,
      deviceData,
      isInSetup,
      hasReady,
      toSet,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 1200px;
  padding: 0 40px;
  margin: 0 auto;
  box-sizing: border-box;
  main {
    z-index: 1;
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
