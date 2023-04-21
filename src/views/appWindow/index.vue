<template>
  <div class="app-window">
    <div class="app-left" v-if="deviceData.data.device_id">
      <FoggieMax :deviceData="deviceData"></FoggieMax>
    </div>
    <div class="app-right" v-loading="loading">
      <DeviceList :deviceList="deviceList" @clickItem="clickItem"></DeviceList>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import FoggieMax from "@/views/foggieMax/layout";
import DeviceList from "./deviceList";
import { search_foggie } from "@/utils/api";
import { useRoute } from "vue-router";

const store = useStore();
const route = useRoute();

const deviceList = computed(() => store.getters.deviceList);
const email = computed(() => store.getters["token/currentUser"]);
const loading = ref(false);
const search = () => {
  loading.value = true;
  search_foggie({ email: email.value })
    .then((res) => {
      console.log(res, "res");
      store.dispatch("setDeviceList", res.data);
      loading.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
};
search();
const deviceData = reactive({
  data: {},
});
const clickItem = (data) => {
  deviceData.data = data;
};
onMounted(() => {
  deviceData.data = route.params;
});
</script>

<style lang="less" scoped>
.app-window {
  position: relative;
  height: 100%;
  // display: flex;
  // justify-content: space-between;
  .app-left {
    overflow-y: auto;
    box-sizing: border-box;
    min-width: 1280px;
    height: 100%;
    padding: 30px;
    background: var(--bg-color);
    margin-right: 200px;
    border-radius: 20px;
  }
  .app-right {
    overflow-x: visible;
    overflow-y: auto;
    box-sizing: border-box;
    height: calc(100% - 55px);
    width: 210px;
    padding: 0 10px;
    // float: right;
    position: fixed;
    top: 25px;
    right: 10px;
    :deep {
      .el-loading-mask {
        background-color: transparent;
      }
    }
  }
}
</style>
