<template>
  <div>
    <el-dialog
      :title="$t('blockChainBox.blockChainDialog')"
      :model-value="blockChainPayVisible"
      class="blockchain-box"
      width="500px"
      :close-on-click-modal="false"
      :before-close="blockChainPayClose"
    >
      <!-- SubOrder -->
      <div class="bc-step1" v-if="blockChainStep === 1">
        <!-- -->
        <p class="product-info">{{ $t("blockChainBox.product_info") }}</p>
        <p class="payment-info">
          {{ $t("index.orderPrice") }}$
          {{ (blockChainData.price * blockChainData.couponRate).toFixed(4) }}
        </p>
        <p
          class="payment-info"
          v-if="blockChainData.pay_item && blockChainData.pay_item.order_sn"
        >
          {{ $t("index.orderId") }} {{ blockChainData.pay_item.order_sn }}
        </p>
        <div class="block-chain-model">
          <div class="block-chain-model-price">
            {{
              (
                (blockChainData.price * blockChainData.couponRate) /
                accountTypesData[blockChainModel].rate
              ).toFixed(4)
            }}
          </div>
          <div class="block-chain-model-current" @click="blockChainModelChoose">
            <span class="span1">
              <img
                src="@/assets/order/icon-bsc-busd.webp"
                class="block-chain-icon"
                v-if="blockChainModel === 'busd'"
              />
              <img
                src="@/assets/order/icon-bsc-usdt.webp"
                class="block-chain-icon"
                v-if="blockChainModel === 'bsc_usd'"
              />
              <img
                src="@/assets/order/icon-eth-usdc.webp"
                class="block-chain-icon"
                v-if="blockChainModel === 'usdc'"
              />
              <img
                src="@/assets/order/icon-eth-usdt.webp"
                class="block-chain-icon"
                v-if="blockChainModel === 'usdt'"
              />
              {{ accountTypesData[blockChainModel].label }}</span
            >
            <span class="span2">{{
              accountTypesData[blockChainModel].label_type
            }}</span>
            <img class="order-change" src="@/assets/order/order_change.svg" />
            <!-- <span class="block-chain-model-current-span" @click="blockChainModelChoose">
              <img src="@/assets/order/order_change.svg" />
            </span> -->
          </div>
          <div class="block-chain-model-choose" v-if="block_chain_model_choose">
            <div
              v-for="(item, index) in accountTypes"
              @click="chooseBlockChain(item.value)"
              :key="index"
            >
              <span class="block-chain-model-choose-items">
                <img
                  src="@/assets/order/icon-bsc-busd.webp"
                  class="block-chain-icon"
                  v-if="item.value === 'busd'"
                />
                <img
                  src="@/assets/order/icon-bsc-usdt.webp"
                  class="block-chain-icon"
                  v-if="item.value === 'bsc_usd'"
                />
                <img
                  src="@/assets/order/icon-eth-usdc.webp"
                  class="block-chain-icon"
                  v-if="item.value === 'usdc'"
                />
                <img
                  src="@/assets/order/icon-eth-usdt.webp"
                  class="block-chain-icon"
                  v-if="item.value === 'usdt'"
                />
                {{ item.label }}
              </span>
            </div>
          </div>
        </div>
        <p class="block-chain-rate">
          1 {{ accountTypesData[blockChainModel].label }} =
          {{ accountTypesData[blockChainModel].rate }} USD
        </p>
        <div class="bc-step1-pay-address">
          <div class="div1" @click="payAddressVisible = true">
            {{ $t("blockChainBox.link_wallet") }}
          </div>
          <div class="div2" v-if="payment_address">
            {{ $t("blockChainBox.payment_address") }}
          </div>
          <div class="div2" v-if="payment_address">{{ payment_address }}</div>
          <div
            class="div2"
            v-if="
              pay_choose_type === 'metamask' &&
              !metamask_network_eth_error &&
              !metamask_network_bsc_error
            "
          >
            {{ $t("blockChainBox.amount_balance_text") }}
            {{ amount_balance_text }}
            {{ accountTypesData[blockChainModel].label }}
            {{ accountTypesData[blockChainModel].label_type }}
          </div>
        </div>
        <p class="amount-balance-error" v-if="amount_balance_error">
          {{ $t("blockChainBox.amount_balance_error") }}
        </p>
        <p class="payment-address-error" v-if="metamask_network_eth_error">
          {{ $t("blockChainBox.metamask_network_eth_error") }}
        </p>
        <p class="payment-address-error" v-if="metamask_network_bsc_error">
          {{ $t("blockChainBox.metamask_network_bsc_error") }}
        </p>
        <el-input
          class="payment-address"
          v-if="is_show_pay_address"
          v-model="payment_address"
          @change="changePaymentAddress"
          :placeholder="$t('index.p_account_address_placeholder')"
        ></el-input>
        <p class="payment-address-error" v-if="payment_address_error">
          {{ $t("blockChainBox.payment_address_error") }}
        </p>
        <p
          class="payment-eth-gas-tips"
          v-if="blockChainModel === 'usdc' || blockChainModel === 'usdt'"
        >
          {{ $t("blockChainBox.eth_gas_tips") }}
        </p>
        <div class="step1-foot">
          <el-button @click="cancelStep1">{{
            $t("blockChainBox.cancel")
          }}</el-button>
          <el-button type="primary" @click="confirmStep1(2)">{{
            $t("blockChainBox.place_order")
          }}</el-button>
        </div>
      </div>
      <div class="bc-step2" v-if="blockChainStep === 2">
        <!-- step2 -->
        <p class="product-info">{{ $t("blockChainBox.product_info") }}</p>
        <!-- <p class="payment-info">{{ blockChainData.price_text }}</p> -->
        <p class="payment-info">
          {{ $t("index.orderPrice") }}$
          {{ (blockChainData.price * blockChainData.couponRate).toFixed(4) }}
        </p>
        <p
          class="payment-info"
          v-if="blockChainData.pay_item && blockChainData.pay_item.order_sn"
        >
          {{ $t("index.orderId") }} {{ blockChainData.pay_item.order_sn }}
        </p>
        <!-- <p class="block-chain-price">
          {{ (blockChainData.price / accountTypesData[blockChainModel].rate).toFixed(4) }} {{ accountTypesData[blockChainModel].label }}
        </p> -->
        <div class="block-chain-model">
          <div class="block-chain-model-price">
            {{
              (
                (blockChainData.price * blockChainData.couponRate) /
                accountTypesData[blockChainModel].rate
              ).toFixed(4)
            }}
          </div>
          <!-- <div class="block-chain-model-current" @click="blockChainModelChoose"> -->
          <div class="block-chain-model-current">
            <span class="span1">
              <img
                src="@/assets/order/icon-eth-usdc.webp"
                class="block-chain-icon"
                v-if="blockChainModel === 'usdc'"
              />
              <img
                src="@/assets/order/icon-eth-usdt.webp"
                class="block-chain-icon"
                v-if="blockChainModel === 'usdt'"
              />
              <img
                src="@/assets/order/icon-bsc-busd.webp"
                class="block-chain-icon"
                v-if="blockChainModel === 'busd'"
              />
              <img
                src="@/assets/order/icon-bsc-usdt.webp"
                class="block-chain-icon"
                v-if="blockChainModel === 'bsc_usd'"
              />
              {{ accountTypesData[blockChainModel].label }}</span
            >
            <span class="span2">{{
              accountTypesData[blockChainModel].label_type
            }}</span>

            <!-- <span class="span1">{{ accountTypesData[blockChainModel].label }}</span>
            <span class="span2">{{ accountTypesData[blockChainModel].label_type }}</span> -->
            <!-- <span>{{ accountTypesData[blockChainModel].label }}</span> -->
            <!-- <img src="@/assets/order/order_change.svg" /> -->
            <!-- <span class="block-chain-model-current-span" @click="blockChainModelChoose">
              <img src="@/assets/order/order_change.svg" />
            </span> -->
          </div>
          <!-- <div class="block-chain-model-choose" v-if="block_chain_model_choose">
            <div v-for="(item, index) in accountTypes"
              @click="chooseBlockChain(item.value)"
              :key="index"
            >
              <span >{{ item.label }}</span>
            </div>
          </div> -->
        </div>
        <div class="count-down" v-if="count_down > 0">
          <span class="count-down-text">{{
            $t("blockChainBox.count_down")
          }}</span>
          <span
            :class="count_down > 300 ? 'count-down-time1' : 'count-down-time2'"
          >
            {{ Math.floor(count_down / 60) }} {{ $t("blockChainBox.minute") }}
            {{ count_down % 60 }} {{ $t("blockChainBox.second") }}
          </span>
        </div>
        <!-- <p class="payment-methods">{{ $t('blockChainBox.payment_method_metamask') }}</p>
        <div class="payment-metamask" @click="payByMetamask">{{ $t('blockChainBox.payment_by_metamask') }}</div>
        <p class="payment-methods">{{ $t('blockChainBox.payment_method_other') }}</p> -->
        <div class="account-qr" ref="qrCodeUrl" id="account-qr"></div>
        <!-- OR -->
        <div class="address-div">
          <div class="receiving-address">
            <span>{{ $t("blockChainBox.receiving_address") }}</span>
            <span>{{ receiving_address }}</span>
            <img
              src="@/assets/order/copy_by_bc.svg"
              class=""
              v-if="receiving_address"
              @click="copyID(receiving_address)"
              alt="copy"
            />
          </div>
          <div class="payment-address">
            <span>{{ $t("blockChainBox.payment_address") }}</span>
            <span>{{
              payment_address
                ? `${payment_address.substr(0, 25)}...${payment_address.substr(
                    -3
                  )}`
                : ""
            }}</span>
          </div>
          <p class="payment-withdrawal-tips">
            {{ $t("blockChainBox.payment_withdrawal_tips") }}
          </p>
        </div>
        <div slot="footer" class="step2-foot">
          <el-button @click="cancelStep2" v-if="count_down > 0">{{
            $t("blockChainBox.cancel_payment")
          }}</el-button>
          <el-button
            type="primary"
            v-if="count_down > 0"
            @click="confirmStep2"
            >{{ $t("blockChainBox.have_payment") }}</el-button
          >
          <el-button @click="payError" v-if="count_down === 0">{{
            $t("blockChainBox.payment_fail")
          }}</el-button>
          <p class="step2-payment-error" v-if="count_down === 0">
            {{ $t("blockChainBox.payment_error") }}
          </p>
        </div>
      </div>
      <div class="bc-step3" v-if="blockChainStep === 3">
        <!-- step3 -->
        <p class="product-info">{{ $t("blockChainBox.product_info") }}</p>
        <!-- <p class="payment-info">{{ blockChainData.price_text }}</p> -->
        <p class="payment-info">
          {{ $t("index.orderPrice") }}$
          {{ (blockChainData.price * blockChainData.couponRate).toFixed(4) }}
        </p>
        <p
          class="payment-info"
          v-if="blockChainData.pay_item && blockChainData.pay_item.order_sn"
        >
          {{ $t("index.orderId") }} {{ blockChainData.pay_item.order_sn }}
        </p>
        <p class="block-chain-price">
          <img
            src="@/assets/order/icon-eth-usdc.webp"
            class="block-chain-icon"
            v-if="blockChainModel === 'usdc'"
          />
          <img
            src="@/assets/order/icon-eth-usdt.webp"
            class="block-chain-icon"
            v-if="blockChainModel === 'usdt'"
          />
          <img
            src="@/assets/order/icon-bsc-busd.webp"
            class="block-chain-icon"
            v-if="blockChainModel === 'busd'"
          />
          <img
            src="@/assets/order/icon-bsc-usdt.webp"
            class="block-chain-icon"
            v-if="blockChainModel === 'bsc_usd'"
          />
          <span>
            {{
              (
                (blockChainData.price * blockChainData.couponRate) /
                accountTypesData[blockChainModel].rate
              ).toFixed(4)
            }}
            {{ accountTypesData[blockChainModel].label }}
            {{ accountTypesData[blockChainModel].label_type }}
          </span>
        </p>
        <div class="count-down" v-if="count_down > 0">
          <span class="count-down-text">{{
            $t("blockChainBox.count_down")
          }}</span>
          <span
            :class="count_down > 300 ? 'count-down-time1' : 'count-down-time2'"
          >
            {{ Math.floor(count_down / 60) }} {{ $t("blockChainBox.minute") }}
            {{ count_down % 60 }} {{ $t("blockChainBox.second") }}
          </span>
        </div>

        <el-input
          class="transaction-hash"
          :disabled="isUseMetaMask"
          v-model="transaction_hash"
          :placeholder="
            isUseMetaMask
              ? $t('blockChainBox.get_transaction_hash')
              : $t('blockChainBox.transaction_hash')
          "
        ></el-input>
        <div
          class="useMetaMaskTips"
          v-if="transaction_hash_status === 'getting'"
        >
          {{ $t("blockChainBox.use_metamask_tips") }}
        </div>
        <div
          class="manual-hash"
          v-if="
            isUseMetaMask &&
            transaction_hash_status === 'error' &&
            count_down > 0
          "
          @click="manualHash"
        >
          {{ $t("blockChainBox.manual_hash") }}
        </div>
        <p class="go-to-hash" v-if="transaction_hash">
          <span class="go-to-hash-span" @click="goToHash">{{
            $t("blockChainBox.checkout_hash")
          }}</span>
          <i class="el-icon-check" v-if="!check_info"></i>
        </p>
        <el-checkbox
          v-if="!isUseMetaMask"
          class="confirm-info"
          v-model="confirm_info"
          :disabled="check_info"
          >{{ $t("blockChainBox.checked_hash") }}</el-checkbox
        >
        <div class="go-to-hash-tips" v-if="is_show_step3_tips">
          {{ $t("blockChainBox.go_to_hash_tips") }}
        </div>
        <div slot="footer" class="step3-foot" v-if="!isUseMetaMask">
          <el-button v-if="count_down === 0" @click="payError">
            {{ $t("blockChainBox.payment_fail") }}</el-button
          >
          <el-button v-if="count_down > 0" @click="cancelStep3">
            {{ $t("blockChainBox.prev_step") }}</el-button
          >
          <el-button type="primary" v-if="count_down > 0" @click="confirmStep3">
            {{ $t("blockChainBox.complete") }}</el-button
          >
          <p class="step3-payment-error" v-if="count_down === 0">
            {{ $t("blockChainBox.payment_error") }}
          </p>
        </div>

        <div slot="footer" class="step3-foot" v-if="isUseMetaMask">
          <el-button v-if="count_down === 0" @click="payError">
            {{ $t("blockChainBox.payment_fail") }}</el-button
          >
          <!-- <el-button 
            v-if="transaction_hash_status === 'error' || count_down === 0"
            @click="payError" >
            {{ $t('blockChainBox.payment_fail') }}</el-button> -->
          <el-button
            v-if="transaction_hash && count_down > 0"
            class="btn_complete_payment"
            type="primary"
            @click="confirmStep3"
          >
            {{ $t("blockChainBox.complete_payment") }}</el-button
          >
          <!-- <p class="step3-payment-error" 
            v-if="count_down === 0 ||  transaction_hash_status === 'error'">{{ $t('blockChainBox.payment_error') }}</p> -->
          <p class="step3-payment-error" v-if="count_down === 0">
            {{ $t("blockChainBox.payment_error") }}
          </p>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('blockChainBox.link_wallet')"
      v-model="payAddressVisible"
      class="blockchain-box-pay-address"
      width="500px"
      :close-on-click-modal="false"
      :before-close="payAddressClose"
    >
      <!-- <div class="pay-address-choose" @click="useMetaMask">
        <div class="is-choose" v-if="pay_choose_type === 'metamask'"></div>
        <img src="@/assets/order/payment_metamask.png" />
        <span>{{ $t("blockChainBox.payment_metamask") }}</span>
      </div> -->
      <div class="pay-address-choose" @click="useOther">
        <div class="is-choose" v-if="pay_choose_type === 'other'"></div>
        {{ $t("blockChainBox.payment_other") }}
      </div>
      <!-- <p class="pay-address-choose-tips" v-if="!isHaveMetaMask">
        {{ $t("blockChainBox.install_metamask") }}
      </p> -->
      <p class="pay-address-choose-tips" v-if="!isLinkMetaMask">
        {{ $t("blockChainBox.bind_metamask") }}
      </p>
    </el-dialog>
  </div>
</template>

<script>
import {
  getExchangeRate,
  getWalletAccounts,
  orderTransaction,
  transactions,
  paymentCancel,
  orderCancel,
} from "@/api/shop";
import QRCode from "qrcodejs2";
import contractABI from "./contractABI.json";
import contractAddress from "./contractAddress.json";
// import EthereumQRPlugin from 'ethereum-qr-code';

export default {
  props: {
    blockChainData: {
      type: Object,
    },
    paypalItem: {
      type: Object,
    },
    blockChainPayVisible: {
      type: Boolean,
    },
    paypalPrice: {
      type: Number,
    },
    paypalTransId: {
      type: Number,
    },
  },
  watch: {
    paypalItem: {
      handler(newValue) {
        this.paypal_item = newValue;
      },
      immediate: true,
      deep: true,
    },
    paypalPrice: {
      handler(newValue) {
        this.paypal_price = newValue;
      },
      immediate: true,
      deep: true,
    },
    paypalTransId: {
      handler(newValue) {
        this.paypal_transId = newValue;
      },
      immediate: true,
      deep: true,
    },
    blockChainPayVisible: {
      handler(newValue) {
        if (newValue) {
          // this.getBlockChain();
          this.pay_choose_type = "";
          this.metamask_network_eth_error = false;
          this.metamask_network_bsc_error = false;
          this.transaction_hash_status = "";
          this.isUseMetaMask = false;
          this.is_show_pay_address = false;
          this.amount_balance_error = false;
        }
      },
      immediate: true,
      deep: true,
    },
    blockChainData: {
      handler(newValue) {
        if (newValue.user_sender) {
          this.initHavePayment(newValue);
        } else {
          this.initNoPayment();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      // blockChainPayVisible: true,
      paypal_item: {},
      paypal_price: "",
      paypal_transId: "",
      payment_address: "",
      receiving_address: "",
      // paypalVisible: false,
      account_type: "",
      accountTypes: [
        { label: "BUSD (BSC)", value: "busd" },
        { label: "USDT (BSC)", value: "bsc_usd" },
        { label: "USDC (ETH)", value: "usdc" },
        { label: "USDT (ETH)", value: "usdt" },
      ],
      accountTypesData: {
        usdc: {
          label: "USDC",
          label_type: "Ethereum",
          rate: 1,
        },
        usdt: {
          label: "USDT",
          label_type: "Ethereum",
          rate: 1,
        },
        busd: {
          label: "BUSD",
          label_type: "BNB Smart Chain",
          rate: 1,
        },
        bsc_usd: {
          label: "USDT",
          label_type: "BNB Smart Chain",
          rate: 1,
        },
      },
      blockChainStep: 1,
      vofoRate: 1,
      busdRate: 1,
      usdcRate: 1,
      usdtRate: 1,
      bsc_usdRate: 1,
      transaction_hash: "",
      blockChainModel: "busd",
      count_down: -1,
      // count_down: 1111,
      // count_down_created: 0,
      confirm_info: false,
      check_info: true,
      block_chain_model_choose: false,
      payAddressVisible: false,
      is_show_pay_address: false,
      payment_address_text: "",
      payment_address_error: false,
      metamask_network_eth_error: false,
      metamask_network_bsc_error: false,
      uuid: "",
      isCountDown: false,
      is_click_step1: true,
      is_click_step2: true,
      is_click_step3: true,
      is_cancel_step2: true,
      isUseMetaMask: false,
      metaMaskSuccess: false,
      transaction_hash_status: "",
      isHaveMetaMask: true,
      isLinkMetaMask: true,
      pay_choose_type: "",
      is_show_step3_tips: false,
      qrCode: "",
      amount_balance: 0,
      amount_balance_text: 0,
      amount_balance_error: false,
    };
  },
  created() {
    // this.getBlockChain();
    this.getBlockChainInfo();
    // if (this.blockChainStep === 2) {
    //   this.getBlockChain();
    // }
    // this.getBlockChain();
    this.listenNetwork();
  },
  methods: {
    listenNetwork() {
      let that = this;
      // let pay_choose_type = this.pay_choose_type;
      window.addEventListener("load", function () {
        // const that = $this;
        if (window.ethereum) {
          window.ethereum.on("networkChanged", function (networkId) {
            that.dealNetworkChange(networkId);
            // if (pay_choose_type === 'metamask') {
            //   // Time to reload your interface with the new networkId
            //   console.log('networkId', networkId);
            //   if ((that.blockChainModel === 'usdc' || that.blockChainModel === 'usdt') && networkId !== '1') {
            //     that.metamask_network_eth_error = true;
            //     that.metamask_network_bsc_error = false;
            //   } else if ((that.blockChainModel === 'busd' || that.blockChainModel === 'bsc_usd') && networkId !== '56') {
            //     that.metamask_network_eth_error = false;
            //     that.metamask_network_bsc_error = true;
            //   } else {
            //     that.metamask_network_eth_error = false;
            //     that.metamask_network_bsc_error = false;
            //     that.getAmountInfo();
            //   }
            // }
          });
        }
      });
    },
    dealNetworkChange(networkId) {
      let that = this;
      console.log(1111111, that.pay_choose_type);
      if (that.pay_choose_type === "metamask") {
        // Time to reload your interface with the new networkId
        console.log("networkId", networkId);
        // if ((that.blockChainModel === 'usdc' || that.blockChainModel === 'usdt') && networkId !== '1') {
        //   that.metamask_network_eth_error = true;
        //   that.metamask_network_bsc_error = false;
        // } else if ((that.blockChainModel === 'busd' || that.blockChainModel === 'bsc_usd') && networkId !== '56') {
        //   that.metamask_network_eth_error = false;
        //   that.metamask_network_bsc_error = true;
        // } else {
        //   that.metamask_network_eth_error = false;
        //   that.metamask_network_bsc_error = false;
        //   that.getAmountInfo();
        // }
        // if (networkId === '1') {
        //   console.log(111111,that.blockChainModel)
        //   that.metamask_network_eth_error = false;

        // } else if (networkId === '56') {
        //   console.log(222222222,that.blockChainModel)
        //   that.metamask_network_bsc_error = false;
        // }
        if (
          (that.blockChainModel === "usdc" ||
            that.blockChainModel === "usdt") &&
          networkId !== "1"
        ) {
          that.metamask_network_eth_error = true;
          that.metamask_network_bsc_error = false;
        } else if (
          (that.blockChainModel === "busd" ||
            that.blockChainModel === "bsc_usd") &&
          networkId !== "56"
        ) {
          that.metamask_network_eth_error = false;
          that.metamask_network_bsc_error = true;
        } else {
          that.metamask_network_eth_error = false;
          that.metamask_network_bsc_error = false;
          that.getAmountInfo();
        }
        // if (((that.blockChainModel === 'usdc' || that.blockChainModel === 'usdt') && networkId === '1')
        //   || ((that.blockChainModel === 'busd' || that.blockChainModel === 'bsc_usd') && networkId === '56')) {
        //     that.getAmountInfo();
        // }
        // that.getAmountInfo();
      }
    },
    async chooseBlockChain(type) {
      if (this.blockChainModel !== type) {
        this.amount_balance_error = false;
      }
      this.blockChainModel = type;
      this.block_chain_model_choose = false;
      if (this.pay_choose_type === "metamask") {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        console.log("chainId", chainId);
        if ((type === "usdc" || type === "usdt") && chainId !== "0x1") {
          this.metamask_network_eth_error = true;
          this.metamask_network_bsc_error = false;
          this.payAddressVisible = false;
          return;
        } else if (
          (type === "busd" || type === "bsc_usd") &&
          chainId !== "0x38"
        ) {
          this.metamask_network_eth_error = false;
          this.metamask_network_bsc_error = true;
          this.payAddressVisible = false;
          return;
        } else {
          this.metamask_network_eth_error = false;
          this.metamask_network_bsc_error = false;
          this.getAmountInfo();
        }
      }
    },
    payError() {
      this.$emit("cancelBlockChain", true);
    },
    payAddressClose() {
      this.payAddressVisible = false;
    },
    blockChainModelChoose() {
      this.block_chain_model_choose = !this.block_chain_model_choose;
    },
    manualHash() {
      this.isUseMetaMask = false;
    },
    goToHash() {
      if (this.transaction_hash) {
        this.check_info = false;
        if (
          this.blockChainModel === "usdc" ||
          this.blockChainModel === "usdt"
        ) {
          window.open(`https://etherscan.io/tx/${this.transaction_hash}`);
        } else {
          window.open(`https://bscscan.com/tx/${this.transaction_hash}`);
        }
      }
    },
    initNoPayment() {
      this.blockChainStep = 1;
      this.payment_address = "";
      // this.receiving_address = '';
      this.blockChainModel = "busd";
    },
    initHavePayment(newValue) {
      this.blockChainStep = 2;
      this.payment_address = newValue.user_sender;
      this.receiving_address = newValue.user_receiver;
      this.blockChainModel = newValue.payment_method;
      this.uuid = newValue.uuid;
      this.getBlockChain();

      // TODO
      let created_at = new Date(newValue.created_at).getTime();
      // let offset = new Date().getTimezoneOffset()* 60 * 1000;
      let nowDate = new Date().getTime();
      // let GMTDate = new Date(nowDate + offset);   //Wed Apr 20 2016 22:27:02 GMT+0800 (CST)

      // TEST
      // created_at = "2023-02-06T21:43:35.908980+00:00".getTime();

      this.count_down = Math.ceil(
        (created_at + 55 * 60 * 1000 - nowDate) / 1000
      );

      if (this.count_down > 0) {
        // this.count_down = 55 * 60;
        this.blockChainStep = 2;
        if (!this.isCountDown) {
          this.countDownFn();
        }
      } else {
        this.count_down = 0;
      }
    },
    useOther() {
      this.pay_choose_type = "other";
      this.metamask_network_eth_error = false;
      this.metamask_network_bsc_error = false;
      if (!this.p_account_address_placeholder) {
        this.is_show_pay_address = true;
        this.payAddressVisible = false;
        this.payment_address = "";
        this.payment_address_error = false;
        this.amount_balance_error = false;
      }
      this.isUseMetaMask = false;
    },
    getBalance() {},
    async useMetaMask() {
      this.pay_choose_type = "metamask";
      this.isUseMetaMask = true;
      this.is_show_pay_address = false;
      this.payAddressVisible = false;
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      console.log("chainId", chainId);
      if (
        (this.blockChainModel === "usdc" || this.blockChainModel === "usdt") &&
        chainId !== "0x1"
      ) {
        this.metamask_network_eth_error = true;
        this.metamask_network_bsc_error = false;
        this.payAddressVisible = false;
        return;
      } else if (
        (this.blockChainModel === "busd" ||
          this.blockChainModel === "bsc_usd") &&
        chainId !== "0x38"
      ) {
        this.metamask_network_eth_error = false;
        this.metamask_network_bsc_error = true;
        this.payAddressVisible = false;
        return;
      } else {
        this.getAmountInfo();
      }
      // let web3Provider;
      // if (window.ethereum) {
      //   web3Provider = window.ethereum;
      //   try {
      //     await window.ethereum.enable();
      //     // this.initMetaMask(web3Provider);
      //   } catch (error) {
      //     console.error("User denied account access");
      //     this.isLinkMetaMask = false;
      //   }
      // } else if (window.web3) {  
      //   web3Provider = window.web3.currentProvider;
      //   // this.initMetaMask(web3Provider);
      // } else {
      //   web3Provider = new this.Web3.providers.HttpProvider('http://localhost:8545');
      //   this.isHaveMetaMask = false;
      // }
      // let web3js = new this.Web3(web3Provider);
      // // test
      // let accounts = await web3js.eth.getAccounts();
      // console.log('accounts', accounts)
      // this.payment_address = accounts[0];
      // this.payAddressVisible = false;
      // this.payment_address_error = false;

      // let web3Provider;
      // if (window.ethereum) {
      //   // web3Provider = window.ethereum;
      //   try {
      //     await window.ethereum.enable();
      //     // this.initMetaMask(web3Provider);
      //     this.payAddressVisible = false;
      //   } catch (error) {
      //     console.error("User denied account access");
      //     this.isLinkMetaMask = false;
      //   }
      // } else if (window.web3) {
      //   // web3Provider = window.web3.currentProvider;
      //   // this.initMetaMask(web3Provider);
      //   this.payAddressVisible = false;
      // } else {
      //   // web3Provider = new this.Web3.providers.HttpProvider('http://localhost:8545');
      //   this.isHaveMetaMask = false;
      // }

      // let contract_abi = contractABI[this.blockChainModel];
      // let contract_address = contractAddress[this.blockChainModel];

      // let myContract = new web3js.eth.Contract(contract_abi, contract_address, {
      //     from: this.payment_address, // default from address
      //     gasPrice: '10000000000' // default gas price in wei, 10 gwei in this case
      // });

      // web3js.eth.getBalance(this.payment_address).then((res)=>console.log('11111', res));

      // myContract.methods.balanceOf(this.payment_address).call({from: this.payment_address}, function(error, result){
      //     if(!error) {
      //         console.log(result);
      //     } else {
      //         console.log(error);
      //     }
      // });

      // web3js.eth.getBalance("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48").then((res)=>console.log('usdc', res));

      // myContract.methods.transfer(this.receiving_address, 10000).send({from: this.payment_address}, (error, transactionHash) =>{
      //   if (!error) {
      //     console.log('transactionHash is ' + transactionHash);
      //   } else {
      //     console.log(error);
      //   }
      // });

      // web3js.eth.sendTransaction({
      //     from: this.payment_address,
      //     to: this.receiving_address,
      //     value: '200000000000000'
      //   })
      //   .on('transactionHash', function(hash){
      //     console.log(1111)
      //     console.info(hash)
      //   })
      //   .on('receipt', function(receipt){
      //     console.log(2222)
      //     console.info(receipt)
      //   })
      //   .on('confirmation', function(confirmationNumber, receipt){
      //     console.log(3333)
      //     console.info(confirmationNumber)
      //     console.info(receipt)
      //   })
      //   .on('error', console.error);
    },

    async getAmountInfo() {
      let web3Provider;
      if (window.ethereum) {
        web3Provider = window.ethereum;
        try {
          await window.ethereum.enable();
          // this.initMetaMask(web3Provider);
        } catch (error) {
          console.error("User denied account access");
          // this.isLinkMetaMask = false;
        }
      } else if (window.web3) {
        web3Provider = window.web3.currentProvider;
        // this.initMetaMask(web3Provider);
      } else {
        web3Provider = new this.Web3.providers.HttpProvider(
          "http://localhost:8545"
        );
        // this.isHaveMetaMask = false;
      }
      let web3js = new this.Web3(web3Provider);
      // test
      let accounts = await web3js.eth.getAccounts();
      console.log("accounts", accounts);
      this.payment_address = accounts[0];
      // this.payAddressVisible = false;
      this.payment_address_error = false;

      let contract_abi = contractABI[this.blockChainModel];
      let contract_address = contractAddress[this.blockChainModel];

      let myContract = new web3js.eth.Contract(contract_abi, contract_address, {
        from: this.payment_address, // default from address
        // gasPrice: '10000000000', // default gas price in wei, 10 gwei in this case
        // gasPrice: '10000000'
        // gas: 21000,
      });
      this.amount_balance = await myContract.methods
        .balanceOf(this.payment_address)
        .call({ from: this.payment_address }, function (error, result) {
          if (!error) {
            console.log("balanceOf", result);
            return result;
          } else {
            console.log("balanceOf error", error);
            return 0;
          }
        });
      if (this.blockChainModel === "usdc" || this.blockChainModel === "usdt") {
        this.amount_balance_text =
          this.amount_balance === "0"
            ? 0
            : (this.amount_balance / Math.pow(10, 6)).toFixed(4);
      } else if (
        this.blockChainModel === "busd" ||
        this.blockChainModel === "bsc_usd"
      ) {
        this.amount_balance_text =
          this.amount_balance === "0"
            ? 0
            : (this.amount_balance / Math.pow(10, 18)).toFixed(4);
      }
    },
    async initMetaMask() {
      let web3Provider;
      if (window.ethereum) {
        web3Provider = window.ethereum;
        try {
          await window.ethereum.enable();
          // this.initMetaMask(web3Provider);
        } catch (error) {
          console.error("User denied account access");
          // this.isLinkMetaMask = false;
        }
      } else if (window.web3) {
        web3Provider = window.web3.currentProvider;
        // this.initMetaMask(web3Provider);
      } else {
        web3Provider = new this.Web3.providers.HttpProvider(
          "http://localhost:8545"
        );
        // this.isHaveMetaMask = false;
      }
      let web3js = new this.Web3(web3Provider);
      // test
      // let accounts = await web3js.eth.getAccounts();
      // console.log('accounts', accounts)
      // this.payment_address = accounts[0];
      // this.payAddressVisible = false;
      // this.payment_address_error = false;

      let contract_abi = contractABI[this.blockChainModel];
      let contract_address = contractAddress[this.blockChainModel];

      let myContract = new web3js.eth.Contract(contract_abi, contract_address, {
        from: this.payment_address, // default from address
        // gasPrice: '10000000000', // default gas price in wei, 10 gwei in this case
        // gasPrice: '10000000'
        // gas: 21000,
      });

      // this.blockChainStep = 3;
      // this.confirmStep1(3);
      this.transaction_hash = "";
      this.transaction_hash_status = "getting";
      let amount = Number(
        (
          (this.blockChainData.price * this.blockChainData.couponRate) /
          this.accountTypesData[this.blockChainModel].rate
        ).toFixed(4)
      );
      // amount = web3js.utils.BN(amount);
      // let times = 1000000;
      if (
        this.blockChainModel === "bsc_usd" ||
        this.blockChainModel === "busd"
      ) {
        amount = web3js.utils.toBN(
          amount * web3js.utils.toBN(Math.pow(10, 18))
        );
        // times = Math.pow(10, 18);
      } else {
        amount = amount * Math.pow(10, 6);
      }
      // amount = amount.times(web3js.toBigNumber(10).pow(decimals));

      // const gas = await myContract.methods
      //   .transfer(this.receiving_address, amount)
      //   .estimateGas({from: this.payment_address}, (gasAmount) => {
      //       console.log('gasAmount', gasAmount);
      //   });

      console.log("amount", amount);

      // amount = 0;
      // this.amount_balance = await web3js.eth.getBalance(this.payment_address).then((res)=>{
      //   console.log('balance', res)
      //   return res;
      // });

      // this.amount_balance = await myContract.methods
      //   .balanceOf(this.payment_address).call({from: this.payment_address}, function(error, result){
      //       if(!error) {
      //           console.log('balanceOf', result);
      //           return result;
      //       } else {
      //           console.log('balanceOf error', error);
      //       }
      //   });
      //   if (this.amount_balance < amount) {
      //     return;
      //   }
      // console.log('amount_balance', this.amount_balance)
      const gas_price = await web3js.eth.getGasPrice().then((res) => {
        console.log(res);
        return res;
      });
      const gas_limit = await myContract.methods
        .transfer(this.receiving_address, amount)
        .estimateGas(
          { from: this.payment_address, gas: 5000000 },
          function (error, gasAmount) {
            if (gasAmount == 5000000) {
              console.log("Method ran out of gas");
            }
            console.log("gas_price", gasAmount);
            return gasAmount;
          }
        );

      myContract.methods
        .transfer(this.receiving_address, amount)
        .send(
          { from: this.payment_address, gas: gas_limit, gasPrice: gas_price },
          (error, transactionHash) => {
            if (!error) {
              this.transaction_hash_status = "success";
              this.transaction_hash = transactionHash;
              console.log("transactionHash is " + transactionHash);
            } else {
              console.log(error);
              this.transaction_hash_status = "error";
              // this.is_cancel_step2 = true;
              // this.cancelOrder();
            }
          }
        );
      // myContract.methods.transfer(this.receiving_address, amount).send({from: this.payment_address}, (error, transactionHash) =>{
      //   if (!error) {
      //     this.transaction_hash_status = 'success';
      //     this.transaction_hash = transactionHash;
      //     console.log('transactionHash is ' + transactionHash);
      //   } else {
      //     console.log(error);
      //     this.transaction_hash_status = 'error';
      //     this.is_cancel_step2 = true;
      //     this.cancelOrder();
      //   }
      // });
    },
    async payByMetamask() {
      if (this.count_down > 0) {
        let web3Provider;
        if (window.ethereum) {
          web3Provider = window.ethereum;
          try {
            await window.ethereum.enable();
          } catch (error) {
            console.error("User denied account access");
          }
        } else if (window.web3) {
          web3Provider = window.web3.currentProvider;
        } else {
          web3Provider = new this.Web3.providers.HttpProvider(
            "http://localhost:8545"
          );
        }

        let web3js = new this.Web3(web3Provider);

        let contract_abi = contractABI[this.blockChainModel];
        let contract_address = contractAddress[this.blockChainModel];

        let myContract = new web3js.eth.Contract(
          contract_abi,
          contract_address,
          {
            from: this.payment_address, // default from address
            gasPrice: "10000000000", // default gas price in wei, 10 gwei in this case
          }
        );

        // web3js.eth.getBalance(this.payment_address).then((res)=>console.log('11111', res));

        // myContract.methods.balanceOf(this.payment_address).call({from: this.payment_address}, function(error, result){
        //     if(!error) {
        //         console.log(result);
        //     } else {
        //         console.log(error);
        //     }
        // });

        // web3js.eth.getBalance("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48").then((res)=>console.log('usdc', res));

        myContract.methods
          .transfer(this.receiving_address, 10000)
          .send({ from: this.payment_address }, (error, transactionHash) => {
            if (!error) {
              console.log("transactionHash is " + transactionHash);
            } else {
              console.log(error);
            }
          });
      }
    },
    changePaymentAddress(text) {
      if (text) {
        this.payment_address_error = false;
      }
    },
    confirmStep1() {
      // TODO
      if (this.metamask_network_eth_error || this.metamask_network_bsc_error) {
        return;
      }
      if (!this.is_click_step1) {
        return;
      }
      // verify coupon
      // const reg = /^[a-zA-Z\d]{12}$/;
      // if (this.blockChainData.coupon_number && !reg.test(this.blockChainData.coupon_number)) {
      //   return;
      // }
      if (this.is_show_pay_address) {
        let reg1 = /^[0-9A-Za-z]{25,50}$/;
        if (!reg1.test(this.payment_address)) {
          this.payment_address_error = true;
          this.is_click_step1 = true;
          return;
        }
      }
      if (!this.payment_address) {
        this.payment_address_error = true;
        this.is_click_step1 = true;
        return;
      }
      let cur_price =
        this.blockChainData.price /
        this.accountTypesData[this.blockChainModel].rate;
      let amount_balance = Number(this.amount_balance);
      if (this.blockChainModel === "usdc" || this.blockChainModel === "usdt") {
        amount_balance = amount_balance / Math.pow(10, 6);
      } else if (
        this.blockChainModel === "busd" ||
        this.blockChainModel === "bsc_usd"
      ) {
        amount_balance = amount_balance / Math.pow(10, 18);
      }
      if (amount_balance < cur_price && this.isUseMetaMask) {
        this.amount_balance_error = true;
        return;
      }
      let data = {
        transaction_id: this.blockChainData.trans_id,
        order_id: this.blockChainData.pay_item.id,
        user_sender: this.payment_address,
        user_receiver: this.receiving_address,
        actual_price: (
          (this.blockChainData.price * this.blockChainData.couponRate) /
          this.accountTypesData[this.blockChainModel].rate
        ).toFixed(4),
        payable_price: (
          this.blockChainData.price * this.blockChainData.couponRate
        ).toString(),
        exchange_rate: this.accountTypesData[this.blockChainModel].rate,
        payment_method: this.blockChainModel,
      };
      this.is_click_step1 = false;
      orderTransaction(data)
        .then((res) => {
          if (res.data && res.data.uuid) {
            this.uuid = res.data.uuid;
            let order_data = {
              transactions_id: this.blockChainData.trans_id,
              uuid: res.data.uuid,
              payment_method: this.blockChainModel,
              pay_address: this.payment_address,
              actual_price: (
                (this.blockChainData.price * this.blockChainData.couponRate) /
                this.accountTypesData[this.blockChainModel].rate
              ).toFixed(4),
              payable_price: (
                this.blockChainData.price * this.blockChainData.couponRate
              ).toString(),
              exchange_rate: this.accountTypesData[this.blockChainModel].rate,
            };
            if (this.blockChainData.coupon_number) {
              let price = this.blockChainData.price;
              order_data = {
                transactions_id: this.blockChainData.trans_id,
                uuid: res.data.uuid,
                payment_method: this.blockChainModel,
                pay_address: this.payment_address,
                actual_price: (
                  (price * this.blockChainData.couponRate) /
                  this.accountTypesData[this.blockChainModel].rate
                ).toFixed(4),
                payable_price: (
                  price * this.blockChainData.couponRate
                ).toString(),
                exchange_rate: this.accountTypesData[this.blockChainModel].rate,
                coupon_number: this.blockChainData.coupon_number,
              };
            }
            let created_at = new Date(res.data.created_at).getTime();
            transactions(order_data)
              .then((res) => {
                this.is_click_step1 = true;
                if (res && res.data) {
                  let nowDate = new Date().getTime();
                  this.count_down = Math.ceil(
                    (created_at + 55 * 60 * 1000 - nowDate) / 1000
                  );
                  if (this.count_down > 0) {
                    // this.blockChainStep = 2;
                    // this.blockChainStep = step;
                    if (!this.isCountDown) {
                      this.countDownFn();
                    }
                    if (this.is_show_pay_address) {
                      this.blockChainStep = 2;
                    } else {
                      this.is_show_step3_tips = false;
                      this.initMetaMask();
                      this.blockChainStep = 3;
                    }
                  } else {
                    this.count_down = 0;
                  }
                  this.getBlockChain();
                }
              })
              .catch(() => {
                this.is_click_step1 = true;
              });
          } else {
            this.is_click_step1 = true;
          }
        })
        .catch(() => {
          this.is_click_step1 = true;
        });
    },
    countDownFn() {
      if (this.count_down > 0) {
        this.isCountDown = true;
        this.count_down -= 1;
        setTimeout(() => {
          this.countDownFn();
        }, 1000);
      } else {
        this.isCountDown = false;
      }
    },
    cancelStep1() {
      this.$emit("cancelBlockChain", true);
    },
    confirmStep2() {
      this.is_show_step3_tips = false;
      this.blockChainStep = 3;
    },
    cancelStep2() {
      if (!this.is_cancel_step2) {
        return;
      }
      this.is_cancel_step2 = false;
      let pay_data = {
        uuid: this.uuid,
      };
      paymentCancel(pay_data)
        .then((res) => {
          if (res.data) {
            let order_data = {
              transaction_id: this.blockChainData.trans_id,
              uuid: this.uuid,
            };
            orderCancel(order_data)
              .then((r) => {
                if (r.code === 200) {
                  // this.blockChainStep = 1;
                  this.$emit("closeBlockChain", true);
                }
                this.is_cancel_step2 = true;
              })
              .catch(() => {
                this.is_cancel_step2 = true;
              });
          } else {
            this.is_cancel_step2 = true;
          }
        })
        .catch(() => {
          this.is_cancel_step2 = true;
        });
    },
    cancelOrder() {
      let pay_data = {
        uuid: this.uuid,
      };
      paymentCancel(pay_data).then((res) => {
        if (res.data) {
          let order_data = {
            transaction_id: this.blockChainData.trans_id,
            uuid: this.uuid,
          };
          orderCancel(order_data)
            .then((r) => {
              if (r.code === 200) {
                // this.blockChainStep = 1;
                // this.$emit('closeBlockChain', true);
              }
              this.is_cancel_step2 = true;
            })
            .catch(() => {
              this.is_cancel_step2 = true;
            });
        }
      });
    },
    confirmStep3() {
      if (!this.is_click_step3) {
        return;
      }
      let reg2 = /^[0-9A-Za-z]{40,90}$/;
      if (!this.isUseMetaMask) {
        if (!reg2.test(this.transaction_hash)) {
          this.is_show_step3_tips = true;
          return;
        }
        if (!this.confirm_info) {
          this.is_show_step3_tips = true;
          return;
        }
      }

      let data = {
        transaction_hash: this.transaction_hash,
        uuid: this.uuid,
      };
      this.is_click_step3 = false;
      orderTransaction(data)
        .then((res) => {
          if (res && res.data) {
            this.payVisible = false;
            // this.blockChainPayVisible = false;
            this.$emit("closeBlockChain", true);
          }
        })
        .catch(() => {
          this.is_click_step3 = true;
        });
    },
    cancelStep3() {
      this.blockChainStep = 2;
      this.getBlockChain();
    },
    async getBlockChainInfo() {
      let walletAccount = await getWalletAccounts();
      // this.addressArr = walletAccount.data[0];
      this.receiving_address = walletAccount.data[0].address;
      this.getExchange("USDC");
      this.getExchange("USDT");
      this.getExchange("BUSD");
      this.getExchange("BSC_USD");
    },
    async getExchange(type) {
      await getExchangeRate(type).then((res) => {
        let str = "";
        if (res && res.data && res.data.length > 0) {
          let len = res.data.length;
          str = res.data[len - 1] && res.data[len - 1][`${type}/USD`];
        }
        if (!str) {
          str = 1;
        }
        // console.log(str);
        if (type === "USDC") {
          this.accountTypesData.usdc.rate = str;
          this.usdcRate = Number(str).toFixed(4);
          // this.upDateList('USDC');
        } else if (type === "BUSD") {
          this.accountTypesData.busd.rate = str;
          this.busdRate = Number(str).toFixed(4);
          // this.upDateList('BUSD');
        } else if (type === "USDT") {
          this.accountTypesData.usdt.rate = str;
          this.usdtRate = Number(str).toFixed(4);
          // this.upDateList('USDT');
        } else if (type === "BSC_USD") {
          this.accountTypesData.bsc_usd.rate = str;
          this.bsc_usdRate = Number(str).toFixed(4);
          // this.upDateList('BSC_USD');
        }
      });
    },
    getBlockChain() {
      if (this.$refs.qrCodeUrl && this.receiving_address) {
        // const qr = new EthereumQRPlugin();
        // const sendDetails = {
        //   // to: contractAddress[this.blockChainModel],
        //   to: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        //   from: '0x879d14A266Aa54abC74b71A34277631f790a31fE',
        //   mode: 'erc20__transfer',
        //   argsDefaults: [
        //     { name: 'to', value: '0x1A282434ec9Ad19688697151700Be4D8aE0D327D' },
        //   ],
        // };

        // const configDetails = {
        //   size:180,
        //   selector: '#account-qr',
        //   options: {
        //     margin: 2
        //   }
        // };
        // //run the plugin
        // qr.toCanvas(sendDetails, configDetails);
        console.log(1111111111);

        this.$refs.qrCodeUrl.innerHTML = "";
        // let str = `ethereum:${this.receiving_address}?contractAddress=${contractAddress[this.blockChainModel]}&decimal=6&value=0&network=ethereum`;
        const str = this.receiving_address;
        this.qrCode = new QRCode("account-qr", {
          text: JSON.stringify(str),
          width: 150,
          height: 150,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.L,
        });

        // let canvas = this.qrCode._el.querySelector("canvas"); 
        // this.base64Text = canvas.toDataURL("image/png");
      } else {
        setTimeout(() => {
          this.getBlockChain();
        }, 500);
      }
    },
    copyID(text) {
      let input = document.createElement("input");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("Copy");
      document.body.removeChild(input);
      let msg = "Copying  Success!";
      this.$message.success(msg);
    },
    blockChainPayClose() {
      this.$emit("closeBlockChain", true);
    },
  },
};
</script>
<style lang="scss">
.blockchain-box {
  &.el-dialog {
    // background: #fff;
    background: linear-gradient(
      rgb(224, 236, 240) 0%,
      rgb(187, 221, 238) 50.94%,
      rgb(122, 180, 230) 100%
    );
    .el-dialog__title {
      color: #606266 !important;
    }
    .el-dialog__body {
      padding: 0px 20px !important;
      color: #606266 !important;
      p {
        padding: 0;
        margin: 0;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
      }
    }
    .el-dialog__body {
      color: #606266 !important;
      .el-checkbox__label {
        color: #606266 !important;
      }
      .bc-step1 {
        .product-info {
          height: 50px;
          line-height: 50px;
          text-align: center;
          font-size: 20px;
        }
        .payment-info {
          font-size: 14px;
          text-align: center;
        }
        .block-chain-rate {
          text-align: center;
        }
        .bc-step1-pay-address {
          > canvas,
          > img {
            display: none !important;
          }
          margin-top: 10px;
          // width: 360px;
          width: 100%;
          .div1 {
            margin: 10px auto;
            width: 150px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 14px;
            cursor: pointer;
            border: 1px solid #9093997a;
            border-radius: 10px;
            background: linear-gradient(
              to right,
              rgba(115, 76, 226, 0.9),
              rgba(96, 107, 251, 0.9)
            );
            color: #fff;
          }
          .div2 {
            height: 30px;
            text-align: center;
            line-height: 30px;
            font-size: 12px;
          }
        }
        .payment-address {
          width: 100%;
          .el-input__wrapper {
            width: 100%;
          }
        }
        .payment-address-error {
          width: 360px;
          color: #be2727d6;
          font-size: 12px;
          text-align: center;
        }
        .payment-eth-gas-tips {
          margin-top: 10px;
          line-height: 20px;
          text-align: center;
          word-break: break-word;
          color: grey;
        }
        .amount-balance-error {
          width: 360px;
          color: #be2727d6;
          font-size: 12px;
          text-align: center;
        }
        .step1-foot {
          display: flex;
          justify-content: space-around;
          margin: 20px 0;
          height: 60px;
          text-align: center;
          > button {
            width: 150px;
            font-size: 14px;
          }
        }
      }

      .bc-step2 {
        .product-info {
          height: 50px;
          line-height: 50px;
          text-align: center;
          font-size: 20px;
        }
        .payment-info {
          font-size: 14px;
          text-align: center;
        }
        .block-chain-rate {
          text-align: center;
        }
        .receiving-address {
          position: relative;
          span {
            display: block;
            margin-right: 10px;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
          }
          img {
            position: absolute;
            right: 0;
            top: 22px;
            width: 14px;
            cursor: pointer;
          }
        }
        .payment-address {
          font-size: 12px;
          span {
            display: block;
            margin-right: 10px;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
          }
          .el-input__wrapper {
            width: 100%;
          }
        }
        .payment-withdrawal-tips {
          text-align: center;
          line-height: 20px;
          font-size: 12px;
          color: grey;
        }

        .payment-methods {
          margin: 0 auto;
          width: 320px;
          text-align: left;
        }
        .payment-metamask {
          margin: 0px auto 20px auto;
          width: 200px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border: 1px solid;
          border-radius: 10px;
          cursor: pointer;
        }
        .account-qr {
          margin: 10px auto;
          width: 150px;
        }
        .address-div {
          padding-left: 20px;
          // margin-top: 20px;
          > div {
            margin: 0 auto;
            width: 320px;
            height: 50px;
            // line-height: 50px;
          }
        }
        .step2-foot {
          margin: 20px 0;
          height: 80px;
          text-align: center;
          > button {
            width: 150px;
          }
          .step2-payment-error {
            margin-top: 5px;
            height: 16px;
            line-height: 16px;
            color: #f56c6c;
          }
        }
        .block-chain-model-current {
          .span1 {
            margin-left: 15px;
          }
          .span2 {
            margin-left: 10px;
          }
        }
      }
      .bc-step3 {
        canvas,
        img {
          display: none;
        }
        .product-info {
          height: 50px;
          line-height: 50px;
          text-align: center;
          font-size: 20px;
        }
        .payment-info {
          font-size: 14px;
          text-align: center;
        }
        .block-chain-price {
          font-size: 14px;
          display: flex;
          justify-content: center;
          height: 20px;
          margin: 5px auto;
          img {
            display: inline-block !important;
            margin-right: 5px;
            width: 16px;
            height: 16px;
          }
          span {
            display: inline-block;
            height: 16px;
            line-height: 16px;
          }
        }
        .transaction-hash {
          width: 360px;
          font-size: 12px;
        }
        .useMetaMaskTips {
          margin-top: 10px;
          font-size: 12px;
          text-align: left;
          color: #f56c6c;
        }
        .manual-hash {
          margin: 5px;
          height: 20px;
          line-height: 20px;
          text-decoration: underline;
          font-size: 12px;
          cursor: pointer;
        }
        .go-to-hash {
          margin-top: 10px;
          .go-to-hash-span {
            font-size: 14px;
            text-decoration: underline;
            cursor: pointer;
          }
          i {
            margin-left: 20px;
            font-size: 20px;
            color: #27ae60;
          }
        }
        .go-to-hash-tips {
          font-size: 12px;
          color: #f56c6c;
        }
        .confirm-info {
          margin: 10px 0;
        }
        .step3-foot {
          margin: 20px 0;
          height: 80px;
          text-align: center;
          > button {
            width: 150px;
          }
          .btn_complete_payment {
            width: 200px;
          }
          .step3-payment-error {
            margin-top: 5px;
            color: #f56c6c;
            line-height: 16px;
          }
        }
      }
      .count-down {
        margin: auto;
        // display: flex;
        // flex-direction: column;
        // align-items: center;
        height: 50px;
        // line-height: 50px;
        text-align: center;
        width: 330px;
        .count-down-text {
          font-size: 12px;
          display: block;
        }
        .count-down-time1 {
          font-size: 24px;
          color: #409eff;
        }
        .count-down-time2 {
          font-size: 16px;
          color: #be2727d6;
        }
      }
    }
    .el-dialog__close,
    .el-dialog__close:hover {
      color: #909399;
    }
    .payment-address {
      display: block;
      margin: 0 auto;
      // width: 350px;
      font-size: 12px;
      .el-input__wrapper {
        width: 100%;
      }
    }
    .block-chain-model {
      position: relative;
      margin: 20px auto;
      height: 60px;
      width: 304px;
      .block-chain-model-price,
      .block-chain-model-current {
        width: 150px;
        float: left;
        height: 50px;
        text-align: center;
        line-height: 50px;
      }
      .block-chain-model-price {
        font-weight: 800;
        font-size: 28px;
        color: #be2727d6;
      }
      .block-chain-model-current {
        position: relative;
        border: 1px solid #9093997a;
        cursor: pointer;
        border-radius: 12px;
        .order-change {
          position: absolute;
          top: 15px;
          right: 5px;
          width: 20px;
          height: 20px;
        }
        span {
          position: absolute;
          text-align: center;
          display: block;
        }
        .span1 {
          top: 0;
          left: 20px;
          width: 100px;
          height: 34px;
          line-height: 34px;
          font-size: 23px;
          font-weight: 800;
        }
        .span2 {
          top: 34px;
          font-size: 12px;
          height: 12px;
          line-height: 12px;
          background: #90939924;
          left: 10px;
          width: 110px;
          font-weight: 400;
        }
        .block-chain-icon {
          position: absolute;
          top: 6px;
          left: -5px;
          width: 20px;
          height: 20px;
        }
      }
      .block-chain-model-choose {
        position: absolute;
        right: 0;
        width: 150px;
        background: #fff;
        top: 50px;
        z-index: 9999;
        border: 1px solid #9093997a;
        border-radius: 12px;
        > div {
          margin: 3px;
          text-align: center;
          cursor: pointer;
          height: 30px;
          line-height: 30px;
          .block-chain-model-choose-items {
            display: flex;
            justify-content: center;
            img {
              margin: 5px;
              width: 20px;
              height: 20px;
            }
          }
        }
      }
    }
  }
}

.blockchain-box-pay-address {
  &.el-dialog {
    background: linear-gradient(
      rgb(224, 236, 240) 0%,
      rgb(187, 221, 238) 50.94%,
      rgb(122, 180, 230) 100%
    );
    .el-dialog__title {
      color: #606266 !important;
    }
    .el-dialog__close,
    .el-dialog__close:hover {
      color: #909399;
    }
    .el-dialog__body {
      padding: 0px 20px !important;
      color: #606266 !important;
      height: 200px;
      .pay-address-choose {
        position: relative;
        width: 300px;
        height: 50px;
        line-height: 50px;
        border: 1px solid;
        border-radius: 10px;
        cursor: pointer;
        margin: 20px auto;
        display: flex;
        justify-content: center;
        img {
          margin: 15px 10px;
          width: 20px;
          height: 20px;
        }
        .is-choose {
          position: absolute;
          top: 21px;
          left: 42px;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background: #27ae60;
        }
      }
      .pay-address-choose-tips {
        margin-left: 30px;
        font-size: 12px;
        color: #be2727d6;
      }
    }
  }
}
</style>
