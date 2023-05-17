<template>
  <!-- <div v-infinite-scroll="orderListInfinite" :infinite-scroll-immediate="false" :infinite-scroll-distance="150"
    :infinite-scroll-disabled="activeName != 'List'"> -->
  <div
    class="OrdersList clearfix"
    v-for="(item, index) in orderList"
    :key="index"
  >
    <div class="ListTitle">
      <div>
        <span
          >Order ID: {{ item.id
          }}{{ item.foggie_id ? `(${item.foggie_id})` : "" }}
        </span>
        <span
          style="
            font-size: 15px;
            color: rgba(255, 255, 255, 0.7);
            margin-left: 30px;
          "
          >{{ item.created_time }}</span
        >
      </div>
      <div class="top-right">
        <el-link class="link" @click="refresh" :underline="false">
          <svg-icon icon-class="refresh"></svg-icon>
          Refresh
        </el-link>
        <el-link class="link" @click="recordsShow = true" :underline="false">
          <svg-icon icon-class="list"></svg-icon>
          Assets Records
        </el-link>
        <div style="font-size: 15px; color: rgba(255, 255, 255, 0.7)">
          <el-tag type="info" effect="dark" round v-if="item.state == '0'">
            Subscription not agreed, waiting...</el-tag
          >
          <el-tag effect="dark" round v-if="item.state == '1'"
            >order status delivery</el-tag
          >
          <el-tag type="warning" effect="dark" round v-if="item.state == '2'">
            Insufficient deposit, the order is about to end
          </el-tag>
          <el-tag effect="dark" round v-if="item.state == '3'">
            With sufficient deposit, the order is still in delivery in the next
            cycle
          </el-tag>
          <el-tag type="success" effect="dark" round v-if="item.state == '4'">
            Order has ended</el-tag
          >
          <el-tag type="danger" effect="dark" round v-if="item.state == '5'">
            Order has been canceled</el-tag
          >
          <el-tag type="warning" effect="dark" round v-if="item.state == '6'">
            The order will be canceled in the next cycle
          </el-tag>
        </div>
      </div>
    </div>
    <div
      class="ListBox"
      :style="
        item.state !== '2' || item.state !== '6'
          ? 'background-color: transparent'
          : ''
      "
    >
      <div class="BoxContent">
        <el-row class="BoxContent_header">
          <el-col :span="14" class="tow_col">
            <div>
              <div>Price</div>
              <div>
                <span>{{ item.price.split(".")[0] }}</span
                >.<span style="font-size: 16px">{{
                  item.price.split(".")[1]
                }}</span>
              </div>
            </div>
            <!-- <div style="text-align: center">
              <div style="color: #86ffff; font-style: italic">Price</div>
              <div style="color: #86ffff; font-style: italic">（total）</div>
              <div>
                <span>{{ item.miner_lock_dmc_amount.split(".")[0] }}</span
                ><span style="font-size: 16px">
                  .{{ item.miner_lock_dmc_amount.split(".")[1] }}</span
                >
              </div>
            </div> -->
            <div>
              <div>Deposit</div>
              <div>
                <span>{{ item.deposit_amount.split(".")[0] }}</span
                >.<span style="font-size: 16px">
                  {{ item.deposit_amount.split(".")[1] }}</span
                >
              </div>
            </div>
            <div>
              <div>Balance(DMC)</div>
              <div>
                <span>{{ item.user_pledge_amount.split(".")[0] }}</span
                >.<span style="font-size: 16px">{{
                  item.user_pledge_amount.split(".")[1]
                }}</span>
              </div>
            </div>
            <div>
              <div>stimated Income(DMC)</div>
              <div>
                <span>{{ item.estimated.split(".")[0] }}</span
                >.<span style="font-size: 16px">{{
                  item.estimated.split(".")[1]
                }}</span>
              </div>
            </div>
            <!-- <div>
              <div>Punish</div>
              <div style="color: #db001b; font-weight: bold">1</div>
            </div> -->
          </el-col>
          <el-col :span="10" style="text-align: center; padding: 0px 20px">
            <div
              style="
                display: flex;
                margin-top: 20px;
                font-weight: bold;
                font-size: 20px;
                color: #fbfbfb;
              "
            >
              <div style="width: 160px; text-align: start">Services</div>
              <el-progress
                style="flex: 1"
                :text-inside="true"
                color="#7066FF"
                :stroke-width="8"
                :percentage="item.serverTime.percentage"
              >
                <span
                  >{{ item.serverTime.time.D }}days
                  {{ item.serverTime.time.H }}hours
                  {{ item.serverTime.time.M }}minutes</span
                >
              </el-progress>
            </div>
            <div
              style="
                display: flex;
                margin-top: 20px;
                font-weight: bold;
                font-size: 20px;
                color: #fbfbfb;
                align-items: center;
              "
            >
              <div style="width: 160px; text-align: start">Last Challenge</div>
              <span style="font-size: 14px">{{
                item.challenge_period
                  ? getSecondTime(+item.challenge_period / 1000)
                  : "Not yet challenged"
              }}</span>
              <svg-icon
                v-if="item.challenge_timeout"
                class="over"
                @click="overShow = true"
                icon-class="overTime"
              ></svg-icon>
            </div>
          </el-col>
        </el-row>
        <el-divider
          style="margin: 12px 0; border-top: 1px #4a4c51 var(--el-border-style)"
        />
        <el-row style="height: 90px">
          <el-col :span="3" style="line-height: 80px; text-align: center">
            <span
              style="margin-right: 10px; font-size: 40px; font-weight: 600"
              >{{ item.miner_lock_pst_amount }}</span
            >
            <span style="font-size: 24px; font-weight: 600">GB</span>
          </el-col>
          <el-col :span="7" class="bottom_col">
            <!-- <svg-icon
              icon-class="left"
              size="40"
              style="margin-right: 10px"
            ></svg-icon> -->
            <!-- <div>
              <div>Blocks</div>
              <div>12600</div>
            </div>
            <div style="text-align: center">
              <div>Foggie</div>
              <div>12</div>
            </div> -->
            <div>
              <div>Files</div>
              <div>{{ item.file_count }}</div>
            </div>
            <div>
              <div>Size</div>
              <div>{{ getfilesize(item.used_space) }}</div>
            </div>
            <!-- <div>
              <div>Slots</div>
              <div>82600</div>
            </div> -->
          </el-col>
          <el-col :span="6" class="bottom_col">
            <svg-icon
              icon-class="hammer"
              size="40"
              style="margin-right: 10px"
            ></svg-icon>
            <div>
              <div>User</div>
              <div>
                <span>{{ item.challenge_num || 0 }}</span> /
                <span style="color: #05f701"
                  >{{ item.challenge_sccess || 0 }}
                </span>
                /
                <span style="color: #db001b; cursor: pointer">{{
                  item.challenge_failed || 0
                }}</span>
              </div>
            </div>
            <!-- <div>
              <div>Chain</div>
              <div><span>12/</span><span style="color: #db001b">0</span></div>
            </div>
            <div>
              <div>Pool</div>
              <div>
                <span>300/</span><span style="color: #db001b">12</span
                ><span style="color: #ffff00">/1</span>
              </div>
            </div> -->
          </el-col>
          <el-col
            :span="8"
            style="
              display: flex;
              justify-content: space-around;
              align-items: center;
              padding-left: 15px;
              cursor: pointer;
            "
          >
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Withdraw"
              placement="top"
            >
              <svg-icon
                icon-class="release"
                size="34"
                style="margin-right: 10px"
                @click.stop="
                  dmcType = 'release';
                  dmcShow = true;
                "
              ></svg-icon>
            </el-tooltip>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Predeposit"
              placement="top"
            >
              <svg-icon
                icon-class="prestore"
                size="36"
                style="margin-right: 10px"
                @click.stop="
                  dmcType = 'prestore';
                  dmcShow = true;
                "
              ></svg-icon>
            </el-tooltip>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Cancel Order"
              placement="top"
            >
              <svg-icon
                icon-class="cancel"
                size="30"
                v-if="item.state == 0"
                style="margin-right: 10px"
                @click.stop="cancelOrder(item)"
              ></svg-icon>
            </el-tooltip>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="upload"
              placement="top"
            >
              <svg-icon
                icon-class="upload"
                size="36"
                style="margin-right: 10px"
                @click.stop="openUpload(item)"
              ></svg-icon>
            </el-tooltip>

            <!-- <svg-icon
              icon-class="folder"
              size="40"
              style="margin-right: 10px"
              @click.stop="openMyFiles(item)"
            ></svg-icon> -->
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Challenge"
              placement="top"
            >
              <svg-icon
                icon-class="dinwei"
                size="34"
                style="margin-right: 10px"
                @click.stop="challengeMiner(item)"
              ></svg-icon>
            </el-tooltip>

            <el-popover
              placement="bottom"
              :ref="'popover_' + index"
              v-model:visible="item.popoverShow"
              :show-arrow="true"
              popper-class="tabsPopover"
              trigger="hover"
            >
              <div class="popoverBox">
                <div
                  class="popoverBox_item"
                  @click.stop="popoverClick('submitMerkle', item)"
                >
                  Upload Merkle
                </div>
              </div>
              <template #reference>
                <div>
                  <svg-icon icon-class="setting" size="30"></svg-icon>
                </div>
              </template>
            </el-popover>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
  <AssetsRecords
    v-if="recordsShow"
    v-model:visible="recordsShow"
    :orderId="orderId"
  ></AssetsRecords>
  <el-dialog
    append-to-body
    class="account-dialog"
    title="Overtime compensation"
    width="500px"
    v-model="overShow"
  >
    <span class="dialog-span"> Overtime payment will terminate the order </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="overShow = false">NO</el-button>
        <el-button type="primary" @click="handlerOver"> YES </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    append-to-body
    class="account-dialog"
    :title="dmcType == 'release' ? 'Withdraw' : 'Predeposit'"
    width="500px"
    v-model="dmcShow"
    :before-close="
      () => {
        amount = 0;
        dmcShow = false;
      }
    "
  >
    <div
      class="dialog-span"
      style="display: flex; justify-content: center; align-items: center"
    >
      Amount
      <el-input-number
        style="margin-left: 20px; width: 200px"
        v-model="amount"
        :min="0.01"
        :precision="4"
        title=""
        :controls="false"
      ></el-input-number>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dmcShow = false">cancel</el-button>
        <el-button type="primary" @click="handlerDMC(dmcType)">
          confirm
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- </div>s -->
</template>

<script setup>
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import { ref, reactive, toRefs, onMounted, computed, toRef, watch } from "vue";
import { useStore } from "vuex";

import {
  pushMerkle,
  getOrderById,
  orderRelease,
  orderAppend,
  orderCancel,
} from "@/api/order/orderList";
import { InitiateChallenge } from "@/api/myFiles/myfiles";
import {
  transferTime,
  ChinaTime1,
  getResidueTime,
  ChinaTime4,
  getSecondTime,
} from "@/utils/ChinaStandardTime";
import AssetsRecords from "./assetsRecords";
import { getfilesize } from "@/utils/util.js";
const $state = useStore();
// const router = useRouter();
const uploadIsShow = computed(() => $state.getters.uploadIsShow);
const props = defineProps({
  orderId: {
    type: String,
    default: "",
  },
});
const overShow = ref(false);
const ChainId = computed(() => $state.getters.ChainId);
const deviceType = computed(() => $state.getters.deviceType);

const email = computed(() => $state.getters.userInfo?.email);
const state = reactive({
  orderList: [],
});
const { orderList } = toRefs(state);
const recordsShow = ref(false);
const { orderId } = toRefs(props);
function loadOrderList() {
  let params = {
    orderId: props.orderId,
    email: email.value,
    deviceType: deviceType.value,
  };

  getOrderById(params)
    .then((res) => {
      if (res.code == 200) {
        res.data.popoverShow = false;
        res.data.created_time = ChinaTime1(new Date(res.data.created_time));
        let nowDate = new Date(res.data.created_time);

        res.data.serverTime = getResidueTime(
          nowDate.setDate(nowDate.getDate() + res.data.epoch * 7),
          res.data.created_time
        );
        res.data.price = (
          +res.data.price_amount / +res.data.miner_lock_pst_amount
        ).toFixed(4);
        state.orderList[0] = res.data;
      }
    })
    .catch((error) => {});
}

function openUpload(item) {
  $state.commit("upload/openUpload", item.id);
}
function openMyFiles(item) {
  $state.commit("upload/setOrderId", item.id);
  // router.push({ path: "/Alltemplate/MyFiles", query: { orderState: item.state } });
}
function handlerOver() {
  pay_challenge({
    chainId: ChainId.value,
    email: email.value,
    orderId: props.orderId,
  }).then((res) => {
    console.log(res);
  });
}
function popoverClick(type, item) {
  if (type == "submitMerkle") {
    ElMessageBox.confirm(
      "You need to pay to take the challenge, are you sure to take the challenge?",
      "Warning",
      {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }
    )
      .then(() => {
        let params = {
          chainId: ChainId.value,
          email: email.value,
          orderId: item.id,
        };

        pushMerkle(params).then((res) => {
          if (res.code == 200) {
            item.popoverShow = false;
            ElMessage({
              showClose: true,
              message: "The merKle tree is uploaded successfully!",
              type: "success",
              grouping: true,
            });
          }
        });
      })
      .catch(() => {});
    // if (item.state == "1") {
    //   ElMessage({
    //     showClose: true,
    //     message: "The order is being delivered, merKle cannot be submitted, please wait.",
    //     type: "warning",
    //     grouping: true,
    //   });
    //   return;
    // }
  }
}
const challengeMiner = (item) => {
  ElMessageBox.confirm(
    "You need to pay to take the challenge, are you sure to take the challenge?",
    "Warning",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(() => {
      let params = {
        chainId: ChainId.value,
        email: email.value,
        orderId: item.id,
        // md5: item.md5,
      };
      InitiateChallenge(params).then((res) => {
        if (res.code == 200) {
        }
      });
    })
    .catch(() => {});
};
function refresh() {
  loadOrderList();
}
const dmcType = ref("");
const dmcShow = ref(false);
const amount = ref(0);
const handlerDMC = (type) => {
  if (
    dmcType.value == "release" &&
    +amount.value > +orderList.value[0].user_pledge_amount
  ) {
    ElNotification({
      type: "error",
      message: "Cannot exceed the Balance",
      position: "bottom-left",
    });
    return false;
  }
  let fetchMethod = type == "release" ? orderRelease : orderAppend;
  fetchMethod({
    chainId: ChainId.value,
    email: email.value,
    orderId: orderId.value,
    amount: amount.value.toFixed(4) + "",
  }).then((res) => {
    if (res.code == 200) {
      ElNotification({
        type: "success",
        message: "Operation successful",
        position: "bottom-left",
      });
      dmcShow.value = false;
      amount.value = false;
      setTimeout(() => {
        refresh();
      }, 2000);
    }
  });
};
const cancelOrder = (item) => {
  ElMessageBox.confirm("Are you sure to cancel the order?", "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  }).then(() => {
    orderCancel({
      chainId: ChainId.value,
      email: email.value,
      orderId: item.id,
    }).then((res) => {
      if (res.code == 200) {
        ElNotification({
          type: "success",
          message: "Cancel completed",
          position: "bottom-left",
        });
        setTimeout(() => {
          refresh();
        }, 2000);
      }
    });
  });
};
watch(uploadIsShow, (newVal, oldVal) => {
  if (!newVal) {
    refresh();
  }
});
onMounted(() => {
  loadOrderList();
});
</script>

<style lang="scss" scoped>
::v-deep {
  .el-progress-bar__outer {
    background-color: #353a43;
  }

  .el-progress-bar__inner {
    position: static;
  }

  .el-progress-bar__innerText {
    position: absolute;
    left: 0px;
    top: -18px;
    font-size: 14px;
    margin: 0;
  }

  .el-progress-bar__outer {
    overflow: visible;
  }
}

.makeDrawer.el-drawer {
  background-color: rgba(243, 246, 255, 0.7);
}

.OrdersList {
  width: 100%;
  // max-width: 1960px;
  margin: 0px auto;

  height: 350px;

  background: rgba(50, 61, 109, 0.5);
  background: linear-gradient(180deg, #3913b8 0%, #75e0e6 100%);
  box-shadow: rgb(255 255 255 / 20%) 0px 0px 0px 0.5px inset;
  backdrop-filter: blur(40px);
  border-radius: 20px;

  padding: 0px 45px 40px 45px;

  .ListTitle {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 24px;
    font-weight: 600;
    color: #fff;
    margin: 20px 0px;
  }
  .top-right {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .link {
    margin-right: 20px;
    svg {
      font-size: 22px;
      margin-right: 5px;
    }
    &:hover {
      color: #409eff;
    }
  }
  .ListBox {
    background-color: #d9001b;
    width: 100%;
    height: 250px;
    padding: 7px;

    .BoxContent {
      background-color: #232731;
      background-color: rgba(255, 255, 255, 0.6);
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 25px;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 15px;

      .BoxContent_header {
        height: 100px;

        .tow_col {
          display: flex;
          justify-content: space-around;
          align-items: end;
          padding-bottom: 20px;

          & > div {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;
            cursor: pointer;
            font-size: 14px;
          }

          & > div > div:first-child {
            font-size: 14px;
            text-align: center;
            color: #86ffff;
            font-style: italic;
            margin-bottom: 5px;
          }

          & > div > div:last-child {
            font-size: 28px !important;
            text-align: center;
          }
        }
      }
    }

    .bottom_col {
      display: flex;
      padding: 0px 15px;
      justify-content: space-around;
      align-items: center;

      & > div {
        font-size: 19px;
        color: #dddddd;
        color: #3d3d3d;
        font-weight: 600;
        line-height: 40px;
        text-align: center;
      }
    }

    .el-col {
      position: relative;
      svg {
        color: #fff;
      }
      svg {
        &:hover {
          color: #0056b5;
        }
      }
    }

    .el-col:not(:last-child)::after {
      position: absolute;
      right: 0px;
      content: "";
      width: 1px;
      height: 80%;
      top: 50%;
      transform: translateY(-50%);
      background-color: #4d4f54;
    }
  }
}

.OrdersList:not(:first-child) {
  margin-top: 20px;
}

::v-deep {
  .el-button:hover {
    box-shadow: rgb(0 0 0 / 10%) 0px 5px 15px, rgb(23 0 102 / 30%) 0px 15px 30px;
    transform: translateY(-3px) scale(1.05);
  }
}

.homeBoxTitile {
  font-size: 18px;
  font-family: PingFang SC-Bold, PingFang SC;
  font-weight: bold;
  color: #000000;
  line-height: 25px;
  margin-bottom: 15px;
}

.homeBoxHeader {
  padding: 0px 50px 0px 15px;
  font-size: 12px;
  font-family: PingFangSC-Regular-, PingFangSC-Regular;
  font-weight: normal;
  color: rgba(0, 0, 0, 0.85);
  line-height: 19px;
  display: flex;
}

.homeBoxHeader-left {
  flex: 1 0 auto;
  display: flex;
  width: 80%;
  flex-wrap: wrap;
}

.homeBoxHeader-left > div {
  margin-right: 30px;
  margin-top: 15px;
}

.homeBoxHeader-right {
  margin-top: 10px;
  flex: 0 0 auto;
  width: 200px;
  text-align: right;

  ::v-deep {
    .el-button {
      background-color: #ff9b3d;
      border: none;
      height: 36px;
    }
  }
}

.hr {
  width: 100%;
  height: 6px;
  background: #ececec;
  // background: linear-gradient(120deg, rgb(224, 195, 252), rgb(142, 197, 252)) rgb(255, 255, 255);
  margin-top: 30px;
}

.timeLine_Box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 20px;
}

.student-timeline {
  margin-top: 30px;

  h2 {
    font-size: 16px;
    color: #0960bd;
  }

  .details {
    margin-top: 20px;
    padding: 20px;
    line-height: 22px;
    border-radius: 15px;
    transition: all 0.5s;
  }

  .details:hover {
    box-shadow: rgb(68 23 219 / 30%) 0px 20px 40px,
      rgb(0 0 0 / 15%) 0px 20px 40px;
    transform: scale(1.01) translateY(-10px);
  }

  .details .common {
    font-size: 13px;
    display: flex;
    flex-wrap: wrap;

    .col_50 {
      width: 50%;
    }

    .col_100 {
      width: 100%;
    }

    & > div {
      display: flex;
      align-items: center;

      & > div {
        font-size: 14px;
        font-weight: bold;
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: left;
        margin-right: 20px;
        color: #666;
        flex: 0 0 auto;
      }

      & > span {
        color: #666;
        font-size: 14px;
        white-space: nowrap;
        height: 30px;
        line-height: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        width: calc(100% - 100px);
      }

      .BluePST {
        color: #5090f5;
        font-weight: 600;
        font-style: italic;
      }

      .yellowPST {
        font-weight: 600;
        color: #ff9b3d;
        font-style: italic;
      }
    }
  }
}
.over {
  color: #ff9b3d;
  cursor: pointer;
  &:hover {
    color: #ff9b3d !important;
    transform: scale(1.05);
  }
}
.account-dialog {
  .dialog-span {
    display: inline-block;
    padding: 20px 0 !important;
    color: #000;
  }

  .dialog-footer {
    .el-button {
      width: unset;
      height: unset;
      border-radius: 50px;
    }
  }
}
</style>
