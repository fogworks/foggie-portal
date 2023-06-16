<template>
  <div class="card-box-files">
    <el-breadcrumb :separator-icon="ArrowRight">
      <!-- <el-switch
        v-if="deviceType == 'space'"
        class="file-source"
        v-model="fileSource"
        size="large"
        active-text="Remote Files"
        inactive-text="Local Files"
        :before-change="switchReceiveStatus"
      /> -->
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
    <div
      class="flex justify-between items-center"
      style="justify-content: flex-end"
    >
      <!-- <el-button
        :disabled="!hasSVC"
        class="top-btn"
        @click="upload"
        key="plain"
        type="primary"
        link
        >Upload +</el-button
      > -->
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
        :disabled="!hasSVC"
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
      <div style="margin-left: 30px">
        <el-input
          class="search-input"
          v-model="keyWord"
          placeholder="Name"
          @keyup.enter.native="doSearch"
        >
          <template #prefix>
            <img @click="doSearch" src="@/assets/search.svg" alt="" />
          </template>
        </el-input>
      </div>
    </div>
    <div>
      <div style="width: 100%; height: 600px">
        <el-auto-resizer>
          <template #default="{ height, width }">
            <el-table-v2
              v-loading="tableLoading"
              class="table-box"
              :columns="columns"
              :data="tableData"
              :width="width"
              :height="height"
              fixed
              ref="fileTable"
            />
          </template>
        </el-auto-resizer>
      </div>
      <!-- <el-table
        class="table-box"
        row-key="key"
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%"
        max-height="1000"
        ref="fileTable"
        @selection-change="handleSelectionChange"
        v-el-table-infinite-scroll="fileListsInfinite"
        :infinite-scroll-immediate="false"
        infinite-scroll-distance="150px"
        :infinite-scroll-disabled="false"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column
          label="Name"
          show-overflow-tooltip
          class-name="action-btn-column"
          width="535"
          prop="name"
        >
          <template #default="scope">
            <template v-if="scope.row.isNewFolder">
              <div class="new-folder">
                <el-input v-model="newFolderName"></el-input>
                <el-button type="primary">
                  <svg-icon size="20" icon-class="yes2"></svg-icon>
                </el-button>
                <el-button type="primary" @click="cancelNewFolder">
                  <svg-icon icon-class="cancel"></svg-icon>
                </el-button>
              </div>
            </template>
            <div v-else class="name-box">
              <div
                class="name-link"
                style="overflow: hidden"
                @click="toDetail(scope.row)"
              >
                <div class="name-img">
                  <img
                    v-if="scope.row.type === 'application/x-directory'"
                    src="@/assets/folder.png"
                    alt=""
                  />
                  <template v-else-if="scope.row.isSystemImg">
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
                </div>
                {{ scope.row.name }}
              </div>
              <el-popover
                popper-class="action-popover"
                :offset="-3"
                :hide-after="0"
                placement="bottom"
                :width="150"
                trigger="hover"
                :persistent="false"
              >
                <template #reference>
                  <div class="color-box table-action">
                    <svg-icon icon-class="more"></svg-icon>
                  </div>
                </template>
                <ul class="more-dropdown">
                  <li>
                    <el-button
                      @click="
                        handleCommand({ flag: 'share', command: scope.row })
                      "
                      :disabled="
                        !(
                          !scope.row.isDir &&
                          currentOODItem.svc_state === 'finish'
                        )
                      "
                    >
                      share</el-button
                    >
                  </li>
                  <li>
                    <el-button
                      @click="
                        handleCommand({ flag: 'ipfs', command: scope.row })
                      "
                      :disabled="
                        !(
                          !scope.row.isDir &&
                          currentOODItem.svc_state === 'finish'
                        )
                      "
                    >
                      IPFS PIN</el-button
                    >
                  </li>
                  <li>
                    <el-button
                      @click="
                        handleCommand({ flag: 'cyfs', command: scope.row })
                      "
                      :disabled="
                        !(
                          !scope.row.isDir &&
                          currentOODItem.cyfs_state === 'finish' &&
                          currentOODItem.cyfs_service_state === 'start'
                        )
                      "
                    >
                      CYFS PIN</el-button
                    >
                  </li>
                  <li>
                    <el-button
                      @click="
                        handleCommand({ flag: 'download', command: scope.row })
                      "
                      :disabled="!scope.row.isDir"
                    >
                      Download</el-button
                    >
                  </li>
                  <li>
                    <el-button
                      @click="
                        handleCommand({ flag: 'rename', command: scope.row })
                      "
                      :disabled="scope.row.isDir"
                    >
                      Rename</el-button
                    >
                  </li>
                  <li>
                    <el-button
                      @click="
                        handleCommand({ flag: 'move', command: scope.row })
                      "
                      :disabled="scope.row.isDir"
                    >
                      Move</el-button
                    >
                  </li>
                  <li>
                    <el-button
                      class="delete-item"
                      @click="
                        handleCommand({ flag: 'delete', command: scope.row })
                      "
                    >
                      Delete</el-button
                    >
                  </li>
                </ul>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Content / File ID" width="180">
          <template #default="{ row }">
            <template v-for="item in row.idList">
              <div v-if="item.code" class="id-box">
                <div class="copy" v-if="item.code">
                  <span class="code">{{ handleID(item.code) }}</span>
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
          width="175"
          show-overflow-tooltip
        />
        <el-table-column
          prop="size"
          label="Size"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          label="Actions"
          class-name="action-btn-column"
          width="125"
          style="text-align: center"
        >
          <template #default="scope">
            <el-dropdown trigger="click" @command="handleCommand">
              <div class="color-box">
                <svg-icon icon-class="more"></svg-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu class="more-dropdown" slot="dropdown">
                  <el-dropdown-item
                    :command="{ flag: 'share', command: scope.row }"
                    :disabled="!scope.row.canShare || !hasSVC"
                    >share</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ flag: 'ipfs', command: scope.row }"
                    :disabled="
                      !(
                        !scope.row.isDir &&
                        currentOODItem.svc_state === 'finish'
                      )
                    "
                    >IPFS PIN</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ flag: 'cyfs', command: scope.row }"
                    :disabled="
                      !(
                        !scope.row.isDir &&
                        currentOODItem.cyfs_state === 'finish' &&
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
                    :command="{ flag: 'rename', command: scope.row }"
                    :disabled="scope.row.isDir"
                    >Rename</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ flag: 'copy', command: scope.row }"
                    :disabled="scope.row.isDir"
                    >Copy</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="{ flag: 'move', command: scope.row }"
                    :disabled="scope.row.isDir"
                    >Move</el-dropdown-item
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
      </el-table> -->
    </div>
    <DetailDialog
      v-if="detailShow"
      v-model:visible="detailShow"
      :orderId="orderId"
      :detailData="detailData"
      :deviceData="deviceData"
      :email="email"
    ></DetailDialog>
  </div>
</template>

<script setup>
import ActionDrop from "@/components/actionDrop";
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
  inject,
  onMounted,
  unref,
} from "vue";
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
import ShareDialog from "./shareDialog";
import PinDialog from "./pinDialog";
import PinTaskList from "./pinTaskList";
import PinFormDialog from "./pinFormDialog";
import DetailDialog from "./detailDialog";
import { getfilesize, transferTime, transferUTCTime } from "@/utils/util.js";
import { useStore } from "vuex";
import setting from "@/setting";
import _ from "lodash";
import { ElCheckbox, ElInput, ElButton, ElMessageBox } from "element-plus";
const { baseUrl } = setting;

const { proxy } = getCurrentInstance();
const emits = defineEmits([
  // "toggleToUpload",
  "getUseSize",
  "update:folderVisible",
  "update:renameVisible",
  "update:checkedData",
  "update:actionType",
  "update:tableLoading",
  "setSingle",
  "setFileSource",
  // "currentPrefix"
]);
const keyWord = ref("");
const pageNum = ref(1);

// const tableLoading = ref(false);

const showShareDialog = ref(false);
const detailShow = ref(false);
const deviceData = inject("deviceData");

const props = defineProps({
  orderId: [String, Number],
  checkedData: Array,
  tableLoading: Boolean,
  merkleState: {
    type: [String, Number],
    default: 0,
  },
  category: {
    type: [String, Number],
    default: 0,
  },
  fileSource: Boolean,
});
const newFolderName = ref("");
const syncDialog = ref(false);
const taskDisplay = ref(false);
const closeRightUpload = () => {
  taskDisplay.value = false;
};
const deviceType = computed(() => deviceData.device_type);
const order_Id = computed(() => store.getters.orderId);

const { currentOODItem, orderId, category, fileSource } = toRefs(props);
const tableLoading = computed({
  get() {
    return props.tableLoading || false;
  },
  set(val) {
    emits("update:tableLoading", val);
  },
});
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
const device_id = computed(() => deviceData.device_id);
let device_id_real = computed(() => deviceData.device_id_real);
let hasSVC = computed(() => deviceData.svc_state === "finish");
const hasIPFS = computed(
  () =>
    deviceData.ipfs_state === "finish" &&
    deviceData.ipfs_service_state === "start"
);
const hasCYFS = computed(
  () =>
    deviceData.cyfs_state === "finish" &&
    deviceData.cyfs_service_state === "start"
);
let shareCopyContent = "";
let tableData = ref([]);
// let tableData = [];
const activeSort = ref("1");
let breadcrumbList = reactive({
  prefix: [],
});
const canMerkle = ref(true);
const continuationToken = ref("");
const fileTable = ref(null);
const SelectionCell = ({ value, intermediate = false, onChange }) => {
  return (
    <ElCheckbox
      onChange={onChange}
      modelValue={value}
      indeterminate={intermediate}
    />
  );
};
const columns = [
  {
    key: "selection",
    width: 30,
    cellRenderer: ({ rowData }) => {
      const onChange = (value) => {
        rowData.checked = value;
        const checkedIdList = tableData.value.filter((el) => el.checked);
        // .map((el) => el.cid);
        emits("update:checkedData", checkedIdList);
      };

      return <SelectionCell value={rowData.checked} onChange={onChange} />;
    },

    headerCellRenderer: () => {
      const _data = unref(tableData);
      const onChange = (value) => {
        tableData.value = tableData.value.map((row) => {
          row.checked = value;
          return row;
        });
        const checkedIdList = tableData.value.filter((el) => el.checked);
        // .map((el) => el.cid);
        console.log(checkedIdList, "checkedIdList");

        emits("update:checkedData", checkedIdList);
      };

      const allSelected = _data.every((row) => row.checked);
      const containsChecked = _data.some((row) => row.checked);

      return (
        <SelectionCell
          value={allSelected}
          intermediate={containsChecked && !allSelected}
          onChange={onChange}
        />
      );
    },
  },
  {
    key: "name",
    title: "Name",
    dataKey: "name",
    width: 535,
    align: "left",
    class: "action-btn-column",
    cellRenderer: ({ rowData }) => {
      const themeShow = () => {
        if (theme.value === "light") {
          return <img src={require("@/assets/logo-dog-black.svg")} alt="" />;
        } else {
          return <img src={require("@/assets/logo-dog.svg")} alt="" />;
        }
      };
      if (rowData.isNewFolder) {
        return (
          <div class="new-folder">
            <el-input v-model={newFolderName.value}></el-input>
            <el-button type="primary" onClick={confirmNewFolder}>
              <svg-icon size="20" icon-class="yes2"></svg-icon>
            </el-button>
            <el-button type="primary" onClick={cancelNewFolder}>
              <svg-icon icon-class="cancel"></svg-icon>
            </el-button>
          </div>
        );
      } else {
        return (
          <div class="name-box">
            <div
              class="name-link"
              style="overflow: hidden"
              onClick={() => toDetail(rowData)}
            >
              <div class="name-img">
                {rowData.type === "application/x-directory" ? (
                  <img src={require("@/assets/folder.png")} alt="" />
                ) : (
                  <img src={rowData.imgUrl} alt="" />
                )}
                {rowData.isSystemImg ? themeShow() : null}
              </div>
              {rowData.name}
            </div>
          </div>
        );
      }
    },
  },
  {
    key: "idList",
    title: "Content / File ID",
    dataKey: "idList",
    width: 180,
    align: "left",
    cellRenderer: ({ rowData }) => {
      {
        return deviceType.value == "space" && rowData.cid ? (
          <div class="id-box">
            <div class="copy">
              <span class="code">{handleID(rowData.cid)}</span>
              <svg-icon
                icon-class="copy"
                class="copy-icon"
                onClick={() => copyLink(rowData.cid)}
              ></svg-icon>
            </div>
          </div>
        ) : (
          rowData.idList.map((item) => {
            return item.code ? (
              <div class="id-box">
                <div class="copy">
                  <span class="code">{handleID(item.code)}</span>
                  <svg-icon
                    icon-class="copy"
                    class="copy-icon"
                    onClick={() => copyLink(item.code)}
                  ></svg-icon>
                </div>
              </div>
            ) : null;
          })
        );
      }
    },
  },
  {
    key: "date",
    title: "Date",
    dataKey: "date",
    width: 175,
    align: "left",
  },
  {
    key: "size",
    title: "Size",
    dataKey: "size",
    width: 120,
    align: "left",
  },
];

// const switchReceiveStatus = () => {
//   return new Promise((resolve, reject) => {
//     try {
//       if (fileSource.value) {
//         console.log("------------remote");
//         ElMessageBox.confirm("Are you sure to get local data?", "Warning", {
//           confirmButtonText: "OK",
//           cancelButtonText: "Cancel",
//         })
//           .then(() => {
//             // get remote data
//             fileSource.value = !fileSource.value;
//             emits("setFileSource", fileSource.value);
//             breadcrumbList.prefix = [];
//             tableData.value = [];
//             // getLocalData();
//           })
//           .catch(() => {
//             reject(false);
//           });
//       } else {
//         console.log("------------local");
//         ElMessageBox.confirm("Are you sure to get remote data?", "Warning", {
//           confirmButtonText: "OK",
//           cancelButtonText: "Cancel",
//         })
//           .then(() => {
//             // get remote data
//             fileSource.value = !fileSource.value;
//             emits("setFileSource", fileSource.value);
//             breadcrumbList.prefix = [];
//             tableData.value = [];
//             // getReomteData();
//           })
//           .catch(() => {
//             reject(false);
//           });
//       }
//     } catch (err) {
//       reject(false);
//     }
//   });
// };
// const tableSort = ({ prop = "", order = 2, key = "" }) => {
//   const sortOrders = ["ascending", "descending", null];
//   activeSort.value = key;
//   // fileTable.value.clearSort();
//   if (fileTable?.value) fileTable.value.sort(prop, sortOrders[order]);
// };
const handleSelectionChange = (val) => {
  emits("update:checkedData", val);
};
const resetChecked = () => {
  // fileTable.value?.clearSelection();
  tableData.value.forEach((el) => {
    el.checked = false;
  });
  emits("update:checkedData", []);
};
const handleID = (str) => {
  return (
    str.substring(0, 6) + "..." + str.substring(str.length - 6, str.length)
  );
};
const refresh = () => {
  keyWord.value = "";
  // tableSort({ prop: "date", order: 1, key: 1 });
  if (tableLoading.value) return;
  tableData.value = [];
  getFileList("", breadcrumbList.prefix, true);
};
const email = computed(() => store.getters.userInfo?.email);
const tokenMap = computed(() => store.getters.tokenMap);
const token = computed(() => {
  if (deviceData.device_type == "space") {
    return deviceData.upload_file_token;
  } else {
    return tokenMap.value[deviceData.device_id];
  }
});
const getReomteData = (scroll, prefix, reset = false) => {
  tableLoading.value = true;
  let type = "space";
  oodFileList(
    email.value,
    type,
    token.value,
    deviceData,
    prefix,
    scroll,
    category.value
  )
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
      checked: false,
      name,
      fileType: 1,
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
  for (let j = 0; j < data?.content?.length; j++) {
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
    let cid = data.content[j].cid;
    let file_id = data.content[j].fileId;

    let name = decodeURIComponent(data.content[j].key);
    if (data.prefix) {
      name = name.split(data.prefix)[1];
    }
    let isPersistent = data.content[j].isPersistent;

    let item = {
      isDir: isDir,
      checked: false,
      name,
      fileType: 2,
      fullName: decodeURIComponent(data.content[j].key),
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
      status: cid || file_id ? "Published" : "-",
      type: data.content[j].contentType,
      file_id: file_id,
      pubkey: cid,
      cid,
      imgUrl: url,
      imgUrlLarge: url_large,
      share: {},
      isSystemImg,
      canShare: cid ? true : false,
      isPersistent,
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
  for (let j = 0; j < data?.data?.length; j++) {
    let date = data.data[j].update_time;
    let isDir = false;

    let cid = data.data[j].cid;
    let file_id = data.data[j].fileId;

    let name = decodeURIComponent(data.data[j].dest_path);

    const type = data.data[j].dest_path.substring(
      data.data[j].dest_path.lastIndexOf(".") + 1
    );
    let { isSystemImg } = handleImg(data.data[j], type, isDir);

    let item = {
      checked: false,

      isDir: isDir,
      fileType: 2,
      fullName: decodeURIComponent(data.data[j].dest_path),
      name,
      key: data.data[j].dest_path,
      idList: [
        {
          name: "IPFS",
          code: data.data[j].isPin ? cid : "",
        },
        {
          name: "CYFS",
          code: data.data[j].isPinCyfs ? file_id : "",
        },
      ],
      date,
      size: getfilesize(data.data[j].file_size),
      status: cid || file_id ? "Published" : "-",
      type: data.data[j].contentType || "",
      file_id: file_id | "",
      pubkey: cid,
      cid,
      imgUrl: "",
      imgUrlLarge: "",
      share: {},
      isSystemImg,
      canShare: cid ? true : false,
      isPersistent: true,
    };
    tableData.value.push(item);
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
const getFileList = function (scroll, prefix, reset = false) {
  newFolderName.value = "";
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
      category.value
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
      checked: false,
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
  contentItem = data?.content?.map((el, j) => {
    let date = transferTime(el.lastModified);
    let isDir = false;
    const type = el.key.substring(el.key.lastIndexOf(".") + 1);
    let { imgHttpLink: url, isSystemImg } = handleImg(el, type, isDir);

    let cid = el.cid;
    let file_id = el.fileId;

    let name = decodeURIComponent(el.key);
    if (data.prefix) {
      name = name.split(data.prefix)[1];
    }

    return {
      checked: false,
      isDir: isDir,
      name,
      fullName: decodeURIComponent(el.key),
      key: el.key,
      fileType: 2,
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
      size: getfilesize(el.size),
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
  if (!commonPrefixesItem) {
    commonPrefixesItem = [];
  }

  if (data.isTruncated) {
    continuationToken.value = data.continuationToken;
  } else {
    continuationToken.value = "";
  }
  if (reset) {
    tableData.value = [...commonPrefixesItem, ...contentItem];
  } else {
    tableData.value = [
      ...tableData.value,
      ...commonPrefixesItem,
      ...contentItem,
    ];
  }
  emits("getUseSize");
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
    }&token=${token.value}&thumb=true`;

    // foggie://peerid/spaceid/cid
  } else if (type === "mp4") {
    type = "video";

    imgHttpLink = `${baseUrl}/file_download/?cid=${cid}&key=${key}&ip=${ip}&port=${port}&Id=${Id}&peerId=${peerId}&type=${
      deviceType.value == "space" ? "space" : "foggie"
    }&token=${token.value}&thumb=true`;
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
    case "rename":
      emits("update:renameVisible", true);
      emits("setSingle", val.command);
      break;
    case "copy":
    case "move":
      emits("update:folderVisible", true);
      emits("update:actionType", val.flag);
      emits("setSingle", val.command);
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
  let key = item.key;
  if (item) {
    ipfsPin(item);
  }

  const isFolder = item.type === "application/x-directory";
  if (key) {
    let user = store.getters["global/userInfo"].dmc;
    let ood_id_cyfs = device_id_real ? device_id_real : device_id;
    let peer_id = deviceData.peer_id;
    let httpStr = `foggie://${peer_id}/${orderId.value}/${item.cid}`;
    let cyfsStr = item.file_id ? `cyfs://o/${ood_id_cyfs}/${item.file_id}` : "";
    let ipfsStr = item.cid ? `ipfs://${item.cid}` : "";

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
    // shareRefContent.httpStr = shareRefContent.httpStr + `&ipfsStr=${ipfsStr}`;

    shareCopyContent = shareCopyContent + cyfsStr + " \n";
    shareCopyContent = shareCopyContent + " " + " \n ";
    shareRefContent.cyfsStr = cyfsStr;
    // shareRefContent.httpStr = shareRefContent.httpStr + `&cyfsStr=${cyfsStr}`;

    shareCopyContent = shareCopyContent + shareStr + " \n";
    shareRefContent.shareStr = shareStr;
    copyContent.value = shareCopyContent;
    // shareRefContent.value=shareCopyContent
    showShareDialog.value = true;
    // this.shareBoxShow = true;
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
    token: token.value,
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
    token: token.value,
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
  localStorage.setItem("currentOODItem", JSON.stringify(deviceData));
  if (item.type === "application/x-directory") {
    let long_name = breadcrumbList.prefix.length
      ? breadcrumbList.prefix?.join("/") + "/" + item.name
      : item.name;
    breadcrumbList.prefix = long_name.split("/").slice(0, -1);
    // emits("currentPrefix", breadcrumbList.prefix);
  } else {
    detailData.data = item;
    detailShow.value = true;
    // localStorage.setItem("detail", JSON.stringify(item));
    // router.push("/detail");
  }
};
const isSearch = ref(false);
const doSearch = async () => {
  if (tableLoading.value) return false;
  tableData.value = [];
  if (keyWord.value === "") {
    getFileList("", breadcrumbList.prefix, true);
  } else {
    tableLoading.value = true;
    breadcrumbList.prefix = [];
    // let token = store.getters.token;
    let type = deviceType.value == "space" ? "space" : "foggie";
    isSearch.value = true;
    if (deviceType.value == "space") {
      if (fileSource.value) {
        let data = await find_objects(
          email.value,
          type,
          token.value,
          deviceData,
          encodeURIComponent(keyWord.value)
        );
        isSearch.value = false;
        tableData.value = [];
        if (data.contents) {
          data.content = data.contents;
        }
        initRemoteData(data);
      } else {
        fileQuery({
          email: email.value,
          orderId: orderId.value,
          deviceType: 3,
          key: encodeURIComponent(keyWord.value),
        })
          .then((res) => {
            isSearch.value = false;
            if (res.data[0]?.cid) {
              initLocalData(res);
            } else {
              ElNotification({
                type: "error",
                message: "Failed to obtain file information",
                position: "bottom-left",
              });
            }
          })
          .catch(() => {
            isSearch.value = false;
            ElNotification({
              type: "error",
              message: "Failed to obtain file information",
              position: "bottom-left",
            });
          });
      }
    } else {
      let data = await find_objects(
        email.value,
        type,
        token.value,
        deviceData,
        encodeURIComponent(keyWord.value)
      );
      isSearch.value = false;
      if (data.contents) {
        data.content = data.contents;
      }
      initFileData(data, true);
    }
  }
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
    let len = breadcrumbList.prefix.length;
    if (len > 0 && breadcrumbList.prefix[len - 1] !== "") {
      breadcrumbList.prefix.push("");
    }
  }
  // emits("currentPrefix", breadcrumbList.prefix);
};
const fileListsInfinite = _.debounce(() => {
  if (deviceType.value == "space") {
    if (
      fileSource.value &&
      continuationToken.value &&
      tableData.value.length < 5000
    ) {
      getReomteData(continuationToken.value, breadcrumbList.prefixfalse);
    }
  } else {
    if (continuationToken.value && tableData.value.length < 5000) {
      getFileList(continuationToken.value, breadcrumbList.prefix, false);
    }
  }
}, 300);

watch(breadcrumbList, (val) => {
  if (!isSearch.value) {
    emits("update:checkedData", []);
    getFileList("", val.prefix, true);
  }
});
watch(
  () => deviceData,
  () => {
    getFileList("", breadcrumbList.prefix, true);
  },
  {
    // immediate: true,
    deep: true,
  }
);
watch(
  fileSource,
  (val) => {
    getFileList("", breadcrumbList.prefix, true);
  },
  {
    // immediate: true,
    deep: true,
  }
);
watch(category, (val) => {
  refresh();
});
const confirmNewFolder = () => {
  const targetObject = () => {
    console.log(breadcrumbList.prefix, "breadcrumbList.prefix");

    // arr.splice(arr.length - 1, 1, newName.value);
    // return arr.join("/");
  };
  targetObject();
  // rename_objects()
  console.log(newFolderName.value, 55555555555);
};
const cancelNewFolder = () => {
  tableData.value.shift();
  newFolderName.value = "";
};
const setNewFolder = () => {
  if (!tableLoading.value && !tableData.value[0]?.isNewFolder) {
    tableData.value.unshift({
      isDir: true,
      name: "",
      key: "isNewFolder",
      isNewFolder: true,
      isSystemImg: false,
      canShare: false,
      date: transferUTCTime(new Date()),
      idList: [],
    });
    fileTable?.value?.scrollToTop(0);
  }
};
watch(
  () => store.getters.uploadIsShow,
  (newVal, oldVal) => {
    if (!newVal && order_Id.value == deviceData.device_id) {
      tableData.value = [];
      tableData.pageNum = 1;
      getFileList("", breadcrumbList.prefix, true);
    }
  }
);
onMounted(() => {
  refresh();
});
defineExpose({ doSearch, resetChecked, setNewFolder, refresh });
const upload = () => {
  store.commit("upload/setUploadOptions", deviceData);
  // store.commit("upload/openUpload", deviceData.device_id);
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
.card-box-files {
  width: 100%;
  // margin: 24px 0 50px 0;
  // .card-box-files();
  color: #000;
  background: var(--bg-color);
  // border: var(--theme-border);
  // @include card-box-files;

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
        //   .refresh-icon {
        //     transform: rotate(90deg);
        //   }
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
    // max-height: 100px;
    margin-bottom: 40px;
    background: var(--card-bg);
    font-size: 16px;

    :deep {
      .el-table-v2__main {
        background: transparent;
      }
      .el-table-v2__header {
        .el-table-v2__header-cell {
          padding-bottom: 10px;
          color: var(--text-color);
          font-weight: 700;
          background: transparent;
        }
      }
      --el-table-row-hover-bg-color: transparent;
      .el-table-v2__row {
        z-index: 2;
        &:hover {
          .table-action {
            display: inline-block;
          }
        }
      }
      .el-table-v2__row-cell {
        color: var(--text-color);
        // background: var(--card-bg);
        background: transparent;
        // .cell {
        //   color: var(--text-color);
        //   min-height: 25px;
        //   line-height: 25px;
        // }
      }
      .action-btn-column {
        z-index: 9;
        position: static;
        .cell {
          text-align: center;
          overflow: visible;
        }
        .new-folder {
          text-align: left;
          .el-input {
            width: 320px;
            margin-right: 10px;
            .el-input__wrapper {
              height: 40px;
            }
          }
          .el-button {
            width: 30px;
            height: 30px;
            border-radius: 10px;
            font-size: 16px;
          }
        }
      }
    }
    :deep {
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
      .name-box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        :deep {
          .dropdown {
            left: 0;
          }
        }
      }
      .name-link {
        display: flex;
        align-items: center;
        font-weight: 700;
        font-size: 16px;
        color: $light_blue;
        cursor: pointer;
      }
      .table-action {
        z-index: 99;
        display: none;
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
        padding: 0;

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
<style lang="scss">
.action-popover {
  padding: 3px 0 !important;
  border-radius: 16px !important;
  overflow: visible;
  width: 100px !important;
  min-width: 100px !important;
  .more-dropdown {
    overflow: hidden;
    .delete-item {
      color: #ff3353 !important;
    }
    display: block;
    background-color: var(--bg-color);
    list-style: none;
    border-radius: 16px;
    box-shadow: var(--box-shadow);
    li {
      .el-button {
        background-color: #fff;
        color: #000;
        width: 100%;
        height: 30px;
        border: none;
        border-radius: 0;
        font-size: 16px;
        &:hover {
          background-color: rgb(219, 219, 219);
        }
      }
    }
  }
}
</style>
