<template>
  <div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="File" name="File"></el-tab-pane>
      <el-tab-pane label="Image" name="Image"></el-tab-pane>
    </el-tabs>
    <template v-if="activeName === 'File'">
      <slot> </slot>
    </template>
    <ImgList v-else-if="activeName === 'Image'"></ImgList>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ImgList from "./imgList";
const activeName = ref("File");
const handleClick = (tab, event) => {
  console.log(tab, event);
};
</script>

<style lang="scss" scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
