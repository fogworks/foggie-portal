<template>
  <div>
    <p class="welcome">Recommended Kits</p>
    <div class="content">
      <div class="members">
        <div v-for="item in kitsList">
          <div class="title">
            {{ item.label }}
          </div>
          <div class="status">
            {{ item.status }}
          </div>
          <el-progress
            class="install-progress"
            :stroke-width="20"
            :text-inside="true"
            :percentage="item.rate"
          />
          <el-button :loading="loading" @click="retry(item.label)"
            >Retry</el-button
          >
        </div>
      </div>
      <!-- <CircleProgress :rate="rate"></CircleProgress> -->
      <!-- <el-progress
        class="install-progress"
        color="#29abff"
        :width="200"
        :stroke-width="15"
        type="circle"
        :percentage="rate"
      >
        <template #default="{ percentage }">
          <span class="percentage-value">{{ percentage }}%</span>
          <span class="percentage-label">CBS</span>
        </template>
      </el-progress>
      <el-progress
        class="install-progress total-progress"
        :stroke-width="26"
        :percentage="totalRate"
      /> -->
      <div class="foot-btn">
        <NextButton v-if="finish" @click="next">Go</NextButton>
        <NextButton v-else @click="startInstall">Start Installation</NextButton>
      </div>

      <!-- <el-button @click="next">Next</el-button> -->
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, defineProps, toRefs } from "vue";
import {
  deployVoodGateway,
  deployCYFS,
  get_kit_installation_status,
} from "@/utils/api";
import NextButton from "@/components/nextButton";
import { createDID, activeVOOD } from "@/utils/did.js";
// import CircleProgress from "@/components/circleProgress";
const emit = defineEmits(["next"]);
const props = defineProps({
  form: Object,
});
const form = reactive(props.form);
const rate = ref(0);
const loading = ref(false);
const totalRate = ref(0);
const finish = ref(false);
const timer = setInterval(() => {
  if (rate.value >= 100) {
    rate.value = 100;
    clearInterval(timer);
  } else {
    rate.value++;
  }
}, 1000);
const totalTimer = setInterval(() => {
  if (totalRate.value >= 100) {
    totalRate.value = 100;
    clearInterval(totalTimer);
  } else {
    totalRate.value++;
  }
}, 1000);
const statusMap = {
  noFinish: "Not installed",
  pending: "Installing",
  noFinish: "Already installed",
  fail: "Installation failed",
};
const kitsList = reactive([
  {
    label: "CBS",
    status: "Not installed",
    rate: 50,
  },
  {
    label: "IPFS",
    status: "Not installed",
    rate: 0,
  },
  {
    label: "CYFS",
    status: "Not installed",
    rate: 0,
  },
]);
const gotoDeploy = async (item, type) => {
  item = {
    vps_id: "",
  };
  if (type === "ipfs") {
    let data = {
      vps_ids: [],
      deploy_ipfs: true,
    };
    deployVoodGateway(data)
      .then((res) => {
        console.log("deploy ipfs", res);
        // this.isDeployClick = false;
        // this.refreshIndexList();
      })
      .finally(() => {
        // this.isDeployClick = false;
      });
  } else if (type === "cyfs") {
    try {
      const bindInfoObj = await createDID("");
      if (bindInfoObj && bindInfoObj.g_uniqueId) {
        const index = calcIndex(bindInfoObj.g_uniqueId);
        const bind_info = {
          owner: bindInfoObj.owner,
          desc: bindInfoObj.desc,
          sec: bindInfoObj.sec,
          index,
        };
        let data = {
          vps_id: "",
          bind_info,
        };
        deployCYFS(data)
          .then((res) => {
            console.log("deploy cyfs", res);
            // this.refreshIndexList();
          })
          .finally(() => {
            // this.isDeployClick = false;
          });
      } else {
        // this.isDeployClick = false;
      }
    } catch {
      // this.isDeployClick = false;
    }
  }
};
const calcIndex = (uniqueStr) => {
  // 示例用了cyfs sdk依赖的node-forge库进行计算
  const md5 = cyfs.forge.md.md5.create();
  md5.update(uniqueStr, "utf8");
  let result = cyfs.forge.util.binary.hex.encode(md5.digest());
  let index = hashCode(result);
  return index;
};
function hashCode(strValue) {
  let hash = 0;
  for (let i = 0; i < strValue.length; i++) {
    let chr = strValue.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  hash = Math.floor(Math.abs(hash) / 63336);
  return hash;
}
const getInstallStatus = (type) => {
  // 获取安装状态
  return new Promise((resolve, reject) => {
    const getStatus = (type) => {
      get_kit_installation_status({ type })
        .then((res) => {
          if (res.status === "finish") {
            resolve(true);
          } else {
            setTimeout(() => {
              getStatus(type);
            }, 5000);
          }
        })
        .catch((err) => {
          reject(false);
        });
    };
    getStatus();
  });
};
const startInstall = async () => {
  const res = await getInstallStatus();
};
const retry = () => {
  console.log(11);
};
const next = async () => {
  // let res = await getInstallStatus();
  // gotoDeploy("", "ipfs");
  // gotoDeploy("", "cyfs");
  // emit("next");
};
</script>

<style lang="less" scoped>
.welcome {
  font-weight: 700;
  font-size: 30px;
  text-align: center;
}
.content {
  margin-top: 100px;
  text-align: center;
  .members {
    display: flex;
    justify-content: space-between;
    margin: 0 70px;
    > div {
      width: 300px;
      height: 300px;
      border-radius: 10px;
      background: linear-gradient(245deg, #5991f2, #48fff6);
      box-shadow: var(--box-shadow);
      &:nth-child(2) {
        background-color: #8ec5fc;
        background-image: linear-gradient(62deg, #8ec5fc 0%, #e0c3fc 100%);
      }
      &:nth-child(3) {
        background-color: #8bc6ec;
        background-image: linear-gradient(135deg, #8bc6ec 0%, #9599e2 100%);
      }
      .title {
        height: 84px;
        line-height: 84px;
        font-weight: 700;
        font-size: 25px;
      }
      .status {
        height: 84px;
        line-height: 84px;
      }
      :deep {
        .el-button {
          width: 100%;
          border-radius: 0 0 10px 10px;
        }
      }
    }
  }
  .install-progress {
    padding: 0 20px;
    margin: 40px 0;
    :deep {
      .el-progress-circle path:first-child {
        stroke: #c0c0c0;
      }
      .el-progress-bar__innerText {
        color: #000;
      }
    }
    .percentage-value {
      display: block;
      margin-top: 10px;
      font-size: 28px;
      font-weight: 700;
      color: #000;
    }
    .percentage-label {
      display: block;
      margin-top: 10px;
      font-size: 20px;
      color: #000;
    }
  }
  .total-progress {
    width: 400px;
    margin: 30px auto;
  }
  .foot-btn {
    display: flex;
    justify-content: center;
    margin-top: 50px;
  }
}
</style>
