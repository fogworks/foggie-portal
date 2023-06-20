<template>
  <div class="uploader-list">
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
      <li v-for="file in curFileList" :key="file.id">
        <upFile :file="file" :list="true" :curFileList="curFileList" :MAX_UPLOAD_NUM="MAX_UPLOAD_NUM"
          @chanStatus="chanStatus" @remove="remove" @fileShare="fileShare" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import upFile from "./file.vue";
import {
  ref,
  watch,
  defineProps,
  defineEmits,
  watchEffect,
  reactive,
  onMounted
} from "vue";
const props = defineProps({
  orderID: {
    type: String,
    default: "",
  },
  uploadLists: {
    type: Array,
    default: () => [],
  },
  deviceType: {
    type: String || Number,
    default: "",
  },
});
const MAX_UPLOAD_NUM = props.deviceType == 3 ? 1 : 4;
const emits = defineEmits([
  "fileShare",
  "update:uploadLists",
  "newQueueID",
]);


const fileList = reactive({
  uploadLists: [],
});

const curFileList = ref([]);
const timer = ref(null);
watchEffect(() => {
  fileList.uploadLists = props.uploadLists;
  if (fileList.uploadLists.length == 0) {
    curFileList.value = [];
  }
  for (let index = 0; index < curFileList.value.length; index++) {
    if (
      !fileList.uploadLists.some(
        (item) => item.id == curFileList.value[index].id
      )
    ) {
      curFileList.value.splice(index, 1);
      break;
    }
  }
});
const chanStatus = (item) => {
  // let index = curFileList.value.findIndex((element) => element.id == item.id);
  // curFileList.value[index][item.type] = item[item.type];
  // if (item.type == "paused" || item.type == "completed" || item.type == "error") {
  // }
  let curFileListLength = curFileList.value.length
  if (curFileListLength >= fileList.uploadLists.length) {
    return
  } else {
    let pushItem = fileList.uploadLists[curFileListLength]
    curFileList.value.unshift(pushItem)
    emits("newQueueID", item.id);
  }


};


const remove = (id) => {
  curFileList.value = curFileList.value.filter((item) => item.id !== id);
  fileList.uploadLists = fileList.uploadLists.filter((item) => item.id !== id);
  emits("update:uploadLists", fileList.uploadLists);
  chanStatus()
};








const fileShare = (file) => {
  emits("fileShare", file);
};


onMounted(() => {
  for (const item of fileList.uploadLists.slice(0, 4)) {
    emits("newQueueID", item.id);
    curFileList.value.unshift(item)
  }
})

// defineExpose({
//   curFileList,
//   orderID: props.orderID,
// });
</script>

<style scoped>
.uploader-list {
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  overflow-y: auto;
  max-height: calc(80vh - 280px);
  padding: 20px 0px;
  margin-left: 20px;
  margin-right: 20px;
}

.uploader-list>ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.head-info {
  position: relative;
  height: 49px;
  line-height: 49px;
  overflow: hidden;
  border-bottom: 1px solid #7e7e7e;
  text-align: left;
  font-size: 12px;
}

.head-info:hover {
  background-color: transparent !important;
}
</style>
