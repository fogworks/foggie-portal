import { ref } from "vue";

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


export function  getFileType(type) {
  let TYPE = type.toLowerCase();
  if (
    TYPE.endsWith(".jpeg") ||
    TYPE.endsWith(".jpg") ||
    TYPE.endsWith(".png") ||
    TYPE.endsWith(".svg")
  ) {
    return fileIconArr.value.image;
  } else if (
    TYPE.endsWith(".mp4") ||
    TYPE.endsWith(".avi") ||
    TYPE.endsWith(".mp4")
  ) {
    return fileIconArr.value.video;
  } else if (TYPE.endsWith(".doc") || TYPE.endsWith(".docx")) {
    return fileIconArr.value.word;
  } else if (
    TYPE.endsWith(".zip") ||
    TYPE.endsWith(".rar") ||
    TYPE.endsWith(".gz") ||
    TYPE.endsWith(".tar")
  ) {
    return fileIconArr.value.rar;
  } else if (TYPE.endsWith(".cmd")) {
    return fileIconArr.value.cmd;
  } else if (TYPE.endsWith(".css")) {
    return fileIconArr.value.css;
  } else if (TYPE.endsWith(".mp3")) {
    return fileIconArr.value.music;
  } else if (TYPE.endsWith(".xlsx") || TYPE.endsWith(".xls")) {
    return fileIconArr.value.excel;
  } else if (TYPE.endsWith(".pdf")) {
    return fileIconArr.value.pdf;
  } else if (TYPE.endsWith(".ppt")) {
    return fileIconArr.value.pdf;
  } else if (
    TYPE.endsWith(".text") ||
    TYPE.endsWith(".txt") ||
    TYPE.endsWith(".md")
  ) {
    return fileIconArr.value.txt;
  } else if (TYPE.endsWith(".html")) {
    return fileIconArr.value.html;
  } else if (TYPE.endsWith("/")) {
    return fileIconArr.value.file;
  } else {
    return fileIconArr.value.other;
  }
}