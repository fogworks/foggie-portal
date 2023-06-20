<template>
  <div>
    <el-dialog :title="'Order'" v-model="renewalVisible" class="p_box">
      <!-- SubOrder -->
      <!-- <div
        v-if="activeOrderItems && activeOrderItems.order_sn"
        class="order_item_box"
      >
        <div class="order_item">
          <div class="order_key">{{ "Price" }}</div>
          <div class="order_value" v-if="buyType === 'month'">
            {{ activeProduct.unit === "dollar" ? "$" : "￥"
            }}{{ activeProduct.last_monthly }}
          </div>
          <div class="order_value" v-if="buyType === 'year'">
            {{ activeProduct.unit === "dollar" ? "$" : "￥"
            }}{{ activeProduct.last_annually }}
          </div>
        </div>
        <div class="order_item">
          <div class="order_key">{{ "Order ID" }}:</div>
          <div class="order_value">{{ activeOrderItems.order_sn }}</div>
        </div>
        <div class="order_item">
          <div class="order_key">{{ "Expiration Time" }}</div>
          <div class="order_value">{{ activeOrderItems.dueDate }}</div>
        </div>
        <div class="order_item" v-if="activeOrderItems.vps_info.length">
          <div class="order_key">{{ "WAN IP" }}:</div>
          <div class="order_value">
            {{
              activeOrderItems.vps_info.length &&
              activeOrderItems.vps_info[0].dedicatedip
            }}
          </div>
        </div>
        <div class="p_line"></div>
      </div> -->

      <div class="p_choose">
        <el-radio-group v-model="buyType" size="large">
          <el-radio label="month">{{ "Monthly Rent" }}</el-radio>
          <el-radio label="year">{{ "Annual Rent" }}</el-radio>
        </el-radio-group>
      </div>

      <div class="p_buy">
        <el-radio-group v-model="buyModel" size="large">
          <el-radio label="card" class="squartCard squartCard-pay">
            <img src="@/assets/card0.png" />
          </el-radio>
          <el-radio label="blockchain" class="squartCard squartCard-pay">
            {{ "Digital Currency" }}
          </el-radio>
        </el-radio-group>
        <el-radio-group
          v-model="buyBlockChainModel"
          v-if="buyModel == 'blockchain'"
          class="blockchain-radio"
          size="large"
        >
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
        </el-radio-group>
      </div>
      <el-switch
        class="coupon-recharge-switch"
        v-model="is_use_coupon_recharge"
        :active-text="'Clip Coupons'"
      >
      </el-switch>
      <el-input
        class="coupon-number-input"
        v-if="is_use_coupon_recharge"
        v-model="coupon_number_recharge"
        @change="rechargeCouponChange"
        :placeholder="'Enter the coupon number to get a 10% discount'"
      >
        ></el-input
      >
      <p
        class="coupon-number-error"
        v-if="is_use_coupon_recharge && is_coupon_error_recharge"
      >
        {{ "Please enter the correct coupon number" }}
      </p>
      <div slot="footer" class="dialog-footer renewal-footer">
        <div class="pay-with-dmc">
          {{ "* After successful payment,you can get DMC reward." }}
        </div>
        <el-button @click="renewalVisible = false">{{ "Cancel" }}</el-button>
        <el-button type="primary" @click="rechargPay">{{
          "Confirm"
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { check_coupon_number, orderRecharge } from "@/utils/api";
const renewalVisible = ref(false);
const recharge_address_input_verify = ref(false);
const is_coupon_error_recharge = ref(false);
const coupon_number_recharge = ref("");
const p_account_address_input = ref("");
const buyType = ref("month");
const buyModel = ref("card");
const buyBlockChainModel = ref("usdc");
const is_use_coupon_recharge = ref(false);
const recharge_click = ref(false);
const activeProduct = reactive({});
const activeOrderItems = reactive({});
let currentComfirmItem = reactive({});
const rechargeOrder = (item) => {
  recharge_address_input_verify.value = false;
  is_coupon_error_recharge.value = false;
  coupon_number_recharge.value = "";
  renewalVisible.value = true;
  p_account_address_input.value = "";
};
const rechargeCouponChange = (text) => {
  console.log("verify coupon", text);
  const reg = /^[a-zA-Z\d]{12}$/;
  if (!reg.test(text)) {
    // 
    is_coupon_error_recharge.value = true;
    return;
  } else {
    is_coupon_error_recharge.value = false;
  }
  // ajax 
  check_coupon_number(text).then((res) => {
    console.log("verify coupon", res);
    if (res.code !== 200) {
      is_coupon_error_recharge.value = true;
    }
  });
};

const rechargPay = () => {
  if (is_use_coupon_recharge.value && !coupon_number_recharge.value) {
    is_coupon_error_recharge.value = true;
    return;
  }
  if (is_use_coupon_recharge.value && is_coupon_error_recharge.value) {
    return;
  }
  if (recharge_click.value) {
    return;
  }
  recharge_click.value = true;

  // let reg1 = /^[0-9A-Za-z]{25,50}$/;
  // if (buyModel.value !== 'card' && !reg1.test(this.p_account_address_input)) {
  //   this.p_account_address_input_verify = true;
  //   return;
  // }
  // let reg2 = /^[0-9A-Za-z]{40,90}$/;
  // if (buyModel.value !== 'card' && !reg2.test(this.transaction_hash)) {
  //   this.recharge_address_input_verify = true;
  //   return;
  // }
  let total_price = "";
  let rent = "";
  if (buyType.value === "month") {
    if (buyModel.value === "card") {
      total_price =
        Number(activeProduct.monthPrice) -
        Number(activeProduct.monthly_discounted);
    } else if (
      buyModel.value === "blockchain" &&
      buyBlockChainModel.value === "usdc"
    ) {
      total_price = activeProduct.usdc_monthly;
    } else if (
      buyModel.value === "blockchain" &&
      buyBlockChainModel.value === "busd"
    ) {
      total_price = activeProduct.busd_monthly;
    } else if (
      buyModel.value === "blockchain" &&
      buyBlockChainModel.value === "usdt"
    ) {
      total_price = activeProduct.usdt_monthly;
    } else if (
      buyModel.value === "blockchain" &&
      buyBlockChainModel.value === "bsc_usd"
    ) {
      total_price = activeProduct.bsc_usd_monthly;
    } else if (
      buyModel.value === "blockchain" &&
      buyBlockChainModel.value === "vofo"
    ) {
      total_price = activeProduct.vofo_monthly;
    }

    rent = "monthly";
  } else if (buyType.value === "year") {
    if (buyModel.value === "card") {
      total_price =
        Number(activeProduct.yeaPrice) -
        Number(activeProduct.annually_discounted);
    } else if (
      buyModel.value === "blockchain" &&
      buyBlockChainModel.value === "usdc"
    ) {
      total_price = activeProduct.usdc_annually;
    } else if (
      buyModel.value === "blockchain" &&
      buyBlockChainModel.value === "busd"
    ) {
      total_price = activeProduct.busd_annually;
    } else if (
      buyModel.value === "blockchain" &&
      buyBlockChainModel.value === "usdt"
    ) {
      total_price = activeProduct.usdt_annually;
    } else if (
      buyModel.value === "blockchain" &&
      buyBlockChainModel.value === "bsc_usd"
    ) {
      total_price = activeProduct.bsc_usd_annually;
    } else if (
      buyModel.value === "blockchain" &&
      buyBlockChainModel.value === "vofo"
    ) {
      total_price = activeProduct.vofo_annually;
    }
    rent = "annually";
  }
  let data = {
    rent: rent,
    payment_method:
      buyModel.value === "card" ? "card" : buyBlockChainModel.value,
    total_price: total_price,
    order_id: activeOrderItems.id,
  };
  let currentComfirmItem1 = {
    total_price: total_price,
    payment_method:
      buyModel.value === "card" ? "card" : buyBlockChainModel.value,
    buyType: buyType.value,
  };
  window.sessionStorage.setItem(
    "currentComfirmItem",
    JSON.stringify(currentComfirmItem1)
  );
  currentComfirmItem = { ...currentComfirmItem1 };
  // orderRecharge(data)
  //   .then((res) => {
  //     if (!res.data) {
  //       return;
  //     }
  //     this.handleResponse(res);
  //   })
  //   .finally(() => {
  //     recharge_click.value = false;
  //   });
};
// const handleResponse = (res) => {
//   let id = res.data.id;
//   window.localStorage.setItem("order_id", id);
//   let len = res.data.order_transaction.length - 1;
//   let trans_id =
//     res.data.order_transaction && res.data.order_transaction[len].id;
//   // let w_url = window.location.origin + "/api/oms/pay_callback/" + trans_id;
//   // this.$router.push("/payOrder");

//   if (buyModel.value === "stripe") {
//     let success_url = window.location.origin + `/#/order`;
//     let cancel_url = window.location.origin + `/#/order`;
//     let postData = {
//       line_items: [
//         {
//           quantity: 1,
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: activeProduct.name,
//               images: ["https://vfoggie.fogworks.io/favicon_ood.png"], //""https://i.imgur.com/EHyR2nP.png
//             },
//             // unit_amount: Number(this.currentComfirmItem.total_price) * 100, //50
//             unit_amount: this.numMulti(
//               Number(this.currentComfirmItem.total_price),
//               100
//             ),
//             // unit_amount: 50, //50
//           },
//         },
//       ],
//       mode: "payment",
//       payment_method_types: ["card"],
//       success_url: success_url,
//       cancel_url: cancel_url,
//       trans_id: trans_id,
//       isRenewal: true,
//     };
//     payStripe(postData).then((res) => {
//       if (res && res.data && res.data.url) {
//         window.location.href = res.data.url;
//       }
//     });
//   } else if (buyModel.value === "card") {
//     this.payment_cloud_trans_id = trans_id;
//     this.renewalVisible = false;
//     this.payment_cloud_show = true;
//     this.referer_name = "recharge";
//     this.payment_cloud_amount = this.coupon_number_recharge
//       ? Number(this.currentComfirmItem.total_price) * 0.9
//       : Number(this.currentComfirmItem.total_price);
//   } else {
//     // let reg1 = /^[0-9A-Za-z]{25,50}$/;
//     // if (!reg1.test(this.p_account_address_input)) {
//     //   this.p_account_address_input_verify = true;
//     //   return;
//     // }

//     // let data = {
//     //   transaction_id: trans_id,
//     //   order_id: id,
//     //   user_sender: this.p_account_address_input,
//     //   user_receiver: this.pay_address,
//     // };
//     // orderTransaction(data).then(()=>{
//     //   this.blockChainPayVisible = true;
//     //   this.renewalVisible = false;
//     //   this.p_account_address_input_verify = false;
//     //   this.payItems = this.activeOrderItems;
//     //   this.blockChainModel = buyBlockChainModel.value;
//     //   // this.renewalVisible = false;
//     //   // this.initOrder();
//     // });

//     let pay_item = this.activeOrderItems;
//     let price =
//       this.buyType === "month"
//         ? activeProduct.last_monthly
//         : activeProduct.last_annually;
//     // let price_text = this.buyType === 'month' ?
//     //   `$ ${activeProduct.last_monthly} (Foggie NFT + 1 month Foggie rent fee)`
//     //   : `$ ${activeProduct.last_annually} (Foggie NFT + 1 year Foggie rent fee)`;
//     let price_text =
//       this.buyType === "month"
//         ? `$ ${activeProduct.last_monthly}`
//         : `$ ${activeProduct.last_annually}`;
//     let coupon_number = this.coupon_number_recharge;
//     this.blockChainData = {
//       pay_item,
//       trans_id,
//       price,
//       price_text,
//       coupon_number,
//       couponRate: coupon_number ? 0.9 : 1,
//     };
//     this.blockChainPayVisible = true;
//     this.renewalVisible = false;
//   }
// };
defineExpose({
  rechargeOrder,
});
</script>

<style lang="scss" scoped>
@import "@/static/style/order.scss";

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
.blockchain-from,
.blockchain-to {
  position: relative;
  margin-left: 20px;
  span {
    display: inline-block;
    width: 50px;
    color: orange;
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
</style>
