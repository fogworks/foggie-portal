<template>
  <div class="Alltemplate_boxs">
    <div>
      <orderList></orderList>
      <myFiles></myFiles>
      <teleport to="body">
        <upload v-show="uploadIsShow"></upload>
      </teleport>
      <!-- <el-container>
        <el-aside :width="asideWidth">
          <TemplateAside :isMobile="isMobile" />
        </el-aside>
        <el-container class="main_header" :class="isMobile ? 'shrinkHeader' : ''">
          <el-header class="header" :class="isMobile ? 'shrinkHeader' : ''">
            <TemplateHeader />
          </el-header>
          <el-main class="content_body" :class="isMobile ? 'shrinkHeader' : ''">

            <router-view></router-view>
            <teleport to='body'>
              <upload v-show="uploadIsShow"></upload>
            </teleport>
          </el-main>
        </el-container>
      </el-container> -->
    </div>
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
import upload from "@/components/upload";
import orderList from "@/components/orders/orderList.vue";

import myFiles from "@/views/Alltemplate/MyFiles/myFiles";
// import TemplateHeader from "@/components/layout/header.vue";
// import TemplateAside from "@/components/layout/aside.vue";
import { getChain_id } from "@/api/common.js";
import { provide, defineExpose, computed, defineProps } from "vue";
import { useStore } from "vuex";
const props = defineProps(["deviceData"]);

const store = useStore();

let uploadIsShow = computed(() => store.getters.uploadIsShow);

watch(
  () => props.deviceData,
  (newValue) => {
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", newValue);
  },
  { immediate: true, deep: true }
);

/* 获取链ID */
function loadChainId() {
  getChain_id().then((res) => {
    if (res.code == 200) {
      store.commit("global/SAVE_ChainId", res.data);
    }
  });
}
onMounted(() => {
  // loadChainId()
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
// @import "../../static/style/variables.scss";
@import "@/static/style/variables.scss";

.Alltemplate_boxs {
  background-repeat: no-repeat;
  box-sizing: border-box;
  color: #fff;
  font-family: Lucida Fax-Italic, Lucida Fax;
  // height: 100%;
  // overflow-y: scroll;
  background-size: cover;
  background-position: 50%;
  border-radius: 0 0 0 0;
  z-index: 1;
  // min-height: 100vh;
  width: 1120px;
  // padding: 0 40px;
  margin: 0 auto;
}

.main_header {
  height: 100%;
  min-height: 100vh;
  width: calc(100vw - #{$sideBarWidth});
  padding-top: 80px;
  overflow: hidden;
  z-index: 999;
  transition: background 0.3s;
}

.shrinkHeader {
  width: calc(100vw - #{$shrinkHeader}) !important;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;
}

.Alltemplate_boxs::-webkit-scrollbar {
  display: none;
  /* Chrome Safari */
}

.header {
  border-bottom: 2px solid #8c88a3;
  height: 80px;
  line-height: 80px;
  position: fixed;
  top: 0px;
  width: calc(100vw - #{$sideBarWidth});
  transition: background 0.3s;
}

.content_body {
  width: 100%;
  width: calc(100vw - #{$sideBarWidth});
  transition: background 0.3s;

  height: calc(100vh - 80px);
  padding-bottom: 100px;
  padding: 20px 20px 100px 20px;
}

.content_body::-webkit-scrollbar {
  display: none;
}

.box_content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-style: normal;
  font-size: 24px;
  line-height: 140%;
  font-weight: bold;

  color: rgb(255, 255, 255);
  margin: 0px;
}

.extraTip {
  font-size: 12px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #ff6e6e;
  line-height: 22px;
}
</style>
