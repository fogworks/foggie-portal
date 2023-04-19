<template>
  <div>
    <!-- <a href="http://154.37.16.163:9000/#/home">Foggie Max</a> -->
    <p class="welcome">
      Device Discovery
      <svg-icon icon-class="reset" @click="refresh" class="refresh"></svg-icon>
      <svg-icon icon-class="add" @click="addIP" class="refresh add"></svg-icon>
    </p>
    <p v-if="curAddress">Your IP address:{{ curAddress }}</p>
    <ul class="deviceList">
      <WifiSearching v-if="loading"></WifiSearching>
      <li
        class="card"
        v-else
        v-for="item in deviceList.list"
        @click="toGuide(item)"
      >
        <span>
          {{ item.device_name }}
        </span>
      </li>
    </ul>
    <IpForm v-model:visible="visible"></IpForm>
    <AssociatedAccount v-model:visible="accountVisible"></AssociatedAccount>
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
import { ref, reactive, defineEmits, computed } from "vue";
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

const loading = ref(false);
const visible = ref(false);
const chooseAssociated = ref(false);
const accountVisible = ref(false);
const router = useRouter();
const curAddress = ref("");
const refresh = () => {
  loading.value = true;
  setTimeout(() => {
    getIP().then((res) => {
      curAddress.value = res?.address;
      loading.value = false;
    });
    let data = {
      url: "http://154.37.16.163:9094/",
    };
    pingUrl(data).then((r) => {
      console.log("~~~~~~", r);
    });
    socketIP().then((rrr) => {
      console.log("!!!!!!!!", rrr);
      deviceList.list = rrr.data;
    });
    // portalPing().then((res)=>{
    //   console.log("res++++++", res)
    // })
    let data1 = {
      ip: "explorer.dmctech.io",
    };
    getNetStatus(data1).then((dd) => {
      console.log("ddddddd", dd);
    });
  }, 3000);
};
const userInfo = computed(() => store.getters.userInfo);
const toGuide = (item) => {
  // if (userInfo.email) {
  // 绑定且登录
  // const url = `http://${item.dedicatedip}:8080/#/welcome`;
  // window.location.href = url;
  // } else {
  chooseAssociated.value = true;
  // }
};
const skip = () => {
  chooseAssociated.value = false;
  router.push({
    name: "Welcome",
  });
};
const addIP = () => {
  visible.value = true;
};
const deviceList = reactive({
  list: [
    // {
    //   name: "xx",
    //   url: "dasdas",
    // },
  ],
});
const emit = defineEmits(["next"]);
</script>

<style lang="less" scoped>
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
    width: 200px;
    height: 180px;
    margin: 20px;
    background: rgba(251, 251, 251, 0.58);
    border: 1px solid white;
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(6px);
    border-radius: 17px;
    text-align: center;
    cursor: pointer;
    transition: all 0.5s;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    font-weight: bolder;
    color: black;
    cursor: pointer;
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
  .card::before {
    content: "";
    position: absolute;
    width: 100px;
    background-image: linear-gradient(
      180deg,
      rgb(0, 183, 255),
      rgb(255, 48, 255)
    );
    height: 150%;
    animation: rotBGimg 3s linear infinite;
    transition: all 0.2s linear;
    display: none;
  }

  @keyframes rotBGimg {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .card::after {
    content: "";
    position: absolute;
    background: transparent;
    inset: 5px;
    border-radius: 15px;
  }
  .card:hover {
    background: #fff;
    &::before {
      display: inline-block;
    }
    &::after {
      background-color: #fff;
    }
  }
}
</style>
