<template>
  <div class="viewContainer index_box">
    <!-- <iframe src="http://154.31.41.36:9876/#/order" style="width:1000px;height:1000px"></iframe> -->
    <div class="index_box_div">
      <div class="box-title">
        <label
          :class="
            buyType === 'year' ? 'title-label title-label-check' : 'title-label'
          "
        >
          <p class="check-p check-month" @click="typeChoose('monthly')">
            Monthly
          </p>
          <p class="check-p check-year" @click="typeChoose('annual')">Annual</p>
          <span class="white-span"></span>
        </label>
      </div>
      <div class="index-notice">
        <img class="" src="@/assets/index/notice.png" />
        Adopt now to get 7 Days of Foggie FREE and obtain DMC rewards*
        immediately!
      </div>
      <div class="box-content">
        <div class="product-box" v-for="(item, index) in dataList" :key="index">
          <div
            :class="
              item.isHaveStock
                ? 'product-info-box'
                : 'product-info-box no-stock'
            "
          >
            <div class="product-value" style="text-align: center">
              {{ index == 0 ? "Basic" : "Premium" }}
            </div>
            <div class="product-tags">
              <div class="product-tag-item2">
                <span class="price">
                  {{ item.unitSymbol }}
                  {{
                    buyType === "month" ? item.last_monthly : item.last_annually
                  }}
                </span>
                /{{ buyType === "month" ? " month" : " year" }}
              </div>
            </div>
            <div class="product-actions2">
              <el-tooltip
                class="item"
                effect="dark"
                content="Data acquisition in progress..."
                v-if="gettingPayInfo"
                placement="bottom"
              >
                <button
                  class="subscribe-div-btn"
                  @click="toPay(item, 'notfree', item.isHaveStock)"
                >
                  <!-- <div class="subscribe-icon">
                    <div class="free_icon">
                      <img src="@/assets/order/buy.png" alt="Activation" />
                    </div>
                  </div> -->
                  <div class="subscribe-btn">
                    <p>Buy</p>
                  </div>
                </button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="Insufficient inventory, please wait patiently"
                v-else-if="!item.isHaveStock"
                placement="bottom"
              >
                <button
                  class="subscribe-div-btn"
                  @click="toPay(item, 'notfree', item.isHaveStock)"
                >
                  <!-- <div class="subscribe-icon">
                    <div class="free_icon">
                      <img src="@/assets/order/buy.png" alt="Activation" />
                    </div>
                  </div> -->
                  <div class="subscribe-btn">
                    <p>Buy</p>
                  </div>
                </button>
              </el-tooltip>
              <button
                v-else-if="item.isHaveStock"
                class="subscribe-div-btn"
                @click="toPay(item, 'notfree', item.isHaveStock)"
              >
                <!-- <div class="subscribe-icon">
                  <div class="free_icon">
                    <img src="@/assets/order/buy.png" alt="Activation" />
                  </div>
                </div> -->
                <div class="subscribe-btn">
                  <p>Buy</p>
                </div>
              </button>
              <!-- <div class="product-action-pay" @click="toPay(item, 'notfree', item.isHaveStock)">{{ $t('index.adoptBtn') }}</div> -->
              <el-tooltip
                class="item"
                effect="dark"
                content="Data acquisition in progress..."
                v-if="gettingPayInfo"
                placement="bottom"
              >
                <div class="product-action-free">Free trial</div>
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="Payment bill already exists, unable to try for free"
                v-else-if="everOrder"
                placement="bottom"
              >
                <div class="product-action-free">Free trial</div>
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="Insufficient inventory, please wait patiently"
                v-else-if="suspendFree"
                placement="bottom"
              >
                <div class="product-action-free">Free trial</div>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="Insufficient inventory, please wait patiently"
                v-else-if="!item.isHaveStock"
                placement="bottom"
              >
                <div
                  class="product-action-free"
                  @click="toFree(item, item.isHaveStock)"
                >
                  Free trial
                </div>
              </el-tooltip>
              <div
                class="product-action-free"
                v-else-if="item.isHaveStock"
                @click="toFree(item, item.isHaveStock)"
              >
                Free trial
              </div>
            </div>
          </div>
          <div class="product-bg-info2">
            <div class="product-bg-line">
              <img src="@/assets/index/product_ok.png" />
              <span>2 CPU 4 Thread Processor</span>
            </div>
            <div class="product-bg-line">
              <img src="@/assets/index/product_ok.png" />
              <span>4 GB RAM</span>
            </div>
            <div class="product-bg-line">
              <img src="@/assets/index/product_ok.png" />
              <span>30 mbps Optimized Bandwidth</span>
            </div>
            <div class="product-bg-line">
              <img src="@/assets/index/product_ok.png" />
              <span>Independent Static IP Address</span>
            </div>
            <div class="product-bg-line">
              <img src="@/assets/index/product_ok.png" />
              <span>
                <span :style="{ 'font-weight': index == 1 ? 600 : 'unset' }">
                  {{ index == 0 ? "80" : "130" }}
                </span>
                <span>GB High Performance SSD</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="Order" v-model="payVisible" class="p_box">
      <!-- SubOrder -->
      <div v-if="payItems && payItems.order_sn" class="order_item_box">
        <div class="order_item">
          <div class="order_key">Price</div>
          <!-- <div class="order_value" v-if="buyType === 'month'">
            {{ activeProduct.unit === "dollar" ? "$" : "￥"
            }}{{ activeProduct.last_monthly }} (Foggie NFT + 1 month Foggie rent fee)
          </div> -->
          <div class="order_value" v-if="buyType === 'month'">
            {{ activeProduct.unit === "dollar" ? "$" : "￥"
            }}{{ activeProduct.last_monthly }}
          </div>
          <!-- <div class="order_value" v-if="buyType === 'year'">
            {{ activeProduct.unit === "dollar" ? "$" : "￥"
            }}{{ activeProduct.last_annually }} (Foggie NFT + 1 year Foggie rent fee)
          </div> -->
          <div class="order_value" v-if="buyType === 'year'">
            {{ activeProduct.unit === "dollar" ? "$" : "￥"
            }}{{ activeProduct.last_annually }}
          </div>
        </div>
        <div class="order_item">
          <div class="order_key">Order ID:</div>
          <div class="order_value">{{ payItems.order_sn }}</div>
        </div>
        <div class="p_line"></div>
      </div>

      <div class="p_buy">
        <el-radio-group v-model="payModel" size="large">
          <el-radio label="card" class="squartCard squartCard-pay">
            <img src="@/assets/card0.png" />
          </el-radio>
          <el-radio label="blockchain" class="squartCard squartCard-pay">
            Digital Currency
          </el-radio>
        </el-radio-group>
        <el-radio-group
          v-model="payBlockChainModel"
          v-if="payModel === 'blockchain'"
          class="blockchain-radio"
          size="large"
        >
          <!-- <el-tooltip class="item" effect="dark" content="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" placement="top-start">
            <el-radio label="usdc"
              class="squartCard">
              <img src="@/assets/order/icon-eth-usdc.webp" />
              USDC (ETH)
            </el-radio>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="0xdAC17F958D2ee523a2206206994597C13D831ec7" placement="top-start">
            <el-radio label="usdt"
              class="squartCard">
              <img src="@/assets/order/icon-eth-usdt.webp" />
              USDT (ETH)
            </el-radio>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56" placement="top-start">
            <el-radio label="busd"
                    class="squartCard">
              <img src="@/assets/order/icon-bsc-busd.webp" />
              BUSD (BSC)
            </el-radio>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="0x55d398326f99059fF775485246999027B3197955" placement="top-start">
            <el-radio label="bsc_usd"
                    class="squartCard">
              <img src="@/assets/order/icon-bsc-usdt.webp" />
              USDT (BSC)
            </el-radio>
          </el-tooltip> -->
          <el-radio label="usdc" class="squartCard">
            <img src="@/assets/order/icon-eth-usdc.webp" />
            USDC (ETH)
          </el-radio>
          <el-radio label="usdt" class="squartCard">
            <img src="@/assets/order/icon-eth-usdt.webp" />
            USDT (ETH)
          </el-radio>
          <el-radio label="busd" class="squartCard">
            <img src="@/assets/order/icon-bsc-busd.webp" />
            BUSD (BSC)
          </el-radio>
          <el-radio label="bsc_usd" class="squartCard">
            <img src="@/assets/order/icon-bsc-usdt.webp" />
            USDT (BSC)
          </el-radio>
          <!-- <el-tooltip class="item" effect="dark" content="xxxx" placement="top-start">
            <el-radio label="vofo"
              class="squartCard">
              VOFO   
            </el-radio>
          </el-tooltip> -->
        </el-radio-group>
      </div>
      <el-switch
        class="coupon-pay-switch"
        v-model="is_use_coupon"
        active-text="Clip Coupons"
      >
      </el-switch>
      <el-input
        class="coupon-number-input"
        v-if="is_use_coupon"
        v-model="coupon_number"
        @change="couponChange"
        placeholder="Enter the coupon number to get a 10% discount"
      >
        ></el-input
      >
      <p
        class="coupon-number-error"
        v-if="is_use_coupon && is_coupon_error_pay"
      >
        Please enter the correct coupon number
      </p>
      <div slot="footer" class="dialog-footer renewal-footer">
        <div class="pay-with-dmc">
          * After successful payment,you can get DMC reward.
        </div>
        <el-button @click="payVisible = false">Cancel</el-button>
        <el-button type="primary" v-if="payModel === 'card'" @click="payByCard"
          >Confirm</el-button
        >
        <el-button
          type="primary"
          v-if="payModel === 'blockchain'"
          @click="toOrderTransaction"
          >Confirm</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { transferTime, ChinaTime4 } from "@/utils/ChinaStandardTime.js";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  h,
  shallowRef,
  reactive,
  toRefs,
  ref,
  onMounted,
  watch,
  computed,
  inject,
} from "vue";
import {
  getProduct,
  addOrder,
  payStripe,
  openOrder,
  createDiD,
  getDiD,
  globalConfig,
  productStock,
  getExchangeRate,
  getWalletAccounts,
  transactions,
  orderTransaction,
  getOrderTransaction,
  check_coupon_number,
  get_user_all_active_order,
} from "@/api/shop/index.js";
// import {getToken} from '@/utils/auth'
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const $router = useRouter();
const store = useStore();

const token = computed(() => store.getters["token/token"]);

// const username = computed(() => store.getters.userInfo?.dmc);
const email = computed(() => store.getters.userInfo?.email);
const user_id = computed(() => store.getters.userInfo?.user_id);
const state = reactive({
  buyType: "month",
  dataList: [],
  usdcRate: "",
  busdRate: "",
  usdtRate: "",
  bsc_usdRate: "",
  blockChainPayVisible: false,
  payVisible: false,
  everOrder: false,
  activeProduct: {},
  currentComfirmItem: {},
  payItems: {},
  buyModel: "card",
  payBlockChainModel: "usdc",
  is_use_coupon: false,
  coupon_number: "",
  suspendFree: false,
  productList: [],
  pay_address: "",
  gettingPayInfo: false,
  vofoRate: 1,
  is_coupon_error_pay: false,
  payment_cloud_trans_id: "",
  payment_cloud_show: false,
  payment_cloud_amount: "",
  blockChainData: {},
});
const {
  buyType,
  dataList,
  usdcRate,
  busdRate,
  usdtRate,
  bsc_usdRate,
  blockChainPayVisible,
  payVisible,
  everOrder,
  activeProduct,
  currentComfirmItem,
  buyModel,
  suspendFree,
  productList,
  pay_address,
  gettingPayInfo,
  vofoRate,
  payItems,
  payBlockChainModel,
  is_use_coupon,
  coupon_number,
  is_coupon_error_pay,
  payment_cloud_trans_id,
  payment_cloud_show,
  payment_cloud_amount,
  blockChainData,
} = toRefs(state);
function typeChoose(type) {
  if (type === "monthly") {
    buyType.value = "month";
  } else if (type === "annual") {
    buyType.value = "year";
  }
}
function couponChange(text) {
  // TODO verify coupon
  console.log("verify coupon", text);
  const reg = /^[a-zA-Z\d]{12}$/;
  if (!reg.test(text)) {
    // 提示不匹配
    is_coupon_error_pay.value = true;
    return;
  } else {
    is_coupon_error_pay.value = false;
  }
  // ajax 匹配是否被使用
  check_coupon_number(text).then((res) => {
    console.log("verify coupon", res);
    if (res.code !== 200) {
      is_coupon_error_pay.value = true;
    }
  });
}
function payByCard() {
  let item = payItems.value;
  let trans_id = item.order_transaction[item.order_transaction.length - 1].id;
  payment_cloud_trans_id.value = trans_id;
  payment_cloud_show.value = true;
  payVisible.value = false;
  payment_cloud_amount.value = coupon_number.value
    ? Number(currentComfirmItem.value.total_price) * 0.9
    : Number(currentComfirmItem.value.total_price);
}
function toOrderTransaction() {
  if (is_use_coupon.value && !coupon_number.value) {
    is_coupon_error_pay.value = true;
    return;
  }
  if (is_use_coupon.value && is_coupon_error_pay.value) {
    return;
  }
  let pay_item = payItems.value;
  let trans_id =
    pay_item.order_transaction[pay_item.order_transaction.length - 1].id;
  // let price_text = buyType === 'month' ?
  //   `$ ${activeProduct.last_monthly } (Foggie NFT + 1 month Foggie rent fee)`
  //   : `${activeProduct.last_annually} (Foggie NFT + 1 year Foggie rent fee)`;
  let price_text =
    buyType.value === "month"
      ? `$ ${activeProduct.value.last_monthly}`
      : `${activeProduct.value.last_annually}`;
  let price =
    buyType === "month"
      ? activeProduct.value.last_monthly
      : activeProduct.value.last_annually;
  blockChainData.value = {
    pay_item,
    trans_id,
    price,
    price_text,
    coupon_number: coupon_number.value,
    couponRate: coupon_number.value ? 0.9 : 1,
  };
  blockChainPayVisible.value = true;
  payVisible.value = false;
}
async function handleData(data) {
  let icons = ["light", "normal", "store", "qstore"];
  var list = [];
  dataList.value = [];
  for (let i = 0; i < data.length; i++) {
    // let stockData = await productStock(data[i].id);
    let pricing = data[i].pricing.trim().replace(/'/g, '"');
    pricing = JSON.parse(pricing);
    let params = data[i].product_customField;
    let str = [];
    let s1 = "",
      s2 = "",
      s3 = "",
      s4 = "",
      s5 = "";
    for (let a = 0; a < params.length; a++) {
      // let s1 = "";
      if (params[a].field_key === "cpu") {
        s1 = params[a].field_value + "CPU";
      } else if (params[a].field_key === "memory") {
        s2 = params[a].field_value + "G";
      } else if (params[a].field_key === "disk_type") {
        s3 = params[a].field_value.toUpperCase();
      } else if (params[a].field_key === "bandwidth") {
        s4 = params[a].field_value + "M";
      } else if (params[a].field_key === "disk_size") {
        s5 = params[a].field_value + "G";
      }
      // str.push(s1);
    }
    str = [s1, s2, s3, s4, s5];
    let last_annually =
      Number(pricing.annually) - Number(pricing.annually_discounted);
    // last_annually = (Math.floor(last_annually * 100) / 100).toFixed(2);
    last_annually = (numMulti(last_annually, 100) / 100).toFixed(2);
    let last_monthly =
      Number(pricing.monthly) - Number(pricing.monthly_discounted);
    // last_monthly = (Math.floor(last_monthly * 100) / 100).toFixed(2);
    last_monthly = (numMulti(last_monthly, 100) / 100).toFixed(2);

    let discounnt = Number(last_monthly) * 12 - Number(last_annually);

    let item = {
      name: data[i].name,
      unit: data[i].piece_unit,
      unitSymbol: data[i].piece_unit === "dollar" ? "$" : "￥",
      monthPrice: pricing.monthly,
      yeaPrice: pricing.annually,
      monthly_discounted: pricing.monthly_discounted,
      last_monthly: last_monthly,
      last_annually: last_annually,
      annually_discounted: pricing.annually_discounted,
      eth_monthly: pricing.eth_monthly,
      eth_annually: pricing.eth_annually,
      bnb_annually: pricing.bnb_annually,
      bnb_monthly: pricing.bnb_monthly,
      usdc_annually: (last_annually / usdcRate).toFixed(4),
      usdc_monthly: (last_monthly / usdcRate).toFixed(4),
      usdt_annually: (last_annually / usdtRate).toFixed(4),
      usdt_monthly: (last_monthly / usdtRate).toFixed(4),
      busd_annually: (last_annually / busdRate).toFixed(4),
      busd_monthly: (last_monthly / busdRate).toFixed(4),
      bsc_usd_annually: (last_annually / bsc_usdRate).toFixed(4),
      bsc_usd_monthly: (last_monthly / bsc_usdRate).toFixed(4),
      vofo_monthly: (last_monthly / vofoRate.value).toFixed(4),
      vofo_annually: (last_annually / vofoRate.value).toFixed(4),
      number:
        data[i].product_category && data[i].product_category.product_count,
      params: str.join(" + "),
      list_icon: icons[i % 4],
      id: data[i].id,
      publish_status: data[i].publish_status,
      category: data[i].product_category.name,
      remark: data[i].remark,
      product_category_id: data[i].product_category.id,
      paramsList: str,
      discounnt: discounnt,
      isTrial: false,
      backgroundVisible: false,
      tipsVisible: false,
      isHaveStock: data[i].stock && data[i].stock > 0,
      nft_level_label: i == 0 ? "Initial Release" : "Rare probability",
    };
    if (data[i].publish_status) {
      list.push(item);
      dataList.value.push(item);
    }
  }
}
function numMulti(num1, num2) {
  let baseNum = 0;
  try {
    baseNum += num1.toString().split(".")[1].length;
  } catch (e) {
    // console.log(e);
  }
  try {
    baseNum += num2.toString().split(".")[1].length;
  } catch (e) {
    // console.log(e);
  }
  return (
    (Number(num1.toString().replace(".", "")) *
      Number(num2.toString().replace(".", ""))) /
    Math.pow(10, baseNum)
  );
}
async function getExchange(type) {
  await getExchangeRate(type).then((res) => {
    let str = "";
    if (res && res.data && res.data.length > 0) {
      let len = res.data.length;
      str = res.data[len - 1] && res.data[len - 1][`${type}/USD`];
    }
    // console.log(str);
    if (type === "USDC") {
      usdcRate.value = Number(str).toFixed(4);
      upDateList("USDC");
    } else if (type === "BUSD") {
      busdRate.value = Number(str).toFixed(4);
      upDateList("BUSD");
    } else if (type === "USDT") {
      usdtRate.value = Number(str).toFixed(4);
      upDateList("USDT");
    } else if (type === "BSC_USD") {
      bsc_usdRate.value = Number(str).toFixed(4);
      upDateList("BSC_USD");
    }
  });
}
function upDateList(type) {
  for (let i = 0; i < dataList.value.length; i++) {
    if (dataList.value[i].last_monthly && dataList.value[i].last_annually) {
      if (type === "USDC") {
        dataList.value[i].usdc_monthly = (
          dataList.value[i].last_monthly / usdcRate.value
        ).toFixed(4);
        dataList.value[i].usdc_annually = (
          dataList.value[i].last_annually / usdcRate.value
        ).toFixed(4);
      } else if (type === "BUSD") {
        dataList.value[i].busd_monthly = (
          dataList.value[i].last_monthly / busdRate.value
        ).toFixed(4);
        dataList.value[i].busd_annually = (
          dataList.value[i].last_annually / busdRate.value
        ).toFixed(4);
      } else if (type === "USDT") {
        dataList.value[i].usdt_monthly = (
          dataList.value[i].last_monthly / usdtRate.value
        ).toFixed(4);
        dataList.value[i].usdt_annually = (
          dataList.value[i].last_annually / usdtRate.value
        ).toFixed(4);
      } else if (type === "BSC_USD") {
        dataList.value[i].bsc_usd_monthly = (
          dataList.value[i].last_monthly / bsc_usdRate.value
        ).toFixed(4);
        dataList.value[i].bsc_usd_annually = (
          dataList.value[i].last_annually / bsc_usdRate.value
        ).toFixed(4);
      }
    }
  }
}
function toFree(item, isHaveStock) {
  if (suspendFree.value) {
    console.log("suspendFree", suspendFree.value);
    return;
  }
  if (isHaveStock) {
    item.isTrial = true;
    toPay(item, "free", isHaveStock);
  }
}
async function toPay(item, isTrial, isHaveStock) {
  if (isHaveStock) {
    item.buyType = buyType.value;
    window.localStorage.removeItem("activeOrderItems");
    // $router.push("/comfirmOrder");
    activeProduct.value = item;
    window.localStorage.setItem(
      "activeProduct",
      JSON.stringify(activeProduct.value)
    );
    if (isTrial === "notfree" && !everOrder.value) {
      ElMessageBox.confirm(
        `<p>You can choose to free trial for 7 days first,</p>Are you sure to continue to pay for adoption?</p>`,
        "Tips",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          dangerouslyUseHTMLString: true,
          type: "warning",
        }
      )
        .then(() => {
          createOrder(isTrial);
        })
        .catch(() => {});
    } else {
      createOrder(isTrial);
    }
  }
}
async function createOrder(type) {
  let total_price = "";
  let rent = "";
  if (type === "free") {
    total_price = 0;
    rent = "free";
    localStorage.removeItem("activeOrderItems");
  } else if (type === "notfree") {
    localStorage.removeItem("activeOrderItems");
    if (buyType.value === "month") {
      total_price =
        Number(activeProduct.value.monthPrice) -
        Number(activeProduct.value.monthly_discounted);
      rent = "monthly";
    } else if (buyType.value === "year") {
      total_price =
        Number(activeProduct.value.yeaPrice) -
        Number(activeProduct.value.annually_discounted);
      rent = "annually";
    }
  }

  // let reCaptchaV3Token = "";
  // await window.grecaptcha
  //   .execute(require("../utils/recaptchaRender").baseUrl, {
  //     action: "submit",
  //   })
  //   .then((token) => {
  //     reCaptchaV3Token = token;
  //   });

  let data = {
    order: {
      // recaptcha_token: reCaptchaV3Token,
      IsPay: false,
      total_price: total_price,
      total_count: 1,
      // user_id: user_id,
      user_id: window.localStorage.getItem("user_id") || user_id.value,
      payment_method: buyModel.value,
    },
    product_info: {
      order_product_detail: [
        {
          product_id: activeProduct.value.id,
          product_num: 1,
          rent: rent,
        },
      ],
    },
  };

  currentComfirmItem.value = {
    total_price: total_price,
    payment_method: buyModel.value,
    buyType: buyType.value,
  };
  window.sessionStorage.setItem(
    "currentComfirmItem",
    JSON.stringify(currentComfirmItem.value)
  );

  addOrder(data).then((res) => {
    if (!res || !res.data) {
      return;
    }
    if (type === "free") {
      window.localStorage.setItem("myTab", "Order");
      // $router.push("/order");
      window.localStorage.setItem("myTab", "Order");
      // $router.push("/order");
      let data = {
        orderid: res.data.id,
        action: "ModuleCreate",
      };
      openOrder(data).then((res) => {
        // loading = false;
        $router.push("/device");
      });
    } else {
      payItems.value = res.data;
      payVisible.value = true;
      // testEth();
      // stripePay(res);
    }
  });
}
function initProductList() {
  // loading = true;
  getProduct().then((res) => {
    productList.value = res.data;
    // getProductStock(res.data);
    handleData(res.data);
    // loading = false;
  });
}
function switchProductBackgroudInfo(item) {
  item.backgroundVisible = !item.backgroundVisible;
}
function closeBlockChain() {
  blockChainPayVisible.value = false;
}
function cancelBlockChain() {
  blockChainPayVisible.value = false;
  payVisible.value = true;
}
function tipsMouseover(item) {
  item.tipsVisible = true;
}
function tipsMouseout(item) {
  item.tipsVisible = false;
}
async function testEth() {
  let walletAccount = await getWalletAccounts();
  // addressArr = walletAccount.data[0];
  pay_address.value = walletAccount.data[0].address;
  getExchange("USDC");
  getExchange("USDT");
  getExchange("BUSD");
  getExchange("BSC_USD");
}
function getPayInfo() {
  get_user_all_active_order()
    .then((res) => {
      everOrder.value = res.data;
    })
    .finally(() => {
      gettingPayInfo.value = false;
    });
}
onMounted(() => {
  // localStorage.removeItem("activeProduct");
  testEth();
  // var aData = localStorage.getItem("aPageData");
  // if (aData) {
  //   fromOrigin = true;
  //   var currentProduct = JSON.parse(aData);
  //   window.localStorage.setItem(
  //     "activeProduct",
  //     JSON.stringify(currentProduct)
  //   );
  //   localStorage.removeItem("aPageData");
  //   window.localStorage.removeItem("activeOrderItems");
  //   $router.push("/comfirmOrder");
  // } else {
  //   window.addEventListener("message", receiveMessage, false);
  // }
  // if (!fromOrigin) {
  initProductList();
  // }

  // setTimeout(()=> {
  // },1000);
  getPayInfo();
});
</script>
<style lang="scss">
@import "@/static/style/product.scss";
</style>
<style lang="scss" scoped>
// .first_tips {
//   backdrop-filter: blur(40px);
//   border-radius: 10px;
//   background: rgba(255, 255, 255, 0.2);
//   color: #fff;
//   font-size: 12px;
//   cursor: pointer;
//   // padding: 20px;
//   height: 36px;
//   line-height: 36px;
//   padding: 0 20px;
//   position: relative;
//   overflow: hidden;
//   .first_tips_text {
//     position: absolute;
//     left: 0;
//     top: 0;
//     animation: 10s wordLoop linear infinite;
//   }
//   @keyframes wordLoop {
//     0% {
//       position: absolute;
//       left: 0;
//       top: 0;
//     }
//     50% {
//       position: absolute;
//       left: 50%;
//       top: 0;
//     }
//     100% {
//       position: absolute;
//       left: 100%;
//       top: 0;
//     }
//   }
// }
// .info_list {
//   display: flex;
//   justify-content: space-between;
//   margin-top: 20px;
//   min-height: 500px;
//   min-height: 460px;
// }
// .new_user_guide {
//   height: 50px;
//   margin-bottom: 16px;
//   line-height: 30px;
//   background-color: #55524d;
//   border-radius: 12px;
//   .is-customed {
//     text-decoration: underline;
//     font-size: 18px;
//   }
// }
.index_box {
  padding: 0px 30px;
  .index_box_div {
    position: relative;
    max-width: 1214px;
    margin: 40px auto;
    .title-label {
      position: relative;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: justify;
      justify-content: space-between;
      cursor: pointer;
      width: 213px;
      height: 43px;
      background: linear-gradient(
        rgba(24, 32, 79, 0.4) 0%,
        rgba(24, 32, 79, 0.25) 100%
      );
      border-radius: 30px;
      border: none;
      box-sizing: border-box;
      box-shadow: rgb(0 0 0 / 15%) 0px 20px 40px,
        rgb(0 0 0 / 30%) 0px 0px 0px 0.5px inset;
      transition: all 0.5s ease-in-out 0s;
      margin: 0px auto;
      padding: 12.5px 24px;
      .bgksWO {
        font-style: normal;
        font-weight: normal;
        font-size: 17px;
        line-height: 20px;
        color: rgb(0, 0, 0);
        transition: all 0.3s ease-in-out 0s;
        text-align: center;
        margin: 0px;
        z-index: 2;
      }
      .iRosYZ {
        font-style: normal;
        font-weight: normal;
        font-size: 17px;
        line-height: 20px;
        color: rgb(255, 255, 255);
        transition: all 0.3s ease-in-out 0s;
        text-align: center;
        margin: 0px;
        z-index: 2;
      }
      .check-p {
        font-style: normal;
        font-weight: normal;
        font-size: 17px;
        line-height: 20px;
        transition: all 0.3s ease-in-out 0s;
        text-align: center;
        margin: 0px;
        z-index: 2;
      }
      .check-month {
        color: #000;
      }
      .check-year {
        color: #fff;
      }
      .white-span {
        position: absolute;
        left: 4px;
        right: 4px;
        width: 98px;
        height: 35px;
        box-sizing: border-box;
        background: rgb(255, 255, 255);
        border-radius: 30px;
        transition: all 0.5s ease-in-out 0s;
      }
    }
    .title-label-check {
      .white-span {
        left: calc(100% - 2px);
        transform: translateX(-100%);
        transition: all 0.5s ease-in-out 0s;
      }
      .check-month {
        color: #fff;
      }
      .check-year {
        color: #000;
      }
    }
    .box-content,
    .box-content * {
      transition: all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
    }

    .product-div {
      position: relative;
      display: flex;
      -webkit-box-pack: center;
      justify-content: center;
      cursor: pointer;
      width: 500px;
      .bg-div {
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
      }
      .bg-div1 {
        transform-origin: left top;
        border-radius: 60px 60px 60px 0px;
      }
      .product-content {
        max-width: 340px;
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
        background: rgba(31, 31, 71, 0.6);
        box-shadow: rgb(0 0 0 / 25%) 0px 40px 80px,
          rgb(255 255 255 / 15%) 0px 0px 0px 0.5px inset;

        background: rgba(255, 255, 255, 0.3);
        box-shadow: rgb(24 32 79 / 25%) 0px 40px 80px,
          rgb(255 255 255 / 50%) 0px 0px 0px 0.5px inset;
        backdrop-filter: blur(40px);
        color: rgba(0, 0, 0, 0.7);
        color: #03040a;
        border-radius: 60px 60px 60px 60px;
        .product-des {
          text-align: center;
          color: rgba(0, 0, 0, 0.7);
          color: #03040a;
          .product-name {
            font-style: normal;
            font-weight: 600;
            font-size: 15px;
            line-height: 18px;
            text-transform: uppercase;
            margin: 0px;
            color: rgba(255, 255, 255, 0.6);
            color: rgba(0, 0, 0, 0.7);
            color: #03040a;
          }
          .product-price {
            font-style: normal;
            font-size: 54px;
            margin: 0px;
            color: rgba(255, 255, 255, 0.6);
            font-weight: 600;
            line-height: 88px;
            color: rgba(0, 0, 0, 0.7);
            color: #03040a;
          }
          .product-price1 {
            font-style: normal;
            font-weight: 500;
            font-size: 24px;
            line-height: 30px;
            color: rgba(255, 255, 255, 0.5);
            max-width: 200px;
            margin: 0px auto;
            text-decoration: line-through;
            color: rgba(0, 0, 0, 0.7);
            color: #03040a;
            height: 30px;
          }
          .product-des-list {
            display: grid;
            row-gap: 8px;
            width: fit-content;
            margin: 23px auto 0px;
            color: rgba(0, 0, 0, 0.7);
            color: #03040a;
            .product-des-item {
              display: grid;
              grid-template-columns: 24px auto;
              text-align: left;
              .item-img {
                width: 24px;
                height: 24px;
                margin: 0px;
                // filter: invert(80%);
              }
              .item-des {
                font-style: normal;
                font-weight: bold;
                font-size: 15px;
                line-height: 18px;
                color: rgba(255, 255, 255, 0.6);
                margin: auto 0px auto 16px;
                color: rgba(0, 0, 0, 0.7);
                color: #03040a;
              }
              label.el-checkbox {
                margin-top: 20px;
                color: rgba(0, 0, 0, 0.7);
                color: #03040a;
                .el-checkbox__label {
                  margin-left: 16px;
                  color: rgba(255, 255, 255, 0.6);
                  color: rgba(0, 0, 0, 0.7);
                  color: #03040a;
                }
              }
              // .el-checkbox__inner {
              //   border-radius: 50%;
              //   width: 20px;
              //   height: 20px;
              // }
              // .el-checkbox__input.is-checked .el-checkbox__inner,
              // .el-checkbox__input.is-indeterminate .el-checkbox__inner {
              //   background-color: #27303a;
              //   border-color: #43464a;
              // }
              // .el-checkbox__inner::after {
              //   box-sizing: content-box;
              //   content: "";
              //   border: 1px solid #fff;
              //   border-left: 0;
              //   border-top: 0;
              //   height: 10px;
              //   left: 7px;
              //   position: absolute;
              //   top: 2px;
              //   transform: rotate(45deg) scaleY(0);
              //   width: 4px;
              //   transition: transform 0.15s ease-in 0.05s;
              //   transform-origin: center;
              // }
            }
          }
        }
        .subscribe-div {
          cursor: pointer;
          background: linear-gradient(
            rgb(255, 255, 255) 0%,
            rgb(217, 223, 255) 100%
          );
          margin: 15px auto 0;
          border: 0.5px solid rgba(255, 255, 255, 0.5);
          box-sizing: border-box;
          box-shadow: rgb(0 0 0 / 10%) 0px 1px 3px,
            rgb(23 0 102 / 20%) 0px 20px 40px;
          border-radius: 20px;
          display: flex;
          padding: 4px;
          width: 169px;
          cursor: pointer;
          animation: 0.3s ease 0s 1 normal forwards running widther;
          height: 50px;
          box-sizing: border-box;
          .subscribe-icon {
            background: rgba(68, 66, 178, 0.1);
            box-shadow: rgb(0 0 0 / 10%) 0px 0px 0px 0.5px inset;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            -webkit-box-align: center;
            align-items: center;
            -webkit-box-pack: center;
            justify-content: center;

            > div {
              background: linear-gradient(to bottom, #b2f8ff, #5b2eff);
              box-shadow: rgb(0 0 0 / 10%) 0px 0px 0px 0.5px inset;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: flex;
              -webkit-box-align: center;
              align-items: center;
              -webkit-box-pack: center;
              justify-content: center;
              img {
                width: 20px;
                height: 20px;
                margin: 0px;
                padding: 0;
                margin: 0;
              }
            }
            .free_icon {
              background: linear-gradient(to bottom, #b2f8ff, #ff3636);
            }
          }
          .subscribe-btn {
            display: grid;
            grid-template-columns: 1fr;
            row-gap: 4px;
            margin: auto;
            text-align: center;
            p {
              font-style: normal;
              font-weight: normal;
              line-height: 130%;
              color: #fff;
              margin: 0px;
              font-size: 14px;
            }
          }
        }
        .subscribe-div:hover {
          box-shadow: rgb(0 0 0 / 10%) 0px 10px 30px,
            rgb(23 0 102 / 30%) 0px 30px 60px;
          transform: translateY(-2px) scale(1.1);
        }
      }
      .no-stock {
        .subscribe-div {
          background: rgba(0, 0, 0, 0.1);
          cursor: not-allowed;
          .subscribe-icon > div {
            background: rgba(0, 0, 0, 0.1) !important;
          }
        }
      }
    }

    .product-div:hover {
      .bg-div {
        transform: rotateX(30deg) rotateY(30deg) translateY(-3px);
      }
      .product-content {
        box-shadow: rgb(24 32 79 / 25%) 0px 100px 100px,
          rgb(255 255 255 / 50%) 0px 0px 0px 0.5px inset;
        transform: translateY(-3px);
      }
    }
    @keyframes widther {
      from {
        width: 40px;
        // transform: scale(1.1);
      }
      to {
        width: 169px;
        // transform: scale(1);
      }
    }
  }
}
.index-box-cn .subscribe-btn p {
  width: 70px;
  text-align: center;
  letter-spacing: 1px;
}
.index-box-cn .item-des {
  letter-spacing: 1px;
}
.index-box-cn .title-label {
  padding: 12.5px 35px !important;
}
.decentralized-dialog > div {
  width: 700px;
  .decentralized-dialog-box {
    position: relative;
    padding: 20px;
    width: 100%;
    height: 350px;
    box-sizing: border-box;
    color: #fff;
    .decentralized-create-h1 {
      position: absolute;
      top: 60px;
      margin: 0;
      padding: 0;
      width: 100%;
      text-align: center;
      font-size: 16px;
    }
    .decentralized-create-btn {
      position: absolute;
      top: 140px;
      left: 50%;
      margin-left: -75px;
      width: 150px;
    }
    .skip-decentralized {
      position: absolute;
      top: 180px;
      left: 314px;
      width: 100px;
      text-align: center;
      cursor: pointer;
    }
    .decentralized-create-tips {
      position: absolute;
      bottom: 5px;
      width: 100%;
      text-align: center;
      font-size: 12px;
    }

    .decentralized-box-title {
      width: 100%;
      height: 50px;
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: bolder;
      color: #fff;
      text-align: center;
    }
    .decentralized-box-item {
      position: relative;
      display: flex;
      margin-top: 20px;
      width: 100%;
      height: 30px;
      font-size: 12px;
      .icon-name {
        margin-top: 5px;
        margin-right: 10px;
        width: 20px;
        height: 20px;
      }
      .item-name {
        margin-right: 10px;
        width: 60px;
        height: 30px;
        line-height: 30px;
      }
      .item-content {
        width: 400px;
        height: 30px;
        line-height: 30px;
      }
      .icon-copy {
        position: absolute;
        top: 5px;
        right: 10px;
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
    }
    .decentralized-copy-all {
      position: absolute;
      bottom: 20px;
      left: 50%;
      margin-left: -60px;
    }
  }
  .el-loading-mask {
    background: rgba(203, 203, 213, 0.1) !important;
  }
}
.p_buy_address_input {
  margin-left: 20px;
  width: 600px;
}
.buy_address_input_verify {
  position: relative !important;
  margin-left: 20px;
}
.p_buy_blockchain {
  // display: none;
  padding-left: 20px;
  p {
    margin: 10px 0 0 0;
    font-size: 12px;
    color: #f99b3d;
  }
}
.blockchain-radio {
  display: none;
  width: 80% !important;
  margin-left: 80px;
  .el-radio__inner {
    width: 18px !important;
    height: 18px !important;
  }
  .el-radio__label {
    position: relative;
    padding-left: 33px;
    height: 20px;
    line-height: 20px;
    font-size: 14px !important;
    img {
      position: absolute;
      display: inline-block;
      height: 20px !important;
      left: 10px;
    }
  }
}
.p_buy_address {
  padding-left: 20px;
  position: relative;
  .p_buy_address_item {
    margin: 0;
    padding: 5px;
  }
  img {
    position: absolute;
    top: 0;
    right: 100px;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
}
.p_box {
  min-width: 500px;
  width: 80%;
  margin: 0 auto;
  // padding: 0 30px;
  .p_choose,
  .p_buy {
    .squartCard {
      margin-top: 14px;
      img {
        height: 30px;
      }
    }
    .squartCard-pay {
      height: 33px;
    }
    padding-left: 20px;
    margin-bottom: 10px;
    .el-radio-group {
      width: 100%;
    }

    .el-radio__label {
      font-size: 18px;
    }

    .el-radio__input.is-checked + .el-radio__label {
      // color: #ff9b3d;
      // border-color: #ff9b3d;
      color: #03040a;
      border-color: #03040a;
    }
    .el-radio__input.is-checked .el-radio__inner {
      // border-color: #ff9b3d;
      border-color: #03040a;
    }
    .el-radio__inner {
      // border-color: #ff9b3d;
      // background: #ff9b3d;
      border-color: #03040a;
      background: #03040a;
      background: transparent;
      width: 20px;
      height: 20px;
    }
    .el-radio {
      display: flex;
      float: left;
      align-items: center;
      // color: #a4a0a0;
      // color: #c0c4cc;
      width: 200px;
    }
    .el-radio__inner::after {
      width: 6px;
      height: 6px;
      // background: #ff9b3d;
      background: #03040a;
    }
  }
  .p_buy {
    img {
      height: 20px;
      overflow: hidden;
    }
  }

  .p_btc {
    .el-collapse-item__header,
    .el-collapse-item__wrap {
      background: transparent;
      color: #fff;
      border-bottom: none !important;
    }

    .el-collapse,
    .el-collapse-item__header {
      border-bottom: none !important;
      border-top: none !important;
      font-size: 14px;
    }

    .el-collapse-item__content {
      padding-bottom: 10px;
    }

    .bitcoin_payItem {
      // color: #a4a0a0;
      color: #c0c4cc;
      font-size: 12px;
      // text-align: center;
      margin-top: 20px;
      font-weight: bolder;
      cursor: pointer;
      margin-left: 30px;
    }

    .provider_url {
      margin-top: 0;
      text-decoration: underline;
    }
    .btc_group {
      .el-radio-group {
        // background: #726e6e;
        padding: 10px;
      }
    }
  }
  .order_item_box {
    padding-left: 20px;
    margin-bottom: 10px;
    font-size: 14px;
    .order_item_title {
      text-align: center;
      color: #ff9b3d;
      font-size: 20px;
      margin-bottom: 8px;
      margin-top: -10px;
    }
    .order_item {
      display: flex;
      line-height: 36px;
      color: #03040a;
      .order_key {
        width: 180px;
      }
    }
  }
}

.product-box {
  position: relative;
  display: flex;
  width: 320px;
  background: #fff;
  border-radius: 10px;
  flex-direction: column;
  padding: 5px 5px 28px;
  box-sizing: border-box;
  margin: 0 40px;
  &:nth-child(2) {
    background: linear-gradient(90deg, #fef4ad 0%, #ffaef3 100%);
  }
}

.product-bg-info2 {
  width: 100%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}

.product-value {
  // font-size: 48px;
  font-size: 30px;
  font-weight: bold;
  color: #333333;
  height: 64px;
  line-height: 64px;
}

.product-tags {
  display: flex;
  justify-content: center;
}

.product-tag-item2 {
  height: 24px;
  line-height: 24px;
  font-size: 18px;
  padding: 0 20px;
  color: rgba(0, 0, 0, 0.85);
  .price {
    color: #036ad6;
    font-size: 30px;
    font-weight: 600;
  }
}

.product-info-box {
  padding: 10px;
  font-family: YaHei;
}

.product-actions2 {
  display: flex;
  margin-top: 30px;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.product-actions2 > div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 44px;
  border-radius: 20px;
  font-size: 16px;
  box-shadow: 0px 3px 4px 1px #959cf5;
  user-select: none;
  margin-bottom: 10px;
}

.product-action-pay {
  cursor: pointer;
  background: linear-gradient(132deg, #272eef 0%, #7661ff 100%);
  color: rgba(255, 255, 255, 0.85);
}
.product-action-pay:hover {
  animation: product-action-pay-animation 0.6s alternate;
}
@keyframes product-action-pay-animation {
  from {
    background: linear-gradient(132deg, #272eef 0%, #7661ff 10%, #272eef 100%);
  }
  30% {
    background: linear-gradient(132deg, #272eef 0%, #7661ff 40%, #272eef 100%);
  }
  60% {
    background: linear-gradient(132deg, #272eef 0%, #7661ff 60%, #272eef 100%);
  }
  80% {
    background: linear-gradient(132deg, #272eef 0%, #7661ff 80%, #272eef 100%);
  }
  to {
    background: linear-gradient(132deg, #272eef 0%, #7661ff 100%, #7661ff 100%);
  }
}
.product-action-free {
  cursor: pointer;
  color: #333333;
  font-weight: 700;
  text-decoration: underline;
  box-shadow: none !important;
}

.product-action-coming {
  cursor: not-allowed;
  align-self: center;
  background: linear-gradient(132deg, #cfcece 0%, #bbc2e8 100%);
  color: #333333;
}
.product-actions-center {
  justify-content: center;
}

.product-img {
  position: relative;
  overflow: hidden;
}

.product-more-icon {
  position: absolute;
  right: 10px;
  bottom: 20px;
  cursor: pointer;
}

.product-bg-info-close {
  position: absolute;
  right: 20px;
  top: 26px;
  cursor: pointer;
}

.product-bg-line {
  display: flex;
  gap: 10px;
  font-size: 16px;
  margin-left: 15px;
  align-items: center;
}

.product-bg-line > img {
  width: 20px;
  object-fit: contain;
}

.product-nft {
  width: 330px;
  height: 330px;
  object-fit: cover;
  border-radius: 52px;
}

.product-img-label {
  // position: absolute;
  // left: -48px;
  // top: 20px;
  // width: 180px;
  // height: 40px;
  // background-color: #FFF;
  // // border-bottom: 2px rgba(35, 103, 213, .2) solid;
  // border-top: 2px rgba(35, 103, 213, .2) solid;
  // box-shadow: 0px 4px 8px 3px rgba(35, 103, 213, 0.5);
  // display: flex;
  // align-items: center;
  // justify-content: center;
  // color: rgba(35, 103, 213, 1);
  // font-weight: bold;
  // font-size: 13px;
  // transform: rotate(-45deg);
  position: absolute;
  height: 20px;
  line-height: 20px;
  text-align: center;
  width: 140px;
  background-color: #ff5722;
  color: #fff;
  transform: rotate(-45deg);
  left: -34px;
  top: 26px;
  font-size: 12px;
}

.product-info-tips {
  position: absolute;
  width: calc(100% - 10px);
  height: calc(100% - 145px);
  top: 5px;
  left: 5px;
  background: #8fabe7;
  border-radius: 52px;
  opacity: 1;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  .product-bg-line {
    display: flex;
    gap: 10px;
    font-size: 14px;
    margin-left: 42px;
    align-items: center;
    > img {
      width: 10px;
      object-fit: contain;
    }
  }
}
.box-content {
  width: 1160px;
  margin: 26px auto 0;
  display: flex;
  justify-content: center;
}

.index-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 660px;
  margin: 20px auto 0;
  font-size: 14px;
  color: #fff;
  height: 30px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.index-notice img {
  width: 20px;
  object-fit: contain;
}
.no-stock {
  .product-action-pay,
  .product-action-free {
    cursor: not-allowed;
    box-shadow: none;
    color: rgba(0, 0, 0, 0.1);
  }
  .subscribe-div-btn {
    background: rgba(0, 0, 0, 0.1);
    cursor: not-allowed;
    border: none;
    box-shadow: none;
    .subscribe-icon > div {
      background: rgba(0, 0, 0, 0.1) !important;
    }
    .subscribe-btn p {
      color: rgba(0, 0, 0, 0.1);
    }
  }
}

.subscribe-div-btn {
  // background: linear-gradient(rgb(255, 255, 255) 0%, rgb(217, 223, 255) 100%);
  background: #036ad6 !important;
  // margin: 3px auto 0;
  border: none;
  box-sizing: border-box;
  // box-shadow: rgb(0 0 0 / 10%) 0px 1px 3px, rgb(23 0 102 / 20%) 0px 20px 40px;
  // border-radius: 20px;
  display: flex;
  padding: 4px;
  width: 150px !important;
  cursor: pointer;
  animation: 0.3s ease 0s 1 normal forwards running widther;
  height: 44px;
  box-sizing: border-box;
  .subscribe-icon {
    background: rgba(68, 66, 178, 0.1);
    box-shadow: rgb(0 0 0 / 10%) 0px 0px 0px 0.5px inset;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    > div {
      background: linear-gradient(to bottom, #b2f8ff, #5b2eff);
      box-shadow: rgb(0 0 0 / 10%) 0px 0px 0px 0.5px inset;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 18px;
        height: 18px;
        margin: 0px;
        padding: 0;
        margin: 0;
      }
    }
    .free_icon {
      background: linear-gradient(to bottom, #b2f8ff, #ff3636);
    }
  }
  .subscribe-btn {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 4px;
    margin: auto;
    text-align: left;
    p {
      margin: 0px;
      // width: 50px;
      line-height: 22px;
      font-style: normal;
      font-weight: normal;
      color: #fff;
      font-size: 16px;
      text-align: justify;
    }
  }
}
.p_account_address_input_tips {
  padding: 0;
  margin: 10px 20px;
  font-size: 12px;
  color: #d9d9d9;
}

.coupon-number-input {
  margin: 10px 20px;
  width: 600px;
}
.coupon-number-input {
  margin: 10px 20px;
  width: 600px;
}
.el-dialog__body .coupon-recharge-switch,
.el-dialog__body .coupon-pay-switch {
  margin: 10px 0 10px 20px;
  .el-switch__label {
    color: #ccc;
  }
}
</style>
<style lang="scss">
.renewal-footer {
  position: relative;
  .pay-with-dmc {
    position: absolute;
    top: 10px;
    left: 20px;
    color: #d9d9d9;
    font-size: 14px;
    label {
      margin-right: 10px;
      .el-checkbox__inner {
        background-color: #a5a5a5;
        border-color: #787878;
      }
    }
  }
}
</style>
