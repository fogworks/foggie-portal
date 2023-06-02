<template>
  <div class="Alltemplate_boxs" id="Alltemplate_boxs">
    <!-- isInsertBody="app-window" -->

    <login
      v-if="customDialogIsShow"
      @closeDialog="closeDialog"
      :userInfo="userInfo"
    ></login>
    <template v-else>
      <div class="top-title">
        <!-- <span>
          {{ deviceData.peer_id }}
        </span> -->
        <span> RPC:{{ deviceData.rpc }} </span>
      </div>
      <orderList
        @setState="setState"
        @setTime="setTime"
        :orderId="orderId"
        :activeDeviceData="activeDeviceData"
        :deviceData="deviceData"
        :isLocal="isLocal"
      ></orderList>
      <myFiles
        :state="state"
        :orderId="orderId"
        :createdTime="createdTime"
        :deviceData="deviceData"
        @getLocal="getLocal"
      ></myFiles>
    </template>
  </div>
</template>

<script setup>
import {
  ref,
  toRefs,
  reactive,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  watch,
} from "vue";
import orderList from "@/components/orders/orderList.vue";
import myFiles from "@/views/Alltemplate/MyFiles/myFiles";
// import customDialog from "@/components-V3/customDialog";
import login from "@/components/login";
import { useStore } from "vuex";

import { getChain_id } from "@/api/common.js";
import { provide, defineExpose, computed, defineProps, readonly } from "vue";
const store = useStore();
const props = defineProps({
  deviceData: {
    type: Object,
    default: {},
  },
  activeDeviceData: {
    type: Object,
    default: () => ({ data: {} }),
  },
});
const { deviceData, activeDeviceData } = toRefs(props);
const orderId = readonly(props.deviceData.space_order_id);
const userInfo = computed(() => store.getters.userInfo);
let customDialogIsShow = ref(true);
const clientPassword = computed(() => store.getters.clientPassword);
const isLocal = ref(true);

const getLocal = (val) => {
  isLocal.value = val;
};

// if (clientPassword.value) {
//   customDialogIsShow.value = false;
// } else {
//   customDialogIsShow.value = true;
// }
store.commit("upload/setOrderId", orderId);
// if (deviceData.device_type == 'foggie_max' || deviceData.device_type == 'foggie' || deviceData.device_type == '') {
//   const orderId = readonly(deviceData.device_id)
//   store.commit('upload/setOrderId', orderId)
// } else {
//   const orderId = readonly(deviceData.order_id)
//   store.commit('upload/setOrderId', orderId)
// }
store.commit("upload/setDeviceType", 3);
store.commit("upload/setPeerId", deviceData.value.peer_id);
store.commit("upload/setDeviceData", deviceData.value);
const state = ref(0);
const createdTime = ref("");
watch(
  () => props.deviceData,
  (newValue) => {},
  { immediate: true, deep: true }
);
const setState = (val) => {
  state.value = val;
};
const setTime = (val) => {
  createdTime.value = val;
};
function closeDialog() {
  customDialogIsShow.value = false;
}

function loadChainId() {
  getChain_id().then((res) => {
    if (res.code == 200) {
      store.commit("clientGlobal/SAVE_ChainId", res.data);
    }
  });
}
const orderListRef = ref(null);
onMounted(() => {
  loadChainId();
});
</script>

<style lang="scss" scoped>
@import "@/static/style/variables.scss";

.Alltemplate_boxs {
  position: relative;
  background-repeat: no-repeat;
  box-sizing: border-box;
  color: #fff;
  font-family: Lucida Fax-Italic, Lucida Fax;

  background-size: cover;
  background-position: 50%;
  border-radius: 0 0 0 0;
  z-index: 1;
  width: 1120px;
  height: 100%;
  margin: 0 auto;
  // position: relative;
}
.top-title {
  display: flex;
  justify-content: space-between;
  // margin: 20px 0;
  height: 60px;
  font-size: 24px;
  text-align: left;
  font-weight: 700;
  text-align: left;

  span {
    background: linear-gradient(to right, #3913b8 0%, #15a2aa 100%);
    background-clip: text;
    text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.Alltemplate_boxs::-webkit-scrollbar {
  display: none;
  /* Chrome Safari */
}
</style>
