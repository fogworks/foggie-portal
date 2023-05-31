<template>
  <div class="uploader-file" :status="status">
    <slot :file="file" :list="list" :status="status" :paused="paused" :error="error" :response="response"
      :average-speed="averageSpeed" :formated-average-speed="formatedAverageSpeed" :current-speed="currentSpeed"
      :is-complete="isComplete" :is-uploading="isUploading" :size="size" :formated-size="formatedSize"
      :uploaded-size="uploadedSize" :progress="progress" :progress-style="progressStyle"
      :progressing-class="progressingClass" :time-remaining="timeRemaining"
      :formated-time-remaining="formatedTimeRemaining" :type="type" :extension="extension" :file-category="fileCategory">
      <div class="uploader-file-progress" :class="progressingClass" :style="progressStyle" />
      <div class="uploader-file-info">
        <div class="uploader-file-name" :title="file.name">
          <img class="iconfont-uploadType" :src="fileIcon" />
          {{ file.name }}
        </div>
        <div class="uploader-file-prefix">
          <a href="javascript:;" @click="toPath">{{ file.urlPrefix }} </a>
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
            <!-- <i>{{ formatedTimeRemaining }}</i> -->
          </span>
        </div>
        <div class="uploader-file-actions" v-if="status !== 'success'">
          <span class="uploader-file-pause" v-show="isBigFile" @click="pause()" />
          <span class="uploader-file-resume" v-show="!ISCIDING" @click="resume()" />️
          <span class="uploader-file-retry" @click="retry()" />
          <span class="uploader-file-remove" @click="remove()" />
        </div>
        <div class="uploader-file-actions" v-if="status === 'success'" @click="fileShare">
          <div style="color: #3f2dec; text-decoration: underline; cursor: pointer">
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
import axios from "axios";
import { useStore } from "vuex";
import {
  ref,
  watch,
  onMounted,
  onUnmounted,
  toRefs,
  computed,
  inject,
} from "vue";
import {
  Header,
  DeleteObjectRequest,
  Upload,
  DeleteObjectReq,
} from "@/pb/node_pb";

import {
  fileUpload,
  uploadMultipart,
  fileCompletesApi,
  SaveFile,
  isCanUpload_Api,
} from "@/api/upload";
import { ElMessage } from "element-plus";

const CHUNK_SIZE = 1024 * 1024 * 5;
const FILE_SIZE = 10 * 1024 * 1024;
const simultaneousUploads = 4;
const maxChunkRetries = 3;
const peerId = "12D3KooWDj1NkJ1DrVvpbBhtJ3nLCNA9CKyg3eynpiUTKsVEDkgx";
const token =
  "58df9379402ab6c87a51be426290e0f752ba5be4fe45736674a05dc12e642c50";

const emits = defineEmits([
  "fileShare",
  "fileDetail",
  "chanStatus",
  "uploadComplete",
  "getStatus",
  "getProgress",
  "remove",
]);
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
// const client = inject("client");
const isFirst = ref(true);
const response = ref(null);
const paused = ref(false);
const error = ref(false);
const averageSpeed = ref(0);
const lastAverageSpeed = ref(0);
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
const upload_id = ref("");
const blobFileArray = [];
const multipartFileArray = ref([]);
const curUploadList = ref([]); // 当前正在上传的 分片的数组
let uploadSucceedNumber = ref(0); //当前上传分片 成功的个数
const isBigFile = ref(true);
const timer = ref(null);
const abortController = ref(null);
const ArrayProgress = ref([]);
const NUMBER = ref(0);
const lastTime = ref(0);
const lastNUMBER = ref(0);
const NUMBER_timer = ref(null);
const aborted = ref(false);
const fileMd5 = ref(null);

const header = new Header();
header.setId(file.value.orderId);
header.setPeerid(peerId);
header.setToken(token);

const username = computed(() => store.getters.userInfo?.dmc);
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
  let progress_val = Math.floor(progress.value);
  const style = `translateX(${Math.floor(progress_val - 100) - 0.01}%)`;
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

const resume = async () => {
  if (!isFirst.value) {
    let number = 0;
    for (const item of curFileList.value) {
      if (item.id == file.value.id) continue;
      if (!item.completed) {
        if (item.error || item.paused) {
        } else {
          number++;
        }
      }
    }
    if (number >= MAX_UPLOAD_NUM.value) {
      ElMessage({
        message: `Maximum allowed to upload ${MAX_UPLOAD_NUM.value} files simultaneously`,
        type: "warning",
      });
      return;
    }
  }

  if (isFirst.value) {
    let params = {
      orderId: file.value.orderId,
      deviceType: file.value.deviceType,
      fileName: encodeURIComponent(file.value.urlFileName),
      email: email.value,
    };
    let res = await isCanUpload_Api(params);
    if (res.code == 200 && res.data) {
      // 可以上传
    } else {
      fileError();
      return;
    }
  }

  isFirst.value = false;
  if (timer.value) clearTimeout(timer.value), (timer.value = null);
  timer.value = setTimeout(() => {
    averageSpeed.value = 0;
    if (NUMBER_timer.value)
      clearInterval(NUMBER_timer.value), (NUMBER_timer.value = null);
    isPause.value = false;
    paused.value = false;
    file.value.paused = false;
    aborted.value = false;
    if (file.value.size > FILE_SIZE) {
      isUploading.value = false;
      fileLoad(file);
    } else {
      isUploading.value = true;
      isBigFile.value = false;
      smallLoad(file.value);
    }
  }, 600);
};

const initFile = () => {
  resume();
  paused.value = file.value["paused"];
  error.value = file.value["error"];
  averageSpeed.value = file.value["averageSpeed"];
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

async function Save_File() {
  if (file.value.deviceType != "3") {
    return true
  }
  let params = {
    md5: fileMd5.value,
    email: email.value,
    orderId: file.value.orderId,
    filePath: encodeURIComponent(file.value.urlFileName),
    fileSize: file.value.size,
    deviceType: file.value.deviceType,
  };
  let isSucceed = await SaveFile(params)
  if (isSucceed.code == 200) {
    return true
  } else {
    return false
  }
}

const toPath = () => {
  emits("fileDetail", file.value);
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
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, 0, file.size));
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

/**
 * @param fileResult  文件切片后 onload 回调中的 e.target.result
 *  */
async function initParams(params, fileResult) {
  let blobSlice =
    File.prototype.slice ||
    File.prototype.mozSlice ||
    File.prototype.webkitSlice;
  let form = new FormData();
  let spark = new SparkMD5.ArrayBuffer();
  form.append("deviceType", file.value.deviceType);
  form.append("fileCategory", "2");
  form.append("fileName", encodeURIComponent(file.value.urlFileName));
  form.append("email", email.value);
  form.append("uploadId", upload_id.value);
  form.append("partId", params.partId);
  form.append("fileSize", params.end - params.start);
  form.append("wholeFileSize", file.value.size);
  form.append("wholeMd5", fileMd5.value);
  form.append("minOffset", params.start);
  form.append("maxOffset", params.end);
  form.append("peerId", peerId);
  form.append("token", token);
  form.append("orderId", file.value.orderId);
  if (file.value.foggieToken) {
    form.append("foggieToken", file.value.foggieToken);
  }
  form.append(
    "file",
    blobSlice.call(file.value.file, params.start, params.end),
    file.value.urlFileName
  );

  await spark.append(fileResult);
  await form.append("md5", spark.end());

  return form;
}

const pause = () => {
  isUploading.value = false;
  isPause.value = true;
  paused.value = true;
  aborted.value = false;
  let data = {
    id: file.value.id,
    paused: true,
    type: "paused",
  };
  for (const item of curUploadList.value || []) {
    blobFileArray[item.partId - 1].uploading = false;
    blobFileArray[item.partId - 1].complete = false;
  }
  curUploadList.value = [];

  emits("chanStatus", data);
  if (abortController.value) {
    abortController.value.abort("Cancel request");
  }
  file.value.cancel();
};
const smallLoad = async (smallFile) => {
  abortController.value = new AbortController();
  let form = new FormData();
  let name = "";

  if (smallFile.file.webkitRelativePath) {
    name = smallFile.file.webkitRelativePath;
  } else {
    name = smallFile.name;
  }
  fileMd5.value = await getFileMd5(smallFile, "small");

  form.append("file", smallFile.file, name);
  form.append("fileCategory", 1);
  form.append("email", email.value);
  form.append("deviceType", +smallFile.deviceType);
  form.append("fileName", encodeURIComponent(name));
  form.append("md5", fileMd5.value);
  form.append("wholeMd5", fileMd5.value);

  form.append("fileType", smallFile.fileType);
  form.append("fileSize", smallFile.size);
  form.append("orderId", smallFile.orderId);
  form.append("foggieToken", smallFile.foggieToken);

  fileUpload(form, abortController.value, UploadProgress)
    .then(async (res) => {
      if (res.code == 200) {
        console.log(123);
        let succeed = await Save_File();
        if (!succeed) {
          fileError();
          return
        }
        console.log(456);
        progress.value = 100;
        completed.value = true;
        let data = {
          id: file.value.id,
          completed: true,
          type: "completed",
        };
        emits("chanStatus", data);
        file.value.completed = true;
        emits("uploadComplete", "Upload Success");
      } else {
        fileError();
      }
    })
    .catch(function () {
      fileError();
    });
};
const fileLoad = async (file) => {
  if (abortController.value) {
    abortController.value = null;
  }
  abortController.value = new AbortController();
  if (upload_id.value && upload_id.value != "") {
    isUploading.value = true;
    multipartUpload(file);
  } else {
    fileMd5.value = await getFileMd5(file.value, "big");
    let params = {
      fileName: encodeURIComponent(file.value.urlFileName),
      fileType: file.value.fileType,
      md5: fileMd5.value,
      fileSize: file.value.size,
      orderId: file.value.orderId,
      token: token,
      peerId: peerId,
      email: email.value,
      deviceType: file.value.deviceType,
      foggieToken: file.value.foggieToken,
    };
    uploadMultipart(params)
      .then((res) => {
        if (res.code == 200) {
          upload_id.value = res.data.uploadId;

          for (const item of file.value.chunks) {
            let params = {
              partId: item.offset + 1,
              start: item.startByte,
              end: item.endByte,
              complete: false, // 当前分片是否已经上传过(上传成功)
              uploading: false, // 当前分片是否正在上传中  true 上传中  false 没有再上传
            };
            blobFileArray.push(params);
            ArrayProgress.value.push(0);
          }

          ISCIDING.value = false;
          isUploading.value = true;
          multipartUpload(file);
        } else {
          if (res.code == 30032) {
            isUploading.value = false;
            completed.value = true;
            progress.value = 100;
            let data = {
              id: file.value.id,
              completed: true,
              type: "completed",
            };
            emits("chanStatus", data);
            emits("getStatus", "Upload Success");
          } else {
            fileError();
          }
        }
      })
      .catch((error) => {
        fileError();
      });
  }
};
const multipartUpload = () => {
  let blobSlice =
    File.prototype.slice ||
    File.prototype.mozSlice ||
    File.prototype.webkitSlice;
  for (const item of blobFileArray) {
    // 当前分片没有上传过 并且 没有在上传  并且 当前上传个数要小于 simultaneousUploads
    if (
      !item.complete &&
      !item.uploading &&
      curUploadList.value.length < simultaneousUploads
    ) {
      if (isPause.value || abortController.value.signal.aborted) {
        break;
      }
      item.uploading = true;
      curUploadList.value.push({
        partId: item.partId,
        start: item.startByte,
        end: item.endByte,
      });
      loadNext(item);
    }
  }

  function loadNext(item) {
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(
      blobSlice.call(file.value.file, item.start, item.end)
    );
    fileReader.onload = (event) => {
      BigUploadFile(item, event.target.result);
    };
  }

  emits("getStatus", "Uploading...");

  if (uploadSucceedNumber.value == blobFileArray.length) {
    if (blobFileArray.every((item) => item.complete == true)) {
      console.log("上传完了");
      fileCompletes();
    }
  }
};

const BigUploadFile = async (params, fileResult) => {
  let retrNum = 0; // 第一条线 重试次数
  let retrNumber = 0; //  第二条线重试次数

  let fileUploadParams = await initParams(params, fileResult);
  fileUpload(fileUploadParams, abortController.value, UploadProgress)
    .then(async (res) => {
      if (res.code == 200) {
        multipartFileArray.value.push({
          etag: res.data,
          partNumber: params.partId,
        });
        blobFileArray[params.partId - 1].uploading = false; // 上传成功 当前分片上传状态为 未上传
        blobFileArray[params.partId - 1].complete = true; // 上传成功 当前分片上传成功状态为 true  上传成功
        curUploadList.value = curUploadList.value.filter(
          (item) => item.partId != params.partId
        ); // 上传成功 正在上传的分片的数组去除当前分片
        uploadSucceedNumber.value++; // 当前分片上传成功数 加一
        multipartUpload();
      } else {
        if (abortController.value.signal.aborted) return;
        let isPass = await retrLoadNext(params.partId, false, fileUploadParams);
        if (typeof isPass === "string") {
          // 取消上传了
        } else {
          if (isPass) {
            multipartUpload();
          } else {
            fileError();
          }
        }
      }
    })
    .catch((error) => {
      if (error.message != "canceled") {
        fileError();
      }
    });

  /**
   * @param {Boolean} isSecond  是否使用第二条线路
   *
   *  */
  async function retrLoadNext(
    errorUploadPartId,
    isSecond = false,
    fileUploadParams
  ) {
    let isPass = false; // 是否成功

    isPass = await retryUpload(errorUploadPartId, isSecond, fileUploadParams);

    if (typeof isPass === "string") {
    } else {
      if (isPass) {
        return true;
      } else {
        if (isSecond) {
          retrNumber += 1;
          if (retrNumber >= maxChunkRetries) {
            return false;
          } else {
            if (abortController.value.signal.aborted) return "Cancel request";
            await retrLoadNext(errorUploadPartId, true, fileUploadParams);
          }
        } else {
          retrNum += 1;
          if (retrNum >= maxChunkRetries) {
            if (file.value.isGateway) {
              if (abortController.value.signal.aborted) return "Cancel request";
              await retrLoadNext(errorUploadPartId, true, fileUploadParams);
            } else {
              return false;
            }
          } else {
            if (abortController.value.signal.aborted) return "Cancel request";
            await retrLoadNext(errorUploadPartId, false, fileUploadParams);
          }
        }
      }
    }
  }

  function retryUpload(errorUploadPartId, isSecond, fileUploadParams) {
    return new Promise((resolve, reject) => {
      fileUpload(fileUploadParams, abortController.value, UploadProgress)
        .then(async (res) => {
          if (res.code == 200) {
            multipartFileArray.value.push({
              etag: res.data,
              partNumber: errorUploadPartId,
            });
            blobFileArray[errorUploadPartId - 1].uploading = false; // 上传成功 当前分片上传状态为 未上传
            blobFileArray[errorUploadPartId - 1].complete = true; // 上传成功 当前分片上传成功状态为 true  上传成功
            curUploadList.value = curUploadList.value.filter(
              (item) => item.partId != params.partId
            ); // 上传成功 正在上传的分片的数组去除当前分片
            uploadSucceedNumber.value++; // 当前分片上传成功数 加一
            resolve(true);
          } else {
            if (abortController.value.signal.aborted) {
              return "Cancel request";
            } else {
              resolve(false);
            }
          }
        })
        .catch((error) => {
          if (abortController.value.signal.aborted) {
            return "Cancel request";
          } else {
            resolve(false);
          }
        });
    });
  }
};
/* 提交文件 */
function fileCompletes() {
  if (NUMBER_timer.value)
    clearInterval(NUMBER_timer.value), (NUMBER_timer.value = null);

  let sortMultipartFileArray = multipartFileArray.value.toSorted((a, b) => {
    if (a.partNumber > b.partNumber) {
      return 1;
    } else {
      return -1;
    }
  });
  let params = {
    fileName: encodeURIComponent(file.value.urlFileName),
    uploadId: upload_id.value,
    parts: sortMultipartFileArray,
    orderId: file.value.orderId,
    fileSize: file.value.size,
    email: email.value,
    md5: fileMd5.value,
    deviceType: file.value.deviceType,
    foggieToken: file.value.foggieToken,
  };

  fileCompletesApi(params)
    .then(async (res) => {
      if (res.code == 200) {
        let data = {
          id: file.value.id,
          completed: true,
          type: "completed",
        };
        console.log(123);
        let succeed = await Save_File();
        if (!succeed) {
          fileError();
          return
        }


        emits("chanStatus", data);
        file.value.completed = true;
        progress.value = 100;
        completed.value = true;
        emits("getStatus", "Upload Success");
        emits("uploadComplete", "Upload Success");
      } else {
        console.log("error");
        fileError();
      }
    })
    .catch((error) => {
      console.log(error);
      fileError();
    });
}

const UploadProgress = (progressEvent, part_number) => {
  if (part_number) {
    let number = ArrayProgress.value[part_number - 1];
    if (number < (progressEvent.loaded / progressEvent.total) * 100) {
      ArrayProgress.value[part_number - 1] =
        (progressEvent.loaded / progressEvent.total) * 100;
    }

    NUMBER.value = ArrayProgress.value.reduce((cur, next) => {
      return cur + next;
    }, 0);

    let uploadProgress =
      (NUMBER.value / (100 * ArrayProgress.value.length)).toFixed(2) * 100;
    progress.value = uploadProgress < 100 ? uploadProgress : 99;

    let curTime = new Date().getTime();
    let time = (curTime - lastTime.value) / 1000;

    if (time >= 0.5) {
      if (lastTime.value == 0) {
        averageSpeed.value =
          Number(NUMBER.value / (100 * ArrayProgress.value.length)) *
          file.value.size;
      } else {
        averageSpeed.value =
          Number(
            (NUMBER.value - lastNUMBER.value) /
            (100 * ArrayProgress.value.length * time)
          ) * file.value.size;
      }
      lastTime.value = curTime;
      lastNUMBER.value = JSON.parse(JSON.stringify(NUMBER.value));
    }

    if (NUMBER_timer.value) {
      clearInterval(NUMBER_timer.value);
      NUMBER_timer.value = null;
    }
    NUMBER_timer.value = setInterval(() => {
      averageSpeed.value = (Math.random() / 1000) * file.value.size;
    }, 1000);
  } else {
    let uploadProgress =
      (progressEvent.loaded / progressEvent.total).toFixed(2) * 100;
    progress.value = uploadProgress < 100 ? uploadProgress : 99;
    averageSpeed.value = progressEvent.loaded - lastAverageSpeed.value;
    lastAverageSpeed.value = progressEvent.loaded;
    if (NUMBER_timer.value) {
      clearInterval(NUMBER_timer.value);
      NUMBER_timer.value = null;
    }
    NUMBER_timer.value = setInterval(() => {
      averageSpeed.value = (Math.random() / 100000) * file.value.size;
    }, 1000);
  }
};

const remove = () => {
  if (file.value.size > FILE_SIZE && upload_id.value) {
    if (abortController.value) abortController.value.abort("Cancel request");
    isPause.value = true;
    paused.value = true;
    aborted.value = false;
    emits("remove", file.value.id);
    file.value.cancel();

    // const deletReq = new DeleteObjectReq();
    // const DeleteRequest = new DeleteObjectRequest();
    // const uploadID = new Upload();
    // deletReq.setHeader(header);

    // uploadID.setKey(encodeURIComponent(file.value.urlFileName));
    // uploadID.setUploadid(upload_id.value);

    // DeleteRequest.setCidsList([""]);
    // DeleteRequest.setObjectType("multipart");
    // DeleteRequest.setObjectsList([uploadID]);
    // deletReq.setRequest(DeleteRequest);

    // if (abortController.value)
    //   abortController.value.abort("Cancel request");

    // client.deleteObject(deletReq, {}, (error, res) => {
    //   isPause.value = true;
    //   paused.value = true;
    //   aborted.value = false;
    //   emit("remove", file.value.id);
    //   file.value.cancel();
    // });
  } else {
    if (abortController.value) abortController.value.abort("Cancel request");
    isPause.value = true;
    paused.value = true;
    aborted.value = false;

    emits("remove", file.value.id);
    file.value.cancel();
  }
};
const retry = () => {
  file.value.error = false;
  error.value = false;
  isComplete.value = true;
  isUploading.value = false;
  paused.value = true;
  resume();
};
const processResponse = (message) => {
  let res = message;
  try {
    res = JSON.parse(message);
  } catch (e) { }
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
    // this[`_${event}`].apply(this, args);
  }
};
const fileProgress = () => {
  progress.value = file.value.progress();
  averageSpeed.value = file.value.averageSpeed;
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
const fileComplete = () => {
  fileSuccess();
};
const fileError = () => {
  fileProgress();
  if (abortController.value) {
    abortController.value.abort("Cancel request");
  }
  let data = {
    id: file.value.id,
    error: true,
    type: "error",
  };
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
  if (timer.value) clearTimeout(timer.value), (timer.value = null);
  if (NUMBER_timer.value)
    clearInterval(NUMBER_timer.value), (NUMBER_timer.value = null);
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
  color: #5d9cff;
  text-align: center;
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
