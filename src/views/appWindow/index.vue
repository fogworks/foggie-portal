<template>
  <div class="app-window" id="app-window">
    <!-- <div class="app-left-box"> -->
    <template
      v-if="!isDiscover"
      v-for="item in totalActiveDevice.data"
      :key="item.device_id || item.space_order_id"
    >
      <div
        :class="[
          'app-left',
          `app-${item.device_id || item.space_order_id}`,
          isCollapse ? 'left-collapse' : '',
        ]"
      >
        <FoggieMax
          :deviceData="item"
          v-if="item.device_type === 'foggie_max' || !item.device_type"
        ></FoggieMax>
        <FoggieClient :deviceData="item" v-else></FoggieClient>
      </div>
    </template>
    <div class="app-left left-collapse" v-else>
      <FoggieMax :deviceData="discoverData"></FoggieMax>
    </div>
    <!-- </div> -->

    <div
      :class="['app-right', isCollapse ? 'right-collapse' : '']"
      v-loading="loading"
      v-if="!isDiscover"
    >
      <div
        :class="['collapse', isCollapse ? 'isCollapse' : '']"
        @click="changeCollapse"
      >
        <svg-icon
          icon-class="collapse"
          :class="[isCollapse ? 'isCollapse' : '']"
        ></svg-icon>
      </div>
      <DeviceList
        @clickItem="clickItem"
        @cancelItem="cancelItem"
        :deviceData="deviceData"
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
import FoggieClient from "@/views/Alltemplate/Alltemplate";
import DeviceList from "./deviceList";
import { search_foggie } from "@/utils/api";
import { sync_device } from "@/api/order/orderList";
import { useRoute } from "vue-router";
const store = useStore();
const route = useRoute();
const { proxy } = getCurrentInstance();
const email = computed(() => store.getters["token/currentUser"]);
const loading = ref(false);
const isCollapse = ref(false);
const deviceData = reactive({
  data: {},
});
const discoverData = computed(() => store.getters["global/discoverData"]);
const search = () => {
  loading.value = true;
  search_foggie({ email: email.value })
    .then((res) => {
      let cur_data = res.data;
      cur_data.forEach((r) => {
        if (r.device_type === "space") {
          r.expire = r.expire.slice(0, r.expire.length - 3);
        }
      });
      store.dispatch("global/setDeviceList", cur_data);
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
  const target = app.getElementsByClassName(
    `app-${data.device_id || data.space_order_id}`
  )[0];
  app.scrollTo(0, target?.offsetTop);
};
const clickItem = (data) => {
  if (!data.is_active && data.device_type !== "space") {
    proxy.$notify({
      type: "info",
      message: "This device is offline",
      position: "bottom-left",
    });
    return false;
  }
  let target = totalActiveDevice.data.find(
    (el) =>
      (el.device_id && el.device_id === data.device_id) ||
      (el.space_order_id && el.space_order_id === data.space_order_id)
  );
  if (target) {
    scrollIntoView(data);
    deviceData.data = data;
  } else {
    if (totalActiveDevice.data.length < 4) {
      totalActiveDevice.data.push(data);
      deviceData.data = data;
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
  if (
    data.device_type === "foggie" ||
    data.device_type === "foggie_max" ||
    !data.device_type
  ) {
    // TODO
    syncDevice(data);
  }
};
const syncDevice = async (data) => {
  let d = {
    email: email.value,
    deviceId: data.device_id,
  };
  await sync_device(d)
    .then(() => {})
    .catch(() => {
      // syncDevice(data);
    });
};
const uploadFileList = computed(() => store.getters.uploadFileList);
const cancelItem = (data) => {
  let target = totalActiveDevice.data.find(
    (el) =>
      (el.device_id && el.device_id === data.device_id) ||
      (el.space_order_id && el.space_order_id === data.space_order_id)
  );
  let targetIndex = totalActiveDevice.data.findIndex(
    (el) =>
      (el.device_id && el.device_id === data.device_id) ||
      (el.space_order_id && el.space_order_id === data.space_order_id)
  );
  if (target) {
    let cantCancel = uploadFileList.value[
      target.space_order_id || target.order_id
    ]?.some((el) => {
      if (el.paused) {
        return true;
      }
      if (!el.completed && !el.error && !el.paused) {
        return true;
      }
    });
    if (cantCancel) {
      proxy.$notify({
        type: "warning",
        message:
          "There are files being uploaded. Please wait for the upload to complete before proceeding with the operation",
        position: "bottom-left",
      });
      return false;
    }
    totalActiveDevice.data = totalActiveDevice.data.filter(
      (el) =>
        (el.device_id && el.device_id !== data.device_id) ||
        (el.space_order_id && el.space_order_id !== data.space_order_id)
    );
    if (target.device_id === deviceData.data.device_id) {
      deviceData.data =
        totalActiveDevice.data[targetIndex] ||
        totalActiveDevice.data[targetIndex - 1] ||
        {};
      if (deviceData.data.device_id) scrollIntoView(deviceData.data);
    }
  }
};
const isDiscover = ref(false);
const changeCollapse = () => {
  isCollapse.value = !isCollapse.value;
};
const init = () => {
  if (route.query.isDiscover) {
    // totalActiveDevice.data.push(route.params);
    // deviceData.data = route.params;
    isDiscover.value = true;
  } else {
    isDiscover.value = false;
    search();
    if (discoverData.value.device_id || discoverData.value.space_order_id) {
      nextTick(() => {
        clickItem(discoverData.value);
      });
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
  overflow-y: hidden;
  scroll-behavior: smooth;
  // display: flex;
  // justify-content: space-between;
  .app-left-box {
    // flex: 1;
    // margin-right: 50px;
  }
  .app-left {
    overflow-y: auto;
    box-sizing: border-box;
    min-width: 1200px;
    height: 100%;
    padding: 30px;
    background: var(--bg-color);
    background: rgba(255, 255, 255, 0.6);
    // margin-right: 300px;
    border-radius: 20px;
    transition: all 0.5s;
    z-index: 1;
    & + .app-left {
      margin-top: 40px;
    }
    &.left-collapse {
      margin-right: 10px;
    }
  }
  .app-right {
    z-index: 1;
    // position: sticky;
    // top: 0;
    // overflow-x: visible;
    // overflow-y: auto;
    box-sizing: border-box;
    // height: 100%;
    height: calc(100% - 60px);
    width: 240px;
    // padding: 0 10px;
    // float: right;
    position: fixed;
    top: 30px;
    right: 20px;
    transition: all 0.5s;

    border-radius: 20px;
    background: rgba(210, 210, 210, 0.6);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 0.5px inset;
    &.right-collapse {
      width: 0;
    }
    :deep {
      .el-loading-mask {
        background-color: transparent;
      }
    }

    .collapse {
      position: absolute;
      top: 50%;
      left: -20px;
      font-size: 30px;
      border-radius: 50%;
      width: 35px;
      height: 35px;
      background-color: #fff;
      cursor: pointer;
      z-index: 1;
      box-shadow: 0 0 7px #727272;
      &.isCollapse {
        left: -18px;
      }
      svg {
        transform: rotate(90deg);
        transition: all 0.5s;
        &.isCollapse {
          transform: rotate(-90deg);
        }
        color: #fff;
        cursor: pointer;
      }
    }
  }
}
</style>
