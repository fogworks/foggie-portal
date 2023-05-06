<template>
  <div class="viewContainer">
    <div class="homeBox">
      <div class="homeBoxTitile">订单筛选列表</div>
      <div class="homeBoxHeader">
        <div class="homeBoxHeader-left">
          <div>
            <span style="font-size: 16px; margin-right: 5px">*請輸入購買週期</span>
            <el-input-number v-model.number="formLine.week" :min="24" placeholder="請輸入購買週期" />
            <span style="font-size: 16px; margin-left: 5px">周</span>
          </div>
          <div>
            <el-input v-model="formLine.quantity" placeholder="請輸入购买数量" style="width: 220px">
              <template #prefix>
                <svg-icon icon-class="search" size="25"></svg-icon>
              </template>
              <template #suffix>
                <span style="font-size: 16px">PST</span>
              </template>
            </el-input>
          </div>

          <div>
            <div style="
                                                          margin-top: -20px;
                                                          color: #ff6e6e;
                                                          font-size: 12px;
                                                          margin-left: 20px;
                                                        ">
              當前基準價:{{ Number(curReferenceRate).toFixed(4) }} DMC
            </div>
            <el-select v-model="formLine.priceSection" placeholder="請選擇理想價格區間" style="width: 360px">
              <el-option :label="`基準價正負20%： 約 ${selectionOption['2'].min} -- ${selectionOption['2'].max} DMC`"
                value="2" />
              <el-option :label="`基準價正負30%： 約 ${selectionOption['3'].min} -- ${selectionOption['3'].max} DMC`"
                value="3" />

              <el-option label="不限價格" :value="0" />
            </el-select>
          </div>
          <el-button style="margin-top: 23px" type="primary" round @click="filterOrder" :loading="loading">筛选</el-button>
        </div>
        <div class="homeBoxHeader-right clearfix">
          <el-button type="primary" round>重置</el-button>
        </div>
      </div>
      <div class="hr"></div>

      <div class="destroyBox">
        <div class="Img_box" v-for="(item, index) in filterOrderList" :key="index">
          <div class="detailImg">
            <div class="detailImg_box" :class="returnBG(index)">
              <!-- <div class="detailImg_box_Img">
                <img class="box_Img" src="../../assets/_bg3.png" alt="" />
              </div> -->
              <div class="detailImg_box_text">
                <p>
                  单价：<span>{{ item.price / 10000 }}DMC</span>
                </p>
                <p>
                  押金：<span>{{ (item.price / 10000) * item.deposit_ratio }}DMC</span>
                </p>
                <p>
                  购买数量：<span>{{ formLine.quantity }}PST</span>
                </p>
                <p>
                  购买周期：<span>{{ formLine.week }}</span>
                </p>
                <p>
                  押金倍數：<span>{{ item.deposit_ratio }}</span>
                </p>
                <p>
                  訂單總價：<span>{{ computeTotalPrices(item) }}DMC</span>
                </p>
                <p>
                  自定義質押率：<span>{{
                    Number(item.maker.benchmark_stake_rate) / 100
                  }}</span>
                </p>
                <p>{{ item.created_time }}</p>
              </div>
              <el-button type="primary" round style="margin-top: 40px; opacity: 0"
                @click="purchasePST(item)">购买</el-button>
            </div>
          </div>
        </div>
      </div>

      <customDialog v-model="dialogIsShow">
        <div class="dialogTitle">訂單確認</div>
        <div class="dialogBody">
          <div>
            <label>订单详情</label>
            <div class="detail_box">
              <div>單價：{{ orderDetail.price }}DMC</div>
              <div>購買數量：{{ formLine.quantity }}PST</div>
              <div>購買周期：{{ formLine.week }}週</div>
              <div>訂單總價：{{ orderDetail.total }} DMC</div>
            </div>
            <label>预存金额:</label>
            <div class="formBox clearfix" style="margin-left: 20px; margin-top: 15px">
              <el-input v-model="formLine.prestoreDMC" maxlength="6" :placeholder="`最少预存${(
                  orderDetail.total - orderDetail.deposit
                ).toFixed(4)}`" style="width: 270px" @input="inputPrestoreDMC" @blur="blurPrestoreDMC">
                <template #prefix>
                  <svg-icon icon-class="search" size="25"></svg-icon>
                </template>
                <template #suffix>
                  <span style="font-size: 16px">DMC</span>
                </template>
              </el-input>
              <div style="
                                                            margin-left: 15px;
                                                            font-size: 14px;
                                                            color: #ff6e6e;
                                                            margin-top: 5px;
                                                          ">
                預計服務時間至
                {{ orderDetail.serverTime ? orderDetail.serverTime : "--" }}，約
                {{ orderDetail.week ? orderDetail.week : "--" }} 週
              </div>
            </div>
            <label style="margin-top: 15px; display: inline-block">押金:{{ orderDetail.deposit }}DMC</label>
            <div class="total">
              總計:
              {{ orderDetail.aggregate ? orderDetail.aggregate : "--" }} DMC
            </div>
            <div class="button">
              <el-button @click="dialogIsShow = false">取消</el-button>
              <el-button type="primary" :loading="loading" @click="submit">购买</el-button>
            </div>
          </div>
        </div>
      </customDialog>
    </div>
  </div>
</template>

<script setup>
import { getCurReferenceRate, getOrderFilterList, buyOrder } from "@/api/order/filterOrder.js";
import { transferTime, ChinaTime4 } from "@/utils/ChinaStandardTime.js";
import customDialog from "@/components-V3/customDialog";
import { getChain_id } from "@/api/common.js";
import { ElMessage } from "element-plus";
import {
  h,
  shallowRef,
  reactive,
  toRefs,
  ref,
  onMounted,
  watch,
  computed,
  inject
} from "vue";
import { switchCase } from "@babel/types";

import { useStore } from "vuex";

const store = useStore()

const ChainId = computed(() => store.getters.ChainId)
const username = computed(() => store.getters.userInfo?.dmc)
const email = computed(() => store.getters.userInfo?.email);
let loading = ref(false);
let dialogIsShow = ref(false); // 弹窗是否展示
let curReferenceRate = ref(0);  //当前基准率

const state = reactive({
  formLine: {
    week: "", //购买周期
    quantity: "", //pst数量
    priceSection: "", // 选择的价格区间 2 3 0
    prestoreDMC: "", // 预存DMC
  },
  selectionOption: {
    2: {
      min: "",
      max: "",
    },
    3: {
      min: "",
      max: "",
    },
  },
  filterOrderList: [], // 筛选出来的订单列表
  orderDetail: {
    orderID: '',
    price: "", // 订单单价
    total: "", //订单总价
    deposit: "", //订单押金
    aggregate: "", // 总计
    week: "", //预计多少周
    serverTime: "", //预计服务时间
  }, //订单详情
});
const { formLine, selectionOption, filterOrderList, orderDetail } =
  toRefs(state);

watch(curReferenceRate, (newVal) => {
  state.selectionOption["2"].min = Math.round(newVal * 1000 * 0.8) / 1000;
  state.selectionOption["2"].max = Math.round(newVal * 1000 * 1.2) / 1000;
  state.selectionOption["3"].min = Math.round(newVal * 1000 * 0.7) / 1000;
  state.selectionOption["3"].max = Math.round(newVal * 1000 * 1.3) / 1000;
});
/* 筛选订单 */
function filterOrder() {
  let params = {
    username: username.value, //测试时可以为空，空则取默认的用户名tianbao12345
    unmatchedAmount: state.formLine.quantity, //pst数量
    period: state.formLine.week, //购买周期
  };
  if (state.formLine.priceSection) {
    params.minPrice = state.selectionOption[state.formLine.priceSection].min//最低价，单位DMC
    params.maxPrice = state.selectionOption[state.formLine.priceSection].max //最高价，单位DMC
  }
  loading.value = true;
  getOrderFilterList(params)
    .then((res) => {
      if (res.code == 200) {
        for (const item of res.data) {
          item.created_time = transferTime(item.created_time);
        }

        state.filterOrderList = res.data;
        loading.value = false;
      }
    })
    .catch((error) => {
      loading.value = false;
    });
}
function blurPrestoreDMC() {

  if (state.formLine.prestoreDMC == '') {
    ElMessage({
      message: `预存金额不能为空`,
      type: "warning",
      grouping: true,
    });
    return false
  } else if (state.formLine.prestoreDMC < state.orderDetail.total - state.orderDetail.deposit) {
    ElMessage({
      message: `预存金额不能小于${(state.orderDetail.total - state.orderDetail.deposit).toFixed(4)}`,
      type: "warning",
      grouping: true,
    });
    return false

  } else {
    return true
  }

}

/* 当预存金额改变时触发 处理总计 和预计服务时间 */
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
    state.orderDetail.serverTime = ''
  }


  state.orderDetail.aggregate = (
    Number(state.formLine.prestoreDMC) + Number(state.orderDetail.deposit)
  ).toFixed(4);
}

/* 计算 总价 */
function computeTotalPrices(item) {
  let total =
    (item.price / 10000) * state.formLine.week +
    (item.price / 10000) * item.deposit_ratio;
  total = Math.round(total * 10000) / 10000;
  return total.toFixed(4);
}

/* 获取基准率 */
function loadCurReferenceRate() {
  getCurReferenceRate().then((res) => {
    if (res.code == 200) {
      curReferenceRate.value = res.data;
    }
  });
}
/* 购买PST */
function purchasePST(item) {
  state.orderDetail.orderID = item.id
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
  let flag = await blurPrestoreDMC()
  if (flag) {
    loading.value = true
    let params = {
      username: username.value, //测试时可以为空，空则取默认的用户名tianbao12345
      chainId: ChainId.value,  //chainId
      email: email.value,
      billId: state.orderDetail.orderID,    //挂单的id
      period: state.formLine.week,     //购买周期，大于等于24
      benchmarkPrice: curReferenceRate.value, //基准价格，单位DMC
      // priceRange: state.formLine.priceSection,      //1  基准价格正负浮动20% ； 2 基准价格正负浮动30%
      unmatchedAmount: state.formLine.quantity,  //购买PST数量
      totalPrice: state.orderDetail.aggregate,       //总价，单位 DMC
    }
    switch (state.formLine.priceSection) {
      case 0:
        params.priceRange = 3
        break;
      case "2":
        params.priceRange = 1
        break;
      case "3":
        params.priceRange = 2
        break;

    }

    buyOrder(params).then(res => {
      if (res.code == 200) {
        state.formLine.prestoreDMC = ''
        dialogIsShow.value = false
        loading.value = false
        ElMessage({
          message: `购买成功！`,
          type: "success",
          grouping: true,
        });
      }
    }).catch(error => {
      loading.value = false

    })




  }
}

function loadChainId() {
  getChain_id().then((res) => {
    if (res.code == 200) {
      store.commit("clientGlobal/SAVE_ChainId", res.data);
    }
  });
}

onMounted(() => {
  loadCurReferenceRate();
  loadChainId()

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
  min-height: calc(100vh - 350px);
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

.homeBoxHeader-left>div {
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
  background: linear-gradient(120deg, rgb(224, 195, 252), rgb(142, 197, 252)) rgb(255, 255, 255);
  margin-top: 30px;
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

    &>p:not(:last-child) {
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

    &>p:last-child {
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

    &>div {
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
</style>
