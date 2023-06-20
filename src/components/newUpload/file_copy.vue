<template>
  <div class="uploader-file" :status="status">
    <slot
      :file="file"
      :list="list"
      :status="status"
      :paused="paused"
      :error="error"
      :response="response"
      :formated-average-speed="formatedAverageSpeed"
      :current-speed="currentSpeed"
      :is-complete="isComplete"
      :is-uploading="isUploading"
      :size="size"
      :formated-size="formatedSize"
      :uploaded-size="uploadedSize"
      :progress="progress"
      :progress-style="progressStyle"
      :progressing-class="progressingClass"
      :time-remaining="timeRemaining"
      :formated-time-remaining="formatedTimeRemaining"
      :type="type"
      :extension="extension"
      :file-category="fileCategory"
    >
      <div
        class="uploader-file-progress"
        :class="progressingClass"
        :style="progressStyle"
      />
      <div class="uploader-file-info">
        <div class="uploader-file-name" :title="file.name">
          <img class="iconfont-uploadType" :src="fileIcon" />
          {{ file.name }}
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
            <i>{{ formatedTimeRemaining }}</i>
          </span>
        </div>
        <div class="uploader-file-actions" v-if="status !== 'success'">
          <span
            class="uploader-file-pause"
            v-show="isBigFile"
            @click="pause()"
          />
          <span
            class="uploader-file-resume"
            v-show="!ISCIDING"
            @click="resume()"
          />️
          <span class="uploader-file-retry" @click="retry()" />
          <span class="uploader-file-remove" @click="remove()" />
        </div>
        <div
          class="uploader-file-actions"
          v-if="status === 'success'"
          @click="fileShare"
        >
          <div
            style="color: #3f2dec; text-decoration: underline; cursor: pointer"
          >
            Share
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup>
import Uploader from "simple-uploader.js";
import events from "./file-events";
import { secondsToStr } from "./utils";
import SparkMD5 from "spark-md5";
import { useStore } from "vuex";
import { ref, watch, onMounted, onUnmounted, toRefs, computed } from "vue";
import { debounce } from "lodash";
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
  list: {
    type: Boolean,
    default: false,
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

const { file, list, MAX_UPLOAD_NUM, curFileList } = toRefs(props);
const isFirst = ref(true);
const response = ref(null);
const paused = ref(false);
const error = ref(false);
const averageSpeed = ref(0);
const currentSpeed = ref(0);
const isComplete = ref(false);
const isUploading = ref(false);
const size = ref(0);
const formatedSize = ref("");
const uploadedSize = ref(0);
const progress = ref(0);
const timeRemaining = ref(0);
const type = ref("");
const extension = ref("");
const progressingClass = ref("");
const completed = ref(file.value.completed);
const ISCIDING = ref(false);
const isPause = ref(false);

const fileIconArr = ref({
  image: require("@/assets/fileType/icon_img.svg"),
  cmd: require("@/assets/fileType/icon_cmd.svg"),
  css: require("@/assets/fileType/icon_css.svg"),
  excel: require("@/assets/fileType/icon_excel.svg"),
  html: require("@/assets/fileType/icon_html.svg"),
  music: require("@/assets/fileType/icon_music.svg"),
  other: require("@/assets/fileType/icon_other.svg"),
  pdf: require("@/assets/fileType/icon_pdf.svg"),
  ppt: require("@/assets/fileType/icon_ppt.svg"),
  rar: require("@/assets/fileType/icon_rar.svg"),
  txt: require("@/assets/fileType/icon_text.svg"),
  video: require("@/assets/fileType/icon_video.svg"),
  word: require("@/assets/fileType/icon_word.svg"),
  file: require("@/assets/fileType/folder.svg"),
});
const isBigFile = ref(true);
const fileMd5 = ref(null);

const startUploadTime = ref(0);
const progressTimer = ref(null);

const email = computed(() => store.getters.userInfo?.email);
let fileIcon = computed(() => {
  let fileName = file.value.name.toLowerCase();
  if (
    fileName.endsWith(".jpeg") ||
    fileName.endsWith(".jpg") ||
    fileName.endsWith(".png") ||
    fileName.endsWith(".svg")
  ) {
    return fileIconArr.value.image;
  } else if (
    fileName.endsWith(".mp4") ||
    fileName.endsWith(".avi") ||
    fileName.endsWith(".mp4")
  ) {
    return fileIconArr.value.video;
  } else if (fileName.endsWith(".doc") || fileName.endsWith(".docx")) {
    return fileIconArr.value.word;
  } else if (
    fileName.endsWith(".zip") ||
    fileName.endsWith(".rar") ||
    fileName.endsWith(".gz") ||
    fileName.endsWith(".tar")
  ) {
    return fileIconArr.value.rar;
  } else if (fileName.endsWith(".cmd")) {
    return fileIconArr.value.cmd;
  } else if (fileName.endsWith(".css")) {
    return fileIconArr.value.css;
  } else if (fileName.endsWith(".mp3")) {
    return fileIconArr.value.music;
  } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
    return fileIconArr.value.excel;
  } else if (fileName.endsWith(".pdf")) {
    return fileIconArr.value.pdf;
  } else if (fileName.endsWith(".ppt")) {
    return fileIconArr.value.pdf;
  } else if (
    fileName.endsWith(".text") ||
    fileName.endsWith(".txt") ||
    fileName.endsWith(".md")
  ) {
    return fileIconArr.value.txt;
  } else if (fileName.endsWith(".html")) {
    return fileIconArr.value.html;
  } else if (fileName.endsWith("/")) {
    return fileIconArr.value.file;
  } else {
    return fileIconArr.value.other;
  }
});
let fileCategory = computed(() => {
  const isFolder = file.value.isFolder;
  let type = isFolder ? "folder" : "unknown";
  const categoryMap = file.value.uploader.opts.categoryMap;
  const typeMap = categoryMap || {
    image: ["gif", "jpg", "jpeg", "png", "bmp", "webp"],
    video: ["mp4", "m3u8", "rmvb", "avi", "swf", "3gp", "mkv", "flv"],
    audio: ["mp3", "wav", "wma", "ogg", "aac", "flac"],
    document: [
      "doc",
      "txt",
      "docx",
      "pages",
      "epub",
      "pdf",
      "numbers",
      "csv",
      "xls",
      "xlsx",
      "keynote",
      "ppt",
      "pptx",
    ],
  };
  Object.keys(typeMap).forEach((_type) => {
    const extensions = typeMap[_type];
    if (extensions.indexOf(extension.value) > -1) {
      type = _type;
    }
  });
  return type;
});

let progressStyle = computed(() => {
  let progress_val = Math.round(progress.value * 1000) / 1000;

  const style = `translateX(${(progress_val - 100).toFixed(4) - 0.01}%)`;
  return {
    progress: `${progress_val}%`,
    webkitTransform: style,
    mozTransform: style,
    msTransform: style,
    transform: style,
  };
});
let formatedAverageSpeed = computed(
  () => `${Uploader.utils.formatSize(averageSpeed.value)} / s`
);
let status = computed(() => {
  if (completed.value) {
    return "success";
  } else if (error.value) {
    return "error";
  } else if (isUploading.value) {
    return "uploading";
  } else if (paused.value) {
    return "paused";
  } else if (ISCIDING.value) {
    return "md5";
  } else {
    return "waiting";
  }
});
let statusText = computed(() => {
  const fileStatusText = file.value.uploader.fileStatusText;
  let txt = status.value;
  if (typeof fileStatusText === "function") {
    txt = fileStatusText(status.value, response.value);
  } else {
    txt = fileStatusText[status.value]();
  }
  if (ISCIDING.value && status.value == "paused") {
    txt = fileStatusText["md5"]();
  }

  return txt || status.value;
});

let formatedTimeRemaining = computed(() => {
  const file_val = file.value;
  if (
    timeRemaining.value === Number.POSITIVE_INFINITY ||
    timeRemaining.value === 0
  ) {
    return "";
  }
  let parsedTimeRemaining = secondsToStr(timeRemaining.value);
  const parseTimeRemaining = file_val.uploader.opts.parseTimeRemaining;

  if (parseTimeRemaining) {
    parsedTimeRemaining = parseTimeRemaining(
      timeRemaining.value,
      parsedTimeRemaining
    );
  }
  return parsedTimeRemaining;
});

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

  if (isFirst.value) {
    let params = {
      orderId: file.value.orderId,
      deviceType: file.value.deviceType,
      sourcePath: file.value.urlPrefix,
      destPath: encodeURIComponent(file.value.urlFileName),

      email: email.value,
      foggieToken: file.value.foggieToken ? file.value.foggieToken : "",
    };

    let res = await isCanUpload_Api(params);

    if (res.code == 200 && res.data) {
      beginUpload();
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
  } else {
    let params = {
      email: email.value,
      orderId: file.value.orderId,
      deviceType: file.value.deviceType,
      md5: fileMd5.value,
    };
    resumeUpload_Api(params)
      .then((res) => {
        if (res.code == 200) {
          beginUpload();
        } else {
          fileError();
        }
      })
      .catch((error) => {
        fileError();
      });
  }
}, 600);

const pause = () => {
  let params = {
    email: email.value,
    orderId: file.value.orderId,
    deviceType: file.value.deviceType,
    md5: fileMd5.value,
    destPath: encodeURIComponent(file.value.urlFileName),
  };
  cancelUpload_Api(params).then((res) => {
    if (res.code == 200) {
      clearInterval(progressTimer.value);
      progressTimer.value = null;

      isUploading.value = false;
      isPause.value = true;
      paused.value = true;
      startUploadTime.value = 0;

      let data = {
        id: file.value.id,
        paused: true,
        type: "paused",
      };

      file.value.fileUploading = false;

      emits("chanStatus", data);

      file.value.cancel();
    }
  });
};
const remove = () => {
  let params = {
    email: email.value,
    orderId: file.value.orderId,
    deviceType: file.value.deviceType,
    md5: fileMd5.value,
  };
  deleteUploadFile_Api(params).then((res) => {
    if (res.code == 200) {
      clearInterval(progressTimer.value);
      progressTimer.value = null;
      paused.value = true;

      if (file.value.size > FILE_SIZE) {
        isPause.value = true;
        paused.value = true;
        emits("remove", file.value.id);
      } else {
        isPause.value = true;
        paused.value = true;

        emits("remove", file.value.id, file.value.orderId);
      }
    }
  });
};
const retry = () => {
  file.value.fileUploading = true;
  file.value.error = false;
  error.value = false;
  isComplete.value = true;
  isUploading.value = false;
  paused.value = true;
  resume();
};

function beginUpload() {
  isFirst.value = false;
  file.value.fileUploading = true;
  averageSpeed.value = 0;

  isPause.value = false;
  paused.value = false;
  file.value.paused = false;

  if (file.value.size > FILE_SIZE) {
    isUploading.value = false;
    fileLoad(file);
  } else {
    isUploading.value = true;
    isBigFile.value = false;
    smallLoad(file.value);
  }
}

const initFile = () => {
  resume();
  paused.value = file.value["paused"];
  error.value = file.value["error"];

  currentSpeed.value = file.value["currentSpeed"];

  isComplete.value = file.value["isComplete"]();
  progress.value = file.value["progress"]();
  timeRemaining.value = file.value["timeRemaining"]();
  size.value = file.value["getSize"]();
  formatedSize.value = file.value["getFormatSize"]();
  uploadedSize.value = file.value["sizeUploaded"]();
  type.value = file.value["getType"]();
  extension.value = file.value["getExtension"]();

  const _handlers = ref({});

  const handlers = (_handlers.value = {});

  const eventHandler = (event) => {
    handlers[event] = (...args) => {
      fileEventsHandler(event, args);
    };
    return handlers[event];
  };
  events.forEach((event) => {
    file.value.uploader.on(event, eventHandler(event));
  });
};
const fileShare = () => {
  emits("fileShare", file.value);
};

const toPath = () => {
  // console.log(file.value);
  // const folderPath = "/path/to/folder";
  // remote.shell.openItem(folderPath);
};
const actionCheck = () => {
  paused.value = file.value.paused;
  error.value = file.value.error;
  isUploading.value = file.value.isUploading();
};
function getFileMd5(file, type) {
  return new Promise((resolve, reject) => {
    let fileReader = new FileReader();
    let spark = new SparkMD5.ArrayBuffer();
    ISCIDING.value = true;
    let blobSlice =
      File.prototype.slice ||
      File.prototype.mozSlice ||
      File.prototype.webkitSlice;
    let curChunks = 1;
    loadNext();

    function loadNext() {
      if (type == "big") {
        fileReader.readAsArrayBuffer(
          blobSlice.call(
            file.file,
            file.chunks[curChunks - 1].startByte,
            file.chunks[curChunks - 1].endByte
          )
        );
        curChunks++;
      } else {
        fileReader.readAsArrayBuffer(
          blobSlice.call(file.file, 0, file.value.size)
        );
      }
    }
    fileReader.onload = function (event) {
      // big file
      if (type == "big") {
        spark.append(event.target.result);
        if (curChunks - 1 == file.chunks.length) {
          let fileMd5 = spark.end();
          spark.destroy();
          ISCIDING.value = false;
          isUploading.value = true;
          resolve(fileMd5);
        } else {
          loadNext();
        }
      } else {
        // small file
        spark.append(event.target.result);
        let fileMd5 = spark.end();
        spark.destroy();
        ISCIDING.value = false;
        isUploading.value = true;
        resolve(fileMd5);
      }
    };
  });
}

async function initParams() {
  let params = {
    email: email.value,
    orderId: file.value.orderId,
    deviceType: file.value.deviceType,
    filePath: file.value.urlPrefix,
    destPath: encodeURIComponent(file.value.urlFileName),
    fileType: file.value.fileType,
    md5: fileMd5.value,
    foggieToken: file.value.foggieToken,
  };
  return params;
}

const smallLoad = async (smallFile) => {
  if (!fileMd5.value) {
    fileMd5.value = await getFileMd5(smallFile, "small");
    let params = await initParams();
    uploadFile(params, "small");
  } else {
    isUploading.value = true;
    loadUploadProgress();
  }
};
const fileLoad = async (file) => {
  if (!fileMd5.value) {
    fileMd5.value = await getFileMd5(file.value, "big");
    let params = await initParams();
    uploadFile(params, "big");
  } else {
    isUploading.value = true;
    loadUploadProgress();
  }
};

function uploadFile(params, type) {
  startUploadTime.value = new Date().getTime();
  fileUploadApi(params)
    .then((res) => {
      if (res.code == 200) {
        loadUploadProgress();
      } else {
        fileError();
      }
    })
    .catch((error) => {
      fileError();
    });
}

function loadUploadProgress() {
  let params = {
    email: email.value,
    orderId: file.value.orderId,
    deviceType: file.value.deviceType,
    md5: fileMd5.value,
  };
  let isFirst = true;
  let startUploadSize = 0;

  progressTimer.value = setInterval(() => {
    getUploadProgress();
  }, 1000);

  function getUploadProgress() {
    byMd5GetUploadProgress(params).then((res) => {
      let endTime = new Date().getTime();

      if (res.code == 200) {
        let response = res.data[0];

        if (isFirst) {
          startUploadSize = response.uploaded_size;
        }
        isFirst = false;

        if (response.uploaded_size == file.value.size) {
          clearInterval(progressTimer.value);
          progressTimer.value = null;
        } else {
          let uploaded_size = response.uploaded_size - startUploadSize;
          let time = (endTime - startUploadTime.value) / 1000;
          progress.value =
            (response.uploaded_size / file.value.size).toFixed(4) * 100;
          averageSpeed.value = uploaded_size / time;
          timeRemaining.value =
            (file.value.size - response.uploaded_size) / averageSpeed.value;
        }
      }
    });
  }
}

const processResponse = (message) => {
  let res = message;
  try {
    res = JSON.parse(message);
  } catch (e) {}
  response.value = res;
};
const fileEventsHandler = (event, args) => {
  const rootFile = args[0];
  const file = args[1];

  const target = list.value ? rootFile : file;
  if (file.value === target) {
    if (list.value && event === "fileSuccess") {
      processResponse(args[2]);
      return;
    }
  }
};
const fileProgress = () => {
  progress.value = file.value.progress();

  currentSpeed.value = file.value.currentSpeed;
  timeRemaining.value = file.value.timeRemaining();
  uploadedSize.value = file.value.sizeUploaded();
  actionCheck();
};
const fileSuccess = (rootFile, file, message) => {
  if (rootFile) {
    processResponse(message);
  }
  fileProgress();
  error.value = false;
  isComplete.value = true;
  isUploading.value = false;
};
const fileError = () => {
  fileProgress();

  let data = {
    id: file.value.id,
    error: true,
    type: "error",
  };
  file.value.fileUploading = false;

  emits("chanStatus", data);
  file.value.error = true;
  error.value = true;
  isComplete.value = false;
  isUploading.value = false;
};
const initStatus = (file) => {
  completed.value = file.value.completed;
};
watch(
  () => status,
  (newVal, oldVal) => {
    if (oldStatus && newStatus === "uploading" && oldStatus !== "uploading") {
      tid.value = setTimeout(() => {
        progressingClass.value = "uploader-file-progressing";
      }, 200);
    } else {
      clearTimeout(tid.value);
      progressingClass.value = "";
    }
  }
);
onMounted(() => {
  initFile();
});
onUnmounted(() => {
  clearInterval(progressTimer.value);
  progressTimer.value = null;

  let _handlers = ref({});
  const handlers = (_handlers.value = {});
  const eventHandler = (event) => {
    handlers[event] = (...args) => {
      fileEventsHandler(event, args);
    };
    return handlers[event];
  };
  events.forEach((event) => {
    file.value.uploader.off(event, eventHandler(event));
  });
  _handlers = null;
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
  background: linear-gradient(
    171deg,
    #8388fe 0%,
    #519ff4 42%,
    #b783c9 100%
  ) !important;
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

.uploader-file-actions > span {
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

.uploader-file-actions > span:hover {
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
