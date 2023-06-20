<template>
  <div class="uploader-list">
    <ul>
      <li>
        <div class="uploader-file-info head-info">
          <div class="uploader-file-name">File Name</div>
          <div class="uploader-file-prefix">Error Message</div>
          <div class="uploader-file-size">File Size</div>
          <div class="uploader-file-status">Upload Status</div>
          <div class="uploader-file-actions">Operate</div>
        </div>
      </li>
      <li v-for="file in curFileList" :key="file.id">
        <upFile :file="file" :curFileList="curFileList" :MAX_UPLOAD_NUM="MAX_UPLOAD_NUM" @chanStatus="chanStatus"
          @remove="remove" @fileShare="fileShare" @updaLoadFileListByState="updaLoadFileListByState" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import upFile from "./file.vue";
import { findLastIndex } from "lodash";
import {
  ref,
  watch,
  defineProps,
  defineEmits,
  watchEffect,
  toRefs,
  reactive,
  onMounted,
  computed,
} from "vue";
import { useStore } from "vuex";
import { cloneDeep } from "lodash";
const store = useStore();
const props = defineProps({
  // orderID: {
  //   type: [String, Number],
  //   default: "",
  // },
  uploadLists: {
    type: Array,
    default: () => [],
  },
  deviceType: {
    type: [String, Number],
    default: "",
  },
});
const MAX_UPLOAD_NUM = props.deviceType == 3 ? 1 : 4;
const Max_CurFileListLength = 20;

const emits = defineEmits(["fileShare", "newQueueID", "updaFileListByState"]);

const fileList = reactive({
  uploadLists: [],
});

const curFileList = ref([]);

watch(
  () => fileList.uploadLists.length,
  (newVal, oldVal) => {
    let oldLength = oldVal ?? 0;
    if (newVal >= oldLength) {
      let pushNumber = JSON.parse(JSON.stringify(MAX_UPLOAD_NUM));
      for (const item of curFileList.value) {
        if (item.fileUploading) {
          pushNumber--;
          if (pushNumber <= 0) return;
        }
      }
      for (let index = 0; index < pushNumber; index++) {
        chanStatus();
      }
    }
  },
  { deep: true }
);

watch(() => props.uploadLists, (newVal) => {
  fileList.uploadLists = newVal
  // console.log(fileList.uploadLists);
}, { immediate: true, deep: true })


const chanStatus = (item) => {
  let curFileListLength = curFileList.value.length;
  let pushNumber = 0;
  for (const element of curFileList.value) {
    if (element.fileUploading) {
      pushNumber++;
      if (pushNumber >= MAX_UPLOAD_NUM) {
        return;
      }
    }
  }
  if (fileList.uploadLists.length == 0) {
    if (item) {
      emits("newQueueID", item.id, item.orderId);
    }
    return;
  }
  let pushItem = cloneDeep(fileList.uploadLists[0]);
  pushItem.fileUploading = true;
  curFileList.value.unshift(pushItem);
  emits("newQueueID", pushItem.id, pushItem.orderId);
  fileList.uploadLists.shift();
  if (curFileListLength >= Max_CurFileListLength) {
    let deleteIndex = findLastIndex(curFileList.value, (lastItem) => lastItem.fileUploading == false);
    curFileList.value.splice(deleteIndex, 1);
  }

};

const remove = (id, fileOrderId) => {
  curFileList.value = curFileList.value.filter((item) => item.id !== id);
  chanStatus();
};

function updaLoadFileListByState(type) {
  // emits("updaFileListByState", type);
}
const fileShare = (file) => {
  emits("fileShare", file);
};

onMounted(() => { });

defineExpose({
  curFileList,
  orderID: props.orderID,
});
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
