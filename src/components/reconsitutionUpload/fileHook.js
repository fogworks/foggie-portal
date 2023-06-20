import { ref, toRefs, watch, computed, reactive } from "vue";

import { secondsToStr, formatSize } from "./utils";


export default function (params) {
  const { file, progress, timeRemaining, completed, error, fileUploading, paused, ISCIDING, averageSpeed } = toRefs(params)
  const progressingClass = ref("");
  const statusText = ref('')


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
    let fileName = file.value.fileName.toLowerCase();
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
    () => `${formatSize(averageSpeed.value)} / s`
  );
  let status = computed(() => {
    if (completed.value) {
      return "success";
    } else if (error.value) {
      return "error";
    } else if (fileUploading.value) {
      return "uploading";
    } else if (paused.value) {
      return "paused";
    }else if(ISCIDING.value){
      return "md5ing";
    } else {
      return "waiting";
    }
  });

  const fileStatusText = reactive({
    success: () => "Upload Success",
    error: () => "Upload Error",
    uploading: () => "Uploading...",
    paused: () => "Paused...",
    waiting: () => "Waiting...",
    md5ing: () => "Calculating file hash value...",
  })




  let formatedTimeRemaining = computed(() => {
    if (
      timeRemaining.value === Number.POSITIVE_INFINITY ||
      timeRemaining.value === 0
    ) {
      return "";
    }
    let parsedTimeRemaining = secondsToStr(timeRemaining.value);

    return parsedTimeRemaining;
  });



  watch(
    () => status.value,
    (newVal, oldVal) => {
      statusText.value = fileStatusText[newVal]();

    }
  );



  return {
    fileIcon,
    progressStyle,
    formatedAverageSpeed,
    statusText,
    formatedTimeRemaining,
    status,
    progressingClass
  }
}
