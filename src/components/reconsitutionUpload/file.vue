<template>
  <div class="uploader-file" :status="status">
    <div>
      <div class="uploader-file-progress" :class="progressingClass" :style="progressStyle" />
      <div class="uploader-file-info">
        <div class="uploader-file-name" :title="file.fileName">
          <img class="iconfont-uploadType" :src="fileIcon" />
          {{ file.fileName }}
        </div>
        <div class="uploader-file-prefix">
          <el-tooltip placement="top">
            <template #content>
              <div>{{ file.urlPrefix }}</div>
            </template>
            <a href="javascript:;" @click="toPath">{{ file.urlPrefix }} </a>
          </el-tooltip>
        </div>
        <div class="uploader-file-size">{{ formatedSize }}</div>
        <div class="uploader-file-status">
          <span class="uploader-file-status1" v-show="status !== 'uploading'">
            <span>{{ statusText }}</span>
            <span :class="ISCIDING ? 'fileLoader' : ''"></span>
          </span>

          <span v-show="status === 'uploading'">
            <span>{{ progressStyle.progress }}</span>
            <em style="margin-left: 10px">{{ formatedAverageSpeed }}</em>
            <i class="ml-5">{{ formatedTimeRemaining }}</i>
          </span>
        </div>
        <div class="uploader-file-actions" v-if="status !== 'success' && !loading">
          <span class="uploader-file-pause" v-show="isBigFile" @click="pause()" />
          <span class="uploader-file-resume" v-show="!ISCIDING" @click="resume()" />️
          <span class="uploader-file-retry" @click="retry()" />
          <span class="uploader-file-remove" v-if="!fileUploading" @click="remove()" />
        </div>
        <div class="uploader-file-actions" v-if="status === 'success'" @click="fileShare">
          <div style="color: #3f2dec; text-decoration: underline; cursor: pointer">
            Share
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatSize } from "./utils";
import SparkMD5 from "spark-md5";
import { useStore } from "vuex";
import { ref, watch, onMounted, onUnmounted, toRefs, computed } from "vue";
import { debounce } from "lodash";
import fileHook from "./fileHook.js";
import {
  fileUploadApi,
  byMd5GetUploadProgress,
  deleteUploadFile_Api,
  isCanUpload_Api,
  cancelUpload_Api,
  resumeUpload_Api,
} from "@/api/upload";
import { ElMessage, ElMessageBox } from "element-plus";

const FILE_SIZE = 10 * 1024 * 1024;

const emits = defineEmits(["fileShare", "chanStatus", "remove"]);
const props = defineProps({
  file: {
    type: Object,
    default() {
      return {};
    },
  },
  MAX_UPLOAD_NUM: {
    type: Number,
    default: 0,
  },
  curFileList: {
    type: Array,
    default() {
      return [];
    },
  },
});
const store = useStore();
const { file, MAX_UPLOAD_NUM, curFileList } = toRefs(props);
const isFirst = ref(true);
const paused = ref(false);
const error = ref(false);
const completed = ref(false);
const fileUploading = ref(false);
const ISCIDING = ref(false); // 计算md5
const averageSpeed = ref(0); // 上传速度
const formatedSize = ref(""); // 文件大小

const progress = ref(0); // 上传进度
const timeRemaining = ref(0); // 剩余大小

const is_created_succeed = ref(false); // 文件是否创建成功  true 成功 false 失败
const isBigFile = ref(true);
const fileMd5 = ref(null);
const loading = ref(false);

const startUploadTime = ref(0);
const progressTimer = ref(null);
const email = computed(() => store.getters.userInfo?.email);

async function beginUpload() {
  isFirst.value = false;

  averageSpeed.value = 0;
  file_paused(false)
  if (is_created_succeed.value) {
    loadUploadProgress();
  } else {
    let params = initParams();
    uploadFile(params);
  }
}

function initParams() {
  let params = {
    email: email.value,
    orderId: file.value.orderId,
    deviceType: file.value.deviceType,
    sourcePath: file.value.urlPrefix,
    destPath: file.value.urlFileName,
    foggieToken: file.value.foggieToken,
  };
  return params;
}

function uploadFile(params) {
  loading.value = true;
  ISCIDING.value = true;
  file_paused(true)
  fileUploadApi(params)
    .then((res) => {
      loading.value = false;
      if (res.code == 200) {
        fileMd5.value = res.data;
        is_created_succeed.value = true;
        ISCIDING.value = false;
        file_paused(false)
        file_fileUploading(true)
        loadUploadProgress();
      }else if(res.code == 30032){
        remove()
      }else {
        fileError();
      }
    })
    .catch((error) => {
      fileError();
      loading.value = false;
    });
}

function loadUploadProgress() {
  let params = {
    email: email.value,
    orderId: file.value.orderId,
    deviceType: file.value.deviceType,
    md5: fileMd5.value,
  };
  file_paused(false)
  file_fileUploading(true)
  completed.value = false


  let isFirst = true;
  startUploadTime.value = new Date().getTime();
  let startUploadSize = 0;

  progressTimer.value = setInterval(() => {
    getUploadProgress();
  }, 1000);

  function getUploadProgress() {
    byMd5GetUploadProgress(params)
      .then((res) => {
        let endTime = new Date().getTime();

        if (res.code == 200) {
          let response = res.data[0];

          if (isFirst) {
            startUploadSize = response.uploaded_size;
          }
          isFirst = false;

          if (response.state == 0) {
            file_fileUploading(true)

            let uploaded_size = response.uploaded_size - startUploadSize;
            let time = (endTime - startUploadTime.value) / 1000;
            progress.value = (response.uploaded_size / file.value.size).toFixed(4) * 100;
            averageSpeed.value = uploaded_size / time;
            timeRemaining.value = (file.value.size - response.uploaded_size) / (averageSpeed.value == 0 ? 1 : averageSpeed.value);
            if (response.uploaded_size == file.value.size) {
              ISCIDING.value == true
              file_paused(true)
            }
          } else if (response.state == 1) {
            progress.value = 100;
            ISCIDING.value == false
            file_paused(false)
            file_completed(true)
            file_fileUploading(false)

            clearInterval(progressTimer.value);
            progressTimer.value = null;
            let data = { id: file.value.id, error: true, type: "completed" };
            emits("chanStatus", data);
          } else if (response.state == 2) {
            fileError();
          }
        } else {
          fileError();
        }
      })
      .catch((error) => {
        fileError();
      });
  }
}

let params = {
  file,
  progress,
  timeRemaining,
  completed,
  error,
  fileUploading,
  paused,
  ISCIDING,
  averageSpeed,
};

const {
  fileIcon,
  progressStyle,
  formatedAverageSpeed,
  statusText,
  formatedTimeRemaining,
  status,
  progressingClass,
} = fileHook(params);

const fileShare = () => {
  emits("fileShare", file.value);
};

const toPath = () => {
  // console.log(file.value);
  // const folderPath = "/path/to/folder";
  // // 使用remote模块调用操作系统的文件管理器打开文件夹
  // remote.shell.openItem(folderPath);
};

const resume = debounce(async function () {
  if (!isFirst.value) {
    let number = 0;
    for (const item of curFileList.value) {
      if (item.id == file.value.id) continue;
      if (item.fileUploading) {
        number++;
        if (number >= MAX_UPLOAD_NUM.value) {
          ElMessage({
            message: `Maximum allowed to upload ${MAX_UPLOAD_NUM.value} files simultaneously`,
            type: "warning",
            grouping: true,
          });
          return false;
        }
      }
    }
  }

  file_paused(false)
  file_fileUploading(true)
  file_completed(false)
  loading.value = true

  // 文件创建成功 调用重传
  if (is_created_succeed.value && isBigFile.value) {
    let params = {
      email: email.value,
      orderId: file.value.orderId,
      deviceType: file.value.deviceType,
      destPath: file.value.urlFileName,
      md5: fileMd5.value,
    };


    resumeUpload_Api(params)
      .then((res) => {
        loading.value = false;
        if (res.code == 200) {
          beginUpload();
        } else {
          fileError();
        }
      })
      .catch((error) => {

        fileError();
      });
  } else {
    //创建失败重新上传
    let params = initParams();
    uploadFile(params);
  }
}, 600);

const pause = () => {
  let params = {
    email: email.value,
    orderId: file.value.orderId,
    deviceType: file.value.deviceType,
    destPath: file.value.urlFileName,
    md5: fileMd5.value
  };
  cancelUpload_Api(params).then((res) => {
    if (res.code == 200) {
      clearInterval(progressTimer.value);
      progressTimer.value = null;
      file_paused(true)
      file_fileUploading(false)
      let data = {
        id: file.value.id,
        paused: true,
        type: "paused",
      };
      emits("chanStatus", data);
    }
  });
};
const remove = () => {
  let params = {
    email: email.value,
    orderId: file.value.orderId,
    deviceType: file.value.deviceType,
    destPath: file.value.urlFileName,
  };
  deleteUploadFile_Api(params).then((res) => {
    if (res.code == 200) {
      clearInterval(progressTimer.value);
      progressTimer.value = null;
      file_paused(true)

      if (file.value.size > FILE_SIZE) {
        file_paused(true)
        emits("remove", file.value.id);
      } else {
        file_paused(true)
        emits("remove", file.value.id, file.value.orderId);
      }
    }
  });
};
const retry = () => {
  error.value = false;
  resume();
};
const fileError = () => {
  if (progressTimer.value) {
    clearInterval(progressTimer.value);
    progressTimer.value = null;
  }
  progress.value = 0;
  let data = {
    id: file.value.id,
    error: true,
    type: "error",
  };
  // file.value.fileUploading = false;

  ISCIDING.value = false;
  file_paused(false)
  file_completed(false)
  error.value = true;
  file.value.error = true
  loading.value = false
  file_fileUploading(false)
  emits("chanStatus", data);
};

const initFile = async () => {
  formatedSize.value = formatSize(file.value.size);
  file.value.size > FILE_SIZE
    ? (isBigFile.value = true)
    : (isBigFile.value = false);

  if (file.value.isErrorFile) {
    is_created_succeed.value = true;
    fileMd5.value = file.value.md5;
  } else {
    is_created_succeed.value = false;
  }

  if (!is_created_succeed.value) {
    if (file.value.isFolder) {
      beginUpload()

    } else {
      let params = {
        orderId: file.value.orderId,
        deviceType: file.value.deviceType,
        sourcePath: file.value.urlPrefix,
        destPath: file.value.urlFileName,
        email: email.value,
        foggieToken: file.value.foggieToken ? file.value.foggieToken : "",
      };
      let res = await isCanUpload_Api(params);
      if (res.code == 200 && res.data) {
        beginUpload();
        // 可以上传
      } else if (res.code == 30039) {
        ElMessageBox.confirm(
          "duplicate file name, are you sure to overwrite?",
          "Warning",
          {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        )
          .then(() => {
            beginUpload();
          })
          .catch(() => {
            remove();
          });
      } else {
        fileError();
        return;
      }

    }




  }


};

function file_paused(value) {
  paused.value = value
  file.value.paused = value
}
function file_fileUploading(value) {
  fileUploading.value = value
  file.value.fileUploading = value
}
function file_completed(value) {
  completed.value = value
  file.value.completed = value
}

onMounted(() => {
  initFile();
});
onUnmounted(() => {
  clearInterval(progressTimer.value);
  progressTimer.value = null;
});
</script>
<style>
.uploader-file {
  position: relative;
  height: 49px;
  line-height: 49px;
  overflow: hidden;
  border-bottom: 1px solid #7e7e7e;
}

.uploader-file[status="waiting"] .uploader-file-pause,
.uploader-file[status="uploading"] .uploader-file-pause {
  display: block;
}

.uploader-file[status="paused"] .uploader-file-resume {
  display: block;
}

.uploader-file[status="error"] .uploader-file-retry {
  display: block;
}

.uploader-file[status="success"] .uploader-file-remove {
  display: none;
}

.uploader-file[status="error"] .uploader-file-progress {
  background: #ffe0e0;
}

.uploader-file-progress {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(171deg,
      #8388fe 0%,
      #519ff4 42%,
      #b783c9 100%) !important;
  transform: translateX(-100%);
  overflow: hidden;
}

.uploader-file-progressing {
  transition: all 0.4s linear;
}

.uploader-file-info {
  position: relative;
  z-index: 1;
  height: 100%;
  overflow: hidden;
  font-size: 12px;
}

.uploader-file-info:hover {
  background-color: rgba(240, 240, 240, 0.2);
}

.uploader-file-info i,
.uploader-file-info em {
  font-style: normal;
}

.uploader-file-name,
.uploader-file-bucketName,
.uploader-file-prefix,
.uploader-file-size,
.uploader-file-meta,
.uploader-file-status,
.uploader-file-actions {
  float: left;
  position: relative;
  height: 100%;
  color: #000;
}

.uploader-file-name {
  width: 25%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-indent: 14px;
  color: #000;
}

.uploader-file-bucketName {
  width: 10%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-indent: 14px;
}

.iconfont-uploadType {
  width: 24px;
  height: 24px;
  display: inline-block;
  vertical-align: top;
  margin-top: 13px;
  margin-right: 8px;
}

.uploader-file-icon {
  width: 24px;
  height: 24px;
  display: inline-block;
  vertical-align: top;
  margin-top: 13px;
  margin-right: 8px;
}

.uploader-file-icon::before {
  content: "📃";
  display: block;
  height: 100%;
  font-size: 24px;
  line-height: 1;
  text-indent: 0;
}

.uploader-file-icon[icon="folder"]::before {
  content: "📂";
}

.uploader-file-icon[icon="image"]::before {
  content: "📊";
}

.uploader-file-icon[icon="video"]::before {
  content: "📹";
}

.uploader-file-icon[icon="audio"]::before {
  content: "🎵";
}

.uploader-file-icon[icon="document"]::before {
  content: "📋";
}

.uploader-file-size {
  width: 15%;
  text-indent: 10px;
}

.uploader-file-prefix {
  width: 30%;
  /* color: #5d9cff; */
  color: aliceblue;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.uploader-file-meta {
  width: 1%;
}

.uploader-file-status {
  width: 20%;

  /* text-indent: 20px; */
}

.uploader-file-actions {
  width: 10%;
}

.uploader-file-actions>span {
  display: none;
  float: left;
  width: 16px;
  height: 16px;
  margin-top: 16px;
  margin-right: 10px;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAABkCAYAAAD0ZHJ6AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAJcEhZcwAACxMAAAsTAQCanBgAAARkSURBVGje7ZnfS1NRHMAH4ptPkvQSuAdBkCxD8FUQJMEULUgzy1KyyPVQ4JMiiP4Bvg6EwUQQfMmwhwRDshwaKUjDVCgoSdDNHkzTJZ6+Z37Purve8+PeTb2TM/ggu+ew89l33x8H9BBCPG7GowXTJej3+wnDvEm0JuLC04+EYWftVAUv+fiCvDUdQR1BHUEdQR3BTIygvixoQS14XgTtthLVdpNWwXRLqvQ724LplFRtyrYF0yVpFLQrKRVMh6RZ0I6kkmCqklaCqpKZH0FX56Crq9jVfdDVk0RfFrSgFsxkQVmLcdKCVrKySCrryhPEyYShhzOcrFtG0EoilfHHk1CRU5rF6ZjNZhlVOW6RnMSVyyilKies4pO41diVy8wIujoHXV3FGdMHXTtJKLFYTLhZtq4vC1rwXApCZTIqgR6g1PBMCO9DL3bMMSqBHqDU8EyISDAHiGKvWwcCQG2KgjlAFCDAOhAAap0K5gKLphk8mqJgLrCIgoxRJ4J5wKpJ7gAoMkn5EBXBPGDVJHcAFJmkfIhQcAql1oBpTvTol9gG9pm4RHAKpdaAaU706JfYBvaZuJVgPQrt4sFlnOh5MC/p3lmJYD0K7eLBZZzoeTAv6d5ZnuAYHjpgEOnk5F0ufhG6v1ggOIaHDhhEOjl5l4tfhO4vthLcwAMrFNvLJO5vEwhu4IEViu1lEve3WQmyoihQFBzG/V0CQVYUBYqCw7i/SxTBcpsRbFeIYLnNCLZbCY5b5KAnxRwct8hBj9McZFVMW0ihRNBuFdMWUigRlFaxuQ9WWYjRMTiIe5z0wSoLMToGB3GPsA9aTZIJoB+nRgBnM1tzOkkmgH6cGgGczWzNpzqLx3n/aULJJgezeNw07oxQySbVywKjBOgFRnDs+VEsx8FlgVEC9AIjOPb8KJYjvSzoG7UW1IJaUAtqQS14toLNM5fN5APdwBJA8G83Pk/aK/rgzVvXzeQD3cASQPBvNz5P2ssTzAaGUIrHEO6zI5gNDKEUjyHcxxWkh4Ylcowwk1QQpIeGJXKMMJO0EgwqyjGCioJBJvDrxRMSuVOTJEXfbz1/bHwWtBL0yoQehK6RucgE+bGzanzulQh6E3IgQV+xpc8kcrfuSO7eTfJ3ZYmQw0Oy9azVKOk1C/bJ5D5F38YPeLfx0rjWJxHsS0SqsSYuxySjj5qO5Oj7xQWy2VBtFOwzCy6ryH3YfE3uh64Y1xckgstJPydEjkkeHv07Iy4Xaao15+KCWTBx6M/db+T9xivSErqaJDdzXI6yLRE8Vgg0coex/SPJvT0SbWu0KpZtbgSpCH3NRt7I5OxHkObc6heU+/M/J5vrpBFM5GBLqCQux14COXs5CNXK5OjPGm1tSMrJSOMNYQ4mVTGV/L6zTL7+DovkbFUxbSW0Wo05l8hJWsU+cRWfSh+Mt5Lb1ck/J1TvVsdDaR/MiEni+llsdZuZp62EViu+96bpNjNPWwmtVnzvFd5m9IVVC54x/wA7gNvqFG9vXQAAAABJRU5ErkJggg==");
  background-repeat: no-repeat;
  background-position: 0 0;
}

.uploader-file-actions>span:hover {
  background-position-x: -21px;
}

.uploader-file-actions .uploader-file-pause {
  cursor: pointer;
  background-position-y: 0;
}

.uploader-file-actions .uploader-file-resume {
  cursor: pointer;
  background-position-y: -17px;
}

.uploader-file-actions .uploader-file-retry {
  cursor: pointer;
  background-position-y: -53px;
}

.uploader-file-actions .uploader-file-remove {
  cursor: pointer;
  display: block;
  background-position-y: -34px;
}

.statusIcon {
  color: #23dc71;
  font-size: 18px;
  width: 20px;
  height: 20px;
  margin-right: 2px;
  display: inline-block !important;
  vertical-align: middle !important;
}

.uploader-file-status1 {
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.fileLoader {
  margin-left: 5px;
  position: relative;
  width: 30px;
  height: 30px;
  display: inline-block;
}

.fileLoader::after,
.fileLoader::before {
  content: "";
  display: inline-block;
  position: absolute;
  border: 2px solid #e76c6c;
  width: 25px;
  height: 25px;
  border-radius: 50%;
}

.fileLoader::after {
  border-top-color: transparent;
  border-bottom-color: transparent;
  animation: fileLoader1 1s linear infinite;
}

.fileLoader::before {
  border-left-color: transparent;
  border-right-color: transparent;
  animation: fileLoader2 1s linear infinite;
  width: 10px;
  height: 10px;
  left: 8px;
  top: 7px;
}

@keyframes fileLoader1 {
  0% {
    transform: rotate(0deg) scale(1, 1);
  }

  45% {
    transform: rotate(180deg) scale(0.8, 0.8);
  }

  90% {
    transform: rotate(360deg) scale(1, 1);
  }

  100% {
    transform: rotate(360deg) scale(1, 1);
  }
}

@keyframes fileLoader2 {
  0% {
    transform: rotate(360deg) scale(1, 1);
  }

  45% {
    transform: rotate(180deg) scale(0.8, 0.8);
  }

  90% {
    transform: rotate(0deg) scale(1, 1);
  }

  100% {
    transform: rotate(0deg) scale(1, 1);
  }
}
</style>
