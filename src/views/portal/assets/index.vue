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
        <div class="sub-title">Toady's</div>
        <div class="sub-title last-week">Last Week</div>
        <div></div>
      </div>
      <div class="today-grid">
        <div class="flex items-center">
          <div class="plus-icon">+</div>
          <div class="plus-num-today">
            <el-tooltip
              class="plus-num-tips"
              effect="dark"
              content="Already Earned"
              placement="top"
              :append-to-body="false"
            >
              {{ addNum }}
            </el-tooltip>
            /
            <el-tooltip
              class="plus-num-tips"
              effect="dark"
              content="Estimated Benefit"
              placement="top"
              :append-to-body="false"
            >
              {{ estimateNum }}
            </el-tooltip>

            <!-- <span title="Already Earned">{{ addNum }}</span>/<span title="Estimated Benefits">{{ estimateNum }}</span> -->
          </div>
          <div class="dmc">DMC</div>
        </div>
        <div class="flex items-center">
          <!-- <div class="plus-icon">+</div> -->
          <MyEcharts
            style="width: 100%; height: 50px"
            :options="lastWeekOptions"
          ></MyEcharts>
          <!-- {{  lastweekCount }} -->
          <!-- <div class="dmc">DMC</div> -->
        </div>
        <div class="flex today-right">
          <!-- <div @click="rewardsVisible = true">Earn More &nbsp;></div> -->
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
        <!-- <div class="flex PST" @click="NftDialogVisible = true">
          <div class="plus-num">{{ nftCount }}</div>
          <div class="dmc nft">NFT</div>
        </div> -->
        <div class="flex today-right">
          <div class="color-box">
            <el-button @click="WithdrawVisible = true">
              <RippleInk></RippleInk>
              Withdraw</el-button
            >
          </div>
        </div>
      </div>
      <Rewards
        :currentOODItem="currentOODItem"
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
} from "vue";
import NftDialog from "./nftDialog";
import Rewards from "./rewards";
import Withdraw from "./withDraw";
import AssetsRecords from "./assetsRecords";
import BigNumber from "bignumber.js";
import MyEcharts from "@/components/echarts/myEcharts";
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
import RippleInk from "@/components/rippleInk";
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
    const nftCount = ref(0);
    // const visible = ref(false);
    const recordsVisible = ref(false);
    const rewardsVisible = ref(false);
    const WithdrawVisible = ref(false);
    const NftDialogVisible = ref(false);
    const lastweekCount = ref(0);
    const currentOODItem = computed(
      () => store.getters["global/currentOODItem"]
    );
    const email = computed(() => store.getters["token/currentUser"]);
    const lastWeekOptions = reactive({
      color: "#fff",
      grid: {
        top: 5,
        left: 5,
        right: 5,
        bottom: 5,
      },
      tooltip: {
        show: true,
        trigger: "axis",
        axisPointer: {
          type: "none",
        },
      },
      xAxis: {
        type: "category",
        data: [],
        show: false,
      },
      yAxis: {
        show: false,
        type: "value",
      },
      series: [
        {
          symbol: "none",
          data: [],
          type: "line",
          smooth: 0.6,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              {
                offset: 0,
                color: "#188df0",
              },
              {
                offset: 0,
                color: "#7165dd",
              },
            ]),
          },
          lineStyle: {
            color: "#67d8dd",
            width: 2,
          },
        },
      ],
    });
    const getUserAssets = () => {
      userAssets({ email: email.value }).then((res) => {
        if (res.code == 200) {
          balanceCount.value = res.data[0].balance.quantity.slice(
            0,
            res.data[0].balance.quantity.length - 4
          );
          withDrawMoney.value = +balanceCount.value;
          balanceCount2.value = res.data[1].balance.quantity.slice(
            0,
            res.data[1].balance.quantity.length - 4
          );
        }
      });
    };
    // const estimateDMC = ref(0);
    const adminCategoriesListInit = async () => {
      getDMC();
      getUserAssets();
      initYesterdayScore();
      initBills();
    };
    const getDMC = () => {
      let owner_id = sessionStorage.getItem("walletUser")
        ? sessionStorage.getItem("walletUser")
        : "foggiezzzzz2";
      getAssets(owner_id).then((r) => {
        // balanceCount.value = r.amount;
        nftCount.value = r.nft;
      });

      lastweekReward(owner_id).then((rr) => {
        lastWeekOptions.xAxis.data = rr?.map((el) => el.day);
        lastWeekOptions.series[0].data = rr?.map((el) => el.score);
        // if (rr && rr.length > 0) {
        //   let num = 0;
        //   for (let i = 0; i < rr.length; i++) {
        //     num += rr[i].score;
        //   }
        //   lastweekCount.value = num;
        // }
      });
    };
    const initYesterdayScore = async () => {
      let account = sessionStorage.getItem("walletUser")
        ? sessionStorage.getItem("walletUser")
        : "foggiezzzzz2";
      let data = await ydaReward(account, "account");
      if (!data) {
        return;
      }
      // source1 代表自己的，source2 代表分享的
      let owner_total = data.owner_total;
      let rewardDMC = 0.0;
      if (owner_total) {
        for (let i = 0; i < owner_total.length; i++) {
          if (owner_total[i].source === "1") {
            rewardDMC = (owner_total && owner_total[i].total) || "0.0000";
          } else if (owner_total[i].source === "2") {
            // let codeReward =
            //   owner_total && owner_total.length > 1
            //     ? owner_total[i].total
            //     : 0.0;
            //   codeReward = (owner_total && owner_total[i].total) || "0.0000";
          }
        }
      }
      addNum.value = Number(rewardDMC).toFixed(4);
    };
    const initBills = async () => {
      let ratedata = await dmcSwap();
      let dmcRate = 1;
      if (ratedata && ratedata[0]) {
        ratedata = ratedata[0];
        let rsi = ratedata.tokenx && ratedata.tokenx.quantity;
        let dmc = ratedata.tokeny && ratedata.tokeny.quantity;
        rsi = rsi.split("RSI")[0];
        dmc = dmc.split("DMC")[0];
        dmcRate = Number(dmc) / Number(rsi); //1 RSI = x DMC
      }
      let account = sessionStorage.getItem("walletUser")
        ? sessionStorage.getItem("walletUser")
        : "foggiezzzzz2";
      let data = await OwnerBills(account);
      if (!data) {
        return;
      }
      let dataList = data.bills;
      initAmount(dataList, dmcRate);
    };
    const initAmount = (data, dmcRate) => {
      const sellClearCycle = 7 * 60 * 24;
      const RSIPrecision = 8;
      const m = 4;
      const x = 0.1;
      let unmatchedAmont = 0;
      let estimateDMC = 0;
      for (let i = 0; i < data.length; i++) {
        let sunBill = data[i].bills;
        for (let s = 0; s < sunBill.length; s++) {
          unmatchedAmont = unmatchedAmont + sunBill[s].amount;
        }
        let createdAt = data[i].create_ts;
        let updateAt = data[i].update_ts;
        const couldReceiveTimeStamp =
          (Date.now() - new Date(createdAt).getTime()) / (60 * 1000);
        const isOverTimeStamp =
          (new Date(updateAt).getTime() - new Date(createdAt).getTime()) /
          (60 * 1000);
        const overTime = new Date(
          sellClearCycle * (60 * 1000) + new Date(createdAt).getTime()
        );
        let timeStamp = Date.now() - new Date(updateAt).getTime();
        let overTimeStamp = overTime.getTime() - new Date(updateAt).getTime();

        const getRsiPerSecond = new BigNumber((m * x) / (sellClearCycle * 60));
        var amount = 0;
        if (
          (isOverTimeStamp === 0 && couldReceiveTimeStamp < sellClearCycle) ||
          (isOverTimeStamp !== 0 && couldReceiveTimeStamp < sellClearCycle)
        ) {
          timeStamp = timeStamp > 0 ? timeStamp : 0;
          amount = new BigNumber(
            (unmatchedAmont * timeStamp * getRsiPerSecond) / 1000
          ).toFixed(RSIPrecision, 1);
        } else if (
          (isOverTimeStamp === 0 && couldReceiveTimeStamp > sellClearCycle) ||
          (isOverTimeStamp !== 0 && couldReceiveTimeStamp > sellClearCycle)
        ) {
          overTimeStamp = overTimeStamp > 0 ? overTimeStamp : 0;
          amount = new BigNumber(
            (unmatchedAmont * overTimeStamp * getRsiPerSecond) / 1000
          ).toFixed(RSIPrecision, 1);
        } else {
          amount = "xx";
        }
        estimateDMC = new BigNumber(amount * dmcRate * 0.75).toFixed(4, 1);
        estimateDMC = Number(estimateDMC) + Number(addNum.value);
        estimateDMC = Number(estimateDMC).toFixed(4);
        // setTimeout(() => {
        //   initAmount(data, dmcRate);
        // }, 100);
      }
      estimateNum.value = Number(estimateDMC).toFixed(4);
      // addNum.value = estimateDMC;
    };
    const walletUser = ref("");
    const walletType = ref("");
    const myQrcode = ref("");
    const currentDmc = ref(0.0);
    const noOrderShow = ref(false);
    const closeNoBoxShow = ref(false);
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
            // this.$confirm(
            //   this.$t("vood.needwalletUser"),
            //   this.$t("vood.Notice"),
            //   {
            //     confirmButtonText: this.$t("vood.CLICK_LOGIN"),
            //     cancelButtonText: this.$t("index.cancel"),
            //     type: "warning",
            //   }
            // )
            //   .then(() => {
            //     that.openVood();
            //   })
            //   .catch(() => {});
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
    const nftLink = ref("");
    async function initAccountMoney() {
      let DMCUser = window.sessionStorage.getItem("walletUser") || "";
      let user_info = await user();
      if (user_info && user_info.data && user_info.data.dmc) {
        DMCUser = user_info.data.dmc;
      }
      if (DMCUser) {
        let data = await getAssets(DMCUser);
        if (data && data.amount) {
          currentDmc.value = Number(data.amount).toFixed(4);
          // let item = {
          //   key: "dmcAssets",
          //   value: currentDmc.value,
          // };
          withDrawMoney.value = currentDmc.value;
          // this.$emit("handleCollectTopData", item.key, item.value);
          // this.$emit("handleCollectTopData", "nft_link", nft_link);
          window.sessionStorage.setItem("myAssets", data.amount);
        }
        if (data?.nft_link) {
          nftLink.value = data.nft_link;
        }
      }
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
    });
    onMounted(() => {
      // getUserAssets();
      adminCategoriesListInit();
    });
    return {
      addNum,
      email,
      estimateNum,
      withDrawMoney,
      noOrderShow,
      walletUser,
      walletType,
      balanceCount,
      balanceCount2,
      nftCount,
      // visible,
      recordsVisible,
      rewardsVisible,
      WithdrawVisible,
      NftDialogVisible,
      lastweekCount,
      lastWeekOptions,
      currentOODItem,
      nftLink,
      openNoVoodDialog,
      adminCategoriesListInit,
      getDMC,
      initYesterdayScore,
      initBills,
      initAmount,
      reload,
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
    grid-template-columns: repeat(3, 1fr);
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
