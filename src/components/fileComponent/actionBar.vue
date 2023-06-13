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
        @click="handlerClick('rename')"
        v-show="checkedData.length <= 1 && activeName !== 'Image'"
      >
        <svg-icon icon-class="rename"></svg-icon>
        <span> Rename </span>
      </div>
      <div class="action-item" @click="handlerClick('move')">
        <svg-icon icon-class="move"></svg-icon>
        <span> Move </span>
      </div>
    </div>
    <template v-else>
      <div style="display: flex; align-items: center; margin-bottom: 20px">
        <div class="action-box" style="margin-right: 20px; margin-bottom: 0">
          <el-button
            class="top-btn action-item"
            style="background-color: dodgerblue; color: #fff"
            @click="upload"
            key="plain"
            type="primary"
            link
            >Upload +</el-button
          >
        </div>
        <div
          class="action-box"
          style="margin-right: 20px; margin-bottom: 0"
          v-if="activeName == 'All'"
        >
          <div class="action-item" @click="handlerClick('newFolder')">
            <svg-icon icon-class="new_folder"></svg-icon>
            <span> New folder </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import {
  ref,
  toRefs,
  inject,
  computed,
  nextTick,
  getCurrentInstance,
} from "vue";
import { useStore } from "vuex";
import { file_delete } from "@/utils/api.js";
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
  tableLoading: Boolean,
});
const emits = defineEmits([
  "update:checkedData",
  "update:folderVisible",
  "update:renameVisible",
  "update:isSingle",
  "update:imgCheckedData",
  "update:actionType",
  "update:singleData",
  "reset",
  "setNewFolder",
  "refreshList",
]);
const { proxy } = getCurrentInstance();
const store = useStore();
const tableLoading = computed({
  get() {
    return props.tableLoading || false;
  },
  set(val) {
    emits("update:tableLoading", val);
  },
});
const tokenMap = computed(() => store.getters.tokenMap);
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
const resetChecked = () => {
  emits("reset");
};
const refresh = () => {
  emits("refreshList");
};
const deleteItem = (item) => {
  tableLoading.value = true;
  let token = tokenMap.value[deviceData.device_id];

  file_delete(token, item, deviceData).then((res) => {
    if (res && res.data) {
      proxy.$notify({
        type: "success",
        message: "Delete succeeded",
        position: "bottom-left",
      });
      tableLoading.value = false;
      let arr = [];
      if (store.getters.uploadFileList && deviceData.device_id) {
        arr = store.getters.uploadFileList[deviceData.device_id];
        if (arr && arr.length > 0) {
          store.getters.uploadFileList[deviceData.device_id] = arr.filter(
            (val) => {
              return val.urlFileName !== item.key;
            }
          );
        }
      }
      nextTick(() => {
        refresh();
      });
    } else {
      tableLoading.value = false;
      proxy.$notify({
        type: "error",
        message: "Delete Failed",
        position: "bottom-left",
      });
    }
  });
};
const handlerClick = (type) => {
  emits("update:isSingle", false);
  if (type === "move" || type === "copy") {
    emits("update:actionType", type);
    emits("update:folderVisible", true);
  } else if (type === "download") {
    downLoad();
  } else if (type === "delete") {
    if (checkedData.value.length == 1) {
      proxy
        .$confirm("Are you sure to delete it?", "Warning", {
          confirmButtonText: "YES",
          cancelButtonText: "NO",
        })
        .then(async () => {
          await deleteItem(checkedData.value[0]);
          resetChecked();
        });
    }
  } else if (type === "rename") {
    emits("update:singleData", checkedData.value[0]);
    emits("update:renameVisible", true);
  } else if (type === "copy") {
  } else if (type === "newFolder") {
    emits("setNewFolder");
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
