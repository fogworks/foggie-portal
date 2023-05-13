<template>
  <el-dialog
    append-to-body
    class="withdraw-dialog"
    :model-value="visible"
    title=""
    width="910px"
    @close="close"
  >
    <div class="card-box" v-show="visible">
      <div class="flex justify-between">
        <div class="flex items-center">
          <div class="title">DMC asset records</div>
        </div>
      </div>
      <el-tabs v-model="activeName" class="assetsRecord-tabs">
        <el-tab-pane
          v-for="item in tabList"
          :label="item.label"
          :name="item.label"
        ></el-tab-pane>
      </el-tabs>
      <div v-if="activeName === 'Reward'">
        <el-table class="table-box" :data="tableData.value" style="width: 100%">
          <el-table-column
            v-if="activeName === 'Reward'"
            prop="reward_type"
            label="Name"
            width="240"
          />
          <el-table-column
            v-if="activeName === 'Withdraw'"
            prop="to"
            label="To"
            width="240"
          />
          <el-table-column prop="time" label="Time" width="226" />
          <el-table-column prop="score" label="Amount" width="240" />
          <el-table-column prop="status" label="Status" width="140" />
          <!-- <el-table-column
            v-if="activeName === 'Reward'"
            prop="note"
            label="Note"
            width="140"
          /> -->
        </el-table>
        <el-pagination
          v-model:current-page="currentPage"
          :background="false"
          :page-size="100"
          layout="prev, pager, next, jumper"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </div>
      <div v-if="activeName === 'Withdraw'">
        <el-table
          class="table-box"
          :data="withdrawData.value"
          style="width: 100%"
        >
          <el-table-column prop="tx_id" label="Transaction ID" width="240">
            <template v-slot:default="scope">
              <el-tooltip :content="scope.row.tx_id" placement="top-start">
                <span class="link_txt" @click="toDmcLink(scope.row.tx_id)">{{
                  scope.row.showTxiID
                }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="Amount" width="200">
          </el-table-column>
          <el-table-column prop="receiver" label="Receiver" width="180">
            <template v-slot:default="scope">
              <el-tooltip :content="scope.row.receiver" placement="top-start">
                <span class="">{{ scope.row.receiver }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="Update Time" width="240" />
        </el-table>
        <el-pagination
          v-model:current-page="currentPage"
          :background="false"
          :page-size="100"
          layout="prev, pager, next, jumper"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { reactive, ref, onMounted, watch, toRefs, inject } from "vue";
import { historyReward, getWithdrawList } from "@/utils/api.js";
import { transferTime } from "@/utils/util.js";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    currentOODItem: {
      type: Object,
      default: false,
    },
  },
  setup(props, { emit }) {
    const deviceData = inject("deviceData");
    const { currentOODItem } = toRefs(props);
    const activeName = ref("Reward");
    const tabList = ref([
      {
        label: "Reward",
      },
      {
        label: "Withdraw",
      },
    ]);
    const tableData = reactive([]);
    const withdrawData = reactive([]);
    const handleCommand = () => {};
    const close = () => {
      emit("update:visible", false);
    };
    const toDmcLink = (id) => {
      let url = `http://explorer.dmctech.io/transaction/${id}`;
      window.open(url);
    };
    const currentPage = ref(1);
    const total = ref(0);
    const handleCurrentChange = () => {
      initRecords();
    };
    const initRecords = async () => {
      if (currentOODItem && currentOODItem.value.device_id) {
        let device_id = currentOODItem.value.device_id;
        let historyRewardData = [];
        let historyWithdrawData = [];
        let data = await historyReward(device_id, currentPage.value, 100);
        let records = data.records || [];
        total.value = data?.page?.total || 0;
        for (let i = 0; i < records.length; i++) {
          let reward_type = records[i].reward_type || 0;
          let task_complete_state = records[i].task_complete_state;
          if (reward_type === 2) {
            reward_type = "Get binding rewards";
          } else if (reward_type === 3) {
            reward_type = "First upload reward";
          } else if (reward_type === 4) {
            reward_type = "Upload files to big 4G rewards";
          } else if (reward_type === 0) {
            reward_type = `Space Reward(${records[i].space}G)`;
          } else if (reward_type === 1) {
            reward_type = "NFT Reward";
          } else if (reward_type === 5) {
            reward_type = "80G Task Reward";
          } else if (reward_type === 6) {
            reward_type = `Traffic reward(${records[i].space}G)`;
          } else if (reward_type === 8) {
            reward_type = "Renewal Award";
          }
          task_complete_state =
            task_complete_state < 0 ? "To be completed" : "Complete";
          let item = {
            time: transferTime(records[i].create_at),
            id: records[i].id,
            ood_id: records[i].oodid,
            owner_id: records[i].owner_id,
            score:
              Number(records[i].amount).toFixed(4) + " " + records[i].symbol,
            reward_type: reward_type,
            status: task_complete_state,
            txid: records[i].txid,
            promo_code: records[i].promo_code,
            reward_state: records[i].reward_state,
          };
          historyRewardData.push(item);
          tableData.value = historyRewardData;
        }
        let owner_id = sessionStorage.getItem("walletUser")
          ? sessionStorage.getItem("walletUser")
          : "foggiezzzzz2";
        getWithdrawList(owner_id, 1, 10).then((res) => {
          let records = res.records || [];
          // this.totalLen = res.page && res.page.total;
          for (let i = 0; i < records.length; i++) {
            let showTxiID =
              records[i].tx_id.substring(0, 10) +
              "..." +
              records[i].tx_id.substring(
                records[i].tx_id.length - 4,
                records[i].tx_id.length
              );
            let item = {
              time: transferTime(records[i].create_at),
              id: records[i].id,
              cause: records[i].cause,
              amount: records[i].amount,
              receiver: records[i].receiver,
              sender: records[i].sender,
              tx_id: records[i].tx_id,
              showTxiID: showTxiID,
            };
            historyWithdrawData.push(item);
            withdrawData.value = historyWithdrawData;
          }
        });
      }
    };
    watch(activeName, () => {
      // currentPage.value = 1;
      // total.value = 0;
    });
    watch(
      currentOODItem,
      (data) => {
        initRecords();
      },
      {
        immediate: true,
        deep: true,
      }
    );
    onMounted(initRecords);
    return {
      activeName,
      tabList,
      tableData,
      withdrawData,
      currentPage,
      total,
      handleCurrentChange,
      handleCommand,
      close,
      initRecords,
      toDmcLink,
    };
  },
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
.card-box {
  width: 100%;
  @include card-box;

  margin: 24px 0 100px 0;
  padding: 0 40px;
  color: #000;

  .assetsRecord-tabs {
    margin-top: 40px;
    :deep(.el-tabs__item) {
      font-size: 20px;
    }
  }
  .title {
    color: #000;
    font-size: 30px;
    font-weight: 700;
  }

  .title-img {
    width: 32px;
    margin-right: 12px;
    object-fit: contain;
  }
  .status-box {
    margin: 36px 0 64px 0;
  }
  .status {
    font-size: 24px;
    margin-right: 40px;
  }
  :deep {
    .el-pagination {
      float: right;
      button {
        background-color: transparent;
      }
      .el-pager {
        li {
          background-color: transparent;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.withdraw-dialog {
  position: relative;
  backdrop-filter: blur(40px);
  background: rgba(255, 255, 255, 0.6);
  .table-box {
    min-height: 430px;
    margin-bottom: 40px;
    background: transparent;
    --el-table-tr-bg-color: transparent;
    tr {
      background: transparent;
    }

    .el-table__cell {
      background: transparent !important;
      border-bottom: 1px solid #e4e4e4 !important;
    }
    .el-table__inner-wrapper::before {
      z-index: 1;
      background-color: #e4e4e4;
    }
  }
  .link_txt {
    text-decoration: underline;
    cursor: pointer;
    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>
