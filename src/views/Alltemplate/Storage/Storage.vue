<template>
  <customDialog
    v-model="isShow"
    width="calc(100% - 400px)"
    :closeClickModal="false"
  >
    <div class="viewContainer">
      <div class="homeBox">
        <div class="homeBoxTitile">Order Filter List</div>
        <div class="homeBoxHeader">
          <div class="homeBoxHeader-left">
            <div>
              <span style="font-size: 16px; margin-right: 5px"
                >*Please enter the purchase cycle</span
              >
              <el-input-number
                v-model.number="formLine.week"
                :min="24"
                placeholder="Please enter the purchase cycle"
              />
              <span style="font-size: 16px; margin-left: 5px">Weeks</span>
            </div>
            <div>
              <div
                style="
                  margin-top: -20px;
                  color: #ff6e6e;
                  font-size: 12px;
                  margin-left: 20px;
                "
              >
                Current benchmark price:{{
                  Number(curReferenceRate).toFixed(4)
                }}
                DMC
              </div>
              <el-input
                v-model="formLine.quantity"
                placeholder="Please enter the purchase quantity"
                style="width: 220px"
              >
                <template #prefix>
                  <svg-icon icon-class="search" size="25"></svg-icon>
                </template>
                <template #suffix>
                  <span style="font-size: 16px">PST</span>
                </template>
              </el-input>
            </div>
            <el-button
              style="margin-top: 23px"
              type="primary"
              round
              @click="filterOrder"
              :loading="loading"
              >Filter</el-button
            >
          </div>
        </div>
        <div class="hr"></div>
        <div
          style="
            width: 600px;
            margin: 0px auto;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            height: 300px;
          "
        >
          <div style="text-align: center">
            <div style="margin-bottom: 10px">Own DMC:{{ userDMC }} DMC</div>
            <span>
              Total:
              {{
                totalPrice
                  ? `${totalPrice.MinPrice} -- ${totalPrice.MaxPrice}`
                  : "- -"
              }}
              DMC</span
            >
            <div
              class="exceedMaxUserDMC"
              v-if="totalPrice && totalPrice.MaxPrice > userDMC"
            >
              The current purchase price of PST may exceed the number of wallet
              DMC
            </div>
          </div>
        </div>

        <div class="destroyBox">
          <div
            class="Img_box"
            v-for="(item, index) in filterOrderList"
            :key="index"
          >
            <div class="detailImg">
              <div class="detailImg_box" :class="returnBG(index)">
                <!-- <div class="detailImg_box_Img">
                <img class="box_Img" src="../../assets/_bg3.png" alt="" />
              </div> -->
                <div class="detailImg_box_text">
                  <p>
                    Unit Price:<span>{{ item.price / 10000 }}DMC</span>
                  </p>
                  <p>
                    Deposit:<span
                      >{{ (item.price / 10000) * item.deposit_ratio }}DMC</span
                    >
                  </p>
                  <p>
                    Purchase Quantity:<span>{{ formLine.quantity }}PST</span>
                  </p>
                  <p>
                    Purchase Cycle:<span>{{ formLine.week }}</span>
                  </p>
                  <p>
                    Deposit Multiple:<span>{{ item.deposit_ratio }}</span>
                  </p>
                  <p>
                    Total Order Price:<span
                      >{{ computeTotalPrices(item) }}DMC</span
                    >
                  </p>
                  <p>
                    Custom Pledge Rate:<span>{{
                      Number(item.maker.benchmark_stake_rate) / 100
                    }}</span>
                  </p>
                  <p>{{ item.created_time }}</p>
                </div>
                <el-button
                  type="primary"
                  round
                  style="margin-top: 40px; opacity: 0"
                  @click="purchasePST(item)"
                  >Buy</el-button
                >
              </div>
            </div>
          </div>
        </div>

        <customDialog v-model="dialogIsShow">
          <div class="dialogTitle">Order Confirmation</div>
          <div class="dialogBody">
            <div>
              <label>Order Details</label>
              <div class="detail_box">
                <div>Unit Price:{{ orderDetail.price }}DMC</div>
                <div>Purchase Quantity:{{ formLine.quantity }}PST</div>
                <div>Purchase Cycle:{{ formLine.week }}Weeks</div>
                <div>Total Order Price:{{ orderDetail.total }} DMC</div>
              </div>
              <label>Deposit Amount:</label>
              <div
                class="formBox clearfix"
                style="margin-left: 20px; margin-top: 15px"
              >
                <el-input
                  v-model="formLine.prestoreDMC"
                  maxlength="6"
                  :placeholder="`Minimum pre-stored${(
                    orderDetail.total - orderDetail.deposit
                  ).toFixed(4)}`"
                  style="width: 270px"
                  @input="inputPrestoreDMC"
                  @blur="blurPrestoreDMC"
                >
                  <template #prefix>
                    <svg-icon icon-class="search" size="25"></svg-icon>
                  </template>
                  <template #suffix>
                    <span style="font-size: 16px">DMC</span>
                  </template>
                </el-input>
                <div
                  style="
                    margin-left: 15px;
                    font-size: 14px;
                    color: #ff6e6e;
                    margin-top: 5px;
                  "
                >
                  Estimated service time to
                  {{
                    orderDetail.serverTime ? orderDetail.serverTime : "--"
                  }}，about
                  {{ orderDetail.week ? orderDetail.week : "--" }} Weeks
                </div>
              </div>
              <label style="margin-top: 15px; display: inline-block"
                >Deposit:{{ orderDetail.deposit }}DMC</label
              >
              <div class="total">
                Total:
                {{ orderDetail.aggregate ? orderDetail.aggregate : "--" }} DMC
              </div>
              <div class="button">
                <el-button @click="dialogIsShow = false">Cancel</el-button>
                <el-button type="primary" :loading="loading" @click="submit"
                  >Buy</el-button
                >
              </div>
            </div>
          </div>
        </customDialog>
      </div>
    </div>
  </customDialog>

  <div class="viewContainer" v-if="!isShow">
    <div class="homeBox">
      <div class="homeBoxTitile">Order Filter List</div>

      <div class="hr"></div>

      <div class="topThreeOrder">
        <div class="threeOrder">
          <div class="rightOrigin"></div>
          <div class="rightCard card">
            <div style="text-align: center">
              <p class="PricingCard__Title">THREE</p>
              <h1 class="title">$25</h1>
              <p class="PricingCard__Subtext">
                per member, per month, billed monthly
              </p>
              <div class="PricingCard__FeatureWrapper">
                <div class="FeatureRow__Wrapper">
                  <el-icon><Select /></el-icon>
                  <p class="TextStyles__Caption">Free<span> courses</span></p>
                </div>
                <div class="FeatureRow__Wrapper">
                  <el-icon><Select /></el-icon>
                  <p class="TextStyles__Caption">
                    5 Premium<span> Videos</span>
                  </p>
                </div>
                <div class="FeatureRow__Wrapper">
                  <el-icon><Select /></el-icon>
                  <p class="TextStyles__Caption">
                    Notify me
                    <span>,Favorite</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oneOrder">
          <div class="centerOrigin"></div>
          <div class="centerCard card">
            <div style="text-align: center">
              <p class="PricingCard__Title">ONE</p>
              <h1 class="title">$19</h1>
              <p class="PricingCard__Subtext">per month, billed monthly</p>
              <div class="PricingCard__FeatureWrapper">
                <div class="FeatureRow__Wrapper">
                  <el-icon><Select /></el-icon>
                  <p class="TextStyles__Caption">
                    All courses<span> and videos</span>
                  </p>
                </div>
                <div class="FeatureRow__Wrapper">
                  <el-icon><Select /></el-icon>
                  <p class="TextStyles__Caption">
                    Source files<span>, ePub</span>
                  </p>
                </div>
                <div class="FeatureRow__Wrapper">
                  <el-icon><Select /></el-icon>
                  <p class="TextStyles__Caption">
                    Certificates<span>, Tests</span>
                  </p>
                </div>
                <div class="FeatureRow__Wrapper">
                  <el-icon><Select /></el-icon>
                  <p class="TextStyles__Caption">
                    Premium<span> tutorials</span>
                  </p>
                </div>
                <div class="FeatureRow__Wrapper">
                  <el-icon><Select /></el-icon>
                  <p class="TextStyles__Caption">
                    UI<span>, icons, illustrations</span>
                  </p>
                </div>
                <div class="FeatureRow__Wrapper">
                  <el-icon><Select /></el-icon>
                  <p class="TextStyles__Caption">Commercial<span> use</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="towOrder">
          <div class="leftOrigin"></div>
          <div class="leftCard card">
            <div style="text-align: center">
              <p class="PricingCard__Title">TOW</p>
              <h1 class="title">Free</h1>
              <p class="PricingCard__Subtext">Trial</p>
              <div class="PricingCard__FeatureWrapper">
                <div class="FeatureRow__Wrapper">
                  <el-icon><Select /></el-icon>
                  <p class="TextStyles__Caption">Free<span> courses</span></p>
                </div>
                <div class="FeatureRow__Wrapper">
                  <el-icon><Select /></el-icon>
                  <p class="TextStyles__Caption">
                    5 Premium<span> Videos</span>
                  </p>
                </div>
                <div class="FeatureRow__Wrapper">
                  <el-icon><Select /></el-icon>
                  <p class="TextStyles__Caption">
                    Notify me
                    <span>,Favorite</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="destroyBox">
        <div
          class="Img_box"
          v-for="(item, index) in filterOrderList"
          :key="index"
        >
          <div class="detailImg">
            <div class="detailImg_box" :class="returnBG(index)">
              <!-- <div class="detailImg_box_Img">
                <img class="box_Img" src="../../assets/_bg3.png" alt="" />
              </div> -->
              <div class="detailImg_box_text">
                <p>
                  Unit Price:<span>{{ item.price / 10000 }}DMC</span>
                </p>
                <p>
                  Deposit:<span
                    >{{ (item.price / 10000) * item.deposit_ratio }}DMC</span
                  >
                </p>
                <p>
                  Purchase Quantity:<span>{{ formLine.quantity }}PST</span>
                </p>
                <p>
                  Purchase Cycle:<span>{{ formLine.week }}</span>
                </p>
                <p>
                  Deposit Multiple:<span>{{ item.deposit_ratio }}</span>
                </p>
                <p>
                  Total Order Price:<span
                    >{{ computeTotalPrices(item) }}DMC</span
                  >
                </p>
                <p>
                  Custom Pledge Rate:<span>{{
                    Number(item.maker.benchmark_stake_rate) / 100
                  }}</span>
                </p>
                <p>{{ item.created_time }}</p>
              </div>
              <el-button
                type="primary"
                round
                style="margin-top: 40px; opacity: 0"
                @click="purchasePST(item)"
                >Buy</el-button
              >
            </div>
          </div>
        </div>
      </div>

      <customDialog v-model="dialogIsShow">
        <div class="dialogTitle">Order Confirmation</div>
        <div class="dialogBody">
          <div>
            <label>Order Details</label>
            <div class="detail_box">
              <div>Unit Price:{{ orderDetail.price }}DMC</div>
              <div>Purchase Quantity:{{ formLine.quantity }}PST</div>
              <div>Purchase Cycle:{{ formLine.week }}Weeks</div>
              <div>Total Order Price:{{ orderDetail.total }} DMC</div>
            </div>
            <label>Deposit Amount:</label>
            <div
              class="formBox clearfix"
              style="margin-left: 20px; margin-top: 15px"
            >
              <el-input
                v-model="formLine.prestoreDMC"
                maxlength="6"
                :placeholder="`Minimum pre-stored${(
                  orderDetail.total - orderDetail.deposit
                ).toFixed(4)}`"
                style="width: 270px"
                @input="inputPrestoreDMC"
                @blur="blurPrestoreDMC"
              >
                <template #prefix>
                  <svg-icon icon-class="search" size="25"></svg-icon>
                </template>
                <template #suffix>
                  <span style="font-size: 16px">DMC</span>
                </template>
              </el-input>
              <div
                style="
                  margin-left: 15px;
                  font-size: 14px;
                  color: #ff6e6e;
                  margin-top: 5px;
                "
              >
                Estimated service time to
                {{
                  orderDetail.serverTime ? orderDetail.serverTime : "--"
                }}，about {{ orderDetail.week ? orderDetail.week : "--" }} Weeks
              </div>
            </div>
            <label style="margin-top: 15px; display: inline-block"
              >Deposit:{{ orderDetail.deposit }}DMC</label
            >
            <div class="total">
              Total:
              {{ orderDetail.aggregate ? orderDetail.aggregate : "--" }} DMC
            </div>
            <div class="button">
              <el-button @click="dialogIsShow = false">Cancel</el-button>
              <el-button type="primary" :loading="loading" @click="submit"
                >Buy</el-button
              >
            </div>
          </div>
        </div>
      </customDialog>
    </div>
  </div>
</template>

<script setup>
import {
  getCurReferenceRate,
  getOrderFilterList,
  buyOrder,
} from "@/api/order/filterOrder.js";

import { transferTime, ChinaTime4 } from "@/utils/ChinaStandardTime.js";
import customDialog from "@/components-V3/customDialog";
import { ElMessage } from "element-plus";
import { reactive, toRefs, ref, onMounted, watch, computed, inject } from "vue";
import { useStore } from "vuex";

const store = useStore();

const ChainId = computed(() => store.getters.ChainId);
const username = computed(() => store.getters.userInfo?.dmc);
let loading = ref(false);
let dialogIsShow = ref(false);
let curReferenceRate = ref(0);

let isShow = ref(true);
let userDMC = ref(1);
const state = reactive({
  formLine: {
    week: "",
    quantity: "",
    prestoreDMC: "",
  },

  filterOrderList: [],
  orderDetail: {
    orderID: "",
    price: "",
    total: "",
    deposit: "",
    aggregate: "",
    week: "",
    serverTime: "",
  },
});
const { formLine, filterOrderList, orderDetail } = toRefs(state);

const totalPrice = computed(() => {
  let MinPrice =
    Number(state.formLine.quantity) *
    0.7 *
    Number(curReferenceRate.value).toFixed(4);
  let MaxPrice =
    Number(state.formLine.quantity) *
    1.3 *
    Number(curReferenceRate.value).toFixed(4);
  if (MinPrice == 0 && MaxPrice == 0) {
    return "";
  } else {
    let obj = {
      MinPrice: Math.round(MinPrice * 10000) / 10000,
      MaxPrice: Math.round(MaxPrice * 10000) / 10000,
    };
    return obj;
  }
});

// watch(curReferenceRate, (newVal) => {
//   state.selectionOption["2"].min = Math.round(newVal * 1000 * 0.8) / 1000;
//   state.selectionOption["2"].max = Math.round(newVal * 1000 * 1.2) / 1000;
//   state.selectionOption["3"].min = Math.round(newVal * 1000 * 0.7) / 1000;
//   state.selectionOption["3"].max = Math.round(newVal * 1000 * 1.3) / 1000;
// });
function filterOrder() {
  let params = {
    username: username.value,
    unmatchedAmount: state.formLine.quantity,
    period: state.formLine.week,
  };
  // if (state.formLine.priceSection) {
  //   params.minPrice = state.selectionOption[state.formLine.priceSection].min;
  //   params.maxPrice = state.selectionOption[state.formLine.priceSection].max;
  // }
  loading.value = true;
  getOrderFilterList(params)
    .then((res) => {
      if (res.code == 200) {
        for (const item of res.data) {
          item.created_time = transferTime(item.created_time);
        }
        state.filterOrderList = res.data;
        isShow.value = false;
        loading.value = false;
      }
    })
    .catch((error) => {
      loading.value = false;
    });
}
function blurPrestoreDMC() {
  if (state.formLine.prestoreDMC == "") {
    ElMessage({
      message: `The deposit amount cannot be empty`,
      type: "warning",
      grouping: true,
    });
    return false;
  } else if (
    state.formLine.prestoreDMC <
    state.orderDetail.total - state.orderDetail.deposit
  ) {
    ElMessage({
      message: `The deposit amount cannot be less than${(
        state.orderDetail.total - state.orderDetail.deposit
      ).toFixed(4)}`,
      type: "warning",
      grouping: true,
    });
    return false;
  } else {
    return true;
  }
}

function inputPrestoreDMC(text) {
  text = text.replace(/[^0-9\.]/g, "");
  state.formLine.prestoreDMC = text;
  state.orderDetail.week = Math.round(text / state.orderDetail.price);
  if (state.orderDetail.week) {
    state.orderDetail.serverTime = ChinaTime4(
      state.orderDetail.week * 7,
      "YYYY-MM-DD"
    );
  } else {
    state.orderDetail.serverTime = "";
  }

  state.orderDetail.aggregate = (
    Number(state.formLine.prestoreDMC) + Number(state.orderDetail.deposit)
  ).toFixed(4);
}

function computeTotalPrices(item) {
  let total =
    (item.price / 10000) * state.formLine.week +
    (item.price / 10000) * item.deposit_ratio;
  total = Math.round(total * 10000) / 10000;
  return total.toFixed(4);
}

function loadCurReferenceRate() {
  getCurReferenceRate().then((res) => {
    if (res.code == 200) {
      curReferenceRate.value = res.data;
    }
  });
}
function purchasePST(item) {
  state.orderDetail.orderID = item.id;
  state.orderDetail.price = (item.price / 10000).toFixed(4);
  state.orderDetail.total = computeTotalPrices(item);
  state.orderDetail.deposit = (
    (item.price / 10000) *
    item.deposit_ratio
  ).toFixed(4);
  dialogIsShow.value = true;
}

function returnBG(index) {
  if (index <= 20) {
    return `bg${index}`;
  } else {
    return `bg${index % 20}`;
  }
}

async function submit() {
  let flag = await blurPrestoreDMC();
  if (flag) {
    loading.value = true;
    let params = {
      username: username.value,
      chainId: ChainId.value, //chainId
      billId: state.orderDetail.orderID,
      period: state.formLine.week,
      benchmarkPrice: curReferenceRate.value,
      // priceRange: state.formLine.priceSection,
      unmatchedAmount: state.formLine.quantity,
      totalPrice: state.orderDetail.aggregate,
    };

    switch (state.formLine.priceSection) {
      case 0:
        params.priceRange = 3;
        break;
      case "2":
        params.priceRange = 1;
        break;
      case "3":
        params.priceRange = 2;
        break;
    }

    buyOrder(params)
      .then((res) => {
        if (res.code == 200) {
          state.formLine.prestoreDMC = "";
          dialogIsShow.value = false;
          loading.value = false;
          ElMessage({
            message: `Successful Purchase!`,
            type: "success",
            grouping: true,
          });
        }
      })
      .catch((error) => {
        loading.value = false;
      });
  }
}

onMounted(() => {
  loadCurReferenceRate();
});
</script>

<style lang="scss" scoped src="@/static/style/bg.scss"></style>

<style lang="scss" scoped>
::v-deep {
  .el-input-number__decrease {
    border-right: 1.5px solid #a7a1c7;
  }

  .el-input-number__increase {
    border-left: 1.5px solid #a7a1c7;
  }

  .el-input-number__decrease,
  .el-input-number__increase {
    background-color: transparent;
  }
}

.viewContainer {
  padding-top: 10px;
}

.homeBox {
  background-color: rgb(242, 246, 255, 0.25);
  border-radius: 20px;
  min-height: calc(100vh - 200px);
  overflow: hidden;
  padding: 15px 30px;
  padding-bottom: 100px;
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

    .el-button:hover {
      transform: scale(1.1);
    }
  }
}

.hr {
  width: 100%;
  height: 6px;
  background: #ececec;
  background: linear-gradient(120deg, rgb(224, 195, 252), rgb(142, 197, 252))
    rgb(255, 255, 255);
  margin-top: 30px;
}

.topThreeOrder,
.topThreeOrder* {
  transition: all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
}

.topThreeOrder {
  display: grid;
  grid-template-columns: auto auto auto;
  gap: 4px;
  max-width: 1440px;
  margin: 100px auto;

  .card {
    .title {
      font-style: normal;
      font-size: 60px;
      margin: 0px;
      color: rgb(0, 0, 0);
      font-weight: 600;
      line-height: 95px;
      text-rendering: optimizeLegibility;
      font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
        Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      padding: 0;
    }

    .PricingCard__Title {
      font-style: normal;
      font-weight: 600;
      font-size: 15px;
      line-height: 18px;
      text-transform: uppercase;
      margin: 0px;
      color: rgba(0, 0, 0, 0.7);
    }

    .PricingCard__Subtext {
      font-style: normal;
      font-weight: 500;
      font-size: 15px;
      line-height: 18px;
      color: rgba(0, 0, 0, 0.7);
      max-width: 200px;
      margin: 0px auto;
      padding: 0;
    }

    .PricingCard__FeatureWrapper {
      display: grid;
      row-gap: 8px;
      width: fit-content;
      margin: 23px auto 0px;

      .FeatureRow__Wrapper {
        display: grid;
        grid-template-columns: 24px auto;
        text-align: left;

        .TextStyles__Caption {
          font-style: normal;
          font-weight: bold;
          font-size: 15px;
          line-height: 18px;
          color: rgb(0, 0, 0);
          margin: auto 0px auto 16px;
          padding: 0px;

          & > span {
            font-weight: normal;
          }
        }
      }
    }
  }

  .towOrder {
    position: relative;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;

    .leftOrigin {
      transform-origin: left top;
      position: absolute;
      max-width: 360px;
      width: 100%;
      height: 426px;
      background: linear-gradient(
        rgba(108, 207, 238, 0.5) 0%,
        rgba(76, 127, 228, 0.5) 100%
      );
      border-radius: 0px 60px 60px;
      transform: matrix(0.99, -0.14, 0.15, 0.99, 0, 0);
      transform-origin: left top;
      z-index: -1;
      transition: all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
    }

    .leftCard {
      max-width: 360px;
      min-width: 240px;
      width: 100%;
      height: 426px;
      background: rgba(255, 255, 255, 0.3);
      box-shadow: rgb(24 32 79 / 25%) 0px 40px 80px,
        rgb(255 255 255 / 50%) 0px 0px 0px 0.5px inset;
      backdrop-filter: blur(40px);
      padding: 50px 20px;
      border-radius: 0px 60px 60px;
      z-index: 2;
      transition: all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
    }
  }

  .towOrder:hover {
    .leftOrigin {
      transform: skewX(10deg) skewY(-20deg) scaleX(0.8) translateY(-3px);
    }

    .leftCard {
      box-shadow: rgb(24 32 79 / 25%) 0px 100px 100px,
        rgb(255 255 255 / 50%) 0px 0px 0px 0.5px inset;
      transform: translateY(-3px);
    }
  }

  .oneOrder {
    position: relative;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;

    .centerOrigin {
      position: absolute;
      width: 100%;
      max-width: 380px;
      height: 519px;
      background: linear-gradient(
        rgb(47, 184, 255) 0%,
        rgb(158, 236, 217) 100%
      );
      border-radius: 60px 60px 60px 0px;
      transform: matrix(1, 0.14, 0, 0.99, 0, 0);
      transform-origin: left bottom;
      z-index: -1;
      transition: all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
    }

    .centerCard {
      min-width: 240px;
      width: 100%;
      background: rgba(255, 255, 255, 0.3);
      box-shadow: rgb(24 32 79 / 25%) 0px 40px 80px,
        rgb(255 255 255 / 50%) 0px 0px 0px 0.5px inset;
      backdrop-filter: blur(40px);
      padding: 50px 20px;
      max-width: 380px;
      height: 519px;
      border-radius: 60px 60px 60px 0px;
      z-index: 2;
      transition: all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
    }
  }

  .oneOrder:hover {
    .centerOrigin {
      transform: skewX(-10deg) skewY(20deg) scaleX(0.8) translateY(-3px);
    }

    .centerCard {
      box-shadow: rgb(24 32 79 / 25%) 0px 100px 100px,
        rgb(255 255 255 / 50%) 0px 0px 0px 0.5px inset;
      transform: translateY(-3px);
    }
  }

  .threeOrder {
    position: relative;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;

    .rightOrigin {
      position: absolute;
      max-width: 360px;
      width: 100%;
      height: 426px;
      background: linear-gradient(
        rgb(115, 184, 249) 11.94%,
        rgb(203, 216, 241) 80.98%
      );
      border-radius: 60px 0px 60px 60px;
      transform: matrix(0.99, 0.14, -0.15, 0.99, 0, 0);
      transform-origin: right top;
      z-index: -1;
      transition: all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
    }

    .rightCard {
      max-width: 360px;
      min-width: 240px;
      width: 100%;
      height: 426px;
      background: rgba(255, 255, 255, 0.3);
      box-shadow: rgb(24 32 79 / 25%) 0px 40px 80px,
        rgb(255 255 255 / 50%) 0px 0px 0px 0.5px inset;
      backdrop-filter: blur(40px);
      padding: 50px 20px;
      border-radius: 60px 0px 60px 60px;
      z-index: 2;
      transition: all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
    }
  }

  .threeOrder:hover {
    .rightOrigin {
      transform: skewX(-10deg) skewY(20deg) scaleX(0.8) translateY(-3px);
    }

    .rightCard {
      box-shadow: rgb(24 32 79 / 25%) 0px 100px 100px,
        rgb(255 255 255 / 50%) 0px 0px 0px 0.5px inset;
      transform: translateY(-3px);
    }
  }
}

.destroyBox {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  justify-items: center;
  box-sizing: border-box;
  max-width: 1440px;
  margin: 0px auto;
}

::v-deep .el-button {
  transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
}

.Img_box {
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  transition: all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;

  .detailImg {
    margin-top: 20px;
    min-width: 280px;
  }
}

.Img_box:hover {
  transform: scale(1.05);

  ::v-deep .el-button {
    opacity: 1 !important;
  }
}

.detailImg_box {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  min-width: 200px;
  max-width: 320px;
  height: 360px;
  border-radius: 20px;
  padding: 20px;

  .detailImg_box_Img {
    height: 150px;
    margin: 0px auto;

    .box_Img {
      max-width: 200px;
      width: 100%;
      height: 150px;
      margin: 0px auto;
      opacity: 0;
      animation: 1s ease 0s 1 normal forwards running JBCopacity;
    }
  }

  .detailImg_box_text {
    position: relative;
    padding-top: 10px;

    & > p:not(:last-child) {
      font-style: normal;
      font-size: 18px;
      line-height: 160%;
      font-weight: bold;
      text-align: left;
      color: rgb(255, 255, 255);
      margin: 0px;

      // display: -webkit-box;
      // -webkit-line-clamp: 3;
      // -webkit-box-orient: vertical;
      // overflow: hidden;
      span {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.7);
      }
    }

    .transaction_id {
      color: rgb(255, 255, 255);
      margin: 0px;

      word-break: break-all;
      white-space: pre-wrap;
    }

    & > p:last-child {
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 18px;
      // text-align: center;
      text-align: left;

      color: rgba(255, 255, 255, 0.7);
      margin: 10px 0px 0px;
    }
  }
}

.dialogTitle {
  color: #ececec;
  text-align: center;
}

.dialogBody {
  margin-top: 25px;

  label {
    position: relative;
  }

  label::before {
    content: "* ";
    display: inline-block;
    position: absolute;
    color: rgb(116, 41, 28);
    width: 2px;
    top: 2px;
    left: -10px;
  }

  .detail_box {
    display: flex;
    flex-wrap: wrap;
    padding: 15px;

    & > div {
      min-width: 100%;
      flex: 1 0 auto;
      height: 25px;
      line-height: 25px;
    }
  }

  .total {
    width: 100%;
    height: 30px;
    line-height: 30px;
    margin-top: 15px;
    text-align: center;
    color: #ff6e6e;
  }

  .button {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin-top: 30px;
  }
}

.exceedMaxUserDMC {
  width: 100%;
  text-align: center;
  color: #ff6e6e;
  margin-top: 30px;
}
</style>
