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
          <div class="title">DMC asset Rewards</div>
        </div>
      </div>
      <div>
        <el-table class="table-box" :data="tableData" style="width: 100%">
          <el-table-column prop="createdAt" label="Time" width="250">
            <template #default="{ row }">
              {{ transferUTCTime(row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="ratio" label="Ratio" width="150" />
          <el-table-column prop="award_type" label="Type" width="170" />
          <el-table-column prop="quantity" label="Quantity" width="200">
            <template #default="{ row }">
              {{ row.quantity + row.quantityType }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="currentPage"
          :background="false"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, onMounted, watch, toRefs, inject } from "vue";
import { historyReward, getWithdrawList } from "@/utils/api.js";
import { transferTime, transferUTCTime } from "@/utils/util.js";
import { get_miner_reward } from "@/utils/api.js";
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:visible"]);
const { visible } = toRefs(props);
const deviceData = inject("deviceData");
const tableData = ref([]);
const close = () => {
  emit("update:visible", false);
};
const currentPage = ref(1);
const total = ref(0);
const initRecords = () => {
  get_miner_reward(
    {
      peer_id: deviceData.peer_id,
    },
    10,
    currentPage.value
  ).then(({ result }) => {
    total.value = result.total;
    tableData.value = result.data;
    console.log(result, "resssssss");
  });
};
const handleCurrentChange = () => {
  initRecords();
};

onMounted(initRecords);
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
