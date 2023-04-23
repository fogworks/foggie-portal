<template>
  <div>
    <el-dialog
      class="withdraw-dialog"
      :model-value="visible"
      :title="title"
      width="910px"
      @close="close"
    >
      <div>
        <div class="sub-title">
          Complete the following quest to get more rewards.
        </div>
        <div class="row" v-for="item in rowList.value">
          <div class="row-item1">
            {{ item.title }}
          </div>
          <div class="row-item2">
            {{ item.num ? "+" + item.num + " DMC" : "" }}
          </div>
          <div class="row-item3">
            <div class="color-box">
              <el-button type="primary" @click="gotoReward(item)">
                <RippleInk></RippleInk>
                {{ item.status }}</el-button
              >
            </div>
            <!-- <el-button v-else disabled type="primary">Finished</el-button> -->
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, toRefs, watch } from "vue";
import {
  awardTaskList,
  oodFileStatus,
  rewardReceive,
  finishTask,
} from "@/utils/api.js";
import RippleInk from "@/components/rippleInk";
export default {
  components: { RippleInk },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Rewards",
    },
    currentOODItem: {
      type: Object,
      default: false,
    },
  },
  setup(props, { emit }) {
    const close = () => {
      emit("update:visible", false);
    };
    const { visible, title, currentOODItem } = toRefs(props);
    let rowList = reactive([]);
    const fileCount = ref(0);
    const currentFirstVoodSIZE = ref(0);

    const initTaskList = async () => {
      // let oodId = "Dr663EDOga1WYd60kUtu8rSMf9FdhV6rn3drU2T1t8zN";
      let oodId = currentOODItem.value.device_id;
      let res = await awardTaskList(oodId);
      let TaskGroupList = [];
      if (res && res.TaskGroup !== null) {
        let TaskGroup = res.TaskGroup;
        let NftReward = {};
        for (let item in TaskGroup) {
          if (TaskGroup[item].length === 2) {
            let list = TaskGroup[item][1];
            list.groupId = item;
            TaskGroupList.push(list);
            NftReward = TaskGroup[item][0];
            NftReward.groupId = item;
          } else if (TaskGroup[item].length === 1) {
            let list = TaskGroup[item][0];
            list.groupId = item;
            TaskGroupList.push(list);
          }
        }
        let taskList = JSON.parse(JSON.stringify(TaskGroupList));
        if (NftReward && NftReward.id) {
          taskList.unshift(NftReward);
        }
        let rr = await oodFileStatus(oodId, "sum");
        currentFirstVoodSIZE.value = rr && rr[0].used_size;
        fileCount.value = rr && rr[0].file_count;

        let arr = [];
        for (let i = 0; i < taskList.length; i++) {
          let item = taskList[i];
          let o = {
            title: "",
            num: "",
            status: "",
          };
          if (item.targe_type === 1) {
            o.title = "NFT Reward";
            o.num = "1";
          } else if (item.targe_type === 2) {
            o.title = "Adopt Foggie";
            o.num = "5";
          } else if (item.targe_type === 3) {
            o.title = "First upload reward";
            o.num = "2.5";
          } else if (item.targe_type === 4) {
            o.title = "Upload files to big 4G rewards";
            o.num = "5";
          }

          if (item.targe_type === 1 || item.targe_type === 2) {
            if (item.label === "Adopted") {
              o.status = "Available";
            } else if (item.label === "" && item.complete_state === -1) {
              o.status = "Task not completed";
            } else if (item.label === "" && item.complete_state === 1) {
              o.status = "Received";
            }
          } else if (item.targe_type === 3) {
            if (item.complete_state === -1 && fileCount.value > 0) {
              o.status = "Available";
            } else if (item.complete_state === 1) {
              o.status = "Received";
            } else if (fileCount.value === 0) {
              o.status = "Task not completed";
            }
          } else if (item.targe_type === 4) {
            if (
              item.complete_state === -1 &&
              currentFirstVoodSIZE.value / 1024 / 1024 / 1024 > 4
            ) {
              o.status = "Available";
            } else if (item.complete_state === 1) {
              o.status = "Received";
            } else if (currentFirstVoodSIZE.value / 1024 / 1024 / 1024 < 4) {
              o.status = "Task not completed";
            }
          }
          o.label = item.label;
          o.targe_type = item.targe_type;
          o.complete_state = item.complete_state;
          o.id = item.id;
          o.groupId = item.groupId;
          if (item.targe_type < 5) {
            arr.push(o);
          }
        }
        rowList.value = arr;
      }
    };
    const gotoReward = async (item) => {
      let ood_id = currentOODItem.value.device_id;
      if (!ood_id) {
        return;
      }
      if (
        item.targe_type === 3 &&
        item.complete_state === -1 &&
        fileCount.value > 0
      ) {
        let data = {
          // ood_id: "Dr663EDOga1WYd60kUtu8rSMf9FdhV6rn3drU2T1t8zN",
          ood_id: currentOODItem.value.device_id,
          tid: item.id,
        };
        await finishTask(data);
        let rewardData = {
          // ood_id: "Dr663EDOga1WYd60kUtu8rSMf9FdhV6rn3drU2T1t8zN",
          ood_id,
          gid: item.groupId,
        };
        await rewardReceive(rewardData);
        window.location.reload();
      } else if (
        item.targe_type === 4 &&
        item.complete_state === -1 &&
        currentFirstVoodSIZE.value / 1024 / 1024 / 1024 > 4
      ) {
        let data = {
          // ood_id: "Dr663EDOga1WYd60kUtu8rSMf9FdhV6rn3drU2T1t8zN",
          ood_id,
          tid: item.id,
        };
        await finishTask(data);
        let rewardData = {
          // ood_id: "Dr663EDOga1WYd60kUtu8rSMf9FdhV6rn3drU2T1t8zN",
          ood_id: currentOODItem.value.device_id,
          gid: item.groupId,
        };
        await rewardReceive(rewardData);
        window.location.reload();
      } else if (item.targe_type === 1 && item.label === "Adopted") {
        let data = {
          // ood_id: "Dr663EDOga1WYd60kUtu8rSMf9FdhV6rn3drU2T1t8zN",
          ood_id,
          tid: item.id,
        };
        await finishTask(data);
        window.location.reload();
      } else if (item.targe_type === 2 && item.label === "Adopted") {
        let data = {
          // ood_id: "Dr663EDOga1WYd60kUtu8rSMf9FdhV6rn3drU2T1t8zN",
          ood_id,
          tid: item.id,
        };
        await finishTask(data);
        let rewardData = {
          // ood_id: "Dr663EDOga1WYd60kUtu8rSMf9FdhV6rn3drU2T1t8zN",
          ood_id,
          gid: item.groupId,
        };
        await rewardReceive(rewardData);
        window.location.reload();
      }
    };
    watch(
      currentOODItem,
      (data) => {
        initTaskList();
      },
      {
        immediate: true,
        deep: true,
      }
    );
    // onMounted(initTaskList);
    return { visible, title, rowList, close, initTaskList, gotoReward };
  },
};
</script>

<style lang="less" scoped>
.sub-title {
  margin-top: 40px;
  color: #000;
  font-size: 24px;
  font-weight: 700;
}
.row {
  display: flex;
  align-items: center;
  margin-top: 20px;
  .row-item1 {
    width: 420px;
    font-size: 20px;
    color: #000;
  }
  .row-item2 {
    width: 160px;
    font-size: 20px;
    font-weight: 700;
    color: #000;
  }
  .row-item3 {
    flex: 1;
    display: flex;
    justify-content: center;
    .color-box {
      .color-box();
      .ripple-ink {
        border-radius: 16px;
      }
    }

    :deep(.el-button) {
      position: relative;
      // width: 120px;
      height: 48px;
      border-radius: 50px;
      font-size: 16px;
    }
  }
}
</style>
<style lang="less">
.withdraw-dialog {
  position: relative;
  backdrop-filter: blur(40px);
  background: rgba(255, 255, 255, 0.6);
}
</style>
