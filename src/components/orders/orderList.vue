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
        <span>Order ID: {{ item.id }} </span>
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
          Records
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
                <span>{{ item.price_amount.split(".")[0] }}</span
                ><span style="font-size: 16px"
                  >.{{ item.price_amount.split(".")[1] }}</span
                >
              </div>
            </div>
            <div style="text-align: center">
              <!-- <svg-icon
                icon-class="money"
                size="40"
                style="margin-right: 10px"
              ></svg-icon> -->
              <div style="color: #86ffff; font-style: italic">Price</div>
              <div style="color: #86ffff; font-style: italic">（total）</div>
              <div>
                <span>{{ item.miner_lock_dmc_amount.split(".")[0] }}</span
                ><span style="font-size: 16px">
                  .{{ item.miner_lock_dmc_amount.split(".")[1] }}</span
                >
              </div>
            </div>
            <div>
              <div>Deposit</div>
              <div>
                <span>{{ item.deposit_amount.split(".")[0] }}</span
                ><span style="font-size: 16px">
                  .{{ item.deposit_amount.split(".")[1] }}</span
                >
              </div>
            </div>
            <div>
              <div>Residue</div>
              <div>
                <span>200</span>
              </div>
            </div>
            <div>
              <div>day Estimated</div>
              <div>
                <span>1</span><span style="font-size: 16px">.0000</span>
              </div>
            </div>
            <div>
              <div>Punish</div>
              <div style="color: #db001b; font-weight: bold">1</div>
            </div>
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
                <template #default="{ percentage }">
                  <span
                    >{{ item.serverTime.time.D }}days
                    {{ item.serverTime.time.H }}hours
                    {{ item.serverTime.time.M }}minutes</span
                  >
                </template>
              </el-progress>
            </div>
            <div
              style="
                display: flex;
                margin-top: 20px;
                font-weight: bold;
                font-size: 20px;
                color: #fbfbfb;
              "
            >
              <div style="width: 160px; text-align: start">Last Challenge</div>
              <el-progress
                style="flex: 1"
                :text-inside="true"
                color="#6FE9EE"
                :stroke-width="8"
                :percentage="70"
              >
                <template #default="{ percentage }">
                  <span>15days 0 hours 30min</span>
                </template>
              </el-progress>
              <svg-icon
                v-if="item.challenge_period"
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
          <el-col :span="9" class="bottom_col">
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
          <el-col :span="8" class="bottom_col">
            <svg-icon
              icon-class="hammer"
              size="40"
              style="margin-right: 10px"
            ></svg-icon>
            <div>
              <div>User</div>
              <div><span>12/</span><span style="color: #db001b">1</span></div>
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
            :span="4"
            style="
              display: flex;
              justify-content: space-around;
              align-items: center;
              padding-left: 15px;
              cursor: pointer;
            "
          >
            <svg-icon
              icon-class="upload"
              size="36"
              style="margin-right: 10px"
              @click.stop="openUpload(item)"
            ></svg-icon>
            <!-- <svg-icon
              icon-class="folder"
              size="40"
              style="margin-right: 10px"
              @click.stop="openMyFiles(item)"
            ></svg-icon> -->
            <svg-icon
              icon-class="dinwei"
              size="40"
              style="margin-right: 10px"
              @click.stop="challengeMiner(item)"
            ></svg-icon>

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

  <!-- </div>s -->
</template>

<script setup>
import { ElMessage } from "element-plus";
import { ref, reactive, toRefs, onMounted, computed, toRef } from "vue";
import { useStore } from "vuex";

import { pushMerkle, getOrderById } from "@/api/order/orderList";
import { InitiateChallenge } from "@/api/myFiles/myfiles";
import {
  transferTime,
  ChinaTime1,
  getResidueTime,
  ChinaTime4,
} from "@/utils/ChinaStandardTime";
import AssetsRecords from "./assetsRecords";
import { getfilesize } from "@/utils/util.js";
const $state = useStore();
// const router = useRouter();
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
        for (const item of res.data) {
          item.popoverShow = false;
          item.created_time = ChinaTime1(new Date(item.created_time));
          let nowDate = new Date(item.created_time);

          item.serverTime = getResidueTime(
            nowDate.setDate(nowDate.getDate() + item.epoch * 7),
            item.created_time
          );
        }

        state.orderList = res.data;
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
    // if (item.state == "1") {
    //   ElMessage({
    //     showClose: true,
    //     message: "The order is being delivered, merKle cannot be submitted, please wait.",
    //     type: "warning",
    //     grouping: true,
    //   });
    //   return;
    // }

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
  }
}
const challengeMiner = (item) => {
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
};
onMounted(() => {
  loadOrderList();
});
function refresh() {
  loadOrderList();
}
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
    right: 0px;
    top: -18px;
    font-size: 14px;
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
