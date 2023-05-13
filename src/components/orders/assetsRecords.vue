<template>
  <el-dialog
    class="withdraw-dialog"
    :model-value="visible"
    title=""
    width="910px"
    @close="close"
  >
    <div class="card-box">
      <div class="flex justify-between">
        <div class="flex items-center">
          <div class="title">Order asset records</div>
        </div>
      </div>
      <!-- <el-tabs v-model="activeName" class="assetsRecord-tabs">
        <el-tab-pane
          v-for="item in tabList"
          :label="item.label"
          :name="item.label"
        ></el-tab-pane>
      </el-tabs> -->
      <div>
        <el-table class="table-box" :data="tableData" style="width: 100%">
          <el-table-column label="Time" width="420">
            <template #default="scope">
              {{ transferTime(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="change_amount" label="Quantity" width="340">
            <template #default="scope">
              {{ scope.row.change_amount }}DMC
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

<script>
import { reactive, ref, onMounted, computed, watch, toRefs, inject } from "vue";
import { historyReward, getWithdrawList } from "@/utils/api.js";
import { orderAssetsList } from "@/api/order/orderList.js";
import { transferTime } from "@/utils/util.js";
import { useStore } from "vuex";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    orderId: {
      type: [String, Number],
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const activeName = ref("Reward");
    const tabList = ref([
      {
        label: "Reward",
      },
      {
        label: "Withdraw",
      },
    ]);
    const { visible, orderId } = toRefs(props);
    const tableData = ref([]);
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
    const dmc = computed(() => store.getters["global/userInfo"].dmc);
    const getUserAssetsList = () => {
      orderAssetsList({
        orderId: orderId.value,
        limit: 10,
        pageNum: currentPage.value,
      }).then((res) => {
        if (res.code == 200) {
          total.value = res.data.count;
          tableData.value = res.data.list;
        }
      });
    };
    const initRecords = async () => {
      getUserAssetsList();
    };
    watch(activeName, () => {
      // currentPage.value = 1;
      // total.value = 0;
    });
    // watch(
    //   orderId,
    //   (data) => {
    //     initRecords();
    //   },
    //   {
    //     immediate: true,
    //     deep: true,
    //   }
    // );
    onMounted(initRecords);
    return {
      activeName,
      tabList,
      visible,
      tableData,
      withdrawData,
      currentPage,
      dmc,
      total,
      handleCurrentChange,
      handleCommand,
      close,
      initRecords,
      toDmcLink,
      transferTime,
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
  box-shadow: none;
  border: none;

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
