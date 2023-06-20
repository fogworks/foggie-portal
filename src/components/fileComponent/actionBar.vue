<template>
  <div class="action-content">
    <div v-if="hasChecked" class="action-box">
      <div
        class="action-item"
        @click="handlerClick('share')"
        v-if="checkedData.length <= 1"
      >
        <svg-icon icon-class="share"></svg-icon>
        <span> Share </span>
      </div>
      <div class="action-item" @click="handlerClick('download')">
        <svg-icon icon-class="download"></svg-icon>
        <span> Download </span>
      </div>
      <div
        class="action-item"
        v-if="deviceType !== 'space'"
        @click="handlerClick('delete')"
      >
        <svg-icon icon-class="delete"></svg-icon>
        <span> Delete </span>
      </div>
      <div
        class="action-item"
        @click="handlerClick('rename')"
        v-if="
          checkedData.length <= 1 && activeName !== 'Image' && showActionBool
        "
      >
        <svg-icon icon-class="rename"></svg-icon>
        <span> Rename </span>
      </div>
      <div
        class="action-item"
        v-if="checkedData.length <= 1 && showActionBool"
        @click="handlerClick('move')"
      >
        <svg-icon icon-class="move"></svg-icon>
        <span> Move </span>
      </div>
    </div>
    <template v-else>
      <div style="display: flex; align-items: center">
        <div class="action-box" style="margin-right: 20px; margin-bottom: 0">
          <el-button
            class="top-btn action-item upload-btn"
            style="background-color: dodgerblue; color: #fff"
            :disabled="uploadDisable"
            @click="upload"
            key="plain"
            type="primary"
            link
            >Upload +</el-button
          >
        </div>
        <!-- && deviceType !== 'space' -->
        <div
          class="action-box"
          style="margin-right: 20px; margin-bottom: 0"
          v-if="activeName == 'All' && showActionBool"
        >
          <div class="action-item" @click="handlerClick('newFolder')">
            <svg-icon icon-class="new_folder"></svg-icon>
            <span> New folder </span>
          </div>
        </div>
      </div>
    </template>
    <el-switch
      v-if="deviceType == 'space'"
      class="file-source"
      v-model="fileSource"
      size="large"
      active-text="Remote Files"
      inactive-text="Local Files"
      :before-change="switchReceiveStatus"
    />
    <ShareDialog
      :shareRefContent="shareRefContent"
      :copyContent="copyContent"
      v-model:visible="showShareDialog"
    ></ShareDialog>
  </div>
</template>

<script setup>
import ShareDialog from "@/views/foggieMax/home/_modules/myFiles/shareDialog";
import {
  ref,
  toRefs,
  inject,
  computed,
  nextTick,
  getCurrentInstance,
} from "vue";
import {
  getSecondTime,
} from "@/utils/ChinaStandardTime";
import { useStore } from "vuex";
import { file_delete, files_download } from "@/utils/api.js";
import useShare from "./hooks/useShare.js";
import useDelete from "./hooks/useDelete.js";
import { baseUrl } from "@/setting";
const deviceData = inject("deviceData");
import { ElMessageBox } from "element-plus";
const deviceType = computed(() => deviceData.device_type);
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
  createdTime: {
    type: String,
    default: "",
  },
  tableLoading: Boolean,
  state: {
    type: [String, Number],
  },
  merkleState: {
    type: [String, Number],
    default: 0,
  },
  fileSource: {
    type: Boolean,
  },
});
const emits = defineEmits([
  "update:checkedData",
  "update:folderVisible",
  "update:renameVisible",
  "update:isSingle",
  "update:imgCheckedData",
  "update:actionType",
  "update:singleData",
  "update:fileSource",
  "reset",
  "setNewFolder",
  "refreshList",
]);
const { proxy } = getCurrentInstance();

const tableLoading = computed({
  get() {
    return props.tableLoading || false;
  },
  set(val) {
    emits("update:tableLoading", val);
  },
});
const refresh = () => {
  emits("refreshList");
};
const { doShare, showShareDialog, shareRefContent, copyContent } = useShare();
const {
  checkedData,
  imgCheckedData,
  activeName,
  createdTime,
  state,
  merkleState,
  fileSource,
} = toRefs(props);
const { deleteItem } = useDelete(tableLoading, refresh);
const showActionBool = computed(() => {
  if (deviceData.type !== "space") {
    if (fileSource.value) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
});
const store = useStore();
const uploadDisable = computed(() => {
  console.log(deviceData, "deviceData");
  if (
    deviceData.device_type == "space" &&
    ([4, 5].includes(state.value) || !merkleState.value)
  ) {
    return true;
  } else {
    return false;
  }
});

const tokenMap = computed(() => store.getters.tokenMap);
const token = computed(() => {
  if (deviceData.device_type == "space") {
    return deviceData.upload_file_token;
  } else {
    return tokenMap.value[deviceData.device_id];
  }
});

const hasChecked = computed(() => {
  // if (activeName.value == "Image") {
  //   return Object.keys(imgCheckedData.value).some((key) => {
  //     if (imgCheckedData.value[key].length) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   });
  // } else {
  return checkedData.value.length ? true : false;
  // }
});
const { ipcRenderer } = window.require("electron");
const imgData = computed(() => {
  // let data = [];
  // if (activeName.value == "Image") {
  //   Object.keys(imgCheckedData.value).forEach((el) => {
  //     imgCheckedData.value[el].forEach((item) => {
  //       data.push(item);
  //     });
  //   });
  //   return data;
  // } else {
  return checkedData.value;
  // }
});
const downLoad = () => {
  console.log(imgData.value, "imgData.value");
  const data = imgData.value.map((el) => {
    return {
      cid: el.cid,
      key: el.key,
    };
  });
  let ip = deviceData.rpc.split(":")[0];
  ip = "218.2.96.99";
  const type = deviceData.device_type == "space" ? "space" : "foggie";
  const token2 =
    deviceData.device_type == 3 ? deviceData.upload_file_token : token.value;
  const paramsObj = {
    file_arr: JSON.stringify(data),
    token: token2,
    ip,
    port: deviceData.rpc.split(":")[1],
    Id: deviceData.foggie_id,
    peerId: deviceData.peer_id,
    type,
  };
  let downloadUrl = "";
  if (imgData.value.length == 1) {
    downloadUrl = `${baseUrl}/file_download/?cid=${imgData.value[0].cid}&key=${imgData.value[0].key}&ip=${paramsObj.ip}&port=${paramsObj.port}&Id=${paramsObj.Id}&peerId=${paramsObj.peerId}&type=${paramsObj.type}&token=${paramsObj.token}`;
  } else {
    downloadUrl = `${baseUrl}/files_download/?file_arr=${paramsObj.file_arr}&ip=${paramsObj.ip}&port=${paramsObj.port}&Id=${paramsObj.Id}&peerId=${paramsObj.peerId}&type=${paramsObj.type}&token=${paramsObj.token}`;
  }
  console.log(downloadUrl, "downloadUrl");
  ipcRenderer.send("download", {
    downloadPath: downloadUrl,
    fileName:
      imgData.value.length == 1 ? imgData.value[0].name : "download.zip",
  });
};
function countDownRun() {
  let nowTime = new Date().getTime();
  let endTime = new Date(createdTime.value).getTime() + 1000 * 60 * 3;
  let time = ((+endTime - +nowTime) / 1000).toFixed(0);
  if (time > 4 * 60) {
    time = time - 60 * 60;
  }
  if (time > 0) {
    let content = "Upload files after " + getSecondTime(+time);
    proxy.$notify({
      type: "warning",
      message: content,
      position: "bottom-left",
    });
  } else {
    store.commit("upload/setUploadOptions", deviceData);
    // store.commit("upload/openUpload", orderId.value);
  }
}
const upload = () => {
  if (deviceData.device_type == "space") {
    countDownRun();
  } else {
    store.commit("upload/setUploadOptions", deviceData);
  }
  // store.commit("upload/openUpload", deviceData.device_id);
};
const resetChecked = () => {
  emits("reset");
};
const switchReceiveStatus = () => {
  return new Promise((resolve, reject) => {
    try {
      emits("update:checkedData", []);
      if (fileSource.value) {
        console.log("------------remote");
        ElMessageBox.confirm("Are you sure to get local data?", "Warning", {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
        })
          .then(() => {
            // get remote data
            emits("update:fileSource", !fileSource.value);
            // getLocalData();
          })
          .catch(() => {
            reject(false);
          });
      } else {
        console.log("------------local");
        ElMessageBox.confirm("Are you sure to get remote data?", "Warning", {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
        })
          .then(() => {
            // get remote data
            emits("update:fileSource", !fileSource.value);
            // getReomteData();
          })
          .catch(() => {
            reject(false);
          });
      }
    } catch (err) {
      reject(false);
    }
  });
};
const handlerClick = async (type) => {
  emits("update:isSingle", false);
  if (type === "move") {
    emits("update:actionType", type);
    emits("update:folderVisible", true);
  } else if (type === "download") {
    downLoad();
  } else if (type === "delete") {
    proxy
      .$confirm("Are you sure you want to delete?", "Warning", {
        confirmButtonText: "YES",
        cancelButtonText: "NO",
      })
      .then(async () => {
        deleteItem(imgData.value);
      });
  } else if (type === "rename") {
    emits("update:singleData", checkedData.value[0]);
    emits("update:renameVisible", true);
  } else if (type === "newFolder") {
    emits("setNewFolder");
  } else if (type === "share") {
    await doShare(checkedData.value[0]);
    resetChecked();
    proxy.$notify({
      type: "success",
      message: "Share succeeded",
      position: "bottom-left",
    });
  }
};
</script>

<style lang="scss" scoped>
.action-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.action-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
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
  .upload-btn {
    background: #29abff !important;
    &.is-disabled {
      color: #ccc !important;
    }
  }
  //   :deep {
  //     .el-divider {
  //       background-color: $light_blue;
  //     }
  //   }
}
</style>
