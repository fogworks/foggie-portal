<template>
  <div>
    <!-- <a href="http://154.37.16.163:9000/#/home">Foggie Max</a> -->
    <p class="welcome">
      Device Discovery
      <svg-icon icon-class="reset" @click="refresh" class="refresh"></svg-icon>
      <!-- <svg-icon icon-class="add" @click="addIP" class="refresh add"></svg-icon> -->
    </p>
    <p v-if="curAddress" class="p-address">Your IP address:{{ curAddress }}</p>
    <ul class="deviceList">
      <WifiSearching v-if="loading"></WifiSearching>
      <template v-else>
        <li class="card" v-for="item in deviceList.list" @click="toGuide(item)">
          <div class="item">
            <span>{{ item.device_type ? "Name: " : "IP: " }}</span>
            <span>
              {{ item.device_type ? item.device_name : item.ipaddress }}
            </span>
          </div>
          <div class="item">
            <span>Device ID: &nbsp;</span>
            <span>
              {{ handleID(item.device_id) }}
            </span>
            <svg-icon
              icon-class="copy"
              class="copy-icon"
              @click.stop="copyLink(item.device_id)"
            ></svg-icon>
          </div>
        </li>
        <li class="card add" @click="addIP">
          <svg-icon icon-class="add-bold"></svg-icon>
        </li>
      </template>
    </ul>
    <IpForm v-model:visible="visible" @getMax="getMax"></IpForm>
    <AssociatedAccount
      v-model:visible="accountVisible"
      :currentItem="currentItem"
    ></AssociatedAccount>
    <el-dialog
      class="account-dialog"
      title="Associated account"
      width="500px"
      v-model="chooseAssociated"
    >
      <span> Is it related to Foggie account? </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="skip">Skip</el-button>
          <el-button
            type="primary"
            @click="
              chooseAssociated = false;
              accountVisible = true;
            "
          >
            YES
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, computed, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import WifiSearching from "@/components/wifiSearching";
import IpForm from "./ipForm";
import {
  pingUrl,
  getIP,
  socketIP,
  portalPing,
  getNetStatus,
} from "@/utils/api";
import AssociatedAccount from "./associatedAccount";
import { useStore } from "vuex";
const loading = ref(false);
const visible = ref(false);
const chooseAssociated = ref(false);
const accountVisible = ref(false);
const router = useRouter();
const store = useStore();
const { proxy } = getCurrentInstance();
const curAddress = ref("");
const refresh = () => {
  loading.value = true;
  setTimeout(() => {
    getIP().then((res) => {
      curAddress.value = res?.address;
      loading.value = false;
    });
    socketIP().then((res) => {
      let rrr = res.data;
      loading.value = false;
      for (let i = 0; i < rrr.length; i++) {
        let flag = true;
        for (let j = 0; j < deviceList.list.length; j++) {
          if (rrr[i].ipaddress === deviceList.list[j].ipaddress) {
            flag = false;
          }
        }
        if (flag) {
          deviceList.list.push(rrr[0]);
        }
      }
      // deviceList.list = rrr.data;
    });
  }, 3000);
};
const userInfo = computed(() => store.getters.userInfo);
const detected_net = computed(() => store.getters.detected_net);
let currentItem = reactive({
  data: {},
});
const toGuide = (item) => {
  currentItem.data = item;
  // if (userInfo.email) {
  //
  // const url = `http://${item.ipaddress}:8080/#/welcome`;
  // window.location.href = url;
  // } else {
  // }
  if (detected_net.value && !item.email && !item.bind) {
    chooseAssociated.value = true;
  } else {
    store.dispatch("global/setDiscoverData", item);
    router.push({
      name: "AppWindow",
      query: { isDiscover: true },
    });
    // const url = `http://${item.ipaddress}:9001/#/welcome`;
    // window.location.href = url;
  }
};
const skip = () => {
  chooseAssociated.value = false;
  // const url = `http://${currentItem.ipadreess}:9001/#/welcome`;
  // window.location.href = url;
  store.dispatch("global/setDiscoverData", currentItem.data);

  router.push({
    name: "AppWindow",
    query: { isDiscover: true },
  });
  // router.push({
  //   name: "Welcome",
  // });
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
    customClass: "notify-success",
    message: "Copy succeeded",
    position: "bottom-left",
  });
};
const handleID = (str) => {
  return (
    str.substring(0, 3) + "..." + str.substring(str.length - 3, str.length)
  );
};
const addIP = () => {
  visible.value = true;
};
const deviceList = reactive({
  list: [
    // {
    //   device_name: "xx",
    //   ipaddress: "dasdas",
    //   device_id: "xxxxxxxxxxxxxx",
    // },
  ],
});
const getMax = (data) => {
  let flag = true;
  for (let i = 0; i < deviceList.list.length; i++) {
    if (data.ipaddress === deviceList.list[i].ipaddress) {
      flag = false;
      break;
    }
  }
  if (flag) {
    deviceList.list.push(data);
    proxy.$notify({
      customClass: "notify-success",
      message: "The device is added successfully",
      position: "bottom-left",
    });
  } else {
    proxy.$notify({
      customClass: "notify-warning",
      message: "Device already exists",
      position: "bottom-left",
    });
  }
};
const emit = defineEmits(["next"]);
</script>

<style lang="scss" scoped>
.welcome {
  display: flex;
  align-items: center;
  text-align: left;
  font-weight: 700;
  font-size: 24px;
  color: #fff;

  .refresh {
    margin-left: 10px;
    // color: #29abff;
    color: #fff;
    cursor: pointer;
    transition: all 0.5s;

    &:hover {
      // color: #f9f871;
      transform: rotate(90deg);
    }
  }
  .add {
    font-size: 30px;
    &:hover {
      transform: scale(1.1);
    }
  }
}
.p-address {
  display: flex;
  margin-top: 15px;
  align-items: center;
  text-align: left;
  font-weight: 700;
  font-size: 14px;
  color: #fff;
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
    font-weight: bolder;
    color: #3f3c3c;
    cursor: pointer;
    .item {
      display: flex;
      max-width: 100%;
      justify-content: center;
      flex-direction: row;
      font-weight: 500;
      svg {
        font-size: 20px;
        &:hover {
          color: #29abff;
          transform: scale(1.2);
        }
      }
    }
    > span {
      z-index: 10;
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
  .add {
    align-items: center;
    &::before,
    &::after {
      content: unset;
    }
    svg {
      font-size: 50px;
    }
  }
}
</style>
