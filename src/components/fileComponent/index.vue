<template>
  <div class="card-box">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="All" name="All">
        <template #label>
          <svg-icon icon-class="file"></svg-icon>
          All
        </template>
      </el-tab-pane>
      <el-tab-pane label="Image" name="Image">
        <template #label>
          <svg-icon icon-class="picture"></svg-icon>
          Picture
        </template>
      </el-tab-pane>
      <el-tab-pane label="Video" name="Video">
        <template #label>
          <svg-icon icon-class="video"></svg-icon>
          Video
        </template>
      </el-tab-pane>
    </el-tabs>
    <ActionBar
      :activeName="activeName"
      :checkedData="checkedData"
      :imgCheckedData="imgCheckedData.value"
    ></ActionBar>
    <AllFile
      v-if="activeName === 'All'"
      v-model:checkedData="checkedData"
      v-bind="$attrs"
    ></AllFile>
    <ImgList
      v-else-if="activeName === 'Image'"
      v-model:checkedData="imgCheckedData.value"
    ></ImgList>
  </div>
</template>

<script setup>
import { ref, toRefs, reactive, watch, provide } from "vue";
import ImgList from "./imgList";
import AllFile from "@/views/foggieMax/home/_modules/myFiles";
import ActionBar from "./actionBar.vue";
const activeName = ref("All");

const checkedData = ref([]);
const imgCheckedData = reactive({
  value: {},
});
provide("activeName", activeName);
provide("checkedData", checkedData);
provide("imgCheckedData", imgCheckedData);
const handleClick = (tab, event) => {
  console.log(tab, event);
};
watch(activeName, () => {
  checkedData.value = [];
  imgCheckedData.value = {};
});
watch(
  imgCheckedData,
  () => {
    console.log(imgCheckedData, "imgCheckedDataimgCheckedData");
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.card-box {
  @include card-box;
  margin-top: 20px;
  background-color: var(--bg-color);
}
.demo-tabs {
  :deep {
    .el-tabs__header {
      .el-tabs__item {
        font-size: 24px;
      }
      .is-active {
        color: $light_blue2;
      }
      .el-tabs__active-bar {
        background: $light_blue2;
      }
    }
  }
}
</style>
