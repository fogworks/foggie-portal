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
      <el-tab-pane label="Audio" name="Audio">
        <template #label>
          <svg-icon icon-class="audio"></svg-icon>
          Audio
        </template>
      </el-tab-pane>
      <el-tab-pane label="Document" name="Document">
        <template #label>
          <svg-icon icon-class="document"></svg-icon>
          Document
        </template>
      </el-tab-pane>
    </el-tabs>
    <ActionBar
      :activeName="activeName"
      v-model:checkedData="checkedData"
      v-model:imgCheckedData="imgCheckedData.value"
      v-model:folderVisible="folderVisible"
      v-model:renameVisible="renameVisible"
      v-model:isSingle="isSingle"
      v-model:actionType="actionType"
      v-model:singleData="singleData.value"
      v-model:tableLoading="tableLoading"
      v-model:fileSource="fileSource"
      :createdTime="createdTime"
      v-bind="$attrs"
      @setNoSingle="setNoSingle"
      @setNewFolder="setNewFolder"
      @reset="reset"
      @refreshList="refreshList"
    ></ActionBar>
    <AllFile
      v-if="activeName !== 'Image'"
      v-model:checkedData="checkedData"
      v-model:folderVisible="folderVisible"
      v-model:isSingle="isSingle"
      v-model:renameVisible="renameVisible"
      v-model:actionType="actionType"
      v-model:tableLoading="tableLoading"
      :category="category"
      :fileSource="fileSource"
      @setSingle="setSingle"
      @setFileSource="setFileSource"
      v-bind="$attrs"
      ref="AllFileRef"
    ></AllFile>
    <ImgList
      ref="ImgListRef"
      @setSingle="setSingle"
      v-bind="$attrs"
      v-else-if="activeName === 'Image'"
      v-model:checkedData="imgCheckedData.value"
      :fileSource="fileSource"
      v-model:folderVisible="folderVisible"
    ></ImgList>
  </div>
  <!-- action dialog -->
  <FolderDialog
    v-if="folderVisible"
    v-model:folderVisible="folderVisible"
    v-bind="$attrs"
    :fileSource="fileSource"
    @reset="reset"
    @refreshList="refreshList"
  ></FolderDialog>
  <RenameDialog
    v-if="renameVisible"
    v-model:renameVisible="renameVisible"
    @reset="reset"
    @refreshList="refreshList"
  ></RenameDialog>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>
<script setup>
import { ref, toRefs, reactive, watch, provide, computed, useAttrs } from "vue";
import ImgList from "./imgList";
import FolderDialog from "./folderDialog.vue";
import RenameDialog from "./renameDialog.vue";
import AllFile from "@/views/foggieMax/home/_modules/myFiles";
import ActionBar from "./actionBar.vue";

const emits = defineEmits(["getUseSize"]);
const props = defineProps({
  createdTime: {
    type: String,
    default: "",
  },
});
const { createdTime } = toRefs(props);
const folderVisible = ref(false);
const renameVisible = ref(false);
const activeName = ref("All");
const AllFileRef = ref(null);
const ImgListRef = ref(null);
const tableLoading = ref(false);
const checkedData = ref([]);
const imgCheckedData = reactive({
  value: {},
});
const actionType = ref("");
const isSingle = ref(false);
const fileSource = ref(false);
const singleData = reactive({
  value: {},
});
const setSingle = (data) => {
  isSingle.value = true;
  singleData.value = data;
};
const setNoSingle = () => {
  isSingle.value = false;
};
const category = computed(() => {
  switch (activeName.value) {
    case "All":
      return 0;
    case "Image":
      return 1;
    case "Video":
      return 2;
    case "Audio":
      return 3;
    case "Document":
      return 4;
  }
});
provide("activeName", activeName);
provide("checkedData", checkedData);
provide("imgCheckedData", imgCheckedData);
const setFileSource = (val) => {
  fileSource.value = val;
};
const reset = () => {
  checkedData.value = [];
  imgCheckedData.value = {};
  if (activeName.value === "Image") {
    ImgListRef.value.resetChecked();
  } else {
    AllFileRef.value.resetChecked();
  }
};
const refreshList = () => {
  if (activeName.value === "Image") {
    ImgListRef.value.refresh();
  } else {
    AllFileRef.value.refresh();
  }
};
const handleClick = (tab, event) => {
  console.log(tab, event);
};
const setNewFolder = () => {
  AllFileRef.value.setNewFolder();
};
watch(activeName, () => {
  tableLoading.value = false;
  checkedData.value = [];
  imgCheckedData.value = {};
});
// watch(
//   imgCheckedData,
//   () => {
//     console.log(imgCheckedData, "imgCheckedDataimgCheckedData");
//   },
//   { deep: true }
// );
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
