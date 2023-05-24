<template>
  <div>
    <el-dialog
      :title="$t('index.orderDialog')"
      :visible.sync="renewalVisible"
      class="p_box"
    >
      <!-- SubOrder -->
      <div
        v-if="activeOrderItems && activeOrderItems.order_sn"
        class="order_item_box"
      >
        <div class="order_item">
          <div class="order_key">{{ $t("index.orderPrice") }}</div>
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
          <div class="order_key">{{ $t("index.orderId") }}:</div>
          <div class="order_value">{{ activeOrderItems.order_sn }}</div>
        </div>
        <div class="order_item">
          <div class="order_key">{{ $t("index.expire") }}</div>
          <div class="order_value">{{ activeOrderItems.dueDate }}</div>
        </div>
        <div class="order_item" v-if="activeOrderItems.vps_info.length">
          <div class="order_key">{{ $t("index.wan_ip") }}:</div>
          <div class="order_value">
            {{
              activeOrderItems.vps_info.length &&
              activeOrderItems.vps_info[0].dedicatedip
            }}
          </div>
        </div>
        <div class="p_line"></div>
      </div>

      <div class="p_choose">
        <el-radio-group v-model="buyType" size="large">
          <el-radio label="month">{{ $t("index.monthrent") }}</el-radio>
          <el-radio label="year">{{ $t("index.yearrent") }}</el-radio>
        </el-radio-group>
      </div>

      <div class="p_buy">
        <el-radio-group v-model="buyModel" size="large">
          <el-radio label="card" class="squartCard squartCard-pay">
            <img src="@/assets/card0.png" />
          </el-radio>
          <el-radio label="blockchain" class="squartCard squartCard-pay">
            {{ $t("index.digital_currency") }}
          </el-radio>
        </el-radio-group>
        <el-radio-group
          v-model="buyBlockChainModel"
          v-if="buyModel === 'blockchain'"
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
        :active-text="$t('order.use_coupon_pay')"
      >
      </el-switch>
      <el-input
        class="coupon-number-input"
        v-if="is_use_coupon_recharge"
        v-model="coupon_number_recharge"
        @change="rechargeCouponChange"
        :placeholder="$t('order.coupon_placeholder')"
      >
        ></el-input
      >
      <p
        class="coupon-number-error"
        v-if="is_use_coupon_recharge && is_coupon_error_recharge"
      >
        {{ $t("order.coupon_error") }}
      </p>
      <div slot="footer" class="dialog-footer renewal-footer">
        <div class="pay-with-dmc">
          {{ $t("index.dmc_reward_tip") }}
        </div>
        <el-button @click="renewalVisible = false">{{
          $t("index.cancel")
        }}</el-button>
        <el-button type="primary" @click="rechargPay">{{
          $t("index.confirm")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
const rechargeOrder = (item) => {
  this.recharge_address_input_verify = false;
  this.is_coupon_error_recharge = false;
  this.coupon_number_recharge = "";
  this.renewalVisible = true;
  // this.currentTitle = "Order Renewal";
  // this.showChangeBox = true;
  let activeProduct = item.product;
  window.localStorage.setItem("activeOrderItems", JSON.stringify(item));
  window.localStorage.setItem("activeProduct", JSON.stringify(activeProduct));
  window.localStorage.setItem("order_id", item.id);
  this.activeOrderItems = item;
  this.activeProduct = activeProduct;
  this.p_account_address_input = "";
  // this.testEth();
  // this.$router.push("/comfirmOrder");
};
// const rechargPay = () => {
//   if (this.is_use_coupon_recharge && !this.coupon_number_recharge) {
//     this.is_coupon_error_recharge = true;
//     return;
//   }
//   if (this.is_use_coupon_recharge && this.is_coupon_error_recharge) {
//     return;
//   }
//   if (this.recharge_click) {
//     return;
//   }
//   this.recharge_click = true;

//   // let reg1 = /^[0-9A-Za-z]{25,50}$/;
//   // if (this.buyModel !== 'card' && !reg1.test(this.p_account_address_input)) {
//   //   this.p_account_address_input_verify = true;
//   //   return;
//   // }
//   // let reg2 = /^[0-9A-Za-z]{40,90}$/;
//   // if (this.buyModel !== 'card' && !reg2.test(this.transaction_hash)) {
//   //   this.recharge_address_input_verify = true;
//   //   return;
//   // }
//   let total_price = "";
//   let rent = "";
//   if (this.buyType === "month") {
//     if (this.buyModel === "card") {
//       total_price =
//         Number(this.activeProduct.monthPrice) -
//         Number(this.activeProduct.monthly_discounted);
//     } else if (
//       this.buyModel === "blockchain" &&
//       this.buyBlockChainModel === "usdc"
//     ) {
//       total_price = this.activeProduct.usdc_monthly;
//     } else if (
//       this.buyModel === "blockchain" &&
//       this.buyBlockChainModel === "busd"
//     ) {
//       total_price = this.activeProduct.busd_monthly;
//     } else if (
//       this.buyModel === "blockchain" &&
//       this.buyBlockChainModel === "usdt"
//     ) {
//       total_price = this.activeProduct.usdt_monthly;
//     } else if (
//       this.buyModel === "blockchain" &&
//       this.buyBlockChainModel === "bsc_usd"
//     ) {
//       total_price = this.activeProduct.bsc_usd_monthly;
//     } else if (
//       this.buyModel === "blockchain" &&
//       this.buyBlockChainModel === "vofo"
//     ) {
//       total_price = this.activeProduct.vofo_monthly;
//     }

//     rent = "monthly";
//   } else if (this.buyType === "year") {
//     if (this.buyModel === "card") {
//       total_price =
//         Number(this.activeProduct.yeaPrice) -
//         Number(this.activeProduct.annually_discounted);
//     } else if (
//       this.buyModel === "blockchain" &&
//       this.buyBlockChainModel === "usdc"
//     ) {
//       total_price = this.activeProduct.usdc_annually;
//     } else if (
//       this.buyModel === "blockchain" &&
//       this.buyBlockChainModel === "busd"
//     ) {
//       total_price = this.activeProduct.busd_annually;
//     } else if (
//       this.buyModel === "blockchain" &&
//       this.buyBlockChainModel === "usdt"
//     ) {
//       total_price = this.activeProduct.usdt_annually;
//     } else if (
//       this.buyModel === "blockchain" &&
//       this.buyBlockChainModel === "bsc_usd"
//     ) {
//       total_price = this.activeProduct.bsc_usd_annually;
//     } else if (
//       this.buyModel === "blockchain" &&
//       this.buyBlockChainModel === "vofo"
//     ) {
//       total_price = this.activeProduct.vofo_annually;
//     }
//     rent = "annually";
//   }
//   let data = {
//     rent: rent,
//     payment_method: this.buyModel === "card" ? "card" : this.buyBlockChainModel,
//     total_price: total_price,
//     order_id: this.activeOrderItems.id,
//   };
//   let currentComfirmItem = {
//     total_price: total_price,
//     payment_method: this.buyModel === "card" ? "card" : this.buyBlockChainModel,
//     buyType: this.buyType,
//   };
//   window.sessionStorage.setItem(
//     "currentComfirmItem",
//     JSON.stringify(currentComfirmItem)
//   );
//   this.currentComfirmItem = currentComfirmItem;
//   orderRecharge(data)
//     .then((res) => {
//       if (!res.data) {
//         return;
//       }
//       this.handleResponse(res);
//     })
//     .finally(() => {
//       this.recharge_click = false;
//     });
// };
// const handleResponse = (res) => {
//   let id = res.data.id;
//   window.localStorage.setItem("order_id", id);
//   let len = res.data.order_transaction.length - 1;
//   let trans_id =
//     res.data.order_transaction && res.data.order_transaction[len].id;
//   // let w_url = window.location.origin + "/api/oms/pay_callback/" + trans_id;
//   // this.$router.push("/payOrder");

//   if (this.buyModel === "stripe") {
//     let success_url = window.location.origin + `/#/order`;
//     let cancel_url = window.location.origin + `/#/order`;
//     let postData = {
//       line_items: [
//         {
//           quantity: 1,
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: this.activeProduct.name,
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
//   } else if (this.buyModel === "card") {
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
//     //   this.blockChainModel = this.buyBlockChainModel;
//     //   // this.renewalVisible = false;
//     //   // this.initOrder();
//     // });

//     let pay_item = this.activeOrderItems;
//     let price =
//       this.buyType === "month"
//         ? this.activeProduct.last_monthly
//         : this.activeProduct.last_annually;
//     // let price_text = this.buyType === 'month' ?
//     //   `$ ${this.activeProduct.last_monthly} (Foggie NFT + 1 month Foggie rent fee)`
//     //   : `$ ${this.activeProduct.last_annually} (Foggie NFT + 1 year Foggie rent fee)`;
//     let price_text =
//       this.buyType === "month"
//         ? `$ ${this.activeProduct.last_monthly}`
//         : `$ ${this.activeProduct.last_annually}`;
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
</script>

<style lang="scss" scoped></style>
