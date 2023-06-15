<template>
  <div class="img-content">
    <div v-for="(item, index) in imgData" class="img-box">
      <p>
        <el-checkbox
          v-model="item.checkAll"
          @change="(val) => handleCheckAllChange(val, item)"
        ></el-checkbox>
        {{ item.time }}
      </p>
      <div class="img-item-box">
        <el-checkbox-group
          :validate-event="false"
          v-model="imgCheckedData.value[item.dateId]"
          @change="(val) => handleCheckedItemsChange(val, item)"
        >
          <div :class="['img-item']" v-for="(img, index) in item.list">
            <div :class="['mask', isChecking ? 'isChecking' : '']">
              <el-checkbox
                :class="[
                  'mask-checkbox',
                  itemChecked(img.id, item.dateId) ? 'itemChecked' : '',
                ]"
                :key="index"
                :label="img.id"
              ></el-checkbox>
            </div>
            <ActionDrop class="action-popover">
              <div class="more-box">
                <svg-icon icon-class="more"></svg-icon>
              </div>
              <template #reference>
                <ul class="more-dropdown">
                  <li>
                    <el-button
                      @click="
                        handleCommand({
                          flag: 'download',
                          data: img,
                          pid: item.dateId,
                        })
                      "
                    >
                      Download</el-button
                    >
                  </li>
                  <li>
                    <el-button
                      @click="
                        handleCommand({
                          flag: 'move',
                          data: img,
                          pid: item.dateId,
                        })
                      "
                    >
                      Move</el-button
                    >
                  </li>
                  <li>
                    <el-button
                      class="delete-item"
                      @click="
                        handleCommand({
                          flag: 'delete',
                          data: img,
                          pid: item.dateId,
                        })
                      "
                    >
                      Delete</el-button
                    >
                  </li>
                </ul>
              </template>
            </ActionDrop>
            <el-image
              scroll-container=".img-content"
              :preview-teleported="true"
              :teleported="true"
              :hide-on-click-modal="true"
              :initial-index="1"
              :preview-src-list="[img.url]"
              fit="cover"
              :key="img.id"
              :src="img.url"
              lazy
            >
              <template #placeholder>
                <div class="image-placeholder">
                  <svg-icon
                    icon-class="picture"
                    size="30"
                    style="color: #fff"
                  ></svg-icon>
                </div>
              </template>
              <template #error>
                <div class="image-placeholder">
                  <svg-icon
                    icon-class="image-failed"
                    size="30"
                    style="color: #fff"
                  ></svg-icon>
                </div>
              </template>
            </el-image>
          </div>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import ActionDrop from "@/components/actionDrop";
import { Picture as IconPicture } from "@element-plus/icons-vue";
import {
  toRefs,
  ref,
  reactive,
  nextTick,
  watch,
  onMounted,
  computed,
  inject,
} from "vue";
import { useStore } from "vuex";
import { get_timeline } from "@/utils/api";
import { baseUrl } from "@/setting";
import { getfilesize, transferTime } from "@/utils/util";
import {
  oodFileList,
  find_objects,
  publishPin,
  file_delete,
} from "@/utils/api.js";
import {
  GetFileList,
  GetFileListAll,
  InitiateChallenge,
  fileQuery,
} from "@/api/myFiles/myfiles";
const imgCheckedData = reactive({
  value: {},
});
const emits = defineEmits([
  "update:checkedData",
  "update:folderVisible",
  "setSingle",
]);
const props = defineProps({
  orderId: [String, Number],
  fileSource: Boolean,
});
const { orderId, fileSource } = toRefs(props);
const deviceData = inject("deviceData");
const resetChecked = () => {
  imgCheckedData.value = {};
  refCheckAll();
};
const state = reactive({
  imgData: [
    // {
    //   time: "2023-6-2",
    //   dateId: "xx",
    //   list: [],
    // },
  ],
});
const imgIndex = ref(0);
const store = useStore();
const email = computed(() => store.getters.userInfo?.email);
const tokenMap = computed(() => store.getters.tokenMap);
const deviceType = computed(() => deviceData.device_type);
const token = computed(() => {
  if (deviceData.device_type == "space") {
    return deviceData.upload_file_token;
  } else {
    return tokenMap.value[deviceData.device_id];
  }
});
const { imgData } = toRefs(state);
const refCheckAll = () => {
  imgData.value.forEach((el) => {
    el.checkAll = false;
  });
};
const isChecking = computed(() => {
  return Object.keys(imgCheckedData.value)?.some((key) => {
    if (imgCheckedData.value[key].length) {
      return true;
    } else {
      return false;
    }
  });
});
const itemChecked = (id, pid) => {
  if (imgCheckedData.value?.[pid]?.indexOf(id) > -1) {
    return true;
  } else {
    return false;
  }
};
const timeLine = ref([]);
const dateTimeLine = ref([]);
const tableLoading = ref(false);
const continuationToken = ref("");
const tableData = ref([]);
const breadcrumbList = reactive({
  prefix: [],
});
const getTimeLine = (date = "") => {
  return new Promise((resolve, reject) => {
    const getMethod = (date) => {
      let interval = "year";
      if (!date) {
        interval = "year";
      } else if (date.length == 4) {
        // || date.length == 7 || date.length == 6
        interval = "month";
      } else {
        interval = "day";
      }
      get_timeline({
        deviceData,
        token: token.value,
        interval,
        date,
        category: 1,
      })
        .then((res) => {
          if (res.contents) {
            const content = res.contents;
            content.forEach((el) => {
              if (el.count) {
                timeLine.value.push(el.date);
                if (el.date.length !== 10) {
                  getMethod(el.date);
                } else {
                  dateTimeLine.value.push(el.date);
                  resolve();
                }
              }
            });
          }
        })
        .catch(() => {
          reject();
        });
    };
    getMethod();
  });
};
const getReomteData = (scroll, prefix, reset = false, date = "") => {
  tableLoading.value = true;
  let type = "space";
  oodFileList(
    email.value,
    type,
    token.value,
    deviceData,
    prefix,
    scroll,
    1,
    date
  )
    .then((res) => {
      if (res && res.content) {
        initRemoteData(res, reset, date);
      } else {
        tableLoading.value = false;
      }
    })
    .catch(() => {
      tableLoading.value = false;
    });
};

const getLocalData = (reset = false, date = "") => {
  let params = {
    email: email.value,
    orderId: orderId.value,
    deviceType: 3,
  };
  GetFileListAll(params)
    .then((res) => {
      initLocalData(res, reset, date);
    })
    .catch(() => {
      tableLoading.value = false;
    });
};
const initRemoteData = (data, reset = false, date = "") => {
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
  if (reset) imgData.value = [];
  let content = data?.content?.map((el, index) => {
    let date = transferTime(el.lastModified);
    let isDir = false;
    const type = el.key.substring(el.key.lastIndexOf(".") + 1);
    let { imgHttpLink: url, isSystemImg } = handleImg(el, type, isDir);
    let { imgHttpLink: url_large } = handleImg(el, type, isDir);
    let cid = el.cid;
    let file_id = el.fileId;

    let name = decodeURIComponent(el.key);
    if (data.prefix) {
      name = name.split(data.prefix)[1];
    }
    let isPersistent = el.isPersistent;

    let item = {
      isDir: isDir,
      name,
      fullName: decodeURIComponent(el.key),
      key: el.key,
      idList: [
        {
          name: "IPFS",
          code: el.isPin ? cid : "",
        },
        {
          name: "CYFS",
          code: el.isPinCyfs ? file_id : "",
        },
      ],
      date,
      size: getfilesize(el.size),
      status: cid || file_id ? "Published" : "-",
      type: el.contentType,
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
    return item;
  });
  // for (let j = 0; j < data?.content?.length; j++) {
  //   let date = transferTime(data.content[j].lastModified);
  //   let isDir = false;
  //   const type = data.content[j].key.substring(
  //     data.content[j].key.lastIndexOf(".") + 1
  //   );
  //   let { imgHttpLink: url, isSystemImg } = handleImg(
  //     data.content[j],
  //     type,
  //     isDir
  //   );
  //   let { imgHttpLink: url_large } = handleImg(data.content[j], type, isDir);
  //   let cid = data.content[j].cid;
  //   let file_id = data.content[j].fileId;

  //   let name = decodeURIComponent(data.content[j].key);
  //   if (data.prefix) {
  //     name = name.split(data.prefix)[1];
  //   }
  //   let isPersistent = data.content[j].isPersistent;

  //   let item = {
  //     isDir: isDir,
  //     name,
  //     fullName: decodeURIComponent(data.content[j].key),
  //     key: data.content[j].key,
  //     idList: [
  //       {
  //         name: "IPFS",
  //         code: data.content[j].isPin ? cid : "",
  //       },
  //       {
  //         name: "CYFS",
  //         code: data.content[j].isPinCyfs ? file_id : "",
  //       },
  //     ],
  //     date,
  //     size: getfilesize(data.content[j].size),
  //     status: cid || file_id ? "Published" : "-",
  //     type: data.content[j].contentType,
  //     file_id: file_id,
  //     pubkey: cid,
  //     cid,
  //     imgUrl: url,
  //     imgUrlLarge: url_large,
  //     share: {},
  //     isSystemImg,
  //     canShare: cid ? true : false,
  //     isPersistent,
  //   };
  //   tableData.value.push(item);
  // }
  if (data?.content.length) {
    imgData.value.push({
      time: date,
      dateId: date,
      list: content,
    });
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
const initLocalData = (data, reset = false, date = "") => {
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
  if (reset) imgData.value = [];
  let content = data?.data?.map((el, index) => {
    let date = el.update_time;
    let isDir = false;

    let cid = el.cid;
    let file_id = el.fileId;

    let name = decodeURIComponent(el.dest_path);

    const type = el.dest_path.substring(el.dest_path.lastIndexOf(".") + 1);
    let { isSystemImg } = handleImg(el, type, isDir);

    let item = {
      isDir: isDir,
      fullName: decodeURIComponent(el.dest_path),
      name,
      key: el.dest_path,
      idList: [
        {
          name: "IPFS",
          code: el.isPin ? cid : "",
        },
        {
          name: "CYFS",
          code: el.isPinCyfs ? file_id : "",
        },
      ],
      date,
      size: getfilesize(el.file_size),
      status: cid || file_id ? "Published" : "-",
      type: el.contentType || "",
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
  });
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
  if (data?.data.length) {
    imgData.value.push({
      time: date,
      dateId: date,
      list: content,
    });
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
const getFileList = function (scroll, prefix, reset = false, date = "") {
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
      getReomteData(scroll, list_prefix, reset, date);
    } else {
      getLocalData(reset, date);
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
      1,
      date
    )
      .then((res) => {
        if (res && res.content) {
          initFileData(res, reset, date);
        }
      })
      .finally(() => (tableLoading.value = false));
  }
};

const initFileData = async (data, reset = false) => {
  // tableData.value = [];
  // let commonPrefixesItem = [];
  let contentItem = [];
  emits("update:checkedData", {});
  // fileTable.value?.clearSelection();
  let dir = breadcrumbList.prefix.join("/");
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
      imgUrlLarge: url_large,
      // share: getShareOptions(),
      share: {},
      isSystemImg,
      canShare: cid ? true : false,
    };
    // contentItem.push(item);
  });
  if (data.isTruncated) {
    continuationToken.value = data.continuationToken;
  } else {
    continuationToken.value = "";
  }
  if (reset) {
    tableData.value = [...contentItem];
  } else {
    tableData.value = [...tableData.value, ...contentItem];
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
    }&token=${token.value}&thumb=true`;

    // foggie://peerid/spaceid/cid
  } else if (type === "mp4") {
    type = "video";

    imgHttpLink = `/file_download/?cid=${cid}&key=${key}&ip=${ip}&port=${port}&Id=${Id}&peerId=${peerId}&type=${
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
const init = async () => {
  await getTimeLine();

  // getFileList(
  //   "",
  //   breadcrumbList.prefix,
  //   false,
  //   dateTimeLine.value[imgIndex.value]
  // );
};
watch(dateTimeLine, async (val) => {
  await getFileList(
    "",
    breadcrumbList.prefix,
    false,
    dateTimeLine.value[imgIndex.value]
  );
  imgIndex.value++;
});
const refresh = () => {
  console.log(111);
};
const handleCheckAllChange = (val, item) => {
  imgCheckedData.value[item.dateId] = val ? item.list.map((el) => el.id) : [];
};
const handleCheckedItemsChange = (val, item) => {
  const checkedCount = val.length;
  item.checkAll = checkedCount === item.list.length;
};
const handleCommand = ({ flag, data, pid }) => {
  if (flag == "download") {
  } else if (flag == "delete") {
    imgCheckedData.value[pid] = imgCheckedData.value[pid].filter(
      (el) => el.dateId == pid
    );
    // emits('setSingle',imgCheckedData.value[pid].filter(
    //   (el) => el.dateId == pid
    // ))
  } else if (flag == "move") {
    imgCheckedData.value[pid] = imgCheckedData.value[pid].filter(
      (el) => el.dateId == pid
    );
    emits("update:folderVisible", true);
  }
};
watch(
  imgCheckedData,
  (val) => {
    emits("update:checkedData", val.value);
  },
  {
    immediate: true,
    deep: true,
  }
);
onMounted(() => {
  init();
  // nextTick(() => {
  //   refCheckAll();
  // });
  // scrollContainer.value = imgContentRef.value;
});
defineExpose({ resetChecked });
</script>

<style lang="scss" scoped>
.img-content {
  height: 800px;
  padding-bottom: 100px;
  overflow-y: auto;
  .img-box {
    p {
      position: sticky;
      top: 0;
      z-index: 999;
      background-color: var(--bg-color);
      text-align: left;
    }
  }
  .img-item-box {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 10px;
    :deep {
      .el-checkbox-group {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
      }
    }
    .img-item {
      position: relative;
      width: 128px;
      height: 128px;
      margin: 0 10px 10px 0;
      .mask {
        display: none;
        position: absolute;
        z-index: 1;
        width: 100%;
        height: 30px;
        background-image: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0.3) 0%,
          rgba(0, 0, 0, 0) 100%
        );
        .mask-checkbox {
          display: none;
        }
        .itemChecked {
          display: block;
        }
        &.isChecking {
          display: block;
          height: 100%;
          cursor: pointer;
          :deep {
            .el-checkbox {
              width: 100%;
              height: 100%;
            }
          }
        }

        :deep {
          .el-checkbox {
            position: absolute;
            left: 0;
          }
          .el-checkbox__input {
            position: absolute;
            left: 5px;
            top: 10px;
          }
          .el-checkbox__label {
            display: none;
          }
        }
      }
      .action-popover {
        display: none;

        min-width: unset !important;
        width: 100% !important;
        position: absolute;
        top: 0;
        z-index: 9;
        .more-box {
          position: absolute;
          top: 0;
          left: 80%;
          height: 20px;
          width: 20px;
          margin-top: 6px;
          border-radius: 4px;
          background-color: #fff;
          svg {
            margin-top: 1px;
            font-size: 18px;
            color: $light_blue;
          }
        }
        .more-dropdown {
          z-index: 999;
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
              // background-color: transparent;
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
      &:hover {
        .mask {
          display: block;
          .mask-checkbox {
            display: block;
          }
        }
        .action-popover {
          display: block;
        }
      }
    }
    .action-popover {
      overflow: visible;
      width: unset !important;
      :deep {
        .dropdown {
        }
      }
    }
    .image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f1f1f1;
    }
    :deep {
      .el-image {
        width: 128px;
        height: 128px;
        img {
          // object-fit: cover;
          // vertical-align: middle;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.more-list {
  .el-dropdown-menu__item {
    justify-content: flex-start !important;
  }
}
</style>
