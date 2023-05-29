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

<script>
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
  fileComplete,
  SaveFile,
} from "@/api/upload";
import { ElMessage } from 'element-plus'
const COMPONENT_NAME = "uploader-file";
const CHUNK_SIZE = 1024 * 1024 * 5;
const FILE_SIZE = 10 * 1024 * 1024;
const simultaneousUploads = 4;
const maxChunkRetries = 3;
const peerId = "12D3KooWDj1NkJ1DrVvpbBhtJ3nLCNA9CKyg3eynpiUTKsVEDkgx";
const token =
  "58df9379402ab6c87a51be426290e0f752ba5be4fe45736674a05dc12e642c50";

export default {
  name: COMPONENT_NAME,
  props: {
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
  },
  setup(props, { emit }) {
    const store = useStore();

    const { file, list, MAX_UPLOAD_NUM, curFileList } = toRefs(props);
    const client = inject("client");
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
    const currentChunk = ref(0);
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
    const blobFileArray = ref([]);
    const multipartFileArray = ref([]);
    const errorUploadArray = ref([]);
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
        timeRemaining.vlaue === Number.POSITIVE_INFINITY ||
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




    const resume = () => {
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
            type: 'warning',
          })

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
      emit("fileShare", file.value);
    };

    function Save_File() {
      let params = {
        md5: fileMd5.value,
        email: email.value,
        orderId: file.value.orderId,
        filePath: encodeURIComponent(file.value.urlFileName),
        fileSize: file.value.size,
        deviceType: +file.value.deviceType,
      };
      SaveFile(params).then((res) => { });
    }

    const toPath = () => {
      emit("fileDetail", file.value);
    };
    const _actionCheck = () => {
      paused.value = file.value.paused;
      error.value = file.value.error;
      isUploading.value = file.value.isUploading();
    };
    function getFileMd5(file) {
      return new Promise((resolve, reject) => {
        let fileReader = new FileReader();
        let spark = new SparkMD5.ArrayBuffer();
        let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;

        let curChunks = 1
        loadNext()

        function loadNext() {
          fileReader.readAsArrayBuffer(blobSlice.call(file.file, file.chunks[curChunks - 1].startByte, file.chunks[curChunks - 1].endByte));
          curChunks++
        }
        fileReader.onload = function (event) {
          // let fileMd5 = SparkMD5.ArrayBuffer.hash(event.target.result);
          spark.append(event.target.result);
          if (curChunks - 1 == file.chunks.length) {
            let fileMd5 = spark.end()
            spark.destroy()
            resolve(fileMd5);
          } else {
            loadNext()

          }
        }
      });
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
      emit("chanStatus", data);
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
      fileMd5.value = await getFileMd5(smallFile);

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
            await Save_File();
            progress.value = 100;
            completed.value = true;
            let data = {
              id: file.value.id,
              completed: true,
              type: "completed",
            };
            emit("chanStatus", data);
            file.value.completed = true;
            emit("uploadComplete", "Upload Success");
          } else {
            _fileError();
          }
        })
        .catch(function () {
          _fileError();
        });
    };
    const fileLoad = async (file) => {
      if (upload_id.value && upload_id.value != "") {
        isUploading.value = true;
        multipartUpload(file);
      } else {
        fileMd5.value = await getFileMd5(file.value);
        let params = {
          fileName: encodeURIComponent(file.value.urlFileName),
          fileType: file.value.fileType,
          md5: fileMd5.value,
          fileSize: file.value.size,
          orderId: file.value.orderId,
          token: token,
          peerId: peerId,
          email: email.value,
          deviceType: +file.value.deviceType,
          foggieToken: file.value.foggieToken,
        };

        uploadMultipart(params)
          .then((res) => {
            if (res.code == 200) {
              upload_id.value = res.data.uploadId;
              ISCIDING.value = true;
              let spark = new SparkMD5.ArrayBuffer();
              let blobSlice =
                File.prototype.slice ||
                File.prototype.mozSlice ||
                File.prototype.webkitSlice;
              let chunks = Math.ceil(file.value.size / CHUNK_SIZE);
              let currentChunk1 = 0;
              let fileReader = new FileReader();
              file.value.totalChunkCounts = chunks;
              loadNext();
              fileReader.onload = (e) => {
                spark.append(e.target.result);
                let start = currentChunk1 * CHUNK_SIZE;
                let end =
                  start + CHUNK_SIZE >= file.value.size
                    ? file.value.size
                    : start + CHUNK_SIZE;
                let blob = blobSlice.call(file.value.file, start, end);
                currentChunk1++;
                let form = new FormData();
                form.append("deviceType", file.value.deviceType);

                form.append("fileCategory", "2");
                form.append(
                  "fileName",
                  encodeURIComponent(file.value.urlFileName)
                );
                form.append("email", email.value);
                form.append("uploadId", upload_id.value);
                form.append("md5", spark.end());
                form.append("partId", currentChunk1);
                form.append("fileSize", end - start);
                form.append("wholeFileSize", file.value.size);
                form.append("wholeMd5", fileMd5.value);
                form.append("minOffset", start);
                form.append("maxOffset", end);
                form.append("peerId", peerId);
                form.append("token", token);
                form.append("orderId", file.value.orderId);
                form.append("file", blob, file.value.urlFileName);

                if (currentChunk1 == chunks) {
                  spark.destroy();
                }
                blobFileArray.value.push([form, false]);
                ArrayProgress.value.push(0);
                if (currentChunk1 < chunks) {
                  loadNext();
                } else {
                  ISCIDING.value = false;
                  isUploading.value = true;
                  multipartUpload(file);
                }
              };
              fileReader.onerror = () => {
                file.value.cancel();
              };

              function loadNext() {
                if (file.value && file.value.size) {
                  let start = currentChunk1 * CHUNK_SIZE;
                  let end =
                    start + CHUNK_SIZE >= file.value.size
                      ? file.value.size
                      : start + CHUNK_SIZE;
                  fileReader.readAsArrayBuffer(
                    blobSlice.call(file.value.file, start, end)
                  );
                } else {
                }
              }
            } else {
              if (res.code == 30032) {
                completed.value = true;
                progress.value = 100;
                let data = {
                  id: file.value.id,
                  completed: true,
                  type: "completed",
                };
                emit("chanStatus", data);
                emit("getStatus", "Upload Success");
              } else {
                _fileError();
              }
            }
          })
          .catch((error) => {
            _fileError();
          });
      }
    };
    const multipartUpload = (file) => {
      let retrNum = 0;
      let retrNumber = 0;
      if (abortController.value) {
        abortController.value = null;
      }
      abortController.value = new AbortController();
      let blobSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice;
      let chunks = Math.ceil(file.value.size / CHUNK_SIZE);
      let fileReader = new FileReader();
      async function loadNext() {
        let start = currentChunk.value * CHUNK_SIZE;
        let end = start + CHUNK_SIZE >= file.value.size ? file.value.size : start + CHUNK_SIZE;

        fileReader.readAsArrayBuffer(
          blobSlice.call(file.value.file, start, end)
        );
      }

      async function uploadChunk() {
        return new Promise((resolve, reject) => {
          let isLast = false;

          if (currentChunk.value + 1 == blobFileArray.value.length) {
            isLast = true;
          }

          if ((currentChunk.value + 1) % simultaneousUploads == 0 || isLast) {
            let request = [];
            let curUploadIndex = [];
            for (const item of blobFileArray.value) {
              if (!item[1]) {
                if (request.length >= simultaneousUploads) break;
                request.push(item);
                curUploadIndex.push(item[0].get("partId") - 1);
              }
            }
            request = request.map((item) => {
              return fileUpload(item[0], abortController.value, UploadProgress);
            });

            Promise.allSettled(request)
              .then(async (...res) => {
                let index = 0;
                let errorUploadArray = [];
                res[0].forEach((item, nindex) => {
                  if (item.status == "fulfilled" && item.value?.code == 200) {
                    let blobFileArrayIndex = curUploadIndex[nindex];
                    blobFileArray.value[blobFileArrayIndex][1] = true;
                    multipartFileArray.value.push({
                      etag: item.value?.data,
                      partNumber: curUploadIndex[nindex] + 1,
                    });
                    index++;
                  } else {
                    errorUploadArray.push(curUploadIndex[nindex]);
                  }
                });
                if (index == request.length) {
                  resolve(res);
                } else {
                  if (abortController.value.signal.aborted) return;
                  let isPass = await retrLoadNext(errorUploadArray);
                  if (typeof isPass === "string") {
                  } else {
                    if (isPass) {
                      resolve();
                    } else {
                      _fileError();
                    }
                  }
                }
              })
              .catch((error) => { });
          } else {
            resolve();
          }
        });
      }
      /**
       * @param {Boolean} isSecond
       *
       *  */
      async function retrLoadNext(errorUploadArray, isSecond = false) {
        let isPass = false;
        let request = [];
        for (const INDEX of errorUploadArray) {
          let item = blobFileArray.value[INDEX];
          if (isSecond) {
            request.push(
              fileUpload(item[0], abortController.value, UploadProgress)
            );
          } else {
            request.push(
              fileUpload(item[0], abortController.value, UploadProgress)
            );
          }
        }

        isPass = await retryUpload(request, errorUploadArray);
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
                if (abortController.value.signal.aborted)
                  return "Cancel request";
                await retrLoadNext(errorUploadArray, true);
              }
            } else {
              retrNum += 1;
              if (retrNum >= maxChunkRetries) {
                if (file.value.isGateway) {
                  if (abortController.value.signal.aborted)
                    return "Cancel request";
                  await retrLoadNext(errorUploadArray, true);
                } else {
                  return false;
                }
              } else {
                if (abortController.value.signal.aborted)
                  return "Cancel request";
                await retrLoadNext(errorUploadArray);
              }
            }
          }
        }
      }

      function retryUpload(request = [], errorUploadArray) {
        return new Promise((resolve, reject) => {
          axios.all(request).then(
            axios.spread((...res) => {
              if (res.every((element) => element.code == 200)) {
                res.forEach((element, index) => {
                  multipartFileArray.value.push({
                    etag: element.data,
                    partNumber: Number(errorUploadArray[index]) + 1,
                  });
                  blobFileArray.value[errorUploadArray[index]][1] = true;
                });
                resolve(true);
              } else {
                if (abortController.value.signal.aborted) {
                  return "Cancel request";
                } else {
                  resolve(false);
                }
              }
            })
          )
            .catch((error) => {
              if (abortController.value.signal.aborted) {
                return "Cancel request";
              } else {
                resolve(false);
              }
            });
        });
      }

      emit("getStatus", "Uploading...");
      loadNext();
      fileReader.onload = async (e) => {
        await uploadChunk();
        fileReader.abort();
        currentChunk.value++;
        if (currentChunk.value < chunks) {
          if (!isPause.value) {
            await loadNext();
          }
        } else {
          if (NUMBER_timer.value)
            clearInterval(NUMBER_timer.value), (NUMBER_timer.value = null);

          let params = {
            fileName: encodeURIComponent(file.value.urlFileName),
            uploadId: upload_id.value,
            parts: multipartFileArray.value,
            orderId: file.value.orderId,
            // token: token,
            // peerId: peerId,
            fileSize: file.value.size,
            email: email.value,
            md5: fileMd5.value,
            deviceType: +file.value.deviceType,
            foggieToken: file.value.foggieToken,
          };

          fileComplete(params)
            .then(async (res) => {
              if (res.code == 200) {
                let data = {
                  id: file.value.id,
                  completed: true,
                  type: "completed",
                };

                await Save_File();
                emit("chanStatus", data);
                file.value.completed = true;
                progress.value = Math.ceil((chunks / chunks) * 100);
                completed.value = true;
                emit("getStatus", "Upload Success");
                emit("uploadComplete", "Upload Success");
              } else {
                _fileError();
              }
            })
            .catch((error) => {
              _fileError();
            });
        }
        emit("getProgress", progress.value);
      };
    };
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
        if (abortController.value)
          abortController.value.abort("Cancel request");
        isPause.value = true;
        paused.value = true;
        aborted.value = false;
        emit("remove", file.value.id);
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
        if (abortController.value)
          abortController.value.abort("Cancel request");
        isPause.value = true;
        paused.value = true;
        aborted.value = false;

        emit("remove", file.value.id);
        file.value.cancel();
      }
    };
    const retry = () => {
      file.value.error = false;
      error.value = false;
      isComplete.value = true;
      isUploading.value = false;
      paused.value = true
      resume()
      // file.value.retry();
      // _actionCheck();
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
    const _fileProgress = () => {
      progress.value = file.value.progress();
      averageSpeed.value = file.value.averageSpeed;
      currentSpeed.value = file.value.currentSpeed;
      timeRemaining.value = file.value.timeRemaining();
      uploadedSize.value = file.value.sizeUploaded();
      _actionCheck();
    };
    const _fileSuccess = (rootFile, file, message) => {
      if (rootFile) {
        processResponse(message);
      }
      _fileProgress();
      error.value = false;
      isComplete.value = true;
      isUploading.value = false;
    };
    const _fileComplete = () => {
      _fileSuccess();
    };
    const _fileError = () => {
      _fileProgress();
      let data = {
        id: file.value.id,
        error: true,
        type: "error",
      };
      emit("chanStatus", data);
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
        if (
          oldStatus &&
          newStatus === "uploading" &&
          oldStatus !== "uploading"
        ) {
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
    return {
      isFirst,
      response,
      client,
      paused,
      error,
      averageSpeed,
      lastAverageSpeed,
      currentSpeed,
      isComplete,
      isUploading,
      size,
      formatedSize,
      uploadedSize,
      progress,
      timeRemaining,
      type,
      extension,
      progressingClass,
      completed,
      ISCIDING,
      isPause,
      currentChunk,
      fileIconArr,
      upload_id,
      blobFileArray,
      multipartFileArray,
      errorUploadArray,
      isBigFile,
      timer,
      abortController,
      ArrayProgress,
      NUMBER,
      lastTime,
      lastNUMBER,
      NUMBER_timer,
      fileIcon,
      fileCategory,
      progressStyle,
      formatedAverageSpeed,
      status,
      statusText,
      formatedTimeRemaining,
      file,
      list,
      MAX_UPLOAD_NUM,
      curFileList,
      aborted,
      initFile,
      fileShare,
      toPath,
      _actionCheck,
      pause,
      smallLoad,
      fileLoad,
      multipartUpload,
      UploadProgress,
      remove,
      retry,
      processResponse,
      fileEventsHandler,
      _fileProgress,
      _fileSuccess,
      _fileComplete,
      _fileError,
      initStatus,
      resume,
    };
  },
};
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
