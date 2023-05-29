<template>
  <div class="card-box formBox">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item @click="setPrefix(item, true)">
        <div class="flex items-center">
          <svg-icon icon-class="my-files" class="title-img"></svg-icon>
          <div class="title">Files</div>
        </div>
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
        class="top-btn"
        :disabled="[4, 5].includes(state)"
        @click="openUpload"
        key="plain"
        type="primary"
        link
        >Upload +</el-button
      >
      <el-button class="top-btn refresh" @click="refresh" key="plain" link>
        <svg-icon icon-class="refresh" class="refresh-icon"></svg-icon>
        Refresh</el-button
      >
      <el-dropdown
        trigger="click"
        @command="tableSort"
        popper-class="custom_dropdown"
      >
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
      <!-- <el-button class="top-btn refresh" key="plain" link @click="syncDialog = true">
        <svg-icon icon-class="add" class="refresh-icon"></svg-icon>
        IPFS CID Sync</el-button> -->

      <!-- <el-button class="top-btn refresh" key="plain" link @click="taskDisplay = true">
        <svg-icon icon-class="my-files" style="margin-right: 5px; color: #29abff"></svg-icon>
        PIN Task List</el-button> -->
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
    <div style="height: 100%">
      <el-table
        class="table-box"
        :data="tableData.data"
        :header-cell-style="setNameCell"
        style="width: 100%; margin-top: 10px; height: 1000px"
        ref="fileTable"
        @sort-change="sortChange"
        v-el-table-infinite-scroll="fileListsInfinite"
        :infinite-scroll-immediate="false"
        infinite-scroll-distance="'150px'"
        :infinite-scroll-disabled="false"
        :row-style="rowState"
      >
        <el-table-column
          label="Name"
          show-overflow-tooltip
          min-width="340"
          prop="name"
        >
          <template #default="{ row }">
            <div
              class="name-link"
              to="detail"
              style="display: flex; align-items: center; padding-left: 15px"
              @click.prevent="toDetail(row)"
            >
              <div
                class="name-img"
                v-if="row.type === 'application/x-directory'"
              >
                <img src="@/assets/folder.png" alt="" />

                <!-- <template v-else-if="row.isSystemImg">
                  <img v-show="theme" src="@/assets/logo-dog-black.svg" alt="" />
                  <img v-show="!theme" src="@/assets/logo-dog.svg" alt="" />
                </template> -->
                <!-- <img v-else :src="row.imgUrl" alt="" /> -->
              </div>

              <el-tooltip
                class="box-item"
                effect="dark"
                content="File needs to be re-uploaded"
                placement="top-start"
              >
                <div v-if="!row.is_local">
                  {{ row.name }}
                </div>
              </el-tooltip>

              <el-tooltip
                class="box-item"
                effect="dark"
                content="Not Persisted"
                placement="top-start"
              >
                <div v-if="!row.isPersistent && row.is_local">
                  <i class="i-ersistent">*</i> {{ row.name }}
                </div>
              </el-tooltip>
              <div v-if="row.isPersistent && row.is_local">
                {{ row.name }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Content / File ID" min-width="250">
          <template #default="{ row }">
            <div v-if="row.cid" class="id-box">
              <div class="copy" v-if="row.cid">
                <!-- <span class="id-name">{{ item.name }}</span> -->
                <span class="code">{{ row.cid }}</span>
                <svg-icon
                  icon-class="copy"
                  class="copy-icon"
                  @click="copyLink(row.cid)"
                ></svg-icon>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="Date"
          min-width="150"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column
          prop="size"
          label="Size"
          min-width="100"
          show-overflow-tooltip
          align="center"
        />
        <!-- <el-table-column label="Share" min-width="100" header-align="center">
          <template #default="{ row }">
            <div>
              <MyEcharts style="width: 40px; height: 40px" :options="row.share"></MyEcharts>
            </div>
          </template>
        </el-table-column> -->

        <el-table-column
          label="Actions"
          class-name="action-btn-column"
          min-width="150"
          align="center"
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
                    :disabled="!scope.row.canShare"
                    >share</el-dropdown-item
                  >
                  <!-- :disabled="scope.row.isDir && false" -->
                  <el-dropdown-item
                    :command="{ flag: 'ipfs', command: scope.row }"
                    :disabled="true"
                    >IPFS PIN</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ flag: 'cyfs', command: scope.row }"
                    :disabled="true"
                    >CYFS PIN</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ flag: 'download', command: scope.row }"
                    :disabled="scope.row.isDir"
                    >Download</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <!-- <PinTaskList v-model:display="taskDisplay" :currentOODItems="currentOODItem" @closeRightUpload="closeRightUpload">
  </PinTaskList>
  <ShareDialog :shareRefContent="shareRefContent" :copyContent="copyContent" v-model:visible="showShareDialog">
  </ShareDialog>
  <PinDialog v-model:visible="cyfsDialogShow" type="cyfs" :currentFileItem="pinData" :currentOODItems="currentOODItem"
    @confirm="cyfsPin"></PinDialog>
  <PinDialog v-model:visible="ipfsDialogShow" type="ipfs" :currentFileItem="pinData" :currentOODItems="currentOODItem"
    @confirm="ipfsPin"></PinDialog>
  <PinFormDialog v-model:visible="syncDialog" :currentOODItem="currentOODItem"></PinFormDialog> -->
  <ShareDialog
    :shareRefContent="shareRefContent"
    :copyContent="copyContent"
    v-model:visible="showShareDialog"
  >
  </ShareDialog>
  <DetailDialog
    v-if="detailShow"
    v-model:visible="detailShow"
    :orderId="orderId"
    :detailData="detailData"
    :deviceData="deviceData"
    :email="email"
  ></DetailDialog>
</template>

<script setup>
import { default as vElTableInfiniteScroll } from "el-table-infinite-scroll";

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
  onMounted,
} from "vue";
import DetailDialog from "./detailDialog";
import { GetFileList, InitiateChallenge } from "@/api/myFiles/myfiles";
import {
  oodFileList,
  CidShare,
  find_objects,
  publishPin,
} from "@/utils/api.js";
import moment from "moment";
import _ from "lodash";

// import MyEcharts from "@/components/echarts/myEcharts";
import ShareDialog from "@/views/foggieMax/home/_modules/myFiles/shareDialog";
// import PinDialog from "./_modules/pinDialog";
// import PinTaskList from "./_modules/pinTaskList";
// import PinFormDialog from "./_modules/pinFormDialog";
import { transferTime, transferUTCTime, getfilesize } from "@/utils/util.js";
import { getSecondTime } from "@/utils/ChinaStandardTime";
// import { getFileType } from "@/utils/getFileType";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
// import { fa } from "element-plus/es/locale";
const store = useStore();
const route = useRoute();
const { proxy } = getCurrentInstance();
const emits = defineEmits(["currentPrefix", "getLocal"]);

// const orderId = computed(() => store.getters.orderId);

const chainId = computed(() => store.getters.ChainId);
const email = computed(() => store.getters.userInfo?.email);
const deviceType = computed(() => store.getters.deviceType);
const order_Id = computed(() => store.getters.orderId);


const rowState = ({ row }) => {
  let style = {};
  if (!row.is_local) {
    style = {
      backgroundColor: "#e17f7f",
    };
  }
  return style;
};

watch(
  () => store.getters.uploadIsShow,
  (newVal, oldVal) => {
    if (!newVal && order_Id.value == props.orderId) {
      tableData.data = [];
      tableData.pageNum = 1;
      loadFileList();
    }
  }
);

const keyWord = ref("");
const tableLoading = ref(false);
const showShareDialog = ref(false);
const canMerkle = ref(true);

const props = defineProps({
  currentOODItem: Object,
  orderId: {
    type: String,
    default: "",
  },
  deviceData: Object,
  state: {
    type: [String, Number],
  },
  createdTime: {
    type: String,
    default: "",
  },
});
const syncDialog = ref(false);
const taskDisplay = ref(false);
const closeRightUpload = () => {
  taskDisplay.value = false;
};
const { currentOODItem, orderId, deviceData, state, createdTime } =
  toRefs(props);
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
// const device_id = computed(() => currentOODItem.value.device_id);
// const device_id_real = computed(() => currentOODItem.value.device_id_real);
const device_id = "";
const device_id_real = "";
let shareCopyContent = "";
let tableData = reactive({
  data: [],
  total: 0,
  pageSize: 50,
  pageNum: 1,
});
const { data, total, pageSize, pageNum } = toRefs(tableData);
function countDownRun(timestamp) {
  let nowTime = new Date().getTime();
  let endTime = new Date(createdTime.value).getTime() + 1000 * 60 * 3;
  let time = ((+endTime - +nowTime) / 1000).toFixed(0);
  if (time > 4 * 60) {
    time = time - 60 * 60;
  }
  if (time > 0) {
    let content = "Upload files after " + getSecondTime(+time);
    proxy.$notify({
      type: "warning",
      message: content,
      position: "bottom-left",
    });
  } else {
    store.commit("upload/setUploadOptions", deviceData);
    // store.commit("upload/openUpload", orderId.value);
  }
}
function openUpload() {
  countDownRun();
}

const loadFileList = async () => {
  let token = "";
  let type = "space";
  let data = await oodFileList(
    email.value,
    type,
    token,
    deviceData.value,
    breadcrumbList.prefix.join("/")
  );
  initFileData(data);
};

/* */
const fileListsInfinite = _.debounce(() => {
  if (tableData.total > tableData.data.length) {
    tableData.pageNum += 1;
    loadFileList();
  } else {
    return;
  }
}, 300);

function challengeMiner(params) {
  InitiateChallenge(params).then((res) => {
    if (res.code == 200) {
    }
  });
}

const activeSort = ref("1");
let breadcrumbList = reactive({
  prefix: [],
});
const fileTable = ref(null);

const tableSort = ({ prop = "", order = 2, key = "" }) => {
  const sortOrders = ["ascending", "descending", null];
  activeSort.value = key;

  if (fileTable?.value) fileTable.value.sort(prop, sortOrders[order]);
};
const refresh = () => {
  tableData.data = [];
  loadFileList();
  tableSort({ prop: "create_time", order: 1, key: 1 });
};

const initFileData = async (data) => {
  if (!data) {
    return;
  }
  if (data.err) {
    proxy.$notify({
      type: "warning",
      message: "Failed to fetch data, please try again later",
      position: "bottom-left",
    });
  }
  let params = {
    email: email.value,
    orderId: orderId.value,
    pageSize: tableData.pageSize,
    pageNo: tableData.pageNum,
    deviceType: deviceType.value,
  };
  let localFiles = [];
  let r = await GetFileList(params);
  localFiles = r.data.list;

  tableData.data = [];
  for (let i = 0; i < data.commonPrefixes?.length; i++) {
    let item = {
      isDir: true,
      name: decodeURIComponent(data.commonPrefixes[i]),
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

  for (let j = 0; j < data.content?.length; j++) {
    let date = transferTime(data.content[j].lastModified);
    let isDir = false;
    const type = data.content[j].key.substring(
      data.content[j].key.lastIndexOf(".") + 1
    );
    let { imgHttpLink: url, isSystemImg } = handleImg(
      data.content[j],
      type,
      isDir
    );
    let { imgHttpLink: url_large } = handleImg(data.content[j], type, isDir);
    // let _url = require(`@/svg-icons/logo-dog-black.svg`);
    let cid = data.content[j].cid;
    let file_id = data.content[j].file_id;

    let is_local = false;
    for (let k = 0; k < localFiles.length; k++) {
      if (localFiles[k].cid === data.content[j].cid) {
        is_local = true;
        break;
      }
    }
    // test
    // is_local = false;
    if (!is_local) {
      canMerkle.value = false;
      emits("getLocal", false);
    }
    let name = decodeURIComponent(data.content[j].key);
    if (data.prefix) {
      name = name.split(data.prefix)[1];
    }

    let isPersistent = data.content[j].isPersistent;

    let item = {
      isDir: isDir,
      name,
      key: data.content[j].key,
      idList: [
        {
          name: "IPFS",
          code: data.content[j].isPin ? cid : "",
        },
        {
          name: "CYFS",
          code: data.content[j].isPinCyfs ? file_id : "",
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
      is_local,
      isPersistent,
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

  // tableData.total += data.commonPrefixes.length + data.content.length;
  // tableData.data = tableData.data.concat(res.data.list);
  tableSort({ prop: "date", order: 1, key: 1 });
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

const handleImg = (item, type, isDir) => {
  // size = size || 20;
  // let location = window.location.origin;
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

    // imgHttpLink = `${location}/object?pubkey=${pubkey}&new_w=${size}`;
    let cid = item.cid;
    let key = item.key;

    let ip = deviceData.value.rpc.split(":")[0];
    let port = deviceData.value.rpc.split(":")[1];
    let Id = deviceData.value.foggie_id;
    let peerId = deviceData.value.peer_id;

    // ip = "218.2.96.99";
    // port = 8007;
    // let Id = orderId.value;
    // let peerId = "12D3KooWEJTLsHbP6Q1ybC1u49jFi77tQ8hYtraqGtKTHCXFzLnA";
    imgHttpLink = `/file_download/?cid=${cid}&key=${key}&ip=${ip}&port=${port}&Id=${Id}&peerId=${peerId}&type=space&email=${email.value}`;
  } else {
    isSystemImg = true;
  }
  if (isDir) {
    isSystemImg = true;
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
      // ipfsPin(item);
      break;
    case "cyfs":
      cyfsDialogShow.value = true;
      pinData.item = item;
      // cyfsPin(item);
      break;
    case "download":
      downloadItem(item);
      break;
    default:
      break;
  }
};
const shareRefContent = reactive({});
const copyContent = ref("");
const doShare = async (item) => {
  let key = item.key;
  if (item) {
    ipfsPin(item);
    // await pIN(data);
  }

  const isFolder = item.type === "application/x-directory";
  if (key) {
    // let user = window.sessionStorage.getItem("walletUser");
    let user = store.getters["global/userInfo"].dmc;
    let ood_id_cyfs = device_id_real ? device_id_real : device_id;
    let _key = encodeURIComponent(key);
    // let data = await shareLink(device_id.value, _key);
    // let meta = data.meta;
    let peer_id = deviceData.value.peer_id;
    // let httpStr = `${location.origin}/#/detailFog?pubkey=${meta.pubkey}&name=${item.key}&isFolder=${isFolder}`;
    let httpStr = `foggie://${peer_id}/${orderId.value}/${item.cid}`;
    let cyfsStr = item.file_id ? `cyfs://o/${ood_id_cyfs}/${item.file_id}` : "";
    let ipfsStr = item.cid ? `ipfs://${item.cid}` : "";

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
    shareCopyContent = shareCopyContent + ipfsStr + " \n";
    shareCopyContent = shareCopyContent + " " + " \n ";
    shareRefContent.ipfsStr = ipfsStr;
    shareRefContent.httpStr = shareRefContent.httpStr + `&ipfsStr=${ipfsStr}`;

    shareCopyContent = shareCopyContent + cyfsStr + " \n";
    shareCopyContent = shareCopyContent + " " + " \n ";
    shareRefContent.cyfsStr = cyfsStr;
    shareRefContent.httpStr = shareRefContent.httpStr + `&cyfsStr=${cyfsStr}`;

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
const ipfsPin = () => {
  const item = pinData.item;
  let ip_address = deviceData.value.rpc.split(":")[0];
  let port = deviceData.value.rpc.split(":")[1];
  let peerId = deviceData.value.peer_id;
  let Id = deviceData.value.foggie_id;
  let data = {
    ip_address,
    port,
    token: "11111",
    peerId,
    Id,
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
  let ip_address = deviceData.value.rpc.split(":")[0];
  let port = deviceData.value.rpc.split(":")[1];
  let peerId = deviceData.value.peer_id;
  let Id = deviceData.value.foggie_id;
  let data = {
    ip_address,
    port,
    token: "11111",
    peerId,
    Id,
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

  // let ip = "218.2.96.99";
  let ip = deviceData.value.rpc.split(":")[0];
  // let ip = "154.31.34.194";
  // let port = 8007;
  let port = deviceData.value.rpc.split(":")[1];
  // let Id = orderId.value;
  let Id = deviceData.value.foggie_id;
  let peerId = deviceData.value.peer_id;
  let downloadUrl = `/file_download/?cid=${cid}&key=${key}&ip=${ip}&port=${port}&Id=${Id}&peerId=${peerId}&type=space&email=${email.value}`;

  var oA = document.createElement("a");
  oA.download = item.name;
  oA.href = downloadUrl;
  document.body.appendChild(oA);
  oA.click();
  oA.remove();
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
const detailShow = ref(false);
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
const getFileList = function (scroll, prefix) {
  let list_prefix = "";
  if (prefix?.length) {
    list_prefix = prefix.join("/");
  }
  tableLoading.value = true;
  let token = "";
  let type = "space";
  oodFileList(email.value, type, token, deviceData.value, list_prefix)
    .then((res) => {
      if (res && res.content) {
        initFileData(res);
      }
    })
    .finally(() => (tableLoading.value = false));
};
const doSearch = async () => {
  if (keyWord.value === "") {
    getFileList("", breadcrumbList.prefix);
  } else {
    tableLoading.value = true;
    // let orderId = deviceData.value.space_order_id;
    breadcrumbList.prefix = [];
    let token = store.getters.token;
    let type = "space";
    let data = await find_objects(
      email.value,
      type,
      token,
      deviceData.value,
      keyWord.value
    );
    tableData.data = [];
    initFileData(data);

    // let data = await oodFileSearch(keyWord.value);
    // initFileData(data.data);
  }
};
const setPrefix = (item, isTop = false) => {
  if (isTop) {
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
  // getFileList("", val.prefix);
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

function setNameCell({ row, column, rowIndex, columnIndex }) {
  if (columnIndex == 0) {
    return { paddingLeft: "30px" };
  } else {
    return {};
  }
}
defineExpose({ doSearch });

onMounted(() => {
  loadFileList();
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

.card-box {
  width: 100%;
  margin: 24px auto 50px;
  @include card-box;
  color: #000;
  // background: rgba(50, 61, 109, 0.5);
  // box-shadow: rgb(255 255 255 / 20%) 0px 0px 0px 0.5px inset;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 0.5px inset;
  max-width: 1960px;
  border: var(--theme-border);
  min-height: calc(100vh - 200px);
  background: var(--bg-color);

  ::v-deep {
    .el-breadcrumb {
      .el-breadcrumb__item {
        --el-text-color-regular: #000;
        font-size: 20px;
        cursor: pointer;

        .el-breadcrumb__inner {
          color: #{$light_blue} !important;
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
        color: #{$light_blue};
        transition: transform 0.3s;
      }

      &:hover {
        color: #{$light_blue};

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
  }

  .title-img {
    font-size: 20px;
    margin-right: 12px;
  }

  .table-box {
    min-height: 430px;
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

    ::v-deep {
      .el-table__header {
        .cell {
          padding: 10px 0px;
          color: var(--text-color);
          font-weight: 700;
        }
      }

      --el-table-row-hover-bg-color: transparent;
      // --el-table-tr-bg-color:rgba(50, 61, 109, 0.75);
      --el-table-border-color: rgba(50, 61, 109, 0.75);

      .el-table__row {
        &:hover {
          // background: rgba(50, 61, 109, 0.75);
        }
      }

      .el-table__cell {
        color: var(--text-color);
        // background: rgba(50, 61, 109, 0.75);
        // background-color: #656e92;
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
      color: #{$light_blue};
      cursor: pointer;
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
            color: #{$light_blue};
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
  ::v-deep(.delete-item) {
    color: #ff3353 !important;
  }
}

.sort-menu {
  ::v-deep {
    .el-dropdown-menu__item {
      font-size: 14px !important;
    }

    .activeSort {
      color: #{$light_blue};
    }
  }
}
.i-ersistent {
  color: #e6a23c;
  font-size: 12px;
  width: 10px;
  height: 26px;
  display: inline-block;
  text-align: center;
  cursor: pointer;
}
</style>
