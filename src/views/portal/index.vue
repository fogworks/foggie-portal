<template>
  <div class="portal-main" id="portal-main">
    <div class="left-box">
      <div class="collapse" @click="changeCollapse">
        <svg-icon
          icon-class="collapse"
          :class="[isCollapse ? 'isCollapse' : '']"
        ></svg-icon>
      </div>
      <el-menu
        class="left-menu"
        :collapse="isCollapse"
        :default-active="defaultActive"
        router
      >
        <el-menu-item index="user" class="user">
          <svg-icon icon-class="user"></svg-icon>
          <template #title v-if="userName">
            <div :title="userName">
              {{ userName }}
            </div>
          </template>
        </el-menu-item>
        <el-menu-item index="assets" v-if="hasReady">
          <svg-icon icon-class="income"></svg-icon>
          <template #title> Assets </template>
        </el-menu-item>
        <el-menu-item index="device" v-if="hasReady">
          <svg-icon icon-class="devices"></svg-icon>
          <template #title> Device </template>
        </el-menu-item>
        <el-menu-item disabled index="discover">
          <svg-icon icon-class="discover"></svg-icon>
          <template #title>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Coming Soon"
              placement="right"
            >
              Discover
            </el-tooltip>
          </template>
        </el-menu-item>
        <el-menu-item index="shop" v-if="hasReady">
          <svg-icon icon-class="shop"></svg-icon>
          <template #title> Shop </template>
        </el-menu-item>
      </el-menu>
    </div>
    <teleport to="body">
      <upload
        ref="uploadRef"
        @fileShare="fileShare"
        v-show="uploadIsShow"
      ></upload>
    </teleport>
    <div class="main" id="main">
      <router-view v-slot="{ Component }">
        <component :is="Component" v-if="!$route.meta.keepAlive"></component>
        <keep-alive>
          <component :is="Component" v-if="$route.meta.keepAlive"></component>
        </keep-alive>
      </router-view>
    </div>
    <ShareDialog
      :shareRefContent="shareRefContent"
      :copyContent="copyContent"
      v-model:visible="showShareDialog"
    ></ShareDialog>
  </div>
</template>

<script setup>
import upload from "@/components/reconsitutionUpload/index.vue";

// import upload from "@/components/newUpload/index.vue";
// import upload from "@/components/upload";

// import upload from "@/components/upload";
import ShareDialog from "@/views/foggieMax/home/_modules/myFiles/shareDialog";
import {
  ref,
  reactive,
  computed,
  watch,
  watchEffect,
  onMounted,
  provide,
} from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { getUserLoginStatus, heartbeat } from "@/api/common";
import { getChain_id } from "@/api/common.js";
import { publishPin, user, find_objects } from "@/utils/api";
import { fileQuery } from "@/api/myFiles/myfiles";
import { ElNotification } from "element-plus";

const uploadRef = ref();

const store = useStore();

let uploadIsShow = computed(() => store.getters.uploadIsShow);
const route = useRoute();

const isCollapse = ref(false);
const defaultActive = ref(route.path.slice(1, route.path.length));

// const userName = computed(() => store.getters["token/currentUser"] || "Login");
const userName = computed(() => store.getters.userInfo?.email || "Login");
const email = computed(() => store.getters.userInfo?.email);
const hasReady = computed(() => store.getters.hasReady);
const tokenMap = computed(() => store.getters.tokenMap);
const shareRefContent = reactive({});
const copyContent = ref("");
const showShareDialog = ref(false);
let shareCopyContent = "";

const changeCollapse = () => {
  isCollapse.value = !isCollapse.value;
};
const getChainId = () => {
  getChain_id().then((res) => {
    if (res.code == 200) {
      store.commit("clientGlobal/SAVE_ChainId", res.data);
    }
  });
};
getChainId();
const getCid = (item) => {
  return new Promise((resolve, reject) => {
    let orderId =
      item.deviceType == 3
        ? item.deviceData.space_order_id
        : item.deviceData.order_id;

    fileQuery({
      email: email.value,
      orderId,
      deviceType: +item.deviceType,
      key: encodeURIComponent(item.name),
    })
      .then((res) => {
        if (res.data[0]?.cid) {
          resolve(res.data[0]?.cid);
        } else {
          ElNotification({
            customClass: "notify-error",
            message: "Failed to obtain file information",
            position: "bottom-left",
          });
          reject(false);
        }
      })
      .catch(() => {
        ElNotification({
          customClass: "notify-error",
          message: "Failed to obtain file information",
          position: "bottom-left",
        });
        reject(false);
      });
  });
};
const foggieGetCid = async (item) => {
  return new Promise(async (resolve, reject) => {
    let token = tokenMap.value[item.deviceData.device_id];
    let type = "foggie";
    let data = await find_objects(
      email.value,
      type,
      token,
      item.deviceData,
      encodeURIComponent(item.name)
    );
    if (data) {
      resolve(data.contents[0]?.cid);
    } else {
      ElNotification({
        customClass: "notify-error",
        message: "Failed to obtain file information",
        position: "bottom-left",
      });
      reject(false);
    }
  });
};
const doShare = async (item) => {
  let id = item.id;
  const isFolder = item.fileType === "application/x-directory";
  item.isDir = isFolder;
  const fetchMethod = item.deviceType == 3 ? getCid : foggieGetCid;
  let cid = await fetchMethod(item);
  item.cid = cid;
  if (item && item.deviceType != 3) {
    await ipfsPin(item);
  }

  if (id) {
    let orderId =
      item.deviceType == 3
        ? item.deviceData.space_order_id
        : item.deviceData.order_id;
    let peer_id = item.deviceData.peer_id;
    let httpStr = `foggie://${peer_id}/${orderId}/${item.cid}`;
    let ipfsStr = item.cid ? `ipfs://${item.cid}` : "";

    let myQrcode = window.sessionStorage.getItem("myQrcode");
    let code = `http://foggie.fogworks.io/?pcode=${myQrcode}`;
    let shareStr = `The Web3 content I publish with Foggie is my digital asset and cannot be tampered with or deleted without my permission. It can also help us earn $DMC crypto rewards. Let's Web3-to-Earn together! Use my invite link ${code} to adopt a Foggie so we can all earn $DMC and grow Web3 together.Thanks!`;
    shareCopyContent = shareCopyContent + " " + " \n ";
    shareCopyContent = shareCopyContent + httpStr + " \n";
    shareCopyContent = shareCopyContent + " " + " \n ";
    shareRefContent.httpStr = httpStr;
    if (item.deviceType != 3) {
      shareCopyContent = shareCopyContent + ipfsStr + " \n";
      shareCopyContent = shareCopyContent + " " + " \n ";
      shareRefContent.ipfsStr = ipfsStr;
      shareRefContent.httpStr = shareRefContent.httpStr + `&ipfsStr=${ipfsStr}`;
    }

    shareCopyContent = shareCopyContent + shareStr + " \n";
    shareRefContent.shareStr = shareStr;
    copyContent.value = shareCopyContent;
    // shareRefContent.value=shareCopyContent
    showShareDialog.value = true;
    // this.shareBoxShow = true;
  }
};
const ipfsPin = (item) => {
  let ip_address = item.deviceData.rpc.split(":")[0];
  let port = item.deviceData.rpc.split(":")[1];
  let peerId = item.deviceData.peer_id;
  let token = tokenMap.value[item.deviceData.device_id];

  let data = {
    ip_address,
    port,
    token,
    // peerId: deviceData.value.peer_id,
    peerId,
    Id: item.deviceData.foggie_id,
    exp: 3 * 24 * 3600,
    stype: "ipfs",
    pin: true,
    key: item.cid,
    isDir: item.isDir,
  };
  publishPin(data).then((res) => {
    if (res) {
    }
  });
};
function fileShare(item) {
  doShare(item);
}
function loadUserLoginStatus() {
  let params = {
    email: email.value,
  };
  getUserLoginStatus(params).then((res) => {
    if (res.code == 10001) {
      store.dispatch("global/setHasReady", false);
    } else if (res.code == 10002 || res.code == 10007) {
      store.dispatch("global/setHasReady", true);
    }
  });
}
watchEffect(() => {
  loadUserLoginStatus();
});
watch(
  email,
  async (val) => {
    if (val) {
      let res = await user();
      if (res.data) {
        window.sessionStorage.setItem("walletUser", res.data.dmc);
        window.sessionStorage.setItem("myQrcode", res.data.referral_code);
      }
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
function heartbeatInterval() {
  heartbeat().then((res) => {});
}
onMounted(() => {
  heartbeatInterval();
  setInterval(() => {
    heartbeatInterval();
  }, 60000);
});
</script>

<style lang="scss" scoped>
.portal-main {
  display: flex;
  height: 100%;
  // background: var(--main-background-image);
  // background: url("../../assets/cool-background.png") no-repeat;
  background: linear-gradient(90deg, #7964e3 0, #334ab3 50%, #7964e3);
  background-size: cover;

  .left-box {
    position: relative;

    .collapse {
      position: absolute;
      right: -20px;
      top: 50%;
      font-size: 30px;
      border-radius: 50%;
      width: 35px;
      height: 35px;
      background-color: #fff;
      cursor: pointer;
      z-index: 1;
      box-shadow: 0 0 7px #727272;

      svg {
        transform: rotate(-90deg);
        transition: all 0.5s;

        &.isCollapse {
          transform: rotate(90deg);
        }

        color: #fff;
        cursor: pointer;
      }
    }
  }

  .left-menu {
    position: relative;
  }

  :deep {
    .el-menu {
      // width: 250px;
      height: 100%;
      background-color: var(--bg-color);

      .el-menu-item {
        display: flex;
        text-align: left;
        align-items: center;
        font-size: 20px;

        svg {
          margin-right: 15px;
          font-size: 30px;
          cursor: pointer;
          vertical-align: middle;
        }

        &.user {
          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
          // width: 250px;
          padding: 10px 20px;
          // height: 50px;
          height: unset;
          line-height: unset;
          color: #fff;
          // background: #8b49ec;
          background: #495dd0;

          // background: rgb(28, 42, 237);
          // background: linear-gradient(
          //   93deg,
          //   rgba(28, 42, 237, 1) 0%,
          //   rgba(126, 12, 247, 1) 52%
          // );
          svg {
            margin-right: 0;
          }

          div {
            padding: 5px 0px;
            font-size: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 100%;
          }
        }
      }

      &.el-menu--collapse {
        // width: 200px;
        // min-height: 400px;
        .user {
          height: 56px;

          div {
            padding: 0 20px;
          }

          svg {
            font-size: 30px;
            margin: 0;
          }
        }

        .el-menu-item {
          svg {
            margin: 0;
            font-size: 30px;
          }
        }
      }

      &:not(.el-menu--collapse) {
        width: 220px;
      }
    }
  }

  .main {
    position: relative;
    overflow-y: auto;
    // height: calc(100% - 60px);
    flex: 1;
    padding: 30px;
    padding-right: 20px;
    // background: linear-gradient(
    //   220deg,
    //   rgba(174, 176, 238, 1) 0%,
    //   rgba(148, 187, 233, 1) 100%
    // );

    > div {
      z-index: 1;
    }

    // &::after {
    //   content: "";
    //   position: absolute;
    //   left: 0;
    //   top: 0;
    //   width: 100%;
    //   height: 100%;
    //   background: url("~@/assets/cool-background.png") no-repeat;
    //   background-size: cover;
    //   z-index: 0;
    // }
  }
}
</style>
