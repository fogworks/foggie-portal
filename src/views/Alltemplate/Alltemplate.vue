<template>
  <div class="Alltemplate_boxs" id="Alltemplate_boxs">
    <!-- isInsertBody="app-window" -->
    <customDialog v-if="customDialogIsShow" :isBox="false" :closeClickModal="false">
      <login @closeDialog="closeDialog" :userInfo="userInfo"></login>
    </customDialog>
    <template v-if="!customDialogIsShow">
      <orderList :orderId="orderId"></orderList>
      <myFiles :orderId="orderId"></myFiles>
    </template>



  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  watch,
} from "vue";
import orderList from "@/components/orders/orderList.vue";
import myFiles from "@/views/Alltemplate/MyFiles/myFiles";
import customDialog from '@/components-V3/customDialog'
import login from '@/components/login'
import { useStore } from "vuex";

import { getChain_id } from "@/api/common.js";
import { provide, defineExpose, computed, defineProps, readonly } from "vue";
const store = useStore()
const props = defineProps(["deviceData"]);
const orderId = readonly(props.deviceData.order_id)
const userInfo = computed(() => store.getters.userInfo)
let customDialogIsShow = ref(true)   // 是否展示 
const clientPassword = computed(() => store.getters.clientPassword)

if (clientPassword.value) {
  customDialogIsShow.value = false
} else {
  customDialogIsShow.value = true
}

watch(
  () => props.deviceData,
  (newValue) => {
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", newValue);
  },
  { immediate: true, deep: true }
);

function closeDialog() {
  customDialogIsShow.value = false
}

/* 获取链ID */
function loadChainId() {
  getChain_id().then((res) => {
    if (res.code == 200) {
      store.commit("clientGlobal/SAVE_ChainId", res.data);
    }
  });
}
onMounted(() => {
  loadChainId()
});

// let isMobile = ref(false);
// let asideWidth = ref("236px");

// watch(
//   isMobile,
//   (newValue) => {
//     if (!newValue) {
//       asideWidth.value = "236px";
//     } else {
//       asideWidth.value = "60px";
//     }
//   },
//   { immediate: true }
// );

// const { body } = document;
// const WIDTH = 992; //

// onBeforeMount(() => {
//   window.addEventListener("resize", $_resizeHandler);
// });

// onBeforeUnmount(() => {
//   window.removeEventListener("resize", $_resizeHandler);
// });
// onMounted(() => {
//   isMobile.value = $_isMobile();
//   loadChainId()
// });

// function $_isMobile() {
//   const rect = body.getBoundingClientRect();
//   return rect.width - 1 < WIDTH;
// }
// function $_resizeHandler() {
//   if (!document.hidden) {
//     isMobile.value = $_isMobile();
//   }
// }
</script>

<style lang="scss" scoped>
@import "@/static/style/variables.scss";

.Alltemplate_boxs {
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
  position: relative;

}

.Alltemplate_boxs::-webkit-scrollbar {
  display: none;
  /* Chrome Safari */
}
</style>
