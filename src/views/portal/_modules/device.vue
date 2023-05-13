<template>
  <div>
    <div
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <p class="welcome">Device</p>
      <el-input
        style="width: 200px"
        class="search-input"
        :prefix-icon="Search"
        type="text"
        placeholder="Name Or ID"
        clearable
        v-model="keyWord"
      ></el-input>
    </div>

    <ul class="deviceList">
      <WifiSearching v-if="loading"></WifiSearching>
      <li
        v-else
        :class="[
          'card',
          !item.device_type ? 'foggie' : '',
          item.device_type === 'foggie_max' ? 'max' : '',
          item.device_type === 'space' ? 'space' : '',
          item.device_type === 'space'
            ? ''
            : item.is_active
            ? 'online'
            : 'offline',
        ]"
        v-for="(item, index) in list"
        @click="toGuide(item)"
      >
        <span></span>
        <div
          v-if="item.device_type !== 'space'"
          :class="['circle', item.is_active ? 'onlineC' : 'offlineC']"
        ></div>
        <div class="item" v-if="item.device_type !== 'space'">
          <span>{{ item.device_type ? "" : "IP: " }}</span>
          <span :title="item.device_type ? item.device_name : item.dedicatedip">
            {{ item.device_type ? item.device_name : item.dedicatedip }}
          </span>
        </div>
        <div v-else>
          Order ID:
          {{ item.space_order_id }}
        </div>
        <div class="item" v-if="item.device_type !== 'space'">
          <span>Device ID: &nbsp;</span>
          <span>
            {{ handleID(item.device_id || "") }}
          </span>
          <svg-icon
            icon-class="copy"
            class="copy-icon"
            @click.stop="copyLink(item.device_id)"
          ></svg-icon>
        </div>
        <div
          class="item"
          style="height: unset"
          v-if="item.device_type == 'space'"
        >
          <span
            style="
              white-space: normal;
              text-overflow: unset;
              word-break: break-all;
            "
            class="value-span value-span2"
            >{{ getfilesize(item.used_space) || 0 }}/{{
              getfilesize(item.total_space) || 0
            }}</span
          >
          Space
        </div>
        <template v-if="!item.device_type || item.device_type === 'space'">
          <div>
            Due
            <el-progress
              style="width: 150px; margin-left: 5px"
              :percentage="handleProgress(item)"
              :status="handleProgress(item) == 100 ? 'warning' : ''"
            />
            <!-- <span class="value-span">{{ handleTimeStamp(item.expire) }}</span> -->
          </div>
        </template>

        <!-- <el-dropdown
          popper-class="more-popper"
          @visible-change="visibleChange"
          @command="handleCommand"
        >
          <span>
            <svg-icon
              @click.stop="showClick"
              icon-class="more"
              class="more"
              style="color: #000; font-size: 20px"
            ></svg-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="{ flag: 'edit', data: item }">
                <svg-icon
                  style="margin-right: 5px"
                  icon-class="edit"
                ></svg-icon>
                Edit
              </el-dropdown-item>
              <el-dropdown-item :command="{ flag: 'delete', data: index }">
                <svg-icon
                  icon-class="delete"
                  style="margin-right: 5px"
                ></svg-icon>
                Delete
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->
      </li>
    </ul>
    <div class="to-app" @click="router.push({ name: 'AppWindow' })">APP</div>
    <IPFrom v-model:visible="visible"></IPFrom>
  </div>
</template>

<script setup>
import { ref, reactive, computed, defineEmits, getCurrentInstance } from "vue";
import WifiSearching from "@/components/wifiSearching";
import { useRouter } from "vue-router";
import IPFrom from "./ipForm";
import { search_foggie } from "@/utils/api";
import { handleTimeStamp, transferUTCTime, getfilesize } from "@/utils/util";
import { useStore } from "vuex";
const store = useStore();
const router = useRouter();
const { proxy } = getCurrentInstance();
const deviceList = reactive({
  list: [
    // {
    //   name: "xx",
    //   url: "dasdas",
    // },
  ],
});
const visible = ref(false);
const emit = defineEmits(["next"]);
const toGuide = (item) => {
  if (item.device_type !== "space") {
    if (item.is_active) {
      store.dispatch("global/setDiscoverData", item);
      router.push({
        name: "AppWindow",
      });
    } else {
      proxy.$notify({
        type: "info",
        message: "This device is offline",
        position: "bottom-left",
      });
    }
  } else {
    store.dispatch("global/setDiscoverData", item);
    router.push({
      name: "AppWindow",
    });
  }
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
const handleID = (str) => {
  return (
    str.substring(0, 3) + "..." + str.substring(str.length - 3, str.length)
  );
};
const handleCommand = ({ flag, data }) => {
  if (flag === "edit") {
    visible.value = true;
  } else if (flag === "delete") {
    proxy
      .$confirm("Are you sure to delete this device record?", "Warning", {
        confirmButtonText: "YES",
        cancelButtonText: "NO",
        type: "warning",
      })
      .then(() => {
        deviceList.list.splice(data, 1);
        proxy.$notify({
          type: "success",
          message: "Successfully deleted",
          position: "bottom-left",
        });
      })
      .catch(() => {});
  }
};
const dropMenuRef = ref(null);
const dropMenuShow = ref(false);
const loading = ref(false);
const visibleChange = (val) => {
  dropMenuShow.value = val;
};
const showClick = () => {
  // if (dropMenuShow.value) {
  //   dropMenuRef.value.handleClose();
  // } else {
  //   dropMenuRef.value.handleOpen();
  // }
};
const handleProgress = (item) => {
  if (!item.device_type) {
    let created = new Date(item.created_at).getTime() / 1000;
    let now = new Date().getTime() / 1000 - created;
    let end = +item.expire - created;
    return +(now / end).toFixed(2) > 100 ? 100 : +(now / end).toFixed(2);
  } else {
    let created = +item.created_at;
    let now = new Date().getTime() - created;
    let end = new Date(item.expire).getTime() - created;
    return +(now / end).toFixed(2) > 100 ? 100 : +(now / end).toFixed(2);
  }
};
const keyWord = ref("");
const list = computed(() => {
  if (!keyWord.value) {
    return deviceList.list;
  } else {
    return deviceList.list.filter((el) => {
      return (
        el.device_name?.indexOf(keyWord.value) > -1 ||
        el.dedicatedip?.indexOf(keyWord.value) > -1 ||
        el.device_id?.indexOf(keyWord.value) > -1 ||
        el.space_order_id?.indexOf(keyWord.value) > -1
      );
    });
  }
});
const email = computed(() => store.getters["token/currentUser"]);
const search = () => {
  loading.value = true;
  search_foggie({ email: email.value })
    .then((res) => {
      let cur_data = res.data;
      // cur_data.forEach((r) => {
      //   if (r.device_type === "space") {
      //     r.expire = r.expire.slice(0, r.expire.length - 3);
      //   }
      // });
      deviceList.list = cur_data;
      store.dispatch("global/setDeviceList", cur_data);
      loading.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
};
search();
</script>

<style lang="scss" scoped>
.welcome {
  display: flex;
  align-items: center;
  text-align: left;
  font-weight: 700;
  font-size: 24px;
  color: #fff;
}
.to-app {
  position: fixed;
  right: 50px;
  bottom: 50px;
  width: 50px;
  height: 50px;
  line-height: 50px;
  font-weight: 900;
  border-radius: 50%;
  background: #f2f6ff;
  box-shadow: 0 0 10px #ccc;
  cursor: pointer;
  &:hover {
    color: $light_blue;
    transform: scale(1.1);
  }
}

.deviceList {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  margin: 20px;
  padding: 0;
  list-style: none;
  :deep {
    #wifi-loader {
      margin: 100px auto;
    }
  }
  li {
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    width: 240px;
    height: 220px;
    margin: 20px;
    padding: 0 25px;
    background: rgba(251, 251, 251, 0.58);
    border: 5px solid white;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(6px);
    border-radius: 17px;
    text-align: center;
    cursor: pointer;
    transition: all 0.5s;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    user-select: none;
    font-weight: 500;
    color: #3f3c3c;
    // color: #093aed;
    cursor: pointer;
    &.offline {
      opacity: 0.8;
      color: #818181;
      cursor: not-allowed;
    }
    .circle {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 15px;
      height: 15px;
      border-radius: 50%;
    }
    .onlineC {
      background: #1eb92a;
    }
    .offlineC {
      background: #999;
    }
    span {
      display: inline-block;
      z-index: 10;
      height: 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item {
      display: flex;
      justify-content: center;
      flex-direction: row;
      max-width: 100%;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      svg {
        font-size: 20px;
        &:hover {
          color: #29abff;
          transform: scale(1.2);
        }
      }
    }
    :deep {
      .el-dropdown {
        position: absolute;
        top: 10px;
        right: 10px;
        border: none !important;
        z-index: 10;
      }
    }
    // .more {
    //   position: absolute;
    //   top: 10px;
    //   right: 10px;
    // }
  }
  // .card::before {
  //   content: "";
  //   position: absolute;
  //   width: 100px;
  //   background-image: linear-gradient(
  //     180deg,
  //     rgb(0, 183, 255),
  //     rgb(255, 48, 255)
  //   );
  //   height: 150%;
  //   animation: rotBGimg 3s linear infinite;
  //   transition: all 0.2s linear;
  //   display: none;
  // }

  // @keyframes rotBGimg {
  //   from {
  //     transform: rotate(0deg);
  //   }

  //   to {
  //     transform: rotate(360deg);
  //   }
  // }

  // .card::after {
  //   content: "";
  //   position: absolute;
  //   background: transparent;
  //   inset: 5px;
  //   border-radius: 15px;
  // }
  .card:hover {
    // background: #fff;
    transform: translateY(-5px);
    transition: all 0.5s;
    &::before {
      display: inline-block;
    }
    &::after {
      // background-color: #fff;
    }
  }
  .foggie,
  .space {
    position: relative;
    &::before {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      width: 100%;
      height: 100%;
      background: url("~@/assets/logo-dog.svg") no-repeat;
      background-size: 140px;
      background-position: center;
      opacity: 0.2;
      z-index: -1;
    }
    > div {
      display: flex;
      align-items: center;
    }
    .value-span {
      line-height: 24px;
      font-weight: 500;
      font-size: 16px;
      color: #1973be !important;
    }
  }
  .space {
    &::before {
      background: url("~@/assets/storage.svg") no-repeat;
      background-size: 140px;
      background-position: center;
      opacity: 0.3;
    }
  }
  .max {
    overflow: unset;

    & > span {
      position: absolute;
      overflow: hidden;
      width: 74px;
      height: 85px;
      top: -9px;
      left: -9px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    & > span::before {
      content: "MAX";
      position: absolute;
      width: 150%;
      height: 30px;
      background-image: linear-gradient(
        45deg,
        #ff6547 0%,
        #ffb144 51%,
        #ff7053 100%
      );
      background-image: linear-gradient(
        209.21deg,
        rgb(29, 145, 252) 13.57%,
        rgb(90, 54, 192) 98.38%
      );
      transform: rotate(-45deg) translateY(-20px);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      box-shadow: 0 0px 4px rgba(0, 0, 0, 0.23);
    }

    & > span::after {
      content: "";
      position: absolute;
      width: 10px;
      bottom: 13px;
      left: -6px;
      height: 10px;
      z-index: -1;
      box-shadow: 140px -140px #cc3f47;
      background-image: linear-gradient(
        45deg,
        #ff512f 0%,
        #f09819 51%,
        #ff512f 100%
      );
      background-image: linear-gradient(
        209.21deg,
        rgb(29, 145, 252) 13.57%,
        rgb(90, 54, 192) 98.38%
      );
    }
    // border: 5px solid transparent;
    // background: linear-gradient(315deg, #03a9f4, #ff0058);
    // &::before {
    //   content: "";
    //   position: absolute;
    // }
  }
}

.more-popper {
  background: transparent !important;
  .el-popper__arrow {
    display: none;
  }
  .el-dropdown-menu {
    // background: rgb(242, 246, 255);
    background: rgba(251, 251, 251, 0.58) !important;
  }
  .el-dropdown-menu__item {
    color: #000;
    background: transparent !important;

    // color: #000;
    // & + .el-dropdown-menu__item {
    //   border-top: 1px solid #e5e7eb;
    // }
  }
}
.account-dialog {
  .el-dialog__body {
    padding: 20px 0;
    color: #000;
  }
  .dialog-footer {
    .el-button {
      border-radius: 50px;
    }
  }
}
</style>
