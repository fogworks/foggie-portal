<template>
  <div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="File" name="File"></el-tab-pane>
      <el-tab-pane label="Image" name="Image"></el-tab-pane>
    </el-tabs>
    <ActionBar
      :activeName="activeName"
      :checkedData="checkedData"
      :imgCheckedData="imgCheckedData.value"
    ></ActionBar>
    <template v-if="activeName === 'File'">
      <slot> </slot>
    </template>
    <ImgList
      v-else-if="activeName === 'Image'"
      v-model:checkedData="imgCheckedData.value"
    ></ImgList>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import ImgList from "./imgList";
import ActionBar from "./actionBar.vue";
const activeName = ref("File");

const checkedData = ref([]);
const imgCheckedData = reactive({
  value: {},
});
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
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
