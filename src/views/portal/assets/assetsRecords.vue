<template>
  <el-dialog
    append-to-body
    class="withdraw-dialog"
    :model-value="visible"
    title=""
    width="910px"
    @close="close"
  >
    <div class="card-box">
      <div class="flex justify-between">
        <div class="flex items-center">
          <div class="title">DMC asset records</div>
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
          <el-table-column prop="action" label="Type" width="240" />
          <el-table-column label="Time" width="320">
            <template #default="scope">
              {{ transferUTCTime(scope.row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="Amount" width="200">
            <template #default="scope">
              {{ scope.row.quantity }}{{ scope.row.token }}
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
import { userAssetsList } from "@/api/order/orderList.js";
import { transferUTCTime } from "@/utils/util.js";
import { useStore } from "vuex";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
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
    const email = computed(() => store.getters["token/currentUser"]);
    const dmc = computed(() => store.getters["global/userInfo"].dmc);
    const getUserAssetsList = () => {
      userAssetsList({
        email: email.value,
        limit: 10,
        pageNum: currentPage.value,
      }).then((res) => {
        if (res.code == 200) {
          total.value = res.data.count;
          tableData.value = res.data.list.map((t) => {
            var a = t.contract_action.split("/")[1];
            if ("mint" === a) {
              var n = t.action.rawData.act.data.asset.quantity.split(" ")[0];
              return {
                token: "PST",
                action: "Mint",
                created_at: "".concat(t.action.rawData.block_time, "Z"),
                quantity: "+".concat(n),
              };
            }
            if ("incentiverec" === a) {
              var c = t.action.rawData.act.data.inc.quantity.split(" ")[0];
              return {
                token: "DMC",
                action: ""
                  .concat("Over Dividend", "(")
                  .concat("Bill ID", ":")
                  .concat(t.action.rawData.act.data.bill_id, ")"),
                created_at: "".concat(t.action.rawData.block_time, "Z"),
                quantity: "+".concat(c),
              };
            }
            if ("incentiverec1" === a)
              return {
                token: t.action.rawData.act.data.inc.quantity.split(" ")[1],
                quantity: "+".concat(
                  t.action.rawData.act.data.inc.quantity.split(" ")[0]
                ),
                action: ""
                  .concat("Delivery Dividend", "(")
                  .concat("Order ID", ":")
                  .concat(t.action.rawData.act.data.order_id, ")"),
                created_at: "".concat(t.action.rawData.block_time, "Z"),
              };
            if ("increase" === a) {
              var o = t.action.rawData.act.data.asset.quantity.split(" ")[0];
              return {
                token: "DMC",
                action:
                  t.action.rawData.act.data.miner ===
                  t.action.rawData.act.data.owner
                    ? "Stake"
                    : "Invest",
                created_at: "".concat(t.action.rawData.block_time, "Z"),
                quantity: "-".concat(o),
              };
            }
            if ("transfer" === a || "extransfer" === a) {
              var r,
                i,
                l,
                s,
                u = t.action.rawData.act.data.from === dmc.value ? "-" : "+",
                d = t.action.rawData.act.data;
              return {
                token:
                  (null === (r = t.action.rawData.act.data.quantity) ||
                  void 0 === r ||
                  null === (i = r.quantity) ||
                  void 0 === i
                    ? void 0
                    : i.split(" ")[1]) ||
                  t.action.rawData.act.data.quantity.split(" ")[1],
                quantity: ""
                  .concat(u)
                  .concat(
                    (null === (l = t.action.rawData.act.data.quantity) ||
                    void 0 === l ||
                    null === (s = l.quantity) ||
                    void 0 === s
                      ? void 0
                      : s.split(" ")[0]) ||
                      t.action.rawData.act.data.quantity.split(" ")[0]
                  ),
                action:
                  d.from === dmc.value
                    ? "dmc.ramfee" === d.to
                      ? "ram fee" === d.memo
                        ? "Buy ram" + " " + "Ram fee"
                        : "Sell ram" + " " + "Ram fee"
                      : "Transfer payment"
                    : d.to === dmc.value && "dmc.ram" === d.from
                    ? "Sell ram"
                    : "Transfer Receive",
                created_at: "".concat(t.action.rawData.block_time, "Z"),
              };
            }
            if ("exlocktrans" === a) {
              var m = t.action.rawData.act.data.from === dmc.value ? "-" : "+";
              return {
                token:
                  t.action.rawData.act.data.quantity.quantity.split(" ")[1],
                quantity: ""
                  .concat(m)
                  .concat(
                    t.action.rawData.act.data.quantity.quantity.split(" ")[0]
                  ),
                action: "Transfer Locking",
                created_at: "".concat(t.action.rawData.block_time, "Z"),
              };
            }
            if ("exretire" === a)
              return {
                token: t.action.rawData.act.data.value.quantity.split(" ")[1],
                quantity: "-".concat(
                  t.action.rawData.act.data.value.quantity.split(" ")[0]
                ),
                action: "Burn",
                created_at: "".concat(t.action.rawData.block_time, "Z"),
              };
            if ("exunlock" === a)
              return {
                token:
                  t.action.rawData.act.data.quantity.quantity.split(" ")[1],
                quantity: "+".concat(
                  t.action.rawData.act.data.quantity.quantity.split(" ")[0]
                ),
                action: "Unlock",
                created_at: "".concat(t.action.rawData.block_time, "Z"),
              };
            if ("orderclarec" === a)
              return {
                token:
                  t.action.rawData.act.data.quantity.quantity.split(" ")[1],
                quantity: "+".concat(
                  t.action.rawData.act.data.quantity.quantity.split(" ")[0]
                ),
                action: ""
                  .concat("Delivery Dividend", "(")
                  .concat("Order ID", ":")
                  .concat(t.action.rawData.act.data.order_id, ")"),
                created_at: "".concat(t.action.rawData.block_time, "Z"),
              };
            if ("addordasset" === a)
              return {
                token:
                  t.action.rawData.act.data.quantity.quantity.split(" ")[1],
                quantity: "-".concat(
                  t.action.rawData.act.data.quantity.quantity.split(" ")[0]
                ),
                action: "Prestore",
                created_at: "".concat(t.action.rawData.block_time, "Z"),
              };
            if ("subordasset" === a)
              return {
                token:
                  t.action.rawData.act.data.quantity.quantity.split(" ")[1],
                quantity: "+".concat(
                  t.action.rawData.act.data.quantity.quantity.split(" ")[0]
                ),
                action: "Pick",
                created_at: "".concat(t.action.rawData.block_time, "Z"),
              };
            if ("redeemrec" === a)
              return {
                token: t.action.rawData.act.data.asset.quantity.split(" ")[1],
                quantity: "+".concat(
                  t.action.rawData.act.data.asset.quantity.split(" ")[0]
                ),
                action: "Claim",
                created_at: "".concat(t.action.rawData.block_time, "Z"),
              };
            if ("exchange" === a)
              return {
                token:
                  t.action.rawData.act.data.quantity.quantity.split(" ")[1],
                quantity: "-".concat(
                  t.action.rawData.act.data.quantity.quantity.split(" ")[0]
                ),
                action: "Swap",
                created_at: "".concat(t.action.rawData.block_time, "Z"),
              };
            if ("traderecord" === a)
              return {
                token: t.action.rawData.act.data.to.quantity.split(" ")[1],
                quantity: "+".concat(
                  t.action.rawData.act.data.to.quantity.split(" ")[0]
                ),
                action: "Swap",
                created_at: "".concat(t.action.rawData.block_time, "Z"),
              };
            if ("addreserves" === a) {
              var b = t.action.rawData.act.data;
              return {
                token: "DMC RSI",
                quantity: "+"
                  .concat(b.tokenx.quantity, " +")
                  .concat(b.tokeny.quantity),
                action: "Add Liquidity",
                created_at: "".concat(t.action.rawData.block_time, "Z"),
              };
            }
            if ("outreceipt" === a) {
              var E = t.action.rawData.act.data;
              return {
                token: "DMC RSI",
                quantity: "-".concat(E.x.quantity, " -").concat(E.y.quantity),
                action: "Remove Liquidity",
                created_at: "".concat(t.action.rawData.block_time, "Z"),
              };
            }
            if ("undelegatebw" === a) {
              var p = t.action.rawData.act.data;
              return {
                token:
                  p.unstake_cpu_quantity.split(" ")[1] ||
                  p.unstake_net_quantity.split(" ")[1],
                quantity:
                  p.receiver === dmc.value
                    ? "+".concat(
                        new (p.unstake_cpu_quantity.split(" ")[0])() +
                          p.unstake_net_quantity.split(" ")[0].toFixed(4)
                      )
                    : "+0.0000",
                action: "Claim Resources",
                created_at: "".concat(t.action.rawData.block_time, "Z"),
              };
            }
            if ("liqrec" === a) {
              var v = t.action.rawData.act.data;
              return {
                token:
                  "datamall" === dmc.value
                    ? v.dmc_asset.quantity.split(" ")[1]
                    : ""
                        .concat(v.dmc_asset.quantity.split(" ")[1], " ")
                        .concat(v.pst_asset.quantity.split(" ")[1]),
                quantity:
                  "datamall" === dmc.value
                    ? "+".concat(v.dmc_asset.quantity.split(" ")[0])
                    : "-"
                        .concat(v.dmc_asset.quantity.split(" ")[0], " -")
                        .concat(v.pst_asset.quantity.split(" ")[0]),
                action: "Liquidation",
                created_at: "".concat(t.action.rawData.block_time, "Z"),
              };
            }
            if ("orderrec1" === a) {
              var f = t.action.rawData.act.data;
              return {
                token: f.order_info.miner_lock_pst.quantity.split(" ")[1],
                quantity: "-".concat(
                  f.order_info.miner_lock_pst.quantity.split(" ")[0]
                ),
                action: "".concat(j("order_retire")),
                created_at: "".concat(t.action.rawData.block_time, "Z"),
              };
            }
            if ("assetcharec" === a) {
              var _ = t.action.rawData.act.data;
              return {
                token: _.changed.quantity.split(" ")[1],
                quantity: "+".concat(_.changed.quantity.split(" ")[0]),
                action: "Compensation",
                created_at: "".concat(t.action.rawData.block_time, "Z"),
              };
            }
            if ("assetrec" === a) {
              var O = t.action.rawData.act.data,
                g = O.changed[0].quantity.split(" ")[0];
              return {
                token: O.changed[0].quantity.split(" ")[1],
                quantity: ""
                  .concat(
                    "1" === O.rec_type
                      ? "-"
                      : "2" === O.rec_type ||
                        "3" === O.rec_type ||
                        "6" === O.rec_type ||
                        "4" === O.rec_type ||
                        "5" === O.rec_type ||
                        "7" === O.rec_type
                      ? "+"
                      : ""
                  )
                  .concat(g),
                action:
                  "1" === O.rec_type
                    ? "First Save"
                    : "2" === O.rec_type
                    ? "Remaining Ret"
                    : "3" === O.rec_type
                    ? "User Deposit"
                    : "6" === O.rec_type
                    ? "Over time fine"
                    : "4" === O.rec_type
                    ? "Delivery Income"
                    : "5" === O.rec_type
                    ? "Delivery Dividend"
                    : "7" === O.rec_type
                    ? "Cancel Return"
                    : O.rec_type,
                created_at: "".concat(t.action.rawData.block_time, "Z"),
              };
            }
            return {
              action: a,
              created_at: "".concat(t.action.rawData.block_time, "Z"),
              token: "--",
              quantity: "--",
            };
          });
        }

        console.log(res);
      });
    };
    const initRecords = async () => {
      getUserAssetsList();
    };
    watch(activeName, () => {
      // currentPage.value = 1;
      // total.value = 0;
    });
    watch(
      email,
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
      email,
      activeName,
      tabList,
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
      transferUTCTime,
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
    .el-table__body {
      font-size: 18px;
    }
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
