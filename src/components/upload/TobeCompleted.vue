<template>
  <div class="uploader-file">
    <div>
      <div class="uploader-file-info">
        <div class="uploader-file-name" :title="curFile.name">
          <img class="iconfont-uploadType" :src="fileIcon" />
          {{ curFile.name }}
        </div>
        <div class="uploader-file-prefix">
          <a href="javascript:;">{{ curFile.urlPrefix }} </a>
        </div>
        <div class="uploader-file-size">{{ formatedSize }}</div>
        <div class="uploader-file-actions">
          <span class="uploader-file-remove" @click="remove()" />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, toRefs, onMounted } from "vue";
import { ElMessage } from 'element-plus'
import { useStore } from "vuex";
const formatedSize = ref()
const store = useStore()
const emits = defineEmits(['deleteAllFileList'])
const props = defineProps({
  curFile: {
    type: Object,
    default() {
      return {}
    }
  },
  orderID: {
    type: String,
    default:''
  }
})
const { curFile } = toRefs(props)

formatedSize.value = curFile.value["getFormatSize"]();
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
  let fileName = curFile.value.name.toLowerCase();
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

function remove() {
  emits('deleteAllFileList',curFile.value.id)
  let uploadFileList = store.state.upload.uploadFileList[props.orderID]
  store.state.upload.uploadFileList[props.orderID] = uploadFileList.filter(item => item.id != curFile.value.id)
}

onMounted(() => {

})
</script>

<style lang="scss" scoped>
.uploader-file {
  position: relative;
  height: 49px;
  line-height: 49px;
  overflow: hidden;
  border-bottom: 1px solid #7e7e7e;
}



.uploader-file-info {
  position: relative;
  z-index: 1;
  height: 100%;
  overflow: hidden;
  font-size: 16px;
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
  width: 30%;
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
  width: 25%;
  text-indent: 10px;
}

.uploader-file-prefix {
  width: 35%;
  color: #5d9cff;
  text-align: center;
}

.uploader-file-meta {
  width: 1%;
}



.uploader-file-actions {
  width: 10%;
  text-align: center;
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
</style>