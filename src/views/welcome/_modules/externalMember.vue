<template>
  <div>
    <p class="welcome">Installing Storage Kits</p>
    <div class="content">
      <div class="members">
        <!-- <div class="title">Storage Suite</div> -->
        <el-progress
          class="install-progress"
          :width="300"
          :stroke-width="20"
          stroke-linecap="butt"
          type="circle"
          :percentage="rate"
        >
          <template #default="{ percentage }">
            <span class="percentage-value">{{ percentage }}%</span>
            <span class="percentage-label">{{ status }}</span>
          </template>
        </el-progress>
      </div>
      <div v-if="count > 3" class="tips">
        Installation failed. You can try again or contact customer service for
        assistance
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
        <NextButton v-if="rate === 100" @click="next">Go</NextButton>
        <NextButton v-else-if="count > 3" @click="startInstall"
          >Retry</NextButton
        >
        <NextButton
          v-else-if="status === 'To be installed'"
          @click="startInstall"
          >Start Installation</NextButton
        >
      </div>
      <!-- <el-button @click="next">Next</el-button> -->
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, defineProps, toRefs, watch } from "vue";
import {
  deploy_cbs,
  deploy_ipfs,
  deploy_cyfs,
  get_service_info,
} from "@/utils/api";
import NextButton from "@/components/nextButton";
import { createDID, activeVOOD } from "@/utils/did.js";
// import CircleProgress from "@/components/circleProgress";
const emit = defineEmits(["next", "update:preShow"]);
const props = defineProps({
  form: Object,
});
const rate = ref(0);
const loading = ref(false);
const finish = ref(false);
const timeCallback = (max) => {
  return () => {
    console.log(rate.value >= Number(max), "max");
    if (rate.value >= Number(max)) {
      rate.value = max;
    } else {
      rate.value++;
    }
  };
};
const status = ref("To be installed");
const statusMap = {
  noFinish: "To be installed",
  pending: "Installing",
  finish: "Finish",
  fail: "Installation failed",
};
const installCBS = async (isFinish) => {
  try {
    await deploy_cbs();
    const cbsTimer = setInterval(timeCallback(33), 1000);
    let cbsFinish = await getInstallStatus("cbs");
    if (cbsFinish) {
      clearInterval(cbsTimer);
      rate.value = 33;
      return true;
    } else {
      installCBS();
    }
  } catch {
    installCBS();
  }
  // try {
  //   let res = JSON.parse({});
  // } catch {
  //   console.log(111);
  // }
};
const installIPFS = async (isFinish) => {
  try {
    await deploy_ipfs();
    const ipfsTimer = setInterval(timeCallback(66), 1000);
    let ipfsFinish = await getInstallStatus("ipfs");
    if (ipfsFinish) {
      clearInterval(ipfsTimer);
      rate.value = 66;
      return true;
    } else {
      installIPFS();
    }
  } catch {
    installIPFS();
  }
};
const installCYFS = async (isFinish) => {
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
      deploy_cyfs(bind_info)
        .then(async (res) => {
          const cyfsTimer = setInterval(timeCallback(99), 1000);
          console.log("deploy cyfs", res);
          let cyfsFinish = await getInstallStatus("cyfs");
          if (cyfsFinish) {
            clearInterval(cyfsTimer);
            rate.value = 100;
            // emit("update:preShow", true);
          } else {
            installCYFS();
          }
        })
        .catch(() => {
          installCYFS();
        })
        .finally(() => {});
    }
  } catch {
    installCYFS();
  }
};
const gotoDeploy = async (item, type) => {
  count.value = 0;
  status.value = "Initializing";
  emit("update:preShow", false);
  let cbs = await installCBS();
  if (cbs) {
    let ipfs = await installIPFS();
    if (ipfs) {
      await installCYFS();
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
const count = ref(0);
const getInstallStatus = (type) => {
  // 获取安装状态
  return new Promise((resolve, reject) => {
    const getStatus = () => {
      get_service_info()
        .then(({ result }) => {
          if (type === "cbs") {
            if (result.cbs_state === "finish") {
              resolve(true);
            } else {
              if (count.value > 3) return false;
              if (result.cbs_state === "failed") {
                count.value++;
              }
              setTimeout(() => {
                getStatus(type);
              }, 5000);
            }
          } else if (type === "ipfs") {
            if (result.ipfs_state === "finish") {
              resolve(true);
            } else {
              if (count.value > 3) return false;
              if (result.ipfs_state === "failed") {
                count.value++;
              }
              setTimeout(() => {
                getStatus(type);
              }, 5000);
            }
          } else {
            if (result.cyfs_state === "finish") {
              status.value = "Finish";
              resolve(true);
            } else {
              if (count.value > 3) return false;
              if (result.cyfs_state === "failed") {
                count.value++;
              }
              setTimeout(() => {
                getStatus(type);
              }, 5000);
            }
          }
        })
        .catch((err) => {
          reject(false);
        });
    };
    getStatus();
  });
};
watch(count, (val) => {
  if (val > 3) {
    status.value = "Installation failed";
  }
});
const startInstall = async () => {
  gotoDeploy();
  // const timer = setInterval(timeCallback, 1000);
  // const res = await getInstallStatus();
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
  margin-top: 50px;
  text-align: center;
  .members {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0 70px;
    border-radius: 10px;
    // background: linear-gradient(245deg, #5991f2, #48fff6);
    // box-shadow: var(--box-shadow);

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
  }
  .tips {
    color: #ff7979;
  }
  .install-progress {
    padding: 0 20px;
    margin: 40px auto;
    :deep {
      .el-progress-circle path:first-child {
        stroke: #ddd;
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
