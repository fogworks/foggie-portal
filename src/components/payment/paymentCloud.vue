<template>
  <div v-show="isShow" class="payment-cloud-box">
    <div class="payment-cloud-box-div">
      <svg-icon
        class="icon-close"
        size="14"
        icon-class="cancel"
        @click="closePaymentCloud"
      ></svg-icon>
      <h2>{{ $t("paymentCloud.title") }}</h2>
      <h2>{{ $t("paymentCloud.total_amount") }}{{ amount }}</h2>
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        class="payment-cloud-form"
      >
        <el-form-item
          :label="$t('paymentCloud.card_number')"
          prop="cardNumber"
          class="card-number"
        >
          <el-input v-model="formData.cardNumber"></el-input>
        </el-form-item>
        <div class="credit-card">
          <el-form-item
            :label="$t('paymentCloud.expiration_date')"
            prop="expirationDate"
          >
            <el-input
              v-model="formData.expirationDate"
              v-on:input="expirationDateClick"
              oninput="value=value.replace(/[^\d]/g,'')"
              maxLength="5"
              placeholder="MM/YY"
            >
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('paymentCloud.card_code')" prop="cardCode">
            <el-input v-model="formData.cardCode"> </el-input>
          </el-form-item>
        </div>

        <!-- <h2 v-if="is_billing_show">{{ $t('paymentCloud.billing_address') }}</h2> -->
        <div v-if="is_billing_show" class="billing-address">
          <el-form-item
            :label="$t('paymentCloud.bill_firstName')"
            prop="firstName"
          >
            <el-input
              v-model="formData.firstName"
              onkeyup="this.value=this.value.replace(/[^a-zA-Z]/g,'')"
              maxlength="30"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('paymentCloud.bill_lastName')"
            prop="lastName"
          >
            <el-input
              v-model="formData.lastName"
              onkeyup="this.value=this.value.replace(/[^a-zA-Z]/g,'')"
              maxlength="30"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item :label="$t('paymentCloud.bill_country')" prop="country">
            <el-input v-model="formData.country"></el-input>
          </el-form-item> -->
          <el-form-item :label="$t('paymentCloud.bill_country')">
            <el-select
              v-model="formData.country"
              :placeholder="$t('index.pleaseSelect')"
              :popper-append-to-body="false"
              popper-class="select-popper"
              class="vps-select"
            >
              <el-option
                v-for="item in countryArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item :label="$t('paymentCloud.bill_zip')">
            <el-input v-model="formData.billTo.zip"></el-input>
          </el-form-item> -->
          <el-form-item :label="$t('paymentCloud.bill_address')" prop="address">
            <el-input
              v-model="formData.address"
              onkeyup="this.value=this.value.replace(/[^\w\s\/\'#$,.-]/g,'')"
              maxlength="80"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item :label="$t('paymentCloud.bill_city')">
            <el-input v-model="formData.billTo.city"></el-input>
          </el-form-item>
          <el-form-item :label="$t('paymentCloud.bill_state')">
            <el-input v-model="formData.billTo.state"></el-input>
          </el-form-item> -->
          <el-form-item
            :label="$t('paymentCloud.bill_phoneNumber')"
            prop="phoneNumber"
          >
            <el-input
              v-model="formData.phoneNumber"
              onkeyup="this.value=this.value.replace(/[^\d-]/g,'')"
              maxlength="25"
            ></el-input>
          </el-form-item>
        </div>

        <el-form-item class="payment-cloud-footer">
          <el-button @click="closePaymentCloud">{{
            $t("paymentCloud.cancel")
          }}</el-button>
          <el-button type="primary" @click="goToPay">{{
            $t("paymentCloud.confirm")
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { authorize_net_pay } from "@/utils/api.js";
// import EthereumQRPlugin from 'ethereum-qr-code';
import isoStandardCountryCodes from "./isoStandardCountryCodes.json";

export default {
  props: {
    referer_name: {
      type: String,
    },
    amount: {
      type: Number,
    },
    payment_cloud_show: {
      type: Boolean,
    },
    payment_cloud_trans_id: {
      type: Number,
    },
  },
  watch: {
    payment_cloud_show: {
      handler(newValue) {
        if (newValue) {
          this.formData.cardNumber = "";
          this.formData.expirationDate = "";
          this.formData.cardCode = "";
        }
        this.isShow = newValue;
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      formData: {
        cardNumber: "",
        expirationDate: "",
        cardCode: "",
        address: "",
        city: "",
        country: "US",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        // billTo: {
        //   address: "",
        //   city: "",
        //   country: "",
        //   firstName: "",
        //   lastName: "",
        //   state: "",
        //   zip: "",
        // },
        // billTo: {
        //   address: '14 Main Street',
        //   city: 'Pecan Springs',
        //   country: 'US',
        //   firstName: 'Ellen',
        //   lastName: 'JohnsonPecan Springs',
        //   state: 'TX',
        //   zip: '44628',
        // },
      },
      countryArr: isoStandardCountryCodes.ISOStandardCountryCodes,
      isShow: false,
      is_billing_show: true,
      rules: {
        cardNumber: [
          {
            required: true,
            message: this.$t("paymentCloud.card_number_validate"),
            trigger: ["change", "blur"],
          },
        ],
        expirationDate: [
          {
            required: true,
            message: this.$t("paymentCloud.expiration_validate"),
            trigger: ["change", "blur"],
          },
          {
            validator: this.validateExpiration,
            trigger: ["blur"],
          },
        ],
        cardCode: [
          {
            required: true,
            message: this.$t("paymentCloud.card_code_validate"),
            trigger: ["change", "blur"],
          },
        ],
        firstName: [
          {
            required: true,
            message: this.$t("paymentCloud.firstName_validate"),
            trigger: ["change", "blur"],
          },
        ],
        lastName: [
          {
            required: true,
            message: this.$t("paymentCloud.lastName_validate"),
            trigger: ["change", "blur"],
          },
        ],
        // country: [
        //   {
        //     required: true,
        //     message: this.$t("paymentCloud.country_validate"),
        //     trigger: ["change", "blur"],
        //   },
        // ],
        address: [
          {
            required: true,
            message: this.$t("paymentCloud.address_validate"),
            trigger: ["change", "blur"],
          },
        ],
        phoneNumber: [
          {
            required: true,
            message: this.$t("paymentCloud.phoneNumber_validate"),
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    validateExpiration(rule, value, callback) {
      const reg = /[01]\d\/\d{2}/;
      if (value && !reg.test(value)) {
        callback(new Error(this.$t("paymentCloud.validate_expiration")));
      } else {
        callback();
      }
    },
    expirationDateClick(e) {
      if (e.toString() === "00") {
        this.formData.expirationDate = 0;
      } else if (e.toString() === "0" || e === "") {
        this.formData.expirationDate = e;
      } else if (
        e.toString().length == 2 &&
        Number(e) > 12 &&
        Number(e) < 100
      ) {
        this.formData.expirationDate = `0${e.substr(0, 1)}/${e.substr(1)}`;
      } else if (
        e.toString().length == 3 &&
        Number(e) > 12 &&
        Number(e) < 100
      ) {
        this.formData.expirationDate = `${e.substr(0, 2)}/${e.substr(2)}`;
      } else if (Number(e) >= 100) {
        if (Number(e.substr(0, 2)) > 12) {
          this.formData.expirationDate = `0${e.substr(0, 1)}/${e.substr(1)}`;
        } else {
          this.formData.expirationDate = `${e.substr(0, 2)}/${e.substr(2)}`;
        }
      }
    },
    goToPay() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let expirationDate = this.formData.expirationDate.replace("/", "");
          expirationDate = `20${expirationDate.substr(
            2
          )}-${expirationDate.substr(0, 2)}`;
          let billTo = {
            address: this.formData.address,
            city: "",
            country: this.formData.country,
            firstName: this.formData.firstName,
            lastName: this.formData.lastName,
            state: "",
            zip: "",
            phoneNumber: this.formData.phoneNumber,
          };
          let data = {
            creditCard: {
              cardNumber: this.formData.cardNumber,
              expirationDate: expirationDate,
              cardCode: this.formData.cardCode,
            },
            amount: this.amount,
            refId: this.payment_cloud_trans_id,
            //  refId: 2039,
            payment_method: "authorize_net",
            billTo,
          };
          console.log("data", data);
          authorize_net_pay(data).then((res) => {
            this.isShow = false;
            if (res.error && res.error === "authorize_net price is not match") {
              this.$message({
                type: "error",
                message: this.$t("paymentCloud.pay_fail"),
              });
            }
          });
        }
      });
    },
    closePaymentCloud() {
      this.$emit("closePaymentCloud", this.referer_name);
      // this.isShow = false;
    },
  },
};
</script>
<style lang="scss">
.payment-cloud-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
  background: rgba(0, 0, 0, 0.5);

  .payment-cloud-box-div {
    position: relative;
    margin: 15vh auto;
    width: 600px;
    height: 600px;
    border-radius: 10px;
    background: linear-gradient(
      rgb(224, 236, 240) 0%,
      rgb(187, 221, 238) 50.94%,
      rgb(122, 180, 230) 100%
    );
    box-shadow: rgb(0 0 0 / 25%) 0px 54px 55px, rgb(0 0 0 / 12%) 0px -12px 30px,
      rgb(0 0 0 / 12%) 0px 4px 6px, rgb(0 0 0 / 17%) 0px 12px 13px,
      rgb(0 0 0 / 9%) 0px -3px 5px;
    > h2 {
      padding: 10px 0;
      margin: 0px auto;
      width: 480px;
      font-weight: normal;
      font-size: 20px;
      color: #666;
    }
    .icon-close {
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 20px;
      cursor: pointer;
    }
    .payment-cloud-form {
      margin: 10px auto;
      width: 500px;
      .credit-card,
      .billing-address {
        margin-top: 30px;
        display: grid;
        grid-template-columns: 50% 50%;
      }
      .billing-address {
        margin-top: 10px;
      }
      .el-form-item {
        position: relative;
        margin-bottom: 30px;
        width: 50%;
        height: 45px;
        label {
          position: absolute;
          top: 0px;
          margin-left: 10px;
          // width: 100% !important;
          height: 20px;
          font-size: 12px !important;
          color: grey;
          line-height: 20px;
          text-align: left;
        }
        .el-form-item__content {
          position: absolute;
          top: 20px;
          margin-left: 10px !important;
          width: 230px;
          .el-input__inner {
            height: 40px;
            line-height: 40px;
          }
        }
      }
      .card-number {
        width: 100%;
        .el-form-item__content {
          width: 480px;
        }
      }
      .payment-cloud-footer {
        margin-top: 10px;
        width: 100%;
        text-align: right;
        .el-form-item__content {
          justify-content: center;
          right: 20px;
          width: 100%;
          button {
            width: 150px;
          }
        }
      }
    }
  }
}
</style>
