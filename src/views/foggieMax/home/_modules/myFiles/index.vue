<template>
  <div class="card-box">
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
    <div class="flex justify-between items-center">
      <el-button
        :disabled="!hasCBS"
        class="top-btn"
        @click="upload"
        key="plain"
        type="primary"
        link
        >Upload +</el-button
      >
      <el-button class="top-btn refresh" @click="refresh" key="plain" link>
        <svg-icon icon-class="refresh" class="refresh-icon"></svg-icon>
        Refresh</el-button
      >
      <!-- <el-dropdown trigger="click" @command="tableSort">
        <span class="el-dropdown-link">
          <el-button class="top-btn refresh" @click="" key="plain" link>
            Sort By<el-icon class="el-icon--right"> <arrow-down /> </el-icon
          ></el-button>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="sort-menu">
            <el-dropdown-item
              v-for="item in sortList"
              :class="[activeSort === item.key && 'activeSort']"
              :command="{ prop: item.prop, order: item.order, key: item.key }"
              >{{ item.label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button
        class="top-btn refresh"
        key="plain"
        link
        :disabled="!hasIPFS"
        type="primary"
        @click="syncDialog = true"
      >
        <svg-icon icon-class="add" class="refresh-icon"></svg-icon>
        IPFS CID Sync</el-button
      >

      <el-button
        class="top-btn refresh"
        key="plain"
        link
        @click="taskDisplay = true"
      >
        <svg-icon
          icon-class="my-files"
          style="margin-right: 5px; color: #29abff"
        ></svg-icon>
        PIN Task List</el-button
      > -->
      <div>
        <el-input
          class="search-input"
          v-model="keyWord"
          placeholder="Name Or ID"
          @keyup.enter.native="doSearch"
        >
          <template #prefix>
            <img @click="doSearch" src="@/assets/search.svg" alt="" />
          </template>
        </el-input>
      </div>
    </div>
    <div>
      <el-table
        class="table-box"
        v-loading="tableLoading"
        :data="tableData.data"
        style="width: 100%"
        ref="fileTable"
        @sort-change="sortChange"
      >
        <el-table-column
          label="Name"
          show-overflow-tooltip
          width="440"
          prop="name"
        >
          <template #default="{ row }">
            <div class="name-link" @click="toDetail(row)">
              <div class="name-img">
                <img
                  v-if="row.type === 'application/x-directory'"
                  src="@/assets/folder.png"
                  alt=""
                />
                <!-- <svg-icon icon-class="logo-dog-black" v-if="row.type === 'application/x-directory'"></svg-icon> -->
                <template v-else-if="row.isSystemImg">
                  <img
                    v-show="theme === 'light'"
                    src="@/assets/logo-dog-black.svg"
                    alt=""
                  />
                  <img
                    v-show="theme === 'dark'"
                    src="@/assets/logo-dog.svg"
                    alt=""
                  />
                </template>
                <!-- <img v-else :src="row.imgUrl" alt="" /> -->
              </div>
              {{ row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Content / File ID" width="250">
          <template #default="{ row }">
            <template v-for="item in row.idList">
              <div v-if="item.code" class="id-box">
                <div class="copy" v-if="item.code">
                  <span class="id-name">{{ item.name }}</span>
                  <span class="code">{{ item.code }}</span>
                  <svg-icon
                    icon-class="copy"
                    class="copy-icon"
                    @click="copyLink(item.code)"
                  ></svg-icon>
                </div>
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="Date"
          width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="size"
          label="Size"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          label="Actions"
          class-name="action-btn-column"
          width="100"
          style="text-align: center"
        >
          <template #default="scope">
            <el-dropdown trigger="click" @command="handleCommand">
              <div class="color-box">
                <svg-icon icon-class="more"></svg-icon>
                <!-- <img src="@/assets/more.svg" alt="" /> -->
              </div>
              <template #dropdown>
                <el-dropdown-menu class="more-dropdown" slot="dropdown">
                  <el-dropdown-item
                    :command="{ flag: 'share', command: scope.row }"
                    :disabled="!scope.row.canShare || !hasCBS"
                    >share</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ flag: 'ipfs', command: scope.row }"
                    :disabled="
                      !(
                        !scope.row.isDir &&
                        (currentOODItem.cbs_state === 'finish' ||
                          currentOODItem.cbs_state === 'upgrade_finish' ||
                          currentOODItem.ipfs_state === 'finish') &&
                        currentOODItem.ipfs_service_state === 'start'
                      )
                    "
                    >IPFS PIN</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ flag: 'cyfs', command: scope.row }"
                    :disabled="
                      !(
                        !scope.row.isDir &&
                        (currentOODItem.cbs_state === 'finish' ||
                          currentOODItem.cbs_state === 'upgrade_finish' ||
                          currentOODItem.cyfs_state === 'finish') &&
                        currentOODItem.cyfs_service_state === 'start'
                      )
                    "
                    >CYFS PIN</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ flag: 'download', command: scope.row }"
                    :disabled="scope.row.isDir"
                    >Download</el-dropdown-item
                  >
                  <el-dropdown-item
                    class="delete-item"
                    :command="{ flag: 'delete', command: scope.row }"
                    >Delete</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <PinTaskList
    v-model:display="taskDisplay"
    :currentOODItems="currentOODItem"
    @closeRightUpload="closeRightUpload"
  ></PinTaskList>
  <ShareDialog
    :shareRefContent="shareRefContent"
    :copyContent="copyContent"
    v-model:visible="showShareDialog"
  ></ShareDialog>
  <PinDialog
    v-model:visible="cyfsDialogShow"
    type="cyfs"
    :currentFileItem="pinData"
    :currentOODItems="currentOODItem"
    @confirm="cyfsPin"
  ></PinDialog>
  <PinDialog
    v-model:visible="ipfsDialogShow"
    type="ipfs"
    :currentFileItem="pinData"
    :currentOODItems="currentOODItem"
    @confirm="ipfsPin"
  ></PinDialog>
  <PinFormDialog
    v-model:visible="syncDialog"
    :currentOODItem="currentOODItem"
  ></PinFormDialog>
  <DetailDialog
    v-if="detailShow"
    v-model:visible="detailShow"
    :orderId="orderId"
    :detailData="detailData"
    :deviceData="deviceData"
  ></DetailDialog>
</template>

<script setup>
import { ArrowRight } from "@element-plus/icons-vue";
import {
  reactive,
  ref,
  getCurrentInstance,
  defineEmits,
  watch,
  defineProps,
  toRefs,
  nextTick,
  computed,
  inject,
} from "vue";
import {
  oodFileList,
  CidShare,
  find_objects,
  shareLink,
  publishPin,
  file_delete,
} from "@/utils/api.js";
import MyEcharts from "@/components/echarts/myEcharts";
import ShareDialog from "./shareDialog";
import PinDialog from "./pinDialog";
import PinTaskList from "./pinTaskList";
import PinFormDialog from "./pinFormDialog";
import DetailDialog from "./detailDialog";
import { getfilesize, transferTime } from "@/utils/util.js";
import router from "@/router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const emits = defineEmits(["toggleToUpload", "currentPrefix"]);
const keyWord = ref("");
const tableLoading = ref(false);
const showShareDialog = ref(false);
const detailShow = ref(false);
const deviceData = inject("deviceData");

const props = defineProps({
  currentOODItem: Object,
  orderId: [String, Number],
});
const syncDialog = ref(false);
const taskDisplay = ref(false);
const closeRightUpload = () => {
  taskDisplay.value = false;
};
const { currentOODItem, orderId } = toRefs(props);
const store = useStore();
const sortList = [
  {
    prop: "date",
    label: "Newest Upload",
    key: 1,
    order: 1,
  },
  {
    prop: "date",
    label: "Oldest Upload",
    key: 2,
    order: 0,
  },
  {
    prop: "name",
    label: "Alphabetical A-Z",
    key: 3,
    order: 0,
  },
  {
    prop: "name",
    label: "Alphabetical Z-A",
    key: 4,
    order: 1,
  },
];
const device_id = computed(() => currentOODItem.value.device_id);
let device_id_real = computed(() => currentOODItem.value.device_id_real);
let hasCBS = computed(() => currentOODItem.value.cbs_state === "finish");
const hasIPFS = computed(
  () =>
    currentOODItem.value.ipfs_state === "finish" &&
    currentOODItem.value.ipfs_service_state === "start"
);
const hasCYFS = computed(
  () =>
    currentOODItem.value.cyfs_state === "finish" &&
    currentOODItem.value.cyfs_service_state === "start"
);
let shareCopyContent = "";
let tableData = reactive({ data: [] });
// let tableData = [];
const activeSort = ref("1");
let breadcrumbList = reactive({
  prefix: [],
});
const fileTable = ref(null);

const tableSort = ({ prop = "", order = 2, key = "" }) => {
  const sortOrders = ["ascending", "descending", null];
  activeSort.value = key;
  // fileTable.value.clearSort();
  if (fileTable?.value) fileTable.value.sort(prop, sortOrders[order]);
};
const refresh = () => {
  keyWord.value = "";
  tableSort({ prop: "date", order: 1, key: 1 });
  if (tableLoading.value) return;
  getFileList("", breadcrumbList.prefix);
};
const getFileList = function (scroll, prefix) {
  let list_prefix = "";
  if (prefix?.length) {
    list_prefix = prefix.join("/");
  }
  tableLoading.value = true;
  oodFileList(deviceData, list_prefix)
    .then((res) => {
      if (res && res.content) {
        initFileData(res);
      }
    })
    .finally(() => (tableLoading.value = false));
};

const initFileData = async (data) => {
  tableData.data = [];
  for (let i = 0; i < data.commonPrefixes.length; i++) {
    let name = decodeURIComponent(data.commonPrefixes[i]);
    let item = {
      isDir: true,
      name,
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
    tableData.data.push(item);
  }

  for (let j = 0; j < data.content.length; j++) {
    let date = transferTime(data.content[j].lastModified);
    let isDir = false;
    const type = data.content[j].key.substring(
      data.content[j].key.lastIndexOf(".") + 1
    );
    let { imgHttpLink: url, isSystemImg } = handleImg(
      type,
      deviceData.foggie_id,
      data.content[j].cid,
      data.content[j].key,
      isDir,
      deviceData.rpc.split(":")[0],
      deviceData.rpc.split(":")[1],
      deviceData.peer_id
    );
    let { imgHttpLink: url_large } = handleImg(
      type,
      deviceData.foggie_id,
      data.content[j].cid,
      data.content[j].key,
      isDir,
      deviceData.rpc.split(":")[0],
      deviceData.rpc.split(":")[1],
      deviceData.peer_id
    );
    // let _url = require(`@/svg-icons/logo-dog-black.svg`);
    let cid = data.content[j].cid;
    let file_id = data.content[j].file_id;

    let name = decodeURIComponent(data.content[j].key);
    if (data.prefix) {
      name = name.split(data.prefix)[1];
    }

    let item = {
      isDir: isDir,
      name,
      key: data.content[j].key,
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
      size: getfilesize(data.content[j].size),
      // status: "Published",
      status: cid || file_id ? "Published" : "-",
      type: data.content[j].contentType,
      file_id: file_id,
      pubkey: cid,
      cid,
      imgUrl: url,
      imgUrlLarge: url_large,
      // share: getShareOptions(),
      share: {},
      isSystemImg,
      canShare: cid ? true : false,
    };
    // data[i] = item;
    // getCidShare(device_id.value, data[i].cid);
    tableData.data.push(item);
  }
  // tableData.data = data;

  tableLoading.value = false;
  if (activeSort.value) {
    const target = sortList.find((el) => el.key == activeSort.value);
    const { prop, order, key } = target;
    nextTick(() => {
      tableSort({ prop, order, key });
    });
  }
};
const sortChange = ({ column, prop, order }) => {
  // console.log(
  //   { column, prop, order },
  //   "{ column, prop, order }{ column, prop, order }{ column, prop, order }"
  // );
};
const getCidShare = async (ood_id, cid) => {
  if (ood_id && cid) {
    let data = await CidShare(ood_id, cid);
    if (data && data.bucket) {
      let chartData =
        data && data.bucket && data.bucket["date_histogram_share.ts"];
      let xdata = [];
      let ydata = [];
      for (let i = 0; i < chartData.length; i++) {
        let item = {
          key_as_string: transferTime(chartData[i].key_as_string),
          value: chartData[i].doc_count,
        };
        xdata.push(item.key_as_string.split(" ")[0]);
        ydata.push(item.value);
      }
      initMyOption(xdata, ydata);
    }
    // test
    // initMyOption(
    //   ["1", "2", "3", "4", "5", "6", "7"],
    //   [7, 6, 5, 4, 3, 2, 1],
    //   cid
    // );
  }
};
const initMyOption = (xdata, ydata, cid) => {
  let options = {
    color: "#29abff",
    grid: {
      top: 2,
      left: 2,
      right: 2,
      bottom: 2,
    },
    yAxis: {
      show: false,
      type: "value",
    },
    xAxis: {
      type: "category",
      data: xdata,
      show: false,
    },
    series: [
      {
        data: ydata,
        type: "bar",
      },
    ],
  };

  for (let i = 0; i < tableData.data.length; i++) {
    if (tableData.data[i].cid === cid) {
      tableData.data[i].share = options;
      break;
    }
  }
};
const theme = computed(() => store.getters.theme);
const handleImg = (type, ID, cid, key, isDir, ip, port, peerId) => {
  let imgHttpLink = "";
  type = type.toLowerCase();
  let isSystemImg = false;
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
    imgHttpLink = `/file_download/?cid=${cid}&key=${key}&ip=${ip}&port=${port}&Id=${ID}&peerId=${peerId}`;

    // foggie://peerid/spaceid/cid
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
const ipfsDialogShow = ref(false);
const cyfsDialogShow = ref(false);
const pinData = reactive({
  item: {},
});
const handleCommand = async (val) => {
  const item = val.command;
  switch (val.flag) {
    case "share":
      await doShare(item);
      proxy.$notify({
        type: "success",
        message: "Share succeeded",
        position: "bottom-left",
      });
      break;
    case "ipfs":
      ipfsDialogShow.value = true;

      pinData.item = item;
      ipfsPin(item);
      break;
    case "cyfs":
      cyfsDialogShow.value = true;
      pinData.item = item;
      cyfsPin(item);
      break;
    case "download":
      downloadItem(item);
      break;
    case "delete":
      proxy
        .$confirm("Are you sure to delete it?", "Warning", {
          confirmButtonText: "YES",
          cancelButtonText: "NO",
        })
        .then(() => {
          deleteItem(item);
        });
      // deleteItem(item);
      break;
    default:
      break;
  }
};
const shareRefContent = reactive({});
const copyContent = ref("");
const doShare = async (item) => {
  let key = "";
  if (item) {
    ipfsPin(item);
  }

  const isFolder = item.type === "application/x-directory";
  if (key) {
    // let user = window.sessionStorage.getItem("walletUser");
    let user = store.getters["global/userInfo"].dmc;
    let ood_id_cyfs = device_id_real ? device_id_real : device_id;
    let _key = encodeURIComponent(key);
    let data = await shareLink(device_id.value, _key);
    let meta = data.meta;
    let httpStr = `http://${deviceData.dedicatedip}/#/detailFog?pubkey=${meta.pubkey}&name=${item.key}&isFolder=${isFolder}`;
    // httpStr = `foggie://${peerid}/${spaceid}/${cid}`;
    let cyfsStr = item.file_id
      ? `cyfs://o/${ood_id_cyfs.value}/${meta.file_id}`
      : "";
    let ipfsStr = item.cid ? `ipfs://${meta.cid}` : "";

    // this.shareTitle = this.$t("vood.uploadShareTitle");
    // this.shareContent = this.$t("vood.uploadShareContent");
    shareCopyContent = `${user} publish ${key} to Web3` + "\n";
    shareRefContent.user = `${user} publish ${key} to Web3`;
    let myQrcode = window.sessionStorage.getItem("myQrcode");
    let code = `http://foggie.fogworks.io/?pcode=${myQrcode}`;
    let shareStr = `The Web3 content I publish with Foggie is my digital asset and cannot be tampered with or deleted without my permission. It can also help us earn $DMC crypto rewards. Let's Web3-to-Earn together! Use my invite link ${code} to adopt a Foggie so we can all earn $DMC and grow Web3 together.Thanks!`;
    shareCopyContent = shareCopyContent + " " + " \n ";
    shareCopyContent = shareCopyContent + httpStr + " \n";
    shareCopyContent = shareCopyContent + " " + " \n ";
    shareRefContent.httpStr = httpStr;
    if (
      (currentOODItem.value.cbs_state === "finish" ||
        currentOODItem.value.cbs_state === "upgrade_finish" ||
        currentOODItem.value.ipfs_state === "finish") &&
      currentOODItem.value.ipfs_service_state === "start" &&
      meta.cid
    ) {
      shareCopyContent = shareCopyContent + ipfsStr + " \n";
      shareCopyContent = shareCopyContent + " " + " \n ";
      shareRefContent.ipfsStr = ipfsStr;
      shareRefContent.httpStr = shareRefContent.httpStr + `&ipfsStr=${ipfsStr}`;
    }

    if (
      (currentOODItem.value.cbs_state === "finish" ||
        currentOODItem.value.cbs_state === "upgrade_finish" ||
        currentOODItem.value.cyfs_state === "finish") &&
      currentOODItem.value.cyfs_service_state === "start" &&
      meta.file_id
    ) {
      shareCopyContent = shareCopyContent + cyfsStr + " \n";
      shareCopyContent = shareCopyContent + " " + " \n ";
      shareRefContent.cyfsStr = cyfsStr;
      shareRefContent.httpStr = shareRefContent.httpStr + `&cyfsStr=${cyfsStr}`;
    }
    shareCopyContent = shareCopyContent + shareStr + " \n";
    shareRefContent.shareStr = shareStr;
    copyContent.value = shareCopyContent;
    // shareRefContent.value=shareCopyContent
    showShareDialog.value = true;
    // this.shareBoxShow = true;
  } else {
    // this.closeRewardBox();
  }
};
const ipfsPin = (checked) => {
  const item = pinData.item;
  let ip_address = deviceData.rpc.split(":")[0];
  let port = deviceData.rpc.split(":")[1];
  let peerId = deviceData.peer_id;
  let data = {
    ip_address,
    port,
    token: "11111",
    // peerId: deviceData.value.peer_id,
    peerId,
    Id: deviceData.foggie_id,
    exp: 3 * 24 * 3600,
    stype: "ipfs",
    pin: true,
    key: item.pubkey,
    isDir: item.isDir,
  };
  publishPin(data).then((res) => {
    if (res) {
      ipfsDialogShow.value = false;
    }
  });
};
const cyfsPin = () => {
  const item = pinData.item;
  let ip_address = deviceData.rpc.split(":")[0];
  let port = deviceData.rpc.split(":")[1];
  let data = {
    ip_address,
    port,
    token: "11111",
    peerId: deviceData.peer_id,
    Id: deviceData.foggie_id,
    exp: 3 * 24 * 3600,
    stype: "cyfs",
    pin: true,
    key: item.pubkey,
    isDir: item.isDir,
  };
  publishPin(data).then((res) => {
    if (res) {
      cyfsDialogShow.value = false;
    }
  });
};
const downloadItem = (item) => {
  // let ID = device_id.value;
  // let pubkey = item.pubkey;
  // let downloadUrl = `/fog/${pubkey}?dl=true`;
  // let cid = "QmNf82AtemgaHu2Sg3wpiaEFmoy6ym6Sv1Ma9eLJg6dHm3";
  let cid = item.cid;
  let key = item.key;

  let ip = deviceData.rpc.split(":")[0];
  // let ip = "154.31.34.194";
  let port = deviceData.rpc.split(":")[1];
  // let Id = item.id;
  let Id = deviceData.foggie_id;
  let peerId = deviceData.peer_id;
  let downloadUrl = `/file_download/?cid=${cid}&key=${key}&ip=${ip}&port=${port}&Id=${Id}&peerId=${peerId}`;

  var oA = document.createElement("a");
  oA.download = item.name;
  oA.href = downloadUrl;
  document.body.appendChild(oA);
  oA.click();
  oA.remove();
  proxy.$notify({
    type: "success",
    message: "Download succeeded",
    position: "bottom-left",
  });
};
const deleteItem = (item) => {
  tableLoading.value = true;
  let peerId = deviceData.peer_id;
  let Id = deviceData.foggie_id;
  file_delete(item, peerId, Id).then((res) => {
    if (res && res.data) {
      proxy.$notify({
        type: "success",
        message: "Delete succeeded",
        position: "bottom-left",
      });
      tableLoading.value = false;
      doSearch();
    } else {
      tableLoading.value = false;
      proxy.$notify({
        type: "error",
        message: "Delete Failed",
        position: "bottom-left",
      });
    }
  });
};

const copyLink = (text) => {
  var input = document.createElement("input");
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand("Copy");
  document.body.removeChild(input);
  // let str = `Copying  ${type} successful!`;
  // this.$message.success(str);
  proxy.$notify({
    message: "Copy succeeded",
    type: "success",
    position: "bottom-left",
  });
};
const detailData = reactive({ data: {} });
const toDetail = (item) => {
  localStorage.setItem("currentOODItem", JSON.stringify(currentOODItem.value));
  if (item.type === "application/x-directory") {
    breadcrumbList.prefix = item.name.split("/");
    emits("currentPrefix", breadcrumbList.prefix);
  } else {
    detailData.data = item;
    detailShow.value = true;
    // localStorage.setItem("detail", JSON.stringify(item));
    // router.push("/detail");
  }
};
const doSearch = async () => {
  if (tableLoading.value) return false;
  if (keyWord.value === "") {
    tableData.data = [];
    getFileList("", breadcrumbList.prefix);
  } else {
    tableLoading.value = true;
    let orderId = deviceData.foggie_id;
    let peer_id = deviceData.peer_id;
    breadcrumbList.prefix = [];
    let data = await find_objects(orderId, peer_id, keyWord.value);
    tableData.data = [];
    initFileData(data);
  }
};
const setPrefix = (item, isTop = false) => {
  if (tableLoading.value) return;
  if (isTop) {
    if (!breadcrumbList.prefix.length) return;
    breadcrumbList.prefix = [];
  } else {
    breadcrumbList.prefix = breadcrumbList.prefix.filter((el, index) => {
      let targetIndex = 0;
      if (el === item) targetIndex = index;
      return index <= targetIndex;
    });
  }
  emits("currentPrefix", breadcrumbList.prefix);
};
watch(breadcrumbList, (val) => {
  getFileList("", val.prefix);
});
watch(
  () => currentOODItem,
  () => {
    getFileList("", breadcrumbList.prefix);
  },
  {
    // immediate: true,
    deep: true,
  }
);
defineExpose({ doSearch });
const upload = () => {
  store.commit("upload/openUpload", deviceData.device_id);
};
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
.card-box {
  width: 100%;
  margin: 24px 0 50px 0;
  // .card-box();
  color: #000;
  background: var(--bg-color);
  border: var(--theme-border);
  @include card-box;

  :deep {
    .el-breadcrumb {
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
      background: var(--bg-color);
      z-index: 1;
    }
  }
  .top-btn {
    width: unset;
    font-size: 16px;
    text-align: left;

    &.refresh {
      color: var(--text-color);
      .refresh-icon,
      .el-icon--right {
        margin-right: 10px;
        color: $light_blue;
        transition: transform 0.3s;
      }
      &:hover {
        color: $light_blue;
        .refresh-icon {
          transform: rotate(90deg);
        }
        .el-icon--right {
          transform: translateY(2px);
        }
      }
    }
  }

  .search-input {
    :deep(.el-input__wrapper) {
      width: 200px;
      height: 40px;
      background: linear-gradient(
        rgba(99, 106, 150, 0.8) 0%,
        rgba(182, 186, 214, 0.6) 100%
      );
      .el-input__prefix {
        img {
          cursor: pointer;
        }
      }
      .el-input__inner {
        color: #fff;
        outline: none;
        --el-input-placeholder-color: #d9d9d9;
        // &::-webkit-input-placeholder {
        //   font-size: 16px;
        //   line-height: 16px;
        // }
      }
      &.is-focus {
        background: linear-gradient(
          rgba(24, 32, 79, 0.4) 0%,
          rgba(24, 32, 79, 0.25) 100%
        );
      }
    }
  }

  .title {
    font-size: 20px;
    // color: var(--text-color);
  }

  .title-img {
    // color: var(--text-color);
    font-size: 20px;
    margin-right: 12px;
  }
  .table-box {
    min-height: 430px;
    margin-bottom: 40px;
    background: var(--card-bg);
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
        &:hover {
          background: var(--card-bg);
        }
      }
      .el-table__cell {
        color: var(--text-color);
        background: var(--card-bg);
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
      color: $light_blue;
      cursor: pointer;
      // img {
      //   width: 24px;
      //   margin-right: 8px;
      // }
    }
    .id-box {
      .copy {
        display: flex;
        align-items: center;
        .id-name {
          width: 40px;
          margin-right: 5px;
          // font-size: 16px;
          color: var(--text-color-444);
          // color: #444;
          font-size: 12px;
          font-weight: 500;
          font-style: italic;
        }
        .code {
          max-width: 150px;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--text-color);
        }
        span {
          display: inline-block;
        }
        svg {
          font-size: 16px;
          margin-left: 4px;
          vertical-align: text-top;
          color: var(--text-color);
          cursor: pointer;
          &:hover {
            color: $light_blue;
          }
        }
      }
    }

    .color-box {
      // .color-box();
      @include color-box;

      svg {
        font-size: 28px;
        color: $light_blue;
        transition: all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
      }
      &:hover {
        svg {
          color: #fff;
          transform: scale(1.1);
          cursor: pointer;
        }
      }
    }
  }
}

.more-dropdown {
  :deep(.delete-item) {
    color: #ff3353 !important;
  }
}
.sort-menu {
  :deep {
    .el-dropdown-menu__item {
      font-size: 14px !important;
    }
    .activeSort {
      color: $light_blue;
    }
  }
}
</style>
