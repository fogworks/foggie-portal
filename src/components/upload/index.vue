<template>
  <div class="upload_dialog" @click="closeUploadBox">
    <!-- my_top_upload -->
    <div class="upload_dialog_wrap vood_dialog_wrap" @click.stop="">
      <div>
        <!-- my_top_uploadText my_top_uploadTitle -->
        <div class="upload_dialog_title">Publish</div>
        <div class="my_top_uploadText">
          Support single file and directory upload. The maximum upload size of a
          single file is 2GB. If there are large files, you can choose to slice
          them with tools before uploading
        </div>
        <div class="my_top_uploadText">The OOD you have chosen is: 456</div>
      </div>
      <uploader
        style="position: relative"
        ref="uploader"
        class="uploader-app"
        :multiple="true"
        :options="options"
        :auto-start="false"
        :file-status-text="fileStatusText"
        @files-added="onFilesAdded"
        @file-added="onFileAdded"
      >
        <uploader-unsupport />
        <uploader-drop>
          <uploader-btn class="uploader-btn" :single="true"
            >Select File</uploader-btn
          >
          <uploader-btn class="uploader-btn" :directory="true" :single="true"
            >Select a folder</uploader-btn
          >
        </uploader-drop>
      </uploader>

      <template
        v-for="(uploadList, key) in uploadFileList"
        :key="key"
        style="height: 100%"
      >
        <fileList
          @fileShare="fileShare"
          @fileDetail="fileDetail"
          :orderID="key"
          v-model:uploadLists="uploadFileList[key]"
          v-show="key == orderId"
        >
        </fileList>
      </template>

      <!-- <div class="uploader-list" v-if="isEmpty">
        <ul>
          <li>
            <div class="uploader-file-info head-info">
              <div class="uploader-file-name">File Name</div>
              <div class="uploader-file-prefix">Upload Path</div>
              <div class="uploader-file-size">File Size</div>
              <div class="uploader-file-status">Upload Status</div>
              <div class="uploader-file-actions">Operate</div>
            </div>
          </li>

        </ul>
      </div> -->
    </div>
  </div>
</template>

<script>
import {
  ref,
  reactive,
  onMounted,
  toRefs,
  readonly,
  provide,
  computed,
} from "vue";
import fileList from "../upload/fileList.vue";
import uploader from "vue-simple-uploader";
import { useStore } from "vuex";

import { APIClient } from "@/pb/node_grpc_web_pb";

export default {
  name: "DashBoard",
  components: { fileList },

  setup(props, { emit }) {
    const currentPath = ref("");

    const FILE_SIZE = readonly(1024 * 1024 * 1024 * 2);
    const store = useStore();
    const orderId = computed(() => store.getters.orderId);

    const deviceType = computed(() => store.getters.deviceType);

    const uploadFileList = computed(() => store.state.upload.uploadFileList);

    const options = ref({
      simultaneousUploads: 5,

      chunkSize: 1024 * 1024 * 5,
      forceChunkSize: true, // 是否强制每个块都小于 chunkSize
      allowDuplicateUploads: true, //如果说一个文件已经上传过了是否还允许再次上传。默认的话如果已经上传了，除非你移除了否则是不会再次重新上传的，所以也就是默认值为 false。
    });
    // const client = new APIClient('http://154.31.34.194:9007')
    const client = new APIClient("http://218.2.96.99:8007");
    // window.client = client
    provide("client", readonly(client));

    const alertTitle = ref("");
    const fileStatusText = ref({
      success: () => "Upload Success",
      error: () => "Upload Error",
      uploading: () => "Uploading...",
      paused: () => "Paused...",
      waiting: () => "Waiting...",
      md5: () => "Calculating file hash value...",
      CID: () => "Calculate CID...",
    });
    const fileList = ref([]);

    const onFileAdded = (file) => {
      if (file.size === 0) return;
      if (file.size > FILE_SIZE) {
        ElMessage({
          message:
            "The maximum upload size of a single file should not exceed 2GB.",
          type: "warning",
          duration: 3000,
        });
        return;
      }

      let directory = file.file.webkitRelativePath;
      let directoryPath = directory.substr(0, directory.lastIndexOf("/") + 1);
      let target = "";
      file.paused = false;
      file.rootPath = currentPath.value;
      file.deviceType = deviceType.value;
      file.urlPath = target;

      file.urlPrefix = directoryPath
        ? currentPath.value + directoryPath
        : currentPath.value || "/";
      file.urlFileName = directoryPath
        ? currentPath.value + directoryPath + file.name
        : currentPath.value + file.name;

      let list = store.state.upload.uploadFileList[orderId.value] ?? [];
      if (
        list.some(
          (item) =>
            item.uniqueIdentifier == file.uniqueIdentifier &&
            item.urlPrefix == file.urlPrefix
        )
      ) {
        // 唯一标识  + 文件夹路径如果相同
        return;
      }

      file.orderId = orderId.value;

      list.unshift(file);
      store.commit("upload/setFileList", list);
    };
    const onFileProgress = (rootFile, file, chunk) => {};
    const onFilesAdded = (files, fileList) => {};
    const onFileSuccess = () => {};
    const fileShare = (item) => {
      emit("fileShare", item);
    };
    const fileDetail = (file) => {
      // window.localStorage.setItem(
      //   "voodItem",
      //   JSON.stringify(currentOODItem.value.data)
      // );
      // emit("closeUploadBox");
    };

    const closeUploadBox = () => {
      store.commit("upload/closeUpload");
    };
    onMounted(() => {});

    return {
      FILE_SIZE,
      alertTitle,
      fileStatusText,
      fileList,
      options,
      uploadFileList,
      orderId,
      onFileAdded,
      onFileProgress,
      onFilesAdded,
      onFileSuccess,
      fileShare,
      fileDetail,
      closeUploadBox,
    };
  },
};
</script>

<style lang="scss" scoped>
.upload_dialog {
  position: fixed;
  width: 100vw;
  height: 100%;
  top: 0;
  left: 0;
  // background: #272735e3;
  z-index: 2000;
  background-color: rgba(0, 0, 0, 0.4);
  // -webkit-backdrop-filter: blur(20px) saturate(100%);
  // backdrop-filter: blur(20px) saturate(100%);

  .upload_dialog_wrap {
    position: fixed;
    width: 50%;
    height: 80%;
    top: 10%;
    left: 25%;

    // background-image: linear-gradient(to right, #69b8d7 0%, #745de6 100%);
    padding: 20px 50px;
    border-radius: 20px;
    animation-duration: 1s;
    -webkit-animation-timing-function: linear;
    animation-timing-function: linear;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
    animation-name: anim-open-don;
    box-shadow: inset 0 0 0 0.5px hsl(0deg 0% 100% / 30%);
    -webkit-backdrop-filter: blur(40px);
    color: #000;
    backdrop-filter: blur(40px);
    background: rgba(255, 255, 255, 0.6);
    .upload_dialog_title {
      text-align: center;
      font-size: 26px;
      height: 60px;
      line-height: 60px;
    }
    .upload_dialog_tips {
      font-size: 12px;
      // transform: scale(0.8);
      text-align: left;
      // text-indent: 20px;
    }
    .upload_dialog_currentood {
      font-size: 14px;
      height: 50px;
      line-height: 50px;
      display: flex;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .upload_dialog_content {
      padding: 1.875rem 0;
      background: rgba(255, 255, 255, 0.1);
      border: solid;
      border-image: url(@/assets/dashed-border.png) 2 round;
      // border: 3px dashed #ccc;
      border-radius: 0.625rem;
      text-align: center;
      margin-top: 20px;
    }
    .dialog_close_wrap {
      position: relative;
      .dialog_close_icon {
        position: absolute;
        top: -36px;
        right: -60px;
        width: 36px;
        height: 36px;
        -webkit-box-pack: center;
        place-content: center;
        background: linear-gradient(
          1turn,
          rgba(99, 106, 150, 0.4),
          rgba(182, 186, 214, 0.5)
        );
        box-sizing: border-box;
        box-shadow: 0 20px 40px rgb(0 0 0 / 15%),
          inset 0 0 0 0.5px hsl(0deg 0% 100% / 30%);
        -webkit-backdrop-filter: blur(40px);
        backdrop-filter: blur(40px);
        border-radius: 30px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover {
          transform: scale(1.1);
        }
      }
      .dialog_close {
        position: absolute;
      }
    }
  }
  .vood_dialog_wrap {
    min-width: 700px;
    // min-width: 1200px;
    width: 60%;
    height: 80%;
    top: 10%;
    left: 20%;
    padding: 20px;
    overflow-y: auto;
    :deep {
      .uploader-list {
        // max-height: 440px;
        // overflow: auto;
        // overflow-x: hidden;
        // overflow-y: auto;
        .head-info {
          font-size: 18px;
          > div {
            color: #000;
          }
        }
        .uploader-file-name,
        .uploader-file-size {
          text-align: left;
        }
      }
    }
  }
  .uploader-drop {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    background: transparent;
    border: 1px dashed #4f4f4f;
    // margin-bottom: 10px;
    padding: 10px 0;
    border-radius: 16px;
    text-align: center;
    .drop-title {
    }
  }
  .uploader-btn {
    min-width: 90px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 16px;
    // background: var(--btn-gradient);
    color: #004aff;
    border: none;
    transition: all 1s;
    &:hover {
      transform: scale(1.1);
    }
  }
  .uploader-file-progress {
    // background: #7378e24f;
  }
  .el-table,
  .el-table tr,
  .el-table th.el-table__cell {
    background: transparent;
  }
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background: transparent;
  }
  .el-table td.el-table__cell {
    border-color: #494646;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background-color: #4b525c;
    background-color: #4b525c;
    background: #f8f8f8;
    background: #f5f4f2;
    background: #6ab3d84a;
    cursor: pointer;
    color: #000;
  }
  .el-table--enable-row-hover
    .el-table__body
    tr:hover
    > td.el-table__cell
    .cell {
    color: #000;
  }
  .el-table th.el-table__cell > .cell,
  .el-table__body-wrapper .cell {
    color: #03040a;
    color: #fff;
    white-space: nowrap;
  }
  .el-table {
    margin-bottom: 30px;
  }
}
.uploader-app {
  /* width: 780px; */
  box-sizing: border-box;
  padding: 15px;
  /* margin: 10px auto 0; */
  margin-top: 10px;
  font-size: 12px;
  // box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  margin-left: 20px;
  margin-right: 20px;
}

.uploader .uploader-drop {
  overflow: inherit !important;
}

.uploader-app .uploader-btn {
  display: flex;
  align-items: center;
  margin: 0 20px;
  z-index: 999;
  // display: inline-block;
  position: relative;
  padding: 4px 8px;
  /* line-height: 1.4; */
  color: #dcd9d9;
  // border: 1px solid #d9d3d3 !important;
  cursor: pointer;
  border-radius: 16px;
  background: none;
  outline: none;
  // background: $light_blue;
  // background: var(--btn-gradient);

  color: #004aff;
}

.uploader-example {
  width: 100%;
  padding: 15px;
  margin: 0px auto 0;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  box-sizing: border-box;
  position: fixed;
  width: 820px;
  height: 80px;
}

.uploader-example .uploader-btn {
  margin-right: 4px;
}

.my_top_upload {
  width: 820px;
  height: 500px;
  background: #fff;
  position: fixed;
  top: 80px;
  /* right: 20px; */
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  color: #fff;
  cursor: pointer;

  border-radius: 10px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 2px 8px 0 rgb(0 0 0 / 16%);
  box-shadow: 0 0 10px #c7b9b9;

  /* z-index: 9999;
  border: 1px solid #e2e2e2; */
}

.uploader-file-progress {
  /* background: linear-gradient(
    171deg,
    #272eef 0%,
    #207ee4 42%,
    #e392ff 100%
  ) !important; */
}

.uploader-file-info {
  /* background: #3591f2 !important; */
  color: #000;
}

.my_top_upload_outer {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0px;
  right: 0px;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.2);
  -webkit-backdrop-filter: blur(20px) saturate(100%);
  backdrop-filter: blur(3px) saturate(100%);
  overflow: auto;
}

.my_top_uploadText {
  color: #000;
  font-size: 14px;
  // height: 30px;
  text-indent: 20px;
  text-align: left;
}

.my_top_uploadTitle {
  font-size: 26px;
  text-align: center;
  height: 50px;
  line-height: 50px;
}

.my_top_uploadText > label {
  font-size: 16px;
  position: absolute;
  left: 0;
  color: #fff;
}

.my_top_uploadText > label .el-checkbox__input {
  padding: 0;
  position: relative;
  display: inline-block;
  width: 16px;
}
</style>
