<template>
  <div class="app-window" id="app-window">
    <template v-if="!isDiscover" v-for="item in totalActiveDevice.data">
      <div :class="['app-left', `app-${item.device_id}`]" v-if="item.device_id">
        <FoggieMax :deviceData="item"></FoggieMax>
      </div>
    </template>
    <FoggieMax v-else :deviceData="discoverData.data"></FoggieMax>
    <div class="app-right" v-loading="loading" v-if="!isDiscover">
      <DeviceList
        @clickItem="clickItem"
        @cancelItem="cancelItem"
        :totalActiveDevice="totalActiveDevice"
      ></DeviceList>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  ref,
  reactive,
  onMounted,
  onActivated,
  provide,
  nextTick,
  getCurrentInstance,
} from "vue";
import { useStore } from "vuex";
import FoggieMax from "@/views/foggieMax/layout";
import DeviceList from "./deviceList";
import { search_foggie } from "@/utils/api";
import { useRoute } from "vue-router";
const store = useStore();
const route = useRoute();
const { proxy } = getCurrentInstance();
const email = computed(() => store.getters["token/currentUser"]);
const loading = ref(false);
const search = () => {
  loading.value = true;
  search_foggie({ email: email.value })
    .then((res) => {
      console.log(res, "res");
      store.dispatch("global/setDeviceList", res.data);
      loading.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
};
let totalActiveDevice = reactive({
  data: [],
});
const scrollIntoView = (data) => {
  const app = document.getElementById("app-window");
  const target = app.getElementsByClassName(`app-${data.device_id}`)[0];
  console.dir(app, "appppppppppp");
  console.dir(target, "targettarget");
  app.scrollTo(0, target.offsetTop);
};
const clickItem = (data) => {
  console.log("clickItem");
  let target = totalActiveDevice.data.find(
    (el) => el.device_id === data.device_id
  );
  if (target) {
    scrollIntoView(data);
  } else {
    if (totalActiveDevice.data.length < 4) {
      totalActiveDevice.data.push(data);
      nextTick(() => {
        scrollIntoView(data);
      });
    } else {
      proxy.$notify({
        type: "info",
        message: "Up to four windows can be opened simultaneously",
        position: "bottom-left",
      });
    }
  }
};
const cancelItem = (data) => {
  console.log("cancelItem");
  let target = totalActiveDevice.data.find(
    (el) => el.device_id === data.device_id
  );
  if (target) {
    totalActiveDevice.data = totalActiveDevice.data.filter(
      (el) => el.device_id !== data.device_id
    );
  }
};
const isDiscover = ref(false);
const discoverData = reactive({
  data: {},
});
const init = () => {
  if (route.params.isDiscover && route.params.device_id) {
    // totalActiveDevice.data.push(route.params);
    discoverData.data = route.params;
    isDiscover.value = true;
  } else {
    isDiscover.value = false;
    search();
    if (totalActiveDevice.data.length < 4 && route.params.device_id) {
      totalActiveDevice.data.push(route.params);
    }
  }
};
onActivated(() => {
  init();
});
onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped>
.app-window {
  position: relative;
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
  // display: flex;
  // justify-content: space-between;
  .app-left {
    overflow-y: auto;
    box-sizing: border-box;
    min-width: 1280px;
    height: 100%;
    padding: 30px;
    background: var(--bg-color);
    margin-right: 300px;
    border-radius: 20px;
    & + .app-left {
      margin-top: 40px;
    }
  }
  .app-right {
    // overflow-x: visible;
    // overflow-y: auto;
    box-sizing: border-box;
    height: calc(100% - 60px);
    width: 240px;
    // padding: 0 10px;
    // float: right;
    position: fixed;
    top: 30px;
    right: 20px;
    :deep {
      .el-loading-mask {
        background-color: transparent;
      }
    }
  }
}
</style>
