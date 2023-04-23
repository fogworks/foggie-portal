<template>
  <div class="app-window">
    <template v-for="item in totalActiveDevice.data">
      <div class="app-left" v-if="item.device_id">
        <FoggieMax :deviceData="item"></FoggieMax>
      </div>
    </template>

    <div class="app-right" v-loading="loading">
      <DeviceList
        @clickItem="clickItem"
        @cancelItem="cancelItem"
        :totalActiveDevice="totalActiveDevice"
      ></DeviceList>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted, provide } from "vue";
import { useStore } from "vuex";
import FoggieMax from "@/views/foggieMax/layout";
import DeviceList from "./deviceList";
import { search_foggie } from "@/utils/api";
import { useRoute } from "vue-router";
const store = useStore();
const route = useRoute();

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
search();
let totalActiveDevice = reactive({
  data: [],
});
const clickItem = (data) => {
  console.log("clickItem");
  let target = totalActiveDevice.data.find(
    (el) => el.device_id === data.device_id
  );
  if (!target && totalActiveDevice.data.length < 4) {
    totalActiveDevice.data.push(data);
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
onMounted(() => {
  if (totalActiveDevice.data.length < 4) {
    // totalActiveDevice.data.push(route.params);
    totalActiveDevice.data.push(route.query);
  }
});
</script>

<style lang="scss" scoped>
.app-window {
  position: relative;
  height: 100%;
  overflow-y: auto;
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
