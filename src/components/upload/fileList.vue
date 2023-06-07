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
        <upFile
          :file="file"
          :list="true"
          :curFileList="curFileList"
          :MAX_UPLOAD_NUM="MAX_UPLOAD_NUM"
          @chanStatus="chanStatus"
          @remove="remove"
          @fileShare="fileShare"
        />
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
  toRefs,
  reactive,
  onMounted,
} from "vue";
import { useStore } from "vuex";
const store = useStore();
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

const Max_CurFileListLength = 20;
const MAX_UPLOAD_NUM = props.deviceType == 3 ? 1 : 4;
const emits = defineEmits(["fileShare", "newQueueID"]);

const fileList = reactive({
  uploadLists: [],
});

const curFileList = ref([]);

watch(
  () => fileList.uploadLists.length,
  (newVal, oldVal) => {
    let oldLength = oldVal ?? 0;
    // if (newVal == 0) {
    //   // 删除当前设备下上传列表中所有文件 当前上传列表也需要清除
    //   curFileList.value = [];
    // }
    if (newVal >= oldLength) {
      // 新增文件
      let pushNumber = JSON.parse(JSON.stringify(MAX_UPLOAD_NUM));

      for (const item of curFileList.value) {
        if (item.fileUploading) {
          pushNumber--;
          if (pushNumber <= 0 || curFileList.value.length == newVal) return;
        }
      }
      for (let index = 0; index < pushNumber; index++) {
        chanStatus();
      }
    } else {
      // 删除文件
      // for (let index = 0; index < curFileList.value.length; index++) {
      //   if (!fileList.uploadLists.some((item) => item.id == curFileList.value[index].id)) {
      //     //删除的是已经上传成功的文件
      //     curFileList.value.splice(index, 1);
      //     break;
      //   }
      // }
    }
  },
  { deep: true }
);

watchEffect(() => {
  fileList.uploadLists = props.uploadLists;
});

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
    return;
  }
  let pushItem = fileList.uploadLists[0];
  curFileList.value.unshift(pushItem);
  fileList.uploadLists.shift();
  emits("update:uploadLists", fileList.uploadLists);
  // store.commit("upload/setFileList", fileList.uploadLists,pushItem.orderId);
  if (++curFileListLength > Max_CurFileListLength) {
    curFileList.value.pop();
  }
 
  emits("newQueueID", pushItem.id,pushItem.orderId);
};

const remove = (id,fileOrderId) => {
  curFileList.value = curFileList.value.filter((item) => item.id !== id);
  fileList.uploadLists = fileList.uploadLists.filter((item) => item.id !== id);
  emits("update:uploadLists", fileList.uploadLists);

  // store.commit("upload/setFileList", fileList.uploadLists,fileOrderId);
  chanStatus();
};

const fileShare = (file) => {
  emits("fileShare", file);
};

onMounted(() => {});

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

.uploader-list > ul {
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
