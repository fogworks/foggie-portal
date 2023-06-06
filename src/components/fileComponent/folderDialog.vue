<template>
  <div>
    <el-dialog
      append-to-body
      title="MOVE TO"
      :model-value="visible"
      class="pin-dialog"
      width="600px"
      :close-on-click-modal="false"
      :before-close="beforeClose"
    >
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item @click="setPrefix(item, true)">
          <div class="flex items-center">
            <!-- <img class="title-img" src="@/assets/my-files.png" alt="" /> -->
            <svg-icon icon-class="my-files" class="title-img"></svg-icon>
            <div class="title">Files</div>
          </div>
          <!-- <span>Files</span> -->
        </el-breadcrumb-item>
        <el-breadcrumb-item
          @click="setPrefix(item)"
          v-for="item in breadcrumbList.prefix"
        >
          {{ item }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeClose">Cancel</el-button>
        <div class="color-box">
          <el-button @click="handleSync">
            <RippleInk></RippleInk>
            Confirm</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  defineProps,
  defineEmits,
  toRefs,
  ref,
  getCurrentInstance,
  reactive,
  watch,
  inject,
  onMounted,
} from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import { oodFileList } from "@/utils/api.js";
const { proxy } = getCurrentInstance();
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  currentOODItem: Object,
});
const { visible, currentOODItem } = toRefs(props);
const email = computed(() => store.getters.userInfo?.email);
const tokenMap = computed(() => store.getters.tokenMap);
const deviceData = inject("deviceData");
const tableLoading = ref(false);
const tableData = reactive({ data: [] });
let breadcrumbList = reactive({
  prefix: [],
});
const getFileList = function (scroll, prefix) {
  let list_prefix = "";
  if (prefix?.length) {
    list_prefix = prefix.join("/");
  }
  tableLoading.value = true;
  let token = tokenMap.value[deviceData.device_id];
  let type = "foggie";
  oodFileList(email.value, type, token, deviceData, list_prefix)
    .then((res) => {
      if (res && res.content) {
        initFileData(res);
      }
    })
    .finally(() => (tableLoading.value = false));
};

const initFileData = async (data) => {
  tableData.data = [];
  // let commonPrefixesItem = [];
  // let contentItem = [];
  let commonPrefixesItem = data.commonPrefixes?.map((el, i) => {
    return {
      isDir: true,
      name: decodeURIComponent(el),
      key: el,
      idList: [
        {
          name: "IPFS",
          code: "",
        },
        {
          name: "CYFS",
          code: "",
        },
      ],
      date: "-",
      size: "",
      status: "-",
      type: "application/x-directory",
      file_id: "",
      pubkey: "",
      cid: "",
      imgUrl: "",
      // imgUrlLarge: "",
      share: {},
      isSystemImg: false,
      canShare: false,
    };
  });
  let contentItem = data.content?.map((el, j) => {
    let date = transferTime(el.lastModified);
    let isDir = false;
    const type = el.key.substring(el.key.lastIndexOf(".") + 1);
    let { imgHttpLink: url, isSystemImg } = handleImg(
      type,
      deviceData.foggie_id,
      el.cid,
      el.key,
      isDir,
      deviceData.rpc.split(":")[0],
      deviceData.rpc.split(":")[1],
      deviceData.peer_id
    );

    let cid = el.cid;
    let file_id = el.fileId;

    let name = decodeURIComponent(el.key);
    if (data.prefix) {
      name = name.split(data.prefix)[1];
    }

    return {
      isDir: isDir,
      name,
      key: el.key,
      idList: [
        {
          name: "IPFS",
          code: cid,
        },
        {
          name: "CYFS",
          code: file_id,
        },
      ],
      date,
      // status: "Published",
      status: cid || file_id ? "Published" : "-",
      type: el.contentType,
      file_id: file_id,
      pubkey: cid,
      cid,
      imgUrl: url,
      // imgUrlLarge: url_large,
      // share: getShareOptions(),
      share: {},
      isSystemImg,
      canShare: cid ? true : false,
    };
    // contentItem.push(item);
  });
  tableData.data = [...commonPrefixesItem, ...contentItem];
  tableLoading.value = false;
};
const emits = defineEmits(["update:visible"]);
const beforeClose = () => {
  emits("update:visible", false);
};
const setPrefix = (item, isTop = false) => {
  if (tableLoading.value) return;
  if (isTop) {
    if (!breadcrumbList.prefix.length) return;
    breadcrumbList.prefix = [];
  } else {
    breadcrumbList.prefix = breadcrumbList?.prefix?.filter((el, index) => {
      let targetIndex = 0;
      if (el === item) targetIndex = index;
      return index <= targetIndex;
    });
  }
  // emits("currentPrefix", breadcrumbList.prefix);
};
watch(visible, (val) => {});
onMounted(() => {
  getFileList("", breadcrumbList.prefix);
});
</script>

<style lang="scss" scoped>
.share-content {
  margin-top: 20px;
  color: #000;
  font-size: 20px;
  .title {
    margin-bottom: 30px;
    text-align: center;
    font-weight: 700;
    font-size: 26px;
  }
  .user-info {
    text-align: center;
    // height: 50px;
    line-height: 16px;

    .color-box {
      width: 165px;
      // .color-box();
      @include color-box;

      margin: 0 auto;
      .ripple-ink {
        border-radius: 45px;
      }
      .el-button {
        position: relative;
        font-size: 16px;
        color: var(--text-color);
        border: none;
        border-radius: 45px;
        box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 20%);
        background: var(--btn-gradient);
      }
    }
  }
}
</style>
<style lang="scss">
.pin-dialog {
  // background-image: var(--dialog-gradient-bg) !important;
  color: #000;
  .pin_tips {
    margin-top: 10px;
    color: #000;
  }
  .el-form {
    margin-top: 10px;
    .el-form-item__label {
      color: #000;
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .el-button {
      width: 100px;
      font-size: 18px;
      color: #000;
      border: none;
      border-radius: 45px;
      box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 20%);
      background: #f2f6ff;
    }
    .color-box {
      width: 100px;
      margin-left: 15px;
      // .color-box();
      @include color-box;

      .ripple-ink {
        border-radius: 45px;
      }
      .el-button {
        position: relative;
        color: var(--text-color);
        background: var(--btn-gradient);
      }
    }
  }
}
</style>
