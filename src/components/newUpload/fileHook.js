import { ref, toRefs, watch, computed } from "vue";

import Uploader from "simple-uploader.js";
import { secondsToStr } from "./utils";



export default function (params) {
  const { file, progress, timeRemaining, completed, error, isUploading, paused, ISCIDING, averageSpeed, extension } = toRefs(params)
  const tid = ref(null)
  const progressingClass = ref("");
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


  // watch(
  //   () => status.value,
  //   (newVal, oldVal) => {
  //     if (oldVal && newVal === "uploading" && oldVal !== "uploading") {
  //       if (tid.value) {
  //         clearTimeout(tid.value);
  //         tid.value = null
  //       }
  //       tid.value = setTimeout(() => {
  //         progressingClass.value = "uploader-file-progressing";
  //       }, 200);
  //     } else {
  //       if (tid.value) {
  //         clearTimeout(tid.value);
  //         tid.value = null
  //       }
  //       progressingClass.value = "";
  //     }
  //   }
  // );



  return {
    fileIcon,
    fileCategory,
    progressStyle,
    formatedAverageSpeed,
    statusText,
    formatedTimeRemaining,
    status
  }
}
