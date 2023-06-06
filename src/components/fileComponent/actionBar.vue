<template>
  <div>
    <div v-if="hasChecked" class="action-box">
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
    <div class="action-box" v-else>
      <el-button
        class="top-btn action-item"
        @click="upload"
        key="plain"
        type="primary"
        link
        >Upload +</el-button
      >
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
import { ref, toRefs, inject, computed } from "vue";
import { useStore } from "vuex";
const visible = ref(false);
const actionType = ref("");
const deviceData = inject("deviceData");
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
const store = useStore();
const { checkedData, imgCheckedData, activeName } = toRefs(props);
const hasChecked = computed(() => {
  if (activeName.value == "Image") {
    return Object.keys(imgCheckedData.value).some((key) => {
      if (imgCheckedData.value[key].length) {
        return true;
      } else {
        return false;
      }
    });
  } else {
    return checkedData.value.length ? true : false;
  }
});
const downLoad = () => {
  console.log(imgCheckedData.value, "imgCheckedDataimgCheckedData");
};
const upload = () => {
  store.commit("upload/setUploadOptions", deviceData);
  // store.commit("upload/openUpload", deviceData.device_id);
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
  margin-bottom: 20px;
  border-radius: 99px;
  transition: all 0.3s;
  .top-btn {
    width: unset;
    font-size: 16px;
    text-align: left;
  }
  .action-item {
    position: relative;
    padding: 0 12px;
    height: 32px;
    line-height: 32px;
    background-color: #caedff;
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
      border-top-left-radius: 99px;
      border-bottom-left-radius: 99px;

      &::after {
        display: none;
      }
    }
    &:last-child {
      border-top-right-radius: 99px;
      border-bottom-right-radius: 99px;
    }
  }
  //   :deep {
  //     .el-divider {
  //       background-color: $light_blue;
  //     }
  //   }
}
</style>
