<template>
  <div>
    <el-dialog
      append-to-body
      title="MOVE TO"
      :model-value="folderVisible"
      class="folder-dialog"
      width="600px"
      :close-on-click-modal="false"
      :before-close="beforeClose"
    >
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item @click="setPrefix(item, true)">
          <div class="flex items-center">
            <!-- <img class="title-img" src="@/assets/my-files.png" alt="" /> -->
            <svg-icon icon-class="my-files" class="title-img"></svg-icon>
            <div class="title">All Files</div>
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
      <el-table
        class="table-box"
        row-key="key"
        :show-header="false"
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%"
        max-height="500"
        ref="fileTable"
      >
        <el-table-column
          label="Name"
          show-overflow-tooltip
          width="536"
          prop="name"
        >
          <template #default="{ row }">
            <div class="name-link" @click="toDetail(row)">
              <div class="name-img">
                <img src="@/assets/folder.png" alt="" />
              </div>
              {{ row.name }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeClose">Cancel</el-button>
        <div class="color-box">
          <el-button @click="handleConfirm">
            <RippleInk></RippleInk>
            Move Here</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  toRefs,
  ref,
  getCurrentInstance,
  reactive,
  watch,
  inject,
  onMounted,
  computed,
} from "vue";
import { useStore } from "vuex";
import { ArrowRight } from "@element-plus/icons-vue";
import { getfilesize, transferTime, transferUTCTime } from "@/utils/util.js";
import {
  oodFileList,
  find_objects,
  publishPin,
  file_delete,
  rename_objects,
} from "@/utils/api.js";
import {
  GetFileList,
  GetFileListAll,
  InitiateChallenge,
  fileQuery,
} from "@/api/myFiles/myfiles";
import RippleInk from "@/components/rippleInk";
import { baseUrl } from "@/setting";
const { proxy } = getCurrentInstance();
const store = useStore();
const props = defineProps({
  folderVisible: {
    type: Boolean,
    default: false,
  },
  fileSource: Boolean,
  orderId: [String, Number],
});

const emits = defineEmits(["reset", "refreshList", "update:folderVisible"]);
const { folderVisible, fileSource } = toRefs(props);
const activeName = inject("activeName");
const checkedData = inject("checkedData");
const imgCheckedData = inject("imgCheckedData");
const email = computed(() => store.getters.userInfo?.email);
const tokenMap = computed(() => store.getters.tokenMap);
const deviceData = inject("deviceData");
const token = computed(() => {
  if (deviceData.device_type == "space") {
    return deviceData.upload_file_token;
  } else {
    return tokenMap.value[deviceData.device_id];
  }
});
const deviceType = computed(() => deviceData.device_type);
const tableLoading = ref(false);
const tableData = ref([]);
let breadcrumbList = reactive({
  prefix: [],
});
const continuationToken = ref("");
const getReomteData = (scroll, prefix, reset = false) => {
  tableLoading.value = true;
  let type = "space";
  oodFileList(email.value, type, token.value, deviceData, prefix, scroll, 0)
    .then((res) => {
      if (res && res.content) {
        initRemoteData(res, reset);
      } else {
        tableLoading.value = false;
      }
    })
    .catch(() => {
      tableLoading.value = false;
    });
};

const getLocalData = (reset = false) => {
  let params = {
    email: email.value,
    orderId: orderId.value,
    deviceType: 3,
  };
  GetFileListAll(params)
    .then((res) => {
      initLocalData(res, reset);
    })
    .catch(() => {
      tableLoading.value = false;
    });
};
const initRemoteData = (data, reset = false) => {
  if (!data) {
    tableLoading.value = false;
    return;
  }
  if (data.err) {
    proxy.$notify({
      type: "warning",
      message: "Failed to fetch data, please try again later",
      position: "bottom-left",
    });
  }
  let dir = breadcrumbList.prefix.join("/");
  if (reset) tableData.value = [];
  for (let i = 0; i < data.commonPrefixes?.length; i++) {
    let name = decodeURIComponent(data.commonPrefixes[i]);
    if (data.prefix) {
      name = name.split(data.prefix)[1];
    }
    let item = {
      isDir: true,
      name,
      fullName: decodeURIComponent(data.commonPrefixes[i]),
      key: data.commonPrefixes[i],
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
      imgUrlLarge: "",
      share: {},
      isSystemImg: false,
      canShare: false,
    };
    tableData.value.push(item);
  }
  console.log(tableData.value, "tableDatatableData");
  if (data.isTruncated) {
    continuationToken.value = data.continuationToken;
  } else {
    continuationToken.value = "";
  }

  tableLoading.value = false;
  // if (activeSort.value) {
  //   const target = sortList.find((el) => el.key == activeSort.value);
  //   const { prop, order, key } = target;
  //   nextTick(() => {
  //     tableSort({ prop, order, key });
  //   });
  // }

  // tableSort({ prop: "date", order: 1, key: 1 });
};
const initLocalData = (data, reset = false) => {
  if (!data) {
    tableLoading.value = false;
    return;
  }
  if (data.err) {
    proxy.$notify({
      type: "warning",
      message: "Failed to fetch data, please try again later",
      position: "bottom-left",
    });
  }
  if (reset) tableData.value = [];
  // for (let j = 0; j < data?.data?.length; j++) {
  //   let date = data.data[j].update_time;
  //   let isDir = false;

  //   let cid = data.data[j].cid;
  //   let file_id = data.data[j].fileId;

  //   let name = decodeURIComponent(data.data[j].dest_path);

  //   const type = data.data[j].dest_path.substring(
  //     data.data[j].dest_path.lastIndexOf(".") + 1
  //   );
  //   let { isSystemImg } = handleImg(data.data[j], type, isDir);

  //   let item = {
  //     isDir: isDir,
  //     fullName: decodeURIComponent(data.data[j].dest_path),
  //     name,
  //     key: data.data[j].dest_path,
  //     idList: [
  //       {
  //         name: "IPFS",
  //         code: data.data[j].isPin ? cid : "",
  //       },
  //       {
  //         name: "CYFS",
  //         code: data.data[j].isPinCyfs ? file_id : "",
  //       },
  //     ],
  //     date,
  //     size: getfilesize(data.data[j].file_size),
  //     status: cid || file_id ? "Published" : "-",
  //     type: data.data[j].contentType || "",
  //     file_id: file_id | "",
  //     pubkey: cid,
  //     cid,
  //     imgUrl: "",
  //     imgUrlLarge: "",
  //     share: {},
  //     isSystemImg,
  //     canShare: cid ? true : false,
  //     isPersistent: true,
  //   };
  //   tableData.value.push(item);
  // }

  tableLoading.value = false;
  // if (activeSort.value) {
  //   const target = sortList.find((el) => el.key == activeSort.value);
  //   const { prop, order, key } = target;
  //   nextTick(() => {
  //     tableSort({ prop, order, key });
  //   });
  // }

  // tableSort({ prop: "date", order: 1, key: 1 });
};
const getFileList = function (scroll, prefix, reset = false) {
  let list_prefix = "";
  if (prefix?.length) {
    list_prefix = prefix.join("/");
    if (list_prefix.charAt(list_prefix.length - 1) !== "/") {
      list_prefix = list_prefix + "/";
    }
  }
  tableLoading.value = true;
  if (deviceType.value == "space") {
    if (fileSource.value) {
      getReomteData(scroll, list_prefix, reset);
    } else {
      getLocalData(reset);
    }
  } else {
    let type = "foggie";
    oodFileList(
      email.value,
      type,
      token.value,
      deviceData,
      list_prefix,
      scroll,
      0
    )
      .then((res) => {
        if (res && res.content) {
          initFileData(res, reset);
        }
      })
      .finally(() => (tableLoading.value = false));
  }
};

const initFileData = async (data, reset = false) => {
  // tableData.value = [];
  // let commonPrefixesItem = [];
  let contentItem = [];

  newFolderName.value = "";
  emits("update:checkedData", []);
  // fileTable.value?.clearSelection();
  let dir = breadcrumbList.prefix.join("/");
  let commonPrefixesItem = data.commonPrefixes?.map((el, i) => {
    let name = decodeURIComponent(el);
    if (data.prefix) {
      name = name.split(data.prefix)[1];
    }
    return {
      isDir: true,
      name,
      fullName: decodeURIComponent(el.key),
      key: el,
      fileType: 1,
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
      checked: false,
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
  if (!commonPrefixesItem) {
    commonPrefixesItem = [];
  }

  if (data.isTruncated) {
    continuationToken.value = data.continuationToken;
  } else {
    continuationToken.value = "";
  }
  if (reset) {
    tableData.value = [...commonPrefixesItem];
  } else {
    tableData.value = [...tableData.value, ...commonPrefixesItem];
  }
  tableLoading.value = false;
};

const theme = computed(() => store.getters.theme);
const handleImg = (item, type, isDir) => {
  let imgHttpLink = "";
  type = type.toLowerCase();
  let isSystemImg = false;
  let cid = item.cid;
  let key = item.key;

  let ip = deviceData.rpc.split(":")[0];
  let port = deviceData.rpc.split(":")[1];
  let Id = deviceData.foggie_id;
  let peerId = deviceData.peer_id;
  if (
    type === "png" ||
    type === "bmp" ||
    type === "gif" ||
    type === "jpeg" ||
    type === "ico" ||
    type === "jpg" ||
    type === "svg"
  ) {
    type = "img";
    // imgHttpLink = `${location}/d/${ID}/${pubkey}?new_w=200`;
    // imgHttpLink = `${location}/object?pubkey=${pubkey}&new_w=${size}`;
    // let token = store.getters.token;

    imgHttpLink = `${baseUrl}/file_download/?cid=${cid}&key=${key}&ip=${ip}&port=${port}&Id=${Id}&peerId=${peerId}&type=${
      deviceType.value == "space" ? "space" : "foggie"
    }&token=${token.value}`;

    // foggie://peerid/spaceid/cid
  } else if (type === "mp4") {
    type = "video";

    imgHttpLink = `/file_download/?cid=${cid}&key=${key}&ip=${ip}&port=${port}&Id=${Id}&peerId=${peerId}&type=${
      deviceType.value == "space" ? "space" : "foggie"
    }&token=${token.value}`;
  } else {
    isSystemImg = true;
    // imgHttpLink =
    //   theme === "light"
    //     ? require(`@/assets/logo-dog.svg`)
    //     : require(`@/assets/logo-dog-black.svg`);
  }
  if (isDir) {
    isSystemImg = true;
    // imgHttpLink =
    //   theme === "light"
    //     ? require(`@/assets/logo-dog.svg`)
    //     : require(`@/assets/logo-dog-black.svg`);
  }
  return { imgHttpLink, isSystemImg };
};
const toDetail = (item) => {
  if (item.type === "application/x-directory") {
    console.log(item.name, "itemitemitemitem");

    let long_name = breadcrumbList.prefix.length
      ? breadcrumbList.prefix?.join("/") + "/" + item.name
      : item.name;
    console.log(long_name, "long_name");
    breadcrumbList.prefix = long_name.split("/").slice(0, -1);
    console.log(breadcrumbList.prefix, "breadcrumbList.prefix");
    // emits("currentPrefix", breadcrumbList.prefix);
  }
};
const beforeClose = () => {
  emits("update:folderVisible", false);
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
    console.log(breadcrumbList.prefix, "breadcrumbList.prefix");
  }
  // emits("currentPrefix", breadcrumbList.prefix);
};
const handleConfirm = () => {
  let fetchMethod;
  if (activeName.value == "Image") {
    console.log(imgCheckedData.value, "imgCheckedData");
  } else if (activeName.value == "All") {
    // if (isSingle.value) {
    //   console.log(singleData.value, "singleDatasingleDatasingleData");
    // } else {
    //   console.log(checkedData.value, "checkedDatacheckedDatacheckedData");
    // }
    const targetObject = () => {
      if (breadcrumbList.prefix.length) {
        return (
          breadcrumbList.prefix.join("/") + "/" + checkedData.value[0].name
        );
      } else {
        return checkedData.value[0].name;
      }
    };
    rename_objects({
      deviceData,
      sourceObject: checkedData.value[0].fullName,
      targetObject: targetObject(),
      token: token.value,
      fileType: checkedData.value[0].fileType,
    }).then((res) => {
      if (res) {
        proxy.$notify({
          type: "success",
          message: "Successfully moved",
          position: "bottom-left",
        });
        emits("refreshList");
        emits("reset");
        emits("update:folderVisible", false);
      }
    });
    // emits("reset");
  }
};
watch(breadcrumbList, (val) => {
  getFileList("", val.prefix, true);
});
onMounted(() => {
  getFileList("", breadcrumbList.prefix);
});
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}
.justify-between {
  justify-content: space-between;
}
.items-center {
  align-items: center;
}
.table-box {
  min-height: 400px;
  // max-height: 100px;
  margin-bottom: 40px;
  background: transparent;
  font-size: 16px;
  .name-img {
    display: inline-block;
    width: 25px;
    height: 25px;
    margin-right: 8px;
    text-align: center;
    img {
      max-width: 25px;
      max-height: 25px;
    }
  }
  :deep {
    .el-table__header {
      .cell {
        padding-bottom: 10px;
        color: var(--text-color);
        font-weight: 700;
      }
    }
    --el-table-row-hover-bg-color: transparent;
    .el-table__row {
      content-visibility: auto;
      contain-intrinsic-size: 55.2px;
      background: transparent;

      // &:hover {
      //   background: var(--card-bg);
      // }
    }
    .el-table__cell {
      color: var(--text-color);
      background: transparent;
      .cell {
        color: var(--text-color);
        min-height: 25px;
        line-height: 25px;
      }
    }
    .action-btn-column {
      .cell {
        text-align: center;
        overflow: visible;
      }
    }
  }

  .name-link {
    font-weight: 700;
    font-size: 16px;
    color: $light_blue2;
    cursor: pointer;
    // img {
    //   width: 24px;
    //   margin-right: 8px;
    // }
  }
}
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
.folder-dialog {
  // background-image: var(--dialog-gradient-bg) !important;
  color: #000;
  .el-breadcrumb {
    margin-top: 20px;
    margin-bottom: 20px;
    .el-breadcrumb__item {
      --el-text-color-regular: #000;
      font-size: 20px;
      cursor: pointer;
      .el-breadcrumb__inner {
        color: $light_blue !important;
      }
      &:last-of-type {
        .el-breadcrumb__inner {
          color: var(--text-color) !important;
        }
      }
    }
  }
  .el-loading-mask {
    background: transparent;
    z-index: 1;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .el-button {
      width: unset;
      font-size: 18px;
      color: #000;
      border: none;
      border-radius: 45px;
      box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 20%);
      background: #f2f6ff;
    }
    .color-box {
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
