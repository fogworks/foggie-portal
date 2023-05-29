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
        <div
          style="font-size: 15px; color: rgba(255, 255, 255, 0.7)"
          class="right-tag"
        >
          <el-tag
            type="info"
            title="Subscription not agreed, waiting..."
            effect="dark"
            round
            v-if="item.state == '0'"
          >
            Subscription not agreed, waiting...</el-tag
          >

          <el-tag
            effect="dark"
            title="order status delivery"
            round
            v-if="item.state == '1'"
            >order status delivery</el-tag
          >
          <el-tag
            title="Insufficient deposit, the order is about to end"
            type="warning"
            effect="dark"
            round
            v-if="item.state == '2'"
          >
            Insufficient deposit, the order is about to end
          </el-tag>
          <el-tag
            title="With sufficient deposit, the order is still in delivery in the next
            cycle"
            effect="dark"
            round
            v-if="item.state == '3'"
          >
            With sufficient deposit, the order is still in delivery in the next
            cycle
          </el-tag>
          <el-tag
            title="Order has ended"
            type="success"
            effect="dark"
            round
            v-if="item.state == '4'"
          >
            Order has ended</el-tag
          >
          <el-tag
            title="Order has been canceled"
            type="danger"
            effect="dark"
            round
            v-if="item.state == '5'"
          >
            Order has been canceled</el-tag
          >
          <el-tag
            title="The order will be canceled in the next cycle"
            type="warning"
            effect="dark"
            round
            v-if="item.state == '6'"
          >
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
              <div>Estimated Income(DMC)</div>
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
          <el-col :span="6" class="bottom_col">
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
          <el-col :span="5" class="bottom_col">
            <svg-icon
              icon-class="hammer"
              size="40"
              style="margin-right: 10px"
            ></svg-icon>
            <div>
              <div>User</div>
              <div>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="Total"
                  placement="top"
                >
                  <span>{{ item.challenge_num || 0 }}</span>
                </el-tooltip>
                /
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="Normal"
                  placement="top"
                >
                  <span>{{ item.challenge_other || 0 }}</span>
                </el-tooltip>
                /
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="Success"
                  placement="top"
                >
                  <span style="color: #05f701"
                    >{{ item.challenge_sccess || 0 }}
                  </span>
                </el-tooltip>

                /
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="Error"
                  placement="top"
                >
                  <span style="color: #db001b; cursor: pointer">{{
                    item.challenge_failed || 0
                  }}</span>
                </el-tooltip>
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
            :span="10"
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
              content="Challenge/Merkle List"
              placement="top"
            >
              <svg-icon
                icon-class="list"
                size="40"
                style="margin-right: 10px"
                @click.stop="timeLineShow = !timeLineShow"
              ></svg-icon>
            </el-tooltip>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Withdraw"
              placement="top"
            >
              <svg-icon
                icon-class="withdraw"
                size="36"
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
                v-if="![4, 5].includes(item.state)"
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
                v-if="item.state == 0 && checkCancel()"
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
                v-if="![4, 5].includes(item.state)"
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
              content="Red files in the list need to be re-uploaded"
              placement="top"
            >
              <svg-icon
                v-if="!isLocal"
                icon-class="dinwei"
                size="34"
                style="margin-right: 10px"
              ></svg-icon>
            </el-tooltip>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Challenge"
              placement="top"
            >
              <svg-icon
                v-if="![4, 5].includes(item.state) && isLocal"
                icon-class="dinwei"
                size="34"
                style="margin-right: 10px"
                @click.stop="challengeMiner(item)"
              ></svg-icon>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              effect="dark"
              content="Red files in the list need to be re-uploaded"
              placement="top"
            >
              <svg-icon
                v-if="!isLocal"
                style="color: rgb(16 57 255)"
                icon-class="setting"
                size="30"
              ></svg-icon>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              effect="dark"
              content="Upload Merkle"
              placement="top"
            >
              <svg-icon
                v-if="![4, 5].includes(item.state) && isLocal"
                @click.stop="popoverClick('submitMerkle', item)"
                style="color: rgb(16 57 255)"
                icon-class="setting"
                size="30"
              ></svg-icon>
            </el-tooltip>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
  <TimeLine ref="timeLineRef" :orderId="orderId" v-if="timeLineShow"></TimeLine>
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
import TimeLine from "./timeLine";
import {
  pushMerkle,
  getOrderById,
  orderRelease,
  orderAppend,
  orderCancel,
  pay_challenge,
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
import { getfilesize, transferUTCTime } from "@/utils/util.js";
const $state = useStore();
const emits = defineEmits(["setState"]);
// const router = useRouter();
const uploadIsShow = computed(() => $state.getters.uploadIsShow);
const order_Id = computed(() => $state.getters.orderId);

const timeLineShow = ref(false);

const props = defineProps({
  orderId: {
    type: String,
    default: "",
  },
  deviceData: {
    type: Object,
  },
  activeDeviceData: {
    type: Object,
    default: () => ({ data: {} }),
  },
  isLocal: {
    type: Boolean,
  },
});

const overShow = ref(false);
const ChainId = computed(() => $state.getters.ChainId);

const email = computed(() => $state.getters.userInfo?.email);
const state = reactive({
  orderList: [],
});
const timeLineRef = ref(null);
const { orderList } = toRefs(state);
const recordsShow = ref(false);
const { orderId, deviceData, activeDeviceData } = toRefs(props);
watch(
  activeDeviceData,
  (val) => {
    if (val.data.space_order_id == orderId.value) {
      loadOrderList();
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
function loadOrderList() {
  let params = {
    orderId: props.orderId,
    email: email.value,
    deviceType: 3,
  };

  getOrderById(params)
    .then((res) => {
      if (res.code == 200) {
        res.data.popoverShow = false;
        res.data.created_time = transferUTCTime(res.data.created_time);
        let nowDate = new Date(res.data.created_time);

        res.data.serverTime = getResidueTime(
          nowDate.setDate(nowDate.getDate() + res.data.epoch * 7),
          res.data.created_time
        );
        res.data.price = (
          +res.data.price_amount / +res.data.miner_lock_pst_amount
        ).toFixed(4);
        state.orderList[0] = res.data;
        emits("setState", orderList.value[0].state);
        emits("setTime", orderList.value[0].created_time);
      }
    })
    .catch((error) => {});
}
function checkCancel() {
  let nowTime = new Date().getTime();
  let endTime =
    new Date(orderList.value?.[0]?.created_time).getTime() +
    1000 * 60 * 60 * 24 * 7;
  let time = +endTime - +nowTime;
  if (time > 0) {
    return false;
  } else {
    return true;
  }
}
function openUpload(item) {
  let nowTime = new Date().getTime();
  let endTime =
    new Date(orderList.value[0].created_time).getTime() + 1000 * 60 * 3;
  let time = ((+endTime - +nowTime) / 1000).toFixed(0);
  if (time > 4 * 60) {
    time = time - 60 * 60;
  }
  if (time > 0) {
    let content = "Upload files after " + getSecondTime(+time);
    ElNotification({
      type: "warning",
      message: content,
      position: "bottom-left",
    });
  } else {
    $state.commit("upload/setUploadOptions", deviceData);
  }
}
function openMyFiles(item) {
  $state.commit("upload/setOrderId", item.id);
  // router.push({ path: "/Alltemplate/MyFiles", query: { orderState: item.state } });
}
function handlerOver() {
  pay_challenge({
    chainId: ChainId.value,
    email: email.value,
    orderId: orderId.value,
  }).then((res) => {
    console.log(res);
    if (res.code == 200) {
      refresh();
      ElNotification({
        type: "success",
        message: `Operation successful`,
        position: "bottom-left",
      });
    }
  });
}
const uploadFileList = computed(() => $state.getters.uploadFileList);
function popoverClick(type, item) {
  let cantUpload = uploadFileList.value[props.orderId]?.some((el) => {
    if (el.paused) {
      return true;
    }
    if (!el.completed && !el.error && !el.paused) {
      return true;
    }
  });
  let totalPST = orderList.value[0].total_space;
  let uploadLine = Math.round(+totalPST * 0.05);
  let used_space = orderList.value[0].used_space;
  if (uploadLine > used_space) {
    let needSpace = getfilesize(uploadLine - used_space);
    ElNotification({
      type: "warning",
      message: `At least ${needSpace} of files need to be uploaded to upload Merkle`,
      position: "bottom-left",
    });
    return false;
  }
  if (cantUpload) {
    ElNotification({
      type: "warning",
      message:
        "Please wait for the file upload to finish before uploading Merkle",
      position: "bottom-left",
    });
    return false;
  }
  if (type == "submitMerkle") {
    ElMessageBox.confirm(
      "<Strong>Are you sure to upload Merkle?</Strong> <br /><span>This behavior is to verify the reliability of the storage provider and is also a prerequisite for conducting storage challenges without payment. <br/> If there is any inconsistency, you can choose to refund. <br /> <strong>Once Merkle reaches an agreement, revenue can be generated.</strong> </span>",
      "Warning",
      {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        dangerouslyUseHTMLString: true,
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
              message: "The Merkle tree is uploaded successfully!",
              type: "success",
              grouping: true,
            });
            if (timeLineShow.value) {
              setTimeout(() => {
                timeLineRef.value.loadMerkleList();
              }, 2000);
            }
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
    "<Strong>You need to pay to take the challenge, are you sure to take the challenge?</Strong><br />This behavior is to verify the consistency of your data (when you suspect there is a problem with your data).<br /> When Merkel reaches an agreement, the challenge can be initiated, and the storage party will respond within 24 hours.<br /> <strong>But a fee is required.</strong>  <br />If the verification is successful, a processing fee of 10% of the PST unit price is required.<br /> If there is inconsistency, the storage party can arbitrate. <br />Please do not cheat in any way, otherwise the storage party will successfully arbitrate and you will need to pay a handling fee of 100 times.",
    "Warning",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      dangerouslyUseHTMLString: true,
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
          ElNotification({
            type: "success",
            message: `Successfully initiated the challenge`,
            position: "bottom-left",
          });
          refresh();
          if (timeLineShow.value) {
            setTimeout(() => {
              timeLineRef.value.loadChallengeList();
            }, 2000);
          }
        }
      });
    })
    .catch(() => {});
};
function refresh() {
  loadOrderList();
  if (timeLineShow.value) {
    timeLineRef.value.loadMerkleList();
    timeLineRef.value.loadChallengeList();
  }
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
  if (!newVal && order_Id.value == orderId.value) {
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
  background: var(--liner-gradient);
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
    .right-tag {
      :deep {
        .el-tag {
          display: inline-block;
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 24px;
        }
      }
    }
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
        color: var(--text-color);
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
