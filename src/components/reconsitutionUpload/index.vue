<template>
  <div>
    <div class="upload_dialog" @click="closeUploadBox" v-show="uploadIsShow">
      <div class="upload_dialog_wrap vood_dialog_wrap" @click.stop="">
        <div>
          <div class="upload_dialog_title">Publish</div>
          <div class="my_top_uploadText">
            Support single file and directory upload. The maximum upload size of
            a single file is 2GB. If there are large files, you can choose to
            slice them with tools before uploading
          </div>
          <div class="today-right">
            <div class="color-box">
              <el-button @click="[allFileListDrawer = true, loadFileListByState(3)]">
                File List
              </el-button>
            </div>
          </div>
        </div>
        <div style="position: relative" class="uploader-app">
          <div class="uploader-drop">
            <label class="uploader-btn" @click="openDialog('multiSelections')">Select File</label>
            <label class="uploader-btn" @click="openDialog('openDirectory')">Select a folder</label>
          </div>
        </div>
        <template v-for="(uploadList, key) in uploadFileList" :key="key" style="height: 100%">
          <fileList @fileShare="fileShare" @newQueueID="newQueueID" @updaFileListByState="updaFileListByState"
            :orderID="key" :ref="`fileListRef_${key}`" :uploadLists="uploadFileList[key]" v-show="key == orderId">
          </fileList>
        </template>
      </div>
    </div>


    <el-drawer v-model="allFileListDrawer" title="To be completed File list" direction="rtl" size="50%"
      :show-close="false">
      <template #header="{ close, titleId, titleClass }">
        <p :class="titleClass">
          <span v-if="requestFileList[orderId].isErrorOrWaiting == 'Waiting'">To be completed File list</span>
          <span v-else>Error File list</span>

        <div class="fs20"> List length # {{ total }}
          <!-- <span v-if="selectFilelist[orderId] && selectFilelist[orderId].length > 0"
            class="btn btn-light-success">Upload</span> -->
        </div>

        </p>
        <div class="color-box">
          <el-button @click="[requestFileList[orderId].isErrorOrWaiting = 'Waiting', loadFileListByState(3)]">
            Waiting
          </el-button>
        </div>
        <div class="color-box">
          <el-button @click="[requestFileList[orderId].isErrorOrWaiting = 'error', loadFileListByState(2)]"
            style="background: #EF6666;">
            Error
          </el-button>
        </div>

      </template>






      <div class="uploader-list">

        <el-table ref="multipleTable" class="TobeCompletedBox" :data="allFileList ?? []" :cell-style="{
          backgroundColor: 'transparent',
        }" :header-cell-style="{
  backgroundColor: 'transparent',
}" style="width: 100%;--el-table-border-color: none;" :show-overflow-tooltip="true"
          @selection-change="handleSelectionChange" :row-key="item => item.id">
          <el-table-column type="selection" width="55" :reserve-selection="true" :selectable='selectEnable' />
          <el-table-column prop="fileName" label="File Name" min-width="160">
            <template #default="{ row }">
              <el-tooltip placement="top">
                <template #content>
                  <div>{{ row.fileName }}</div>
                </template>
                <span>
                  <img :src="getFileType(row.fileName)" alt="" srcset="" style="width: 15px;height: 30px;" />
                  <span class="ml-8">{{ row.fileName }}</span>
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="urlPrefix" label="Upload Path" min-width="240" align="center">
            <template #default="{ row }">
              <el-tooltip placement="top">
                <template #content>
                  <div>{{ row.urlPrefix }}</div>
                </template>
                <a href="javascript:;">{{ row.urlPrefix }} </a>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="File Size" align="center">
            <template #default="{ row }">{{ formatSize(row.size) }}</template>
          </el-table-column>
          <el-table-column label="Operate" width="120" align="center">
            <template #default="{ row }">
              <el-link class="link" :underline="false" v-if="requestFileList[orderId].isErrorOrWaiting == 'error'">
                <svg-icon icon-class="refresh"></svg-icon>
              </el-link>
              <el-link class="link" :underline="false" @click="remove(row)">
                <el-icon size="25">
                  <CloseBold />
                </el-icon>
              </el-link>
            </template>
          </el-table-column>
        </el-table>



        <!-- <div class="uploader-file-info head-info">
          <div class="uploader-file-name" style="width: 30%">File Name</div>
          <div class="uploader-file-prefix" style="width: 35%">Upload Path</div>
          <div class="uploader-file-size" style="width: 25%">File Size</div>
          <div class="uploader-file-actions">Operate</div>
        </div> -->

        <!-- <div class="TobeCompletedBox">
          <template v-for="(curFile, index) in (allFileList ?? [])" :key="curFile.id">
            <TobeCompleted @deleteAllFileList="deleteAllFileList" :curFile="curFile" :orderID="orderId">
            </TobeCompleted>
          </template>
        </div> -->
        <el-pagination v-if="total > 0" @size-change="handleSizeChange" prev-icon="DArrowLeft" next-icon="DArrowRight"
          @current-change="handleCurrentChange" :page-sizes="[20, 50, 100]" background :page-size="pageSize"
          :current-page="pageNo" :pager-count="5" layout="prev, pager, next,sizes,jumper," :total="total"
          style="margin: 40px 60px 20px 0px; justify-content: end">
        </el-pagination>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  readonly,
  provide,
  watch,
  watchEffect,
  nextTick,
  computed,
  getCurrentInstance,
} from "vue";
import { ElMessage } from "element-plus";

import { getfileListByState, uploadFolder } from "@/api/upload";
import { getFileType } from "@/utils/getFileType";
import {
  deleteUploadFile_Api,
} from "@/api/upload";
// import TobeCompleted from "@/components/reconsitutionUpload/TobeCompleted.vue";
import fileList from "./fileList.vue";
import { debounce } from "lodash";
import { generateUniqueId, formatSize } from "./utils";
const path = require('path');
const fs = window.require('fs');
const { dialog } = window.require("electron").remote;

/* dialog.showOpenDialog 的配置项包括：
title：对话框的标题。
defaultPath：默认打开的路径。
buttonLabel：按钮的文本标签。
filters：可选择的文件类型，可以是一个数组，每个元素包含一个名称和一个文件扩展名的对象。

properties：对话框的属性，可以是一个数组，包含以下选项：
openFile：允许选择文件。
openDirectory：允许选择文件夹。
multiSelections：允许选择多个文件。
showHiddenFiles：显示隐藏文件。
createDirectory：允许创建新文件夹。
promptToCreate：提示用户是否创建新文件夹。
message：对话框的消息文本。  
securityScopedBookmarks：是否启用安全范围书签。 */


import { useStore } from "vuex";
const _this = getCurrentInstance();
const multipleTable = ref()
const emit = defineEmits(["fileShare"]);
const currentPath = ref("");
const allFileListDrawer = ref(false);

let uploadIsShow = computed(() => store.getters.uploadIsShow);
const store = useStore();
const email = computed(() => store.getters.userInfo?.email);
const orderId = computed(() => store.getters.orderId);
const deviceData = computed(() => store.getters.deviceData);
const deviceType = computed(() => store.getters.deviceType);

const customFileList = reactive({});  // 当前自己点击上传的文件
const uploadFileList = reactive({});  // 当前队列中的文件
const selectFilelist = reactive({})  // 当前选择上传的文件


const requestFileList = reactive({})  // 接收数据库中的文件列表信息

watch(() => orderId.value, (newVal, oldVal) => {
  if (!requestFileList[newVal]) {
    requestFileList[newVal] = {
      isErrorOrWaiting: 'Waiting',
      error: {
        fileList: [],
        pageNo: 1,
        pageSize: 50,
        total: 0
      },
      Waiting: {
        fileList: [],
        pageNo: 1,
        pageSize: 50,
        total: 0
      }
    }
  }
  if (!customFileList[newVal]) {
    customFileList[newVal] = []
  }

}, { immediate: true })


const pageNo = computed(() => {
  let type = requestFileList[orderId.value].isErrorOrWaiting
  return requestFileList[orderId.value][type].pageNo
})

const pageSize = computed(() => {
  let type = requestFileList[orderId.value].isErrorOrWaiting
  return requestFileList[orderId.value][type].pageSize
})

const total = computed(() => {
  let type = requestFileList[orderId.value].isErrorOrWaiting
  return requestFileList[orderId.value][type].total
})



const allFileList = computed({
  get() {
    let customList = customFileList[orderId.value] || []
    let requestList = []
    let type = requestFileList[orderId.value].isErrorOrWaiting
    requestList = requestFileList[orderId.value][type].fileList || []
    return type == 'Waiting' ? customList.concat(requestList) : requestList
  }
})
const tokenMap = computed(() => store.getters.tokenMap);


// 选择文件的对话框Dialog
const openDialog = debounce(async function (type) {
  dialog.showOpenDialog({
    properties: [type],
    // filters: [
    //   { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
    //   { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
    //   { name: 'Custom File Type', extensions: ['as'] },
    //   { name: 'All Files', extensions: ['*'] }
    // ]
  }).then(result => {
    if (!result.canceled) {
      for (const filePath of result.filePaths) {
        if (type == 'openDirectory') {
          // 文件夹
          initDirectory(filePath)
        } else {
          // 文件
          initFile(filePath)
        }
      }
    }
  }).catch(err => {
    console.log(err)
  })
}, 500)

function initFile(filePath) {
  if (filePath) {
    const normalized_path = filePath.replace(/\\/g, path.sep);
    const file_name = path.basename(normalized_path);
    const fileDirectoryName = path.dirname(normalized_path);

    let file = {
      size: fs.statSync(filePath).size,
      paused: false,
      error: false,
      fileUploading: false,
      completed: false,
      id: generateUniqueId(),
      isFolder: false,
      isErrorFile: false,
      fileName: file_name,
      fileDirectoryName: fileDirectoryName,
      deviceType: deviceType.value,
      urlPrefix: filePath,
      urlFileName: currentPath.value ? currentPath.value : file_name,
      orderId: orderId.value,
      deviceData: deviceData.value,
      foggieToken: deviceType.value == 1 || deviceType.value == 2 ? tokenMap.value[orderId.value] ?? "" : ''
    }


    if (customFileList[orderId.value]) {
      if (customFileList[orderId.value].some(item => item.urlPrefix == filePath)) {
        return
      } else {
        customFileList[orderId.value].push(file);
      }
    } else {
      customFileList[orderId.value] = [];
      customFileList[orderId.value].push(file);
    }


    if (!selectFilelist[orderId.value]) {
      selectFilelist[orderId.value] = []
    }
    uploadFileList[orderId.value] = customFileList[orderId.value].concat(selectFilelist[orderId.value])
  }

}

function initDirectory(filePath) {
  if (filePath) {
    const normalized_path = filePath.replace(/\\/g, path.sep);
    // const fileDirectoryName = path.dirname(normalized_path);
    const fileDirectoryName = path.basename(normalized_path);
    if (fileDirectoryName == '.') {
      ElMessage({
        message:
          "The current path does not allow uploading",
        type: "warning",
        duration: 3000,
      });
      return
    }
    const dest_Path = fileDirectoryName.slice(fileDirectoryName.lastIndexOf(path.sep) + 1)

    let params = {
      orderId: orderId.value,
      deviceType: deviceType.value,
      sourcePath: filePath,
      destPath: currentPath.value ? currentPath.value : dest_Path,
      email: email.value
    }
    uploadFolder(params).then(res => {
      if (res.code == 200) {
        let params = {
          email: email.value,
          orderId: orderId.value,
          deviceType: deviceType.value,
          state: 3,
          pageNo: 1,
          pageSize: 1000,
        }
        getfileListByState(params).then(res => {
          if (res.code == 200) {
            requestFileList[orderId.value].Waiting.fileList = res.data.list.map(item => initDirectoryItem(item, 3))
            // allFileListDrawer.value = true
            nextTick(() => {
              for (const item of requestFileList[orderId.value].Waiting.fileList) {
                if (item) {
                  multipleTable.value.toggleRowSelection(item, true)
                }
              }
              uploadFileList[orderId.value] = customFileList[orderId.value].concat(selectFilelist[orderId.value])
            })

          }
        })




      }
    })
  }
}

function updaFileListByState(type) {
  loadFileListByState(type)
}

provide('StateType', computed(() => requestFileList[orderId.value].isErrorOrWaiting))



function loadFileListByState(type = 3) {
  let params = {
    email: email.value,
    orderId: orderId.value,
    deviceType: deviceType.value,
    state: type,
    pageNo: requestFileList[orderId.value][type == 3 ? 'Waiting' : 'error'].pageNo,
    pageSize: requestFileList[orderId.value][type == 3 ? 'Waiting' : 'error'].pageSize
  }
  getfileListByState(params).then(res => {
    if (res.code == 200) {
      requestFileList[orderId.value][type == 3 ? 'Waiting' : 'error'].total = res.data.count
      requestFileList[orderId.value][type == 3 ? 'Waiting' : 'error'].fileList = res.data.list.map(item => initDirectoryItem(item, type))
    }
  })
}

function initDirectoryItem(item, type) {
  let file = {
    size: item.file_size,
    paused: false,
    error: false,
    fileUploading: false,
    completed: false,
    id: item._id,
    isFolder: true,
    isErrorFile: type == 3 ? false : true,
    md5: item.md5,
    fileName: item.dest_path,
    fileDirectoryName: item.file_path ? item.file_path.replace(/\\/g, path.sep).replace(`${path.sep}${item.dest_path}`, '') : '',
    deviceType: deviceType.value,
    urlPrefix: item.file_path,
    urlFileName: item.dest_path,
    orderId: item.order_id,
    deviceData: deviceData.value,
    foggieToken: deviceType.value == 1 || deviceType.value == 2 ? tokenMap.value[orderId.value] ?? "" : ''
  }
  return file
}



/* 在上传过程中 每当有新的文件进行上传操作待上传列表中就删除对应的文件 */
const newQueueID = (id, fileOrderID) => {
  let customFileListIndex = customFileList[fileOrderID].findIndex((file) => file.id == id);
  let requestFileListIndex = requestFileList[fileOrderID].Waiting.fileList.findIndex((file) => file.id == id);
  if (selectFilelist[fileOrderID]) {
    let row = selectFilelist[fileOrderID].filter(item => item.id)[0]
    if (row) {
      multipleTable.value.toggleRowSelection(row, false)
    }
  }
  if (customFileListIndex > -1) {
    customFileList[fileOrderID].splice(customFileListIndex, 1);
  }
  if (requestFileListIndex > -1) {
    requestFileList[fileOrderID].Waiting.fileList.splice(requestFileListIndex, 1);
  }
};

/* 在待上传列表中删除指定文件 */
function remove(row) {
  const { id, isFolder, orderId, urlFileName, deviceType } = row
  let deleteType = requestFileList[orderId].isErrorOrWaiting == 'Waiting' ? 3 : 2
  if (isFolder) {
    //数据库文件
    let params = {
      email: email.value,
      orderId: orderId,
      deviceType: deviceType,
      destPath: urlFileName,
    };

    deleteUploadFile_Api(params).then(res => {
      if (res.code == 200) {
        loadFileListByState(deleteType)
        if (uploadFileList[orderId]) {
          let uploadFileList = uploadFileList[orderId].findIndex((file) => file.id == id);
          if (uploadFileList > -1) {
            uploadFileList[fileOrderID].splice(customFileListIndex, 1);
          }
        }
      }
    })
  } else {
    // 手动上传文件
    let customFileListIndex = customFileList[orderId].findIndex((file) => file.id == id);
    if (customFileListIndex > -1) {
      customFileList[fileOrderID].splice(customFileListIndex, 1);
    }
  }
}


function handleSelectionChange(selection) {
  selectFilelist[orderId.value] = selection
  uploadFileList[orderId.value] = customFileList[orderId.value].concat(selectFilelist[orderId.value])

}

function selectEnable(row) {
  if (!row.isFolder) {
    return false
  } else {
    return true
  }
}

/* 每页多少条 */
function handleSizeChange(val) {
  let type = requestFileList[orderId.value].isErrorOrWaiting
  requestFileList[orderId.value][type].pageSize = val
  if (type == 'Waiting') {
    loadFileListByState(3)
  } else {
    loadFileListByState(2)
  }

}
/* 当前页 */
function handleCurrentChange(val) {
  let type = requestFileList[orderId.value].isErrorOrWaiting
  requestFileList[orderId.value][type].pageNo = val

  if (type == 'Waiting') {
    loadFileListByState(3)

  } else {
    loadFileListByState(2)
  }
}



const closeUploadBox = () => {
  store.commit("upload/closeUpload");
};
const fileShare = (item) => {
  emit("fileShare", item);
};

onMounted(() => {

});
</script>

<style lang="scss" scoped>
.upload_dialog {
  position: fixed;
  width: 100vw;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 2000;
  background-color: rgba(0, 0, 0, 0.4);

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
      text-align: left;
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
        background: linear-gradient(1turn,
            rgba(99, 106, 150, 0.4),
            rgba(182, 186, 214, 0.5));
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
    // min-width: 700px;
    min-width: 900px;
    width: 60%;
    height: 80%;
    top: 10%;
    left: 20%;
    padding: 20px;
    overflow-y: auto;

    :deep {
      .uploader-list {
        .head-info {
          font-size: 18px;

          >div {
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
    padding: 10px 0;
    border-radius: 16px;
    text-align: center;

    .drop-title {}
  }

  .uploader-btn {
    min-width: 90px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 16px;
    color: #004aff;
    border: none;
    transition: all 1s;

    &:hover {
      transform: scale(1.1);
    }
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

  .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell {
    background-color: #4b525c;
    background-color: #4b525c;
    background: #f8f8f8;
    background: #f5f4f2;
    background: #6ab3d84a;
    cursor: pointer;
    color: #000;
  }

  .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell .cell {
    color: #000;
  }

  .el-table th.el-table__cell>.cell,
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
  box-sizing: border-box;
  padding: 15px;
  margin-top: 10px;
  font-size: 12px;
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

.my_top_uploadText>label {
  font-size: 16px;
  position: absolute;
  left: 0;
  color: #fff;
}

.my_top_uploadText>label .el-checkbox__input {
  padding: 0;
  position: relative;
  display: inline-block;
  width: 16px;
}

.today-right {
  cursor: pointer;
  position: absolute;
  right: 30px;
  top: 20px;
}

.el-drawer {
  .head-info:hover {
    background-color: transparent !important;
  }

  .uploader-list {
    height: 100% !important;
    overflow: hidden;
    position: relative;
    padding: 20px 0px;
    margin-left: 5px;
    margin-right: 5px;

    &>div {
      margin: 0;
      padding: 0;
    }

    .head-info {
      font-size: 18px;
      position: relative;
      height: 49px;
      line-height: 49px;
      overflow: hidden;
      border-bottom: 1px solid #7e7e7e;
      text-align: left;

      &>div {
        color: #000;
      }
    }

    .uploader-file-name,
    .uploader-file-size {
      text-align: left;
    }

    .TobeCompletedBox {
      height: calc(100% - 140px);
      overflow-y: auto;
      overflow-x: hidden;
      // &>.uploader-file {
      //   content-visibility: auto;
      //   contain-intrinsic-size: 50px;
      // }
    }

    .link {
      margin: 0px 10px;

      svg {
        font-size: 22px;
        margin-right: 5px;
      }

      &:hover {
        color: #409eff;
      }
    }

    ::v-deep {

      .el-table,
      .el-table tr {
        background-color: transparent;
      }

      .el-table td.el-table__cell {
        border-color: #363637;
      }

      .el-table tbody {
        border-bottom: 0px;
      }

      .el-table__body-wrapper .el-table__body tbody tr td {
        font-size: 14px;
        height: 60px;
        font-weight: 600;
        color: #c0bebe;
      }

      .el-table__inner-wrapper::before {
        background-color: transparent;
      }

      .el-checkbox__input .el-checkbox__inner {
        background: #999aa1 !important;
      }

      .el-checkbox__input.is-disabled .el-checkbox__inner {
        background-color: #0BB783 !important;
        border-color: #0BB783 !important;
      }

      .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #0BB783 !important;
        border-color: #0BB783 !important;
      }

      .el-pagination.is-background .el-pager li:not(.disabled).is-active {
        color: #FFFFFF !important;
        background-color: #0BB783 !important;
        border-color: #0BB783 !important;
        font-weight: 600;
      }

      .el-pagination.is-background .el-pager li {
        color: #7E8299;
        background-color: #E4E6EF;
        border: 1px solid #D9D9D9;
        border-color: #E4E6EF;
        border-radius: 4px 4px 4px 4px;

        font-size: 14px;
        font-family: HelveticaNeue-, HelveticaNeue;
        font-weight: normal;
        color: rgba(0, 0, 0, 0.65);
      }

      .el-table__empty-text {
        font-size: 18px;
        color: var(--el-border-color-lighter);

      }

      .el-pagination.is-background .btn-prev:disabled,
      .el-pagination.is-background .btn-next:disabled {
        background-color: rgb(255 255 255 / 30%);
      }

      .el-pagination__sizes .el-input__wrapper,
      .el-pagination__jump .el-input__wrapper {
        background-color: #E4E6EF;


      }
    }

  }
}

.color-box {
  @include color-box;
}

.el-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  width: auto;
  height: auto;

  color: #fff;
  border: none;
  border-radius: 45px;
  box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 20%);
  background: var(--btn-gradient);
}
</style>
