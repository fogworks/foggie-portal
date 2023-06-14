<template>
  <div>
    <div v-if="hasChecked" class="action-box">
      <div
        class="action-item"
        @click="handlerClick('share')"
        v-if="checkedData.length <= 1 && activeName !== 'Image'"
      >
        <svg-icon icon-class="share"></svg-icon>
        <span> Share </span>
      </div>
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
        v-if="checkedData.length <= 1 && activeName !== 'Image'"
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
import { useStore } from "vuex";
import { file_delete, files_download } from "@/utils/api.js";
import useShare from "./hooks/useShare.js";
import useDelete from "./hooks/useDelete.js";
import { getToken } from "@/utils/auth";
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
const { deleteItem } = useDelete(tableLoading, refresh);
const store = useStore();

const tokenMap = computed(() => store.getters.tokenMap);
const token = computed(() => {
  if (deviceData.device_type == 3) {
    return getToken();
  } else {
    return tokenMap.value[deviceData.device_id];
  }
});
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
  const data = checkedData.value.map((el) => {
    return {
      cid: el.cid,
      key: el.key,
    };
  });
  JSON.stringify();
  console.log(data);
  // imgHttpLink = `${baseUrl}/file_download/?cid=${cid}&key=${key}&ip=${ip}&port=${port}&Id=${Id}&peerId=${peerId}&type=space&token=${deviceData.value.upload_file_token}`;

  files_download({ file_arr: JSON.stringify(data), token: token.value }).then(
    (res) => {
      console.log(res, "resssssssssssss");
    }
  );
  // console.log(imgCheckedData.value, "imgCheckedDataimgCheckedData");
};
const upload = () => {
  store.commit("upload/setUploadOptions", deviceData);
  // store.commit("upload/openUpload", deviceData.device_id);
};
const resetChecked = () => {
  emits("reset");
};

const handlerClick = async (type) => {
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
        });
    }
  } else if (type === "rename") {
    emits("update:singleData", checkedData.value[0]);
    emits("update:renameVisible", true);
  } else if (type === "copy") {
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
