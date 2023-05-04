<template>
  <div class="card-box formBox">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item @click="setPrefix(item, true)">
        <div class="flex items-center">
          <svg-icon icon-class="my-files" class="title-img"></svg-icon>
          <div class="title">Files</div>
        </div>
      </el-breadcrumb-item>
      <el-breadcrumb-item @click="setPrefix(item)" v-for="item in breadcrumbList.prefix">
        {{ item }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="flex justify-between items-center">
      <el-button class="top-btn" @click="openUpload" key="plain" type="primary" link>Upload +</el-button>
      <el-button class="top-btn refresh" @click="refresh" key="plain" link>
        <svg-icon icon-class="refresh" class="refresh-icon"></svg-icon>
        Refresh</el-button>
      <el-dropdown trigger="click" @command="tableSort" popper-class="custom_dropdown">
        <span class="el-dropdown-link">
          <el-button class="top-btn refresh" @click="" key="plain" link>
            Sort By<el-icon class="el-icon--right"> <arrow-down /> </el-icon></el-button>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="sort-menu">
            <el-dropdown-item v-for="item in sortList" :class="[activeSort === item.key && 'activeSort']"
              :command="{ prop: item.prop, order: item.order, key: item.key }">{{ item.label }}</el-dropdown-item>
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
        <el-input class="search-input" v-model="keyWord" placeholder="Name Or ID" @keyup.enter.native="doSearch">
          <template #prefix>
            <img @click="doSearch" src="@/assets/search.svg" alt="" />
          </template>
        </el-input>
      </div>
    </div>
    <div style="height: 100%">
      <el-table class="table-box" :data="data" :header-cell-style="setNameCell"
        style="width: 100%; margin-top: 10px; height: 1000px" ref="fileTable" @sort-change="sortChange"
        v-el-table-infinite-scroll="fileListsInfinite" :infinite-scroll-immediate="false"
        infinite-scroll-distance="'150px'" :infinite-scroll-disabled="false">
        <el-table-column label="Name" show-overflow-tooltip min-width="340" prop="file_path">
          <template #default="{ row }">
            <router-link class="name-link" to="detail" style="display: flex; align-items: center; padding-left: 15px"
              @click.prevent="toDetail(row)">
              <div class="name-img">
                <img v-if="row.type === 'application/x-directory'" src="@/assets/folder.png" alt="" />

                <!-- <template v-else-if="row.isSystemImg">
                  <img v-show="theme" src="@/assets/logo-dog-black.svg" alt="" />
                  <img v-show="!theme" src="@/assets/logo-dog.svg" alt="" />
                </template> -->
                <img v-else :src="row.icon" alt="" />
              </div>
              <div>
                {{ row.file_path }}
              </div>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="Content / File ID" min-width="250">
          <template #default="{ row }">
            <template v-for="item in row.idList">
              <div v-if="item.code" class="id-box">
                <div class="copy" v-if="item.code">
                  <span class="id-name">{{ item.name }}</span>
                  <span class="code">{{ item.code }}</span>
                  <svg-icon icon-class="copy" class="copy-icon" @click="copyLink(item.code)"></svg-icon>
                </div>
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="Date" min-width="150" show-overflow-tooltip align="center" />
        <el-table-column prop="file_size" label="Size" min-width="100" show-overflow-tooltip align="center" />
        <!-- <el-table-column label="Share" min-width="100" header-align="center">
          <template #default="{ row }">
            <div>
              <MyEcharts style="width: 40px; height: 40px" :options="row.share"></MyEcharts>
            </div>
          </template>
        </el-table-column> -->

        <el-table-column label="Actions" class-name="action-btn-column" min-width="150" align="center">
          <template #default="scope">
            <el-dropdown trigger="click" @command="handleCommand" popper-class="custom_dropdown">
              <div class="color-box">
                <svg-icon icon-class="more"></svg-icon>
                <!-- <img src="@/assets/more.svg" alt="" /> -->
              </div>
              <template #dropdown>
                <el-dropdown-menu class="more-dropdown" slot="dropdown">
                  <el-dropdown-item :command="{ flag: 'challenge', command: scope.row }"
                    :disabled="!orderState">challenge</el-dropdown-item>
                  <!-- <el-dropdown-item :command="{ flag: 'ipfs', command: scope.row }" :disabled="
                    !(
                      !scope.row.isDir &&
                      (currentOODItem.deploy_vood_gateway_state ===
                        'finish' ||
                        currentOODItem.deploy_vood_gateway_state ===
                        'upgrade_finish' ||
                        currentOODItem.deploy_ipfs_gateway_state ===
                        'finish') &&
                      currentOODItem.ipfs_service_state === 'start'
                    )
                  ">IPFS PIN</el-dropdown-item> -->
                  <!-- <el-dropdown-item :command="{ flag: 'cyfs', command: scope.row }" :disabled="
                    !(
                      !scope.row.isDir &&
                      (currentOODItem.deploy_vood_gateway_state ===
                        'finish' ||
                        currentOODItem.deploy_vood_gateway_state ===
                        'upgrade_finish' ||
                        currentOODItem.deploy_cyfs_gateway_state ===
                        'finish') &&
                      currentOODItem.cyfs_service_state === 'start'
                    )
                  ">CYFS PIN</el-dropdown-item> -->
                  <!-- <el-dropdown-item :command="{ flag: 'download', command: scope.row }"
                    :disabled="scope.row.isDir">Download</el-dropdown-item> -->
                  <!-- <el-dropdown-item class="delete-item"
                    :command="{ flag: 'delete', command: scope.row }">Delete</el-dropdown-item> -->
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
import { GetFileList, InitiateChallenge } from "@/api/myFiles/myfiles";
import {
  oodFileList,
  pIN,
  IPFSPublish,
  cyfsPINList,
  oodFileDel,
  CidShare,
  oodFileSearch,
  shareLink,
  getIPFSLocalList,
} from "@/utils/api.js";

import _ from "lodash";

// import MyEcharts from "@/components/echarts/myEcharts";
// import ShareDialog from "./_modules/shareDialog";
// import PinDialog from "./_modules/pinDialog";
// import PinTaskList from "./_modules/pinTaskList";
// import PinFormDialog from "./_modules/pinFormDialog";
import { getfilesize } from "@/utils/util.js";
import { transferTime } from "@/utils/util.js";

import { getFileType } from "@/utils/getFileType";
import { useRoute } from "vue-router";
import router from "@/router";
import { useStore } from "vuex";
const store = useStore();
const route = useRoute();
const { proxy } = getCurrentInstance();
const emits = defineEmits(["currentPrefix"]);


// const orderId = computed(() => store.getters.orderId);

const chainId = computed(() => store.getters.ChainId);
const email = computed(() => store.getters.userInfo?.email);
const deviceType = computed(() => store.getters.deviceType);

const orderState = computed(() => {
  let state = route.query.orderState;
  if (state == 0 || state == 4 || state == 5) {
    return false;
  } else {
    return true;
  }
});

watch(
  () => store.getters.uploadIsShow,
  (newVal, oldVal) => {
    if (!newVal) {
      tableData.data = [];
      tableData.pageNum = 1;
      loadFileList();
    }
  }
);

const keyWord = ref("");
const tableLoading = ref(false);
const showShareDialog = ref(false);

const props = defineProps({
  currentOODItem: Object,
  orderId: {
    type: String,
    default: "",
  },
});
const syncDialog = ref(false);
const taskDisplay = ref(false);
const closeRightUpload = () => {
  taskDisplay.value = false;
};
const { currentOODItem, orderId } = toRefs(props);
const sortList = [
  {
    prop: "create_time",
    label: "Newest Upload",
    key: 1,
    order: 1,
  },
  {
    prop: "create_time",
    label: "Oldest Upload",
    key: 2,
    order: 0,
  },
  {
    prop: "file_path",
    label: "Alphabetical A-Z",
    key: 3,
    order: 0,
  },
  {
    prop: "file_path",
    label: "Alphabetical Z-A",
    key: 4,
    order: 1,
  },
];
// const device_id = computed(() => currentOODItem.value.device_id);
// const device_id_real = computed(() => currentOODItem.value.device_id_real);
let shareCopyContent = "";
let tableData = reactive({
  data: [],
  total: 0,
  pageSize: 50,
  pageNum: 1,
});
const { data, total, pageSize, pageNum } = toRefs(tableData);
function openUpload() {
  store.commit("upload/openUpload", orderId.value);
}

function loadFileList() {
  let params = {
    email: email.value,
    orderId: orderId.value,
    pageSize: tableData.pageSize,
    pageNo: tableData.pageNum,
    deviceType: deviceType.value
  };
  GetFileList(params).then((res) => {
    for (const item of res.data.data.list) {
      item.file_path = decodeURIComponent(item.file_path);
      // item.type = item.file_path.substring(item.file_path.lastIndexOf(".") + 1);
      item.icon = getFileType(item.file_path);
      item.file_size = getfilesize(item.file_size);
    }
    tableData.total = res.data.data.count;
    tableData.data = tableData.data.concat(res.data.data.list);
    tableSort({ prop: "create_time", order: 1, key: 1 });
  });
}
/* 下拉加载文件列表 */
const fileListsInfinite = _.debounce(() => {
  if (tableData.total > tableData.data.length) {
    tableData.pageNum += 1;
    loadFileList();
  } else {
    return;
  }
}, 300);

/* 对文件发起挑战 */

function challengeMiner(params) {
  InitiateChallenge(params).then((res) => {
    if (res.code == 200) {
      console.log(res);
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
  tableData.data = [];
  let fileList = await getIPFSLocalList();
  for (let i = 0; i < data.length; i++) {
    let date = "-";
    if (data[i].created_at > 0) {
      let created_at = new Date(data[i].created_at);
      let year = created_at.getUTCFullYear();
      let month = created_at.getUTCMonth() + 1;
      month = month < 10 ? `0${month}` : month;
      let day = created_at.getUTCDate();
      day = day < 10 ? `0${day}` : day;
      let hour = created_at.getUTCHours();
      hour = hour < 10 ? `0${hour}` : hour;
      let minute = created_at.getUTCMinutes();
      minute = minute < 10 ? `0${minute}` : minute;
      let second = created_at.getUTCSeconds();
      second = second < 10 ? `0${second}` : second;
      date = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      date = `${year}-${month}-${day}`;
    }
    let isDir =
      data[i].content_type === "application/x-directory" ||
      data[i].file_type === 2;
    const type = data[i].key.substring(data[i].key.lastIndexOf(".") + 1);
    let { imgHttpLink: url, isSystemImg } = handleImg(
      type,
      device_id.value,
      data[i].pubkey,
      isDir
    );
    let { imgHttpLink: url_large } = handleImg(
      type,
      device_id.value,
      data[i].pubkey,
      isDir,
      400
    );
    // let _url = require(`@/svg-icons/logo-dog-black.svg`);
    let cid = "";

    if (fileList && fileList.length > 0) {
      for (let j = 0; j < fileList.length; j++) {
        if (fileList[j].cid === data[i].cid) {
          cid = fileList[j].cid;
          break;
        }
      }
    }

    let item = {
      isDir: isDir,
      name: decodeURIComponent(data[i].key),
      key: data[i].key,
      idList: [
        {
          name: "IPFS",
          code: cid,
        },
        {
          name: "CYFS",
          code: data[i].file_id,
        },
      ],
      date,
      size: getfilesize(data[i].content_length),
      // status: "Published",
      status: data[i].pubkey || data[i].file_id ? "Published" : "-",
      type: data[i].content_type,
      file_id: data[i].file_id,
      pubkey: data[i].pubkey,
      cid,
      imgUrl: url,
      imgUrlLarge: url_large,
      // share: getShareOptions(),
      share: {},
      isSystemImg,
      canShare: data[i].pubkey ? true : false,
    };
    getCidShare(device_id.value, data[i].cid);
    tableData.data.push(item);
    tableLoading.value = false;
    if (activeSort.value) {
      const target = sortList.find((el) => el.key == activeSort.value);
      const { prop, order, key } = target;
      nextTick(() => {
        tableSort({ prop, order, key });
      });
    }
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

const handleImg = (type, ID, pubkey, isDir, size) => {
  size = size || 20;
  let location = window.location.origin;
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

    imgHttpLink = `${location}/object?pubkey=${pubkey}&new_w=${size}`;
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
    case "challenge":
      let params = {
        chainId: chainId.value,
        email: email.value,
        orderId: item.order_id,
        md5: item.md5,
      };
      challengeMiner(params);
      break;
    default:
      break;
  }
  console.log(val);
  // switch (val.flag) {
  //   case "share":
  //     await doShare(item);
  //     proxy.$notify({
  //       type: "success",
  //       message: "Share succeeded",
  //       position: "bottom-left",
  //     });
  //     break;
  //   case "ipfs":
  //     ipfsDialogShow.value = true;
  //     // ipfsPin(item);
  //     pinData.item = item;
  //     break;
  //   case "cyfs":
  //     cyfsDialogShow.value = true;
  //     pinData.item = item;
  //     // cyfsPin(item);
  //     break;
  //   case "download":
  //     downloadItem(item);
  //     break;
  //   case "delete":
  //     proxy
  //       .$confirm("Are you sure to delete it?", "Warning", {
  //         confirmButtonText: "YES",
  //         cancelButtonText: "NO",
  //       })
  //       .then(() => {
  //         deleteItem(item);
  //       });
  //     // deleteItem(item);
  //     break;
  //   default:
  //     break;
  // }
};
const shareRefContent = reactive({});
const copyContent = ref("");
const doShare = async (item) => {
  let key = "";
  if (item) {
    key = item.name;
    let data = {
      key: item.pubkey,
      is_pin: false,
      new_path: item.key,
    };
    await pIN(data);
  }

  const isFolder = item.type === "application/x-directory";
  if (key) {
    let user = window.sessionStorage.getItem("walletUser");
    let ood_id_cyfs = device_id_real ? device_id_real : device_id;
    let _key = encodeURIComponent(key);
    let data = await shareLink(device_id.value, _key);
    let meta = data.meta;
    let httpStr = `${location.origin}/#/detailFog?pubkey=${meta.pubkey}&name=${item.key}&isFolder=${isFolder}`;
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
      (currentOODItem.value.deploy_vood_gateway_state === "finish" ||
        currentOODItem.value.deploy_vood_gateway_state === "upgrade_finish" ||
        currentOODItem.value.deploy_ipfs_gateway_state === "finish") &&
      currentOODItem.value.ipfs_service_state === "start" &&
      meta.cid
    ) {
      shareCopyContent = shareCopyContent + ipfsStr + " \n";
      shareCopyContent = shareCopyContent + " " + " \n ";
      shareRefContent.ipfsStr = ipfsStr;
      shareRefContent.httpStr = shareRefContent.httpStr + `&ipfsStr=${ipfsStr}`;
    }

    if (
      (currentOODItem.value.deploy_vood_gateway_state === "finish" ||
        currentOODItem.value.deploy_vood_gateway_state === "upgrade_finish" ||
        currentOODItem.value.deploy_cyfs_gateway_state === "finish") &&
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
    console.log(
      "shareCopyContentshareCopyContentshareCopyContent",
      shareCopyContent
    );
  } else {
    // this.closeRewardBox();
  }
};
const ipfsPin = (checked) => {
  const item = pinData.item;
  let data = {
    key: item.pubkey,
    is_pin: false,
    new_path: item.key,
  };
  pIN(data).then((res) => {
    if (res) {
      ipfsDialogShow.value = false;
    }
  });
};
const cyfsPin = () => {
  const item = pinData.item;
  let key = item.key;
  var form = new FormData();
  form.append(
    "dir",
    new Blob([key], {
      type: "application/x-directory",
    }),
    key
  );
  let pubkey = item.pubkey
    ? item.pubkey
    : "QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn";

  cyfsPINList(device_id.value, item.name, pubkey).then((res) => {
    cyfsDialogShow.value = false;
    // proxy.$message({
    //   type: "success",
    //   message: "CYFS Join queue!",
    //   position: "bottom left",
    // });
  });
};
const downloadItem = (item) => {
  // let ID = device_id.value;
  let pubkey = item.pubkey;
  let downloadUrl = `/fog/${pubkey}?dl=true`;

  var oA = document.createElement("a");
  oA.download = item.name; // 设置下载的文件名，默认是'下载'
  oA.href = downloadUrl;
  document.body.appendChild(oA);
  oA.click();
  oA.remove(); // 下载之后把创建的元素删除
  proxy.$notify({
    type: "success",
    message: "Download succeeded",
    position: "bottom-left",
  });
};
const deleteItem = (item) => {
  tableLoading.value = true;
  oodFileDel(device_id.value, item).then((res) => {
    if (res && res[0]) {
      proxy.$notify({
        type: "success",
        message: "Delete succeeded",
        position: "bottom-left",
      });
      doSearch();
    } else {
      proxy.$notify({
        type: "error",
        message: "Delete Error",
        position: "bottom-left",
      });
    }
  });
};

const copyLink = (text) => {
  var input = document.createElement("input"); // 创建input对象
  input.value = text; // 设置复制内容
  document.body.appendChild(input); // 添加临时实例
  input.select(); // 选择实例内容
  document.execCommand("Copy"); // 执行复制
  document.body.removeChild(input); // 删除临时实例
  // let str = `Copying  ${type} successful!`;
  // this.$message.success(str);
  proxy.$notify({
    message: "Copy succeeded",
    type: "success",
    position: "bottom-left",
  });
};
const toDetail = (item) => {
  localStorage.setItem("currentOODItem", JSON.stringify(currentOODItem.value));
  if (item.type === "application/x-directory") {
    // 文件夹类型
    breadcrumbList.prefix = item.name.split("/");
    emits("currentPrefix", breadcrumbList.prefix);
  } else {
    localStorage.setItem("detail", JSON.stringify(item));
    router.push("/detail");
  }
};
const doSearch = async () => {
  if (keyWord.value === "") {
    getFileList("", breadcrumbList.prefix);
  } else {
    let data = await oodFileSearch(keyWord.value);
    initFileData(data.data);
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
  background: #f2f6ff;

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
      background: linear-gradient(rgba(99, 106, 150, 0.8) 0%,
          rgba(182, 186, 214, 0.6) 100%);

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
        background: linear-gradient(rgba(24, 32, 79, 0.4) 0%,
            rgba(24, 32, 79, 0.25) 100%);
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
</style>
