<template>
  <div class="viewContainer">
    <!-- <iframe src="http://154.31.41.36:9876/#/order" style="width:1000px;height:1000px"></iframe> -->
    <iframe
      id="iframeRef"
      ref="iframeRef"
      src="http://localhost:8090/#/order"
      frameborder="no"
      border="0"
      class="flexItem"
      style="width: 1000px; height: 1000px"
    ></iframe>
  </div>
</template>

<script setup>
import {
  getCurReferenceRate,
  getOrderFilterList,
  buyOrder,
  orderSync,
} from "@/api/order/filterOrder.js";
import { getChain_id } from "@/api/common.js";
import { transferTime, ChinaTime4 } from "@/utils/ChinaStandardTime.js";
import customDialog from "@/components-V3/customDialog";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  h,
  shallowRef,
  reactive,
  toRefs,
  ref,
  onMounted,
  watch,
  computed,
  inject,
} from "vue";
import { switchCase } from "@babel/types";

import { useStore } from "vuex";

const store = useStore();

const token = computed(() => store.getters["token/login"]);

// const username = computed(() => store.getters.userInfo?.dmc);
const email = computed(() => store.getters.userInfo?.email);

let iframeRef = ref(null); // 和iframe标签的ref绑定
let iframeWindow = ref(null);
const handleMessage = (event) => {
  console.log(event.data);
};
// 向iframe传参
const sendMessage = () => {
  iframeRef.value.onload = function () {
    iframeWindow.postMessage({ token: token.value });
  };
};

onMounted(() => {
  window.addEventListener("message", handleMessage); // 监听iframe的事件
  //vue3使用ref定义的变量需要使用.value获取值， vue2直接iframeRef.contentWindow
  iframeWindow = iframeRef.value.contentWindow;
  sendMessage();
});
</script>

<style lang="scss" scoped></style>
