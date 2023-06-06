<template>
  <div>
    <div class="action-box">
      <div class="action-item" @click="handlerClick('download')">
        <svg-icon icon-class="download"></svg-icon>
        <span> Download </span>
      </div>
      <div class="action-item" @click="handlerClick('delete')">
        <svg-icon icon-class="delete"></svg-icon>
        <span> Delete </span>
      </div>
      <div
        class="action-item"
        v-show="checkedData.length <= 1 && activeName !== 'Image'"
      >
        <svg-icon icon-class="rename"></svg-icon>
        <span> Rename </span>
      </div>
      <div class="action-item">
        <svg-icon icon-class="copy"></svg-icon>
        <span> Copy </span>
      </div>
      <div class="action-item" @click="handlerClick('move')">
        <svg-icon icon-class="move"></svg-icon>
        <span> Move </span>
      </div>
    </div>

    <folderDialog
      v-if="visible"
      v-model:visible="visible"
      :actionType="actionType"
    ></folderDialog>
  </div>
</template>

<script setup>
import folderDialog from "./folderDialog.vue";
import { ref, toRefs } from "vue";
const visible = ref(false);
const actionType = ref("");
const props = defineProps({
  checkedData: {
    type: Array,
    default: () => [],
  },
  imgCheckedData: {
    type: Object,
    default: () => {},
  },
  activeName: {
    type: String,
    default: "",
  },
});
const { checkedData, imgCheckedData, activeName } = toRefs(props);
const downLoad = () => {
  console.log(imgCheckedData.value, "imgCheckedDataimgCheckedData");
};
const handlerClick = (type) => {
  actionType.value = type;
  if (type === "move" || type === "copy") {
    visible.value = true;
  } else if (type === "download") {
    downLoad();
  } else if (type === "delete") {
  } else if (type === "rename") {
  } else if (type === "copy") {
  }
};
</script>

<style lang="scss" scoped>
.action-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 99px;
  .action-item {
    position: relative;
    padding: 0 12px;
    height: 32px;
    line-height: 32px;
    background-color: #f0faff;
    cursor: pointer;
    svg {
      color: $light_blue;
    }
    span {
      font-weight: 700;
      color: $light_blue;
    }
    &::after {
      height: 12px;
      width: 1px;
      position: absolute;
      background-color: rgba(6, 167, 255, 0.23);
      content: " ";
      left: 0;
      top: 50%;
      margin-top: -6px;
    }
    &:first-child {
      border-radius: 99px 0 0 99px;
    }
    &:last-child {
      border-radius: 0 99px 99px 0;
    }
  }
  //   :deep {
  //     .el-divider {
  //       background-color: $light_blue;
  //     }
  //   }
}
</style>
