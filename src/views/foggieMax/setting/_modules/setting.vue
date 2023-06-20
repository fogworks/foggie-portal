<template>
  <div class="set-box" v-loading="loading">
    <div class="reset">
      <svg-icon @click="resetMethod" icon-class="reset2"></svg-icon>
      <div>
        <p>Click to reset</p>
        <p>After resetting, the device needs to be reinitialized</p>
      </div>
    </div>
    <!-- <div class="content">
      <div class="item-box" v-for="item in kitsList">
        <div class="name">
          {{ item.label }}
        </div>
        <div class="action">
          <el-switch
            v-model="item.status"
            size="large"
            :disabled="item.disabled"
            :loading="item.loading"
            @change="(val) => change(item, val)"
            active-text="Start"
            inactive-text="Stop"
            active-value="start"
            inactive-value="stop"
          />
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  getCurrentInstance,
  watch,
  inject,
  useAttrs,
} from "vue";
import { op_ipfs, op_cyfs, reset_vood } from "@/utils/api";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const $attrs = useAttrs();
const reset = inject("reset");
const requestTarget = inject("requestTarget");
const kitsList = reactive([
  {
    label: "ipfs",
    status: "start",
  },
  {
    label: "cyfs",
    status: "start",
  },
]);
const store = useStore();
const currentOODItem = computed(() => store.getters.currentOODItem);
watch(
  currentOODItem,
  ({ data }) => {
    if (data.cyfs_state !== "finish") {
      kitsList[1].disabled = true;
    } else {
      kitsList[1].disabled = false;
    }
    if (data.ipfs_state !== "finish") {
      kitsList[0].disabled = true;
    } else {
      kitsList[0].disabled = false;
    }
    kitsList[0].status = data.ipfs_service_state || "stop";
    kitsList[1].status = data.cyfs_service_state || "stop";
  },
  { deep: true }
);
const loading = ref(false);
const count = ref(0);
const resetMethod = async () => {
  const rest = () => {
    loading.value = true;
    reset_vood(requestTarget)
      .then(async () => {
        loading.value = false;
        proxy.$notify({
          customClass: "notify-success",
          message: "Reset successful",
          position: "bottom-left",
        });
        // $attrs.reset();
        reset();
        // window.location.href = "http://localhost:8081/#/welcome";
      })
      .catch(() => {
        count.value++;
        if (count.value > 3) {
          loading.value = false;
          count.value = 0;
          return false;
        }
        rest();
      });
  };
  rest();
};
const change = (item, val) => {
  item.loading = true;
  let fetchMethod = item.label === "ipfs" ? op_ipfs : op_cyfs;
  fetchMethod({ op_type: val }, requestTarget)
    .then((res) => {
      proxy.$notify({
        customClass: "notify-success",
        message: "Successfully set",
        position: "bottom-left",
      });
    })
    .catch((err) => {
      item.status = item.status === "start" ? "stop" : "start";
      proxy.$notify({
        customClass: "notify-error",
        message: "Setting failed",
        position: "bottom-left",
      });
    })
    .finally(() => {
      item.loading = false;
    });
};
</script>

<style lang="scss" scoped>
.set-box {
  :deep {
    .el-loading-mask {
      background: var(--bg-color);
      z-index: 1;
    }
  }
}
.welcome {
  font-weight: 700;
  font-size: 30px;
}
.reset {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 45%;
  height: 100px;
  margin: 20px 45px;
  border-radius: 16px;
  background: #f2f6ff;
  box-shadow: var(--box-shadow);
  p {
    text-align: left;
    margin: 5px 0;
    &:first-child {
      font-weight: 700;
    }
    &:nth-child(2) {
      font-size: 14px;
    }
  }
  svg {
    margin-right: 10px;
    margin-left: 30px;
    color: crimson;
    font-size: 40px;
    cursor: pointer;
    &:hover {
      transform: scale(1.2);
    }
  }
}
.content {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;

  .item-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 45%;
    height: 100px;
    margin: 20px 10px;
    margin-bottom: 20px;
    border-radius: 16px;
    background: #f2f6ff;
    box-shadow: var(--box-shadow);
    .name {
      margin: 0 30px;
    }
    .action {
      margin-right: 30px;
      span {
        cursor: pointer;
      }
    }
  }
}
</style>
