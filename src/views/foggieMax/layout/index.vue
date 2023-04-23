<template>
  <div class="container">
    <!-- <header>
      <LayoutHeader></LayoutHeader>
    </header> -->
    <main>
      <Access v-if="!accessible" v-model:accessible="accessible"></Access>
      <div v-else>
        <div class="top-title">
          <span @click="isInSetup = false">
            {{ deviceData.device_name }}
          </span>
          <svg-icon icon-class="setup" class="setup" @click="toSet"></svg-icon>
        </div>
        <MaxHome v-if="!isInSetup" :haveNet="haveNet"></MaxHome>
        <Setting v-else></Setting>
      </div>
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
import Setting from "../setting";
import { useStore } from "vuex";
// import mainVue from './views/main/main.vue'
import {
  shareLink,
  pIN,
  getActivationVood,
  detected_net,
} from "@/utils/api.js";
import { ref, onMounted, reactive, provide, toRefs, inject } from "vue";
export default {
  name: "FoggieMax",
  components: {
    MaxHome,
    Access,
    Setting,
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

    return {
      currentOODItem,
      haveNet,
      accessible,
      deviceData,
      isInSetup,
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
    margin: 20px 0;
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
