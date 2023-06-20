<template>
  <div class="light-box">
    <div class="card-box">
      <div class="flex justify-between">
        <div class="flex items-center">
          <img class="title-img" src="@/assets/assets-title.png" alt="" />
          <div class="title">Assets</div>
        </div>
        <a
          class="flex items-center records"
          @click.prevent="recordsVisible = true"
        >
          <div>Records</div>

          <img class="list-img" src="@/assets/assets-more-list.png" alt="" />
        </a>
      </div>
      <div class="today-grid" style="border: none; padding: 0">
        <div class="sub-title">Space</div>
        <div class="sub-title last-week">Order</div>
        <div></div>
      </div>
      <div class="today-grid">
        <div class="flex items-center">
          <!-- <div class="plus-icon">+</div> -->
          <div class="plus-num-today">
            <el-tooltip
              class="plus-num-tips"
              effect="dark"
              content="Used Space"
              placement="top"
              :append-to-body="false"
            >
              {{ getfilesize(usedSpace) || "0.00 B" }}
            </el-tooltip>
            /
            <el-tooltip
              class="plus-num-tips"
              effect="dark"
              content="Total Space"
              placement="top"
              :append-to-body="false"
            >
              {{ getfilesize(totalSpace) || "0.00 B" }}
            </el-tooltip>

            <!-- <span title="Already Earned">{{ addNum }}</span>/<span title="Estimated Benefits">{{ estimateNum }}</span> -->
          </div>
        </div>
        <div
          class="flex items-center"
          style="justify-content: center; font-size: 26px"
        >
          <!-- <div class="plus-icon">+</div> -->
          <!-- <MyEcharts
            style="width: 100%; height: 50px"
            :options="lastWeekOptions"
          ></MyEcharts> -->
          {{ assetsOrderNum }}
          <!-- {{  lastweekCount }} -->
          <!-- <div class="dmc">DMC</div> -->
        </div>
        <div class="flex today-right">
          <div @click="rewardsVisible = true">Earn More &nbsp;></div>
        </div>
      </div>
      <div class="sub-title">Balance</div>
      <div class="today-grid Balance-grid">
        <div class="flex items-center">
          <div class="plus-num">{{ balanceCount }}</div>
          <div class="dmc">DMC</div>
        </div>
        <div class="flex items-center" style="justify-content: center">
          <div class="plus-num">{{ balanceCount2 }}</div>
          <div class="dmc">PST</div>
        </div>

        <div class="flex today-right">
          <div class="color-box">
            <el-button @click="openWithdraw">
              <RippleInk></RippleInk>
              Withdraw</el-button
            >
          </div>
        </div>
      </div>
      <Rewards
        v-if="rewardsVisible"
        @reload="reload"
        v-model:visible="rewardsVisible"
      >
      </Rewards>
      <Withdraw
        v-if="WithdrawVisible"
        v-model:visible="WithdrawVisible"
        :walletUser="walletUser"
        :walletType="walletType"
        :withDrawMoney="withDrawMoney"
        :noOrderShow="noOrderShow"
        @reload="reload"
      ></Withdraw>

      <AssetsRecords
        v-if="recordsVisible"
        v-model:visible="recordsVisible"
      ></AssetsRecords>
      <!-- <NftDialog
        v-model:visible="NftDialogVisible"
        :nft-link="nftLink"
      ></NftDialog> -->
    </div>
  </div>
</template>

<script>
import {
  ref,
  reactive,
  onMounted,
  computed,
  watchEffect,
  toRefs,
  inject,
  nextTick,
  watch,
} from "vue";
import NftDialog from "./nftDialog";
import Rewards from "./rewards";
import Withdraw from "./withDraw";
import AssetsRecords from "./assetsRecords";
import BigNumber from "bignumber.js";
import MyEcharts from "@/components/echarts/myEcharts";
import useOrderList from "@/views/portal/_modules/hooks/useOrderList";

import {
  user,
  ydaReward,
  getAssets,
  lastweekReward,
  dmcSwap,
  OwnerBills,
} from "@/utils/api.js";
import { userAssets } from "@/api/order/orderList.js";
import * as echarts from "echarts";
import { getfilesize } from "@/utils/util";
import RippleInk from "@/components/rippleInk";
import usePrivateKey from "@/views/portal/user/_modules/hooks/usePrivateKey";
import { useStore } from "vuex";
export default {
  components: {
    Rewards,
    Withdraw,
    AssetsRecords,
    MyEcharts,
    RippleInk,
    NftDialog,
  },
  setup(props, { emit }) {
    const store = useStore();
    const addNum = ref(0);
    const estimateNum = ref(0);
    const balanceCount = ref(0);
    const balanceCount2 = ref(0);
    const withDrawMoney = ref(0);
    // const visible = ref(false);
    const recordsVisible = ref(false);
    const rewardsVisible = ref(false);
    const WithdrawVisible = ref(false);
    const NftDialogVisible = ref(false);
    const lastweekCount = ref(0);
    const usedSpace = ref(0);
    const totalSpace = ref(0);
    const totalOrder = ref(0);
    const currentOODItem = computed(
      () => store.getters["global/currentOODItem"]
    );
    const email = computed(() => store.getters["token/currentUser"]);
    const { assetsOrderNum, getAssetsOrderNum } = useOrderList();
    const getUserAssets = () => {
      userAssets({ email: email.value }).then((res) => {
        if (res.code == 200) {
          balanceCount.value = res.data[0]?.balance.quantity.slice(
            0,
            res.data[0].balance.quantity.length - 4
          );
          withDrawMoney.value = +balanceCount.value;
          balanceCount2.value = res.data[1]?.balance.quantity.slice(
            0,
            res.data[1].balance.quantity.length - 4
          );
          usedSpace.value = res.data[2]?.used_space;
          totalSpace.value = res.data[2]?.total_space;
          totalOrder.value = res.data[2]?.order_num;
        }
      });
    };
    // const estimateDMC = ref(0);
    const adminCategoriesListInit = async () => {
      // getDMC();

      getUserAssets();
      // initYesterdayScore();
      // initBills();
    };
    const walletUser = ref("");
    const walletType = ref("");
    const myQrcode = ref("");
    const noOrderShow = ref(false);
    const closeNoBoxShow = ref(false);
    const { dmc, joinPool } = usePrivateKey();
    const openWithdraw = async () => {
      if (!dmc.value) {
        joinPool();
      } else {
        WithdrawVisible.value = true;
      }
    };
    function openNoVoodDialog() {
      closeNoBoxShow.value = true;
    }
    function getUserInfo() {
      user().then((res) => {
        if (res.data) {
          window.sessionStorage.setItem("myQrcode", res.data.referral_code);
          myQrcode.value = res.data.referral_code || "";
          if (res.data.dmc && res.data.dmc !== "null") {
            window.sessionStorage.setItem("walletUser", res.data.dmc);
            walletUser.value = res.data.dmc;
            walletType.value = res.data.wallet_type;
          } else {
            window.sessionStorage.removeItem("walletUser");
          }
          const lead_mark = document.getElementById("lead_mark");
          if (lead_mark && res.data && !res.data.vood_next) {
            lead_mark.style.display = "block";
            document.body.style.overflow = "hidden";
            // that.initTest();
          }
        }
      });
    }
    const reload = () => {
      setTimeout(() => {
        adminCategoriesListInit();
      }, 3000);
    };
    watchEffect(() => {
      getUserInfo();
      // initAccountMoney();
      getUserAssets();
      // search();
      getAssetsOrderNum();
    });
    watch(
      dmc,
      (val) => {
        if (val) {
          getUserInfo();
          getUserAssets();
        }
      },
      {
        deep: true,
      }
    );
    onMounted(() => {
      adminCategoriesListInit();
    });
    return {
      addNum,
      email,
      estimateNum,
      usedSpace,
      totalSpace,
      totalOrder,
      withDrawMoney,
      noOrderShow,
      walletUser,
      walletType,
      balanceCount,
      balanceCount2,
      // visible,
      recordsVisible,
      rewardsVisible,
      WithdrawVisible,
      NftDialogVisible,
      // lastweekCount,
      // lastWeekOptions,
      currentOODItem,
      assetsOrderNum,
      // nftLink,
      openNoVoodDialog,
      adminCategoriesListInit,
      // getDMC,
      // initYesterdayScore,
      // initBills,
      // initAmount,
      reload,
      getfilesize,
      openWithdraw,
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
.light-box {
  position: relative;
  width: 700px;
  height: 350px;
  padding: 0;
  // .vip-card();
  overflow: hidden;
  min-width: 500px;
  @include vip-card;
  margin: 50px auto;
  &::before {
    content: "";
    position: absolute;
    z-index: 1;
    left: -20%;
    width: 70%;
    height: 100%;
    transform: skewX(-35deg);
    background: linear-gradient(
      200deg,
      rgba(244, 244, 244, 0.15) 0%,
      rgba(244, 244, 244, 0) 50%
    );
  }
}
.card-box {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 350px;
  color: #fff !important;

  z-index: 2;
  // .card-box();
  box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 20%),
    rgb(0 0 0 / 10%) 0px 0px 0px 0.5px inset;
  @include card-box;

  .records {
    cursor: pointer;
  }

  .title {
    font-size: 30px;
  }

  .title-img {
    width: 32px;
    margin-right: 10px;
    object-fit: contain;
  }
  .list-img {
    width: 16px;
    margin-left: 4px;
    object-fit: contain;
  }
  .sub-title {
    margin-top: 20px;
    margin-bottom: 8px;
    font-size: 24px;
    text-align: left;
  }
  .last-week {
    text-align: center;
  }
  .today-grid {
    display: grid;
    align-items: center;
    grid-template-columns: 2fr 1fr 2fr;
    padding-bottom: 15px;
    border-bottom: 1px solid #fff3;

    .PST {
      justify-content: center;
      cursor: pointer;
    }
    .plus-icon {
      margin-right: 8px;
      font-size: 24px;
    }
    .plus-num {
      margin-right: 8px;
      font-size: 20px;
      letter-spacing: 2px;
      font-family: Farrington7B !important;
    }
    .plus-num-today .el-only-child__content {
      margin: 0 4px;
      font-size: 14px;
      letter-spacing: 2px;
      font-family: Farrington7B !important;
    }
    .dmc {
      margin-left: 2px;
      font-size: 16px;
    }
    .nft {
      text-decoration: underline;
    }
    .today-right {
      justify-content: flex-end;
      cursor: pointer;
      .color-box {
        // .color-box();
        @include color-box;

        .ripple-ink {
          border-radius: 45px;
        }
      }
      .el-button {
        position: relative;
        width: 135px;
        color: #fff;
        border: none;
        border-radius: 45px;
        box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 20%);
        background: var(--btn-gradient);
      }
    }
  }
  .Balance-grid {
    border-bottom: none;
    // grid-template-columns: repeat(4, 1fr);
  }
}
</style>
<style lang="scss">
.plus-num-today {
  // margin: 0 4px;
  // letter-spacing: 2px;
  // font-family: Farrington7B !important;
  > span {
    margin: 0;
    font-size: 14px;
    letter-spacing: 1px;
    font-family: Farrington7B !important;
  }
}
</style>
