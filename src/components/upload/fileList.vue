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
          @chanStatus="chanStatus" @getStatus="getStatus" @uploadComplete="uploadComplete" @getProgress="getProgress"
          @remove="remove" @fileShare="fileShare" @fileDetail="fileDetail" />
      </li>




    </ul>
  </div>
</template>

<script setup>
import upFile from "./file.vue";
import { useStore } from "vuex";

import {
  ref,
  watch,
  defineProps,
  defineEmits,
  watchEffect,
  reactive,
} from "vue";
const MAX_UPLOAD_NUM = 1;
const emits = defineEmits(["fileShare", "fileDetail", "update:uploadLists"]);
const props = defineProps({
  orderID: {
    type: String,
    default: "",
  },
  uploadLists: {
    type: Array,
    default: () => [],
  },
});

const $store = useStore();
const progress = ref(0);
const status = ref("original state");
const fileList = reactive({
  uploadLists: [],
});

const count = ref(0);
const curFileList = ref([]);
const timer = ref(null);

watch(
  () => fileList.uploadLists,
  (newVal, oldVal) => {
    let oldLength = oldVal?.length ?? 0;
    if (newVal.length >= oldLength) {
      if (newVal.length >= MAX_UPLOAD_NUM) {
        if (curFileList.value.length == 0) {
          let startInde = newVal.length - (MAX_UPLOAD_NUM > newVal.length ? newVal.length : MAX_UPLOAD_NUM);
          let endInde = newVal.length + 1;
          curFileList.value = newVal.slice(startInde, endInde);
        } else {
          if (timer.value) clearTimeout(timer.value), (timer.value = null);
          timer.value = setTimeout(() => {
            let pushNumber = JSON.parse(JSON.stringify(MAX_UPLOAD_NUM));
            for (const item of curFileList.value) {
              if (!item.completed) {
                if (pushNumber <= 0) {
                  return;
                } else {
                  if (item.error || item.paused) {
                  } else {
                    pushNumber--;
                  }
                }
              }
            }
            if (pushNumber <= 0) return;

            let startInde = newVal.length - curFileList.value.length > MAX_UPLOAD_NUM ? newVal.length - curFileList.value.length - MAX_UPLOAD_NUM : 0;
            let endInde = newVal.length - curFileList.value.length;
            for (const item of newVal.slice(startInde, endInde).reverse()) {
              if (
                pushNumber > 0 &&
                !curFileList.value.some((element) => element.id == item.id)
              ) {
                curFileList.value.unshift(item);
                pushNumber--;
              }
            }
          }, 100);
        }
      } else {
        curFileList.value = newVal;
      }
    } else {
      if (newVal.length == curFileList.value.length) {
        return;
      } else {
        if (timer.value) clearTimeout(timer.value), (timer.value = null);
        timer.value = setTimeout(() => {
          let pushNumber = JSON.parse(JSON.stringify(MAX_UPLOAD_NUM));
          for (const item of curFileList.value) {
            if (!item.completed) {
              if (pushNumber <= 0) {
                return;
              } else {
                if (item.error || item.paused) {
                } else {
                  pushNumber--;
                }
              }
            }
          }
          if (pushNumber <= 0) return;
          let index = newVal.length - curFileList.value.length - 1;
          curFileList.value.unshift(newVal[index]);
        }, 100);
      }
    }
  },
  { deep: true }
);
watchEffect(() => {
  fileList.uploadLists = props.uploadLists;
});
const chanStatus = (item) => {
  let index = curFileList.value.findIndex((element) => element.id == item.id);
  curFileList.value[index][item.type] = item[item.type];
};

const getStatus = (val) => {
  status.value = val;
};
const getProgress = (val) => {
  progress.value = val;
};
const remove = (id) => {
  curFileList.value = curFileList.value.filter((item) => item.id !== id);
  fileList.uploadLists = fileList.uploadLists.filter((item) => item.id !== id);
  emits("update:uploadLists", fileList.uploadLists);
};
const uploadComplete = () => {
  count.value++;
};
const fileShare = (file) => {
  emits("fileShare", file);
};
const fileDetail = (file) => {
  emits("fileDetail", file);
};

defineExpose({
  curFileList,
  orderID: props.orderID
})
</script>

<style>
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
