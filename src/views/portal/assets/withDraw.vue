<template>
  <div>
    <!-- 体现第一步 -->
    <el-dialog
      class="withdraw-dialog"
      :model-value="visible"
      :title="title"
      width="910px"
      :show-close="!loading"
      :lock-scroll="true"
      :close-on-click-modal="false"
      @close="close"
    >
      <div v-loading="dialogLoading">
        <div class="no_auth_withdraw" v-if="no_auth_withdraw">
          {{ no_auth_withdraw }}!
        </div>
        <el-form
          v-if="!dialogLoading && !no_auth_withdraw"
          label-position="left"
          class="withdraw-form"
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="220px"
        >
          <el-form-item label="From DMC" v-if="!isWalletUser">
            <span>{{ walletUser }}</span>
          </el-form-item>
          <el-form-item label="Balance">
            <span>{{ oldWalletMoney }} DMC</span>
          </el-form-item>
          <el-form-item label="To DMC" prop="receiver">
            <span v-if="isWalletUser">{{ form.receiver }} (Owner)</span>
            <el-input
              v-if="!isWalletUser"
              v-model.trim="form.receiver"
              placeholder="Please enter your username in the DMC wallet"
            ></el-input>
          </el-form-item>
          <el-form-item label="Withdrawal Amount" prop="walletMoney">
            <span v-if="!isWalletUser"> {{ actualMoeny }} DMC </span>
            <div class="all-box" v-else>
              <!-- <el-input
                v-model.number="form.walletMoney"
                oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
              >
                <template #suffix>
                  <span>DMC</span>
                </template>
              </el-input> -->
              <el-input-number
                v-model="form.walletMoney"
                :min="0.01"
                :precision="4"
                title=""
                :controls="false"
              ></el-input-number>
              <span class="dmc">DMC</span>
              <span @click="getAll" class="text-button">ALL Amounts</span>
            </div>
          </el-form-item>
          <el-form-item label="Gas Fee">
            <span class="gas-fee">{{ gasfee }} DMC </span>
            <span class="gas-fee-tips"
              >(1% service charge needs to be deducted)</span
            >
          </el-form-item>
          <el-form-item label="Total">
            <span class="total">{{ total }} DMC</span>
          </el-form-item>
        </el-form>
      </div>
      <template v-if="!dialogLoading && !no_auth_withdraw" #footer>
        <div class="color-box">
          <el-button :loading="loading" type="primary" @click="next">
            <RippleInk></RippleInk>
            Next</el-button
          >
        </div>
      </template>
    </el-dialog>
    <!-- 谷歌二维码 -->
    <el-dialog
      width="700px"
      class="withdraw-dialog"
      title="Enable Dual Authentication"
      :modal="false"
      :lock-scroll="true"
      :show-close="!loading"
      :close-on-click-modal="false"
      v-model="showGoogleQrcode"
    >
      <div class="qrcode-step">
        <div class="google-tips">
          Please use Google Authenticator or other compatible programs on your
          phone to scan the QR code below, or manually enter a 16 digit key.
        </div>
        <div class="auth_qrcode" v-if="authQrcode && !withDrawBtn">
          <img :src="authQrcode" />
        </div>
        <div class="auth_input" v-if="scret_key && !withDrawBtn">
          <span>
            {{ "Verification key:" }}{{ scret_key }}
            <el-icon class="copy-icon" @click="copySecret(scret_key)"
              ><DocumentCopy
            /></el-icon>
          </span>
        </div>
        <div class="auth_input" v-if="scret_key && !withDrawBtn">
          <span>
            <el-icon class="warning-icon"><Warning /></el-icon>
            Please save your Google verification key in time. This key is
            generated only once and will not be retained after refreshing.</span
          >
        </div>
        <div class="auth_input" v-if="scret_key && !withDrawBtn">
          <el-form
            :rules="withdrawRules"
            ref="authorFormRef"
            class="withdraw-form"
            :model="authorForm"
          >
            <el-form-item
              label="Please enter Google Author"
              prop="validateToken"
            >
              <!-- <el-input
                :placeholder="'Google Author'"
                v-model="authorForm.validateToken"
                class="my_auth_input"
              /> -->
              <VerificationCode
                v-if="showGoogleQrcode"
                v-model:authInput="authorForm.validateToken"
              ></VerificationCode>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="showErrorTips" class="showErrorTips">
          {{ googleErrorTip }}
        </div>
      </div>
      <!-- //验证是否手机操作google -->
      <template #footer>
        <div class="color-box google">
          <!-- <el-button :loading="loading" type="primary" @click="next">
            <RippleInk></RippleInk>
            Next</el-button
          > -->
          <el-button
            :loading="loading"
            type="primary"
            style="width: auto; margin-bottom: 30px; height: 46px"
            v-if="scret_key && !withDrawBtn"
            class="submit_btn"
            @click="showGoogleKey"
          >
            <RippleInk></RippleInk>
            Google Authentication</el-button
          >
        </div>
        <!-- <el-button
          :loading="loading"
          type="primary"
          style="width: auto; margin-bottom: 30px; height: 46px"
          v-if="scret_key && !withDrawBtn"
          class="submit_btn"
          @click="showGoogleKey"
        >
          <RippleInk></RippleInk>
          Google Authentication</el-button
        > -->
      </template>
    </el-dialog>
    <!-- 谷歌验证码提现框 -->
    <el-dialog
      top="25vh"
      width="700px"
      class="withdraw-dialog"
      title="Withdraw"
      :modal="false"
      :lock-scroll="true"
      :close-on-click-modal="false"
      :show-close="!loading"
      v-model="showGoogleBtn"
    >
      <el-form
        :model="withdrawForm"
        ref="withdrawFormRef"
        label-position="left"
        label-width="180px"
        class="withdraw-form"
        :rules="withdrawRules"
      >
        <el-form-item
          v-if="withDrawBtn"
          label="Google Author"
          prop="my_auth_input"
        >
          <VerificationCode
            v-if="showGoogleBtn"
            v-model:authInput="withdrawForm.my_auth_input"
          ></VerificationCode>

          <!-- <el-input
            clearable
            placeholder="Please enter Google Author"
            v-model="withdrawForm.my_auth_input"
          ></el-input> -->
        </el-form-item>
      </el-form>
      <div v-if="showErrorTips" class="showErrorTips">
        {{ googleErrorTip }}
      </div>
      <template #footer>
        <!-- <el-button
          style="margin-top: 20px"
          v-if="withDrawBtn"
          type="primary"
          @click="handelWithdraw"
          :loading="loading"
        >
          <RippleInk></RippleInk>
          Withdraw</el-button
        > -->
        <div class="color-box">
          <el-button
            v-if="withDrawBtn"
            type="primary"
            @click="handelWithdraw"
            :loading="loading"
          >
            <RippleInk></RippleInk>
            Withdraw</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, toRefs, watch, computed, inject } from "vue";
import {
  getGoogle,
  getWithdrawGoogle,
  withdrawGoogle,
  checkAccount,
  withdrawDMC,
  verifyGoogle,
} from "@/utils/api.js";
import { Base64 } from "js-base64";
import { ElNotification } from "element-plus";
import VerificationCode from "./verificationCode";
import RippleInk from "@/components/rippleInk";
export default {
  name: "WithDraw",
  components: { VerificationCode, RippleInk },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Withdraw",
    },
    walletUser: {
      type: String,
      default: "",
    },
    walletType: {
      type: String,
      default: "",
    },
    noOrderShow: {
      type: Boolean,
    },
    withDrawMoney: {},
  },
  setup(props, { emit }) {
    const requestTarget = inject("requestTarget");
    const close = () => {
      emit("reload");
      emit("update:visible", false);
    };
    const { visible, title, walletUser, walletType, withDrawMoney } =
      toRefs(props);
    const form = reactive({
      did: "hhvk3oti4qlr",
      balance: "3.00",
      receiver: "",
      walletMoney: "",
      gasfee: "0.0",
      total: "",
    });
    const withdrawForm = reactive({
      my_auth_input: "",
    });
    const authorForm = reactive({
      validateToken: "",
    });
    const formRef = ref(null);
    const withdrawFormRef = ref(null);
    const authorFormRef = ref(null);
    const dialogLoading = ref(false);
    const showGoogleBtn = ref(false);
    const showGoogleQrcode = ref(false);
    const withDrawBtn = ref(false);
    const oldWalletMoney = ref("");
    const actualMoeny = ref("");
    const scret_keyOld = ref("");
    const scret_key = ref("");
    const authQrcode = ref("");
    const isWalletUser = ref(false);
    const no_auth_withdraw = ref("");
    const loading = ref(false);
    const showErrorTips = ref(false);
    const googleErrorTip = ref("");
    let gasfee = computed(() => {
      return (Number(form.walletMoney) * 0.01).toFixed(4);
    });
    let total = computed(() => {
      return (Number(form.walletMoney) + Number(gasfee.value)).toFixed(4);
    });
    const validateReceiver = (rule, value, cb) => {
      if (!value) {
        cb(new Error("Please enter the account address to withdraw"));
      } else {
        let postdata = {
          account_name: form.receiver,
        };
        checkAccount(postdata, requestTarget).then(
          (res) => {
            cb();
          },
          (err) => {
            cb(
              new Error(
                "The account does not exist. Please enter the correct account address"
              )
            );
          }
        );
      }
    };
    const validateWalletMoney = (rule, value, cb) => {
      if (!value) {
        cb(new Error("Please enter the withdrawal amount"));
      } else if (value > Number(actualMoeny.value)) {
        cb(new Error("Exceeds the withdrawal amount"));
      } else if (Number(value) < 0.01) {
        cb(new Error("The minimum withdrawal amount is 0.01"));
      } else {
        cb();
      }

      return value;
    };
    const rules = {
      receiver: [{ validator: validateReceiver, trigger: "blur" }],
      walletMoney: [{ validator: validateWalletMoney, trigger: "change" }],
    };
    const validateAuthInput = (rule, value, cb) => {
      let numReg = /^\d{6}$/;
      if (!value) {
        cb(new Error("Please enter Google Author"));
      } else if (!numReg.test(value)) {
        cb(new Error("Please enter Google Authenticator in 6-digit format"));
      } else {
        cb();
      }
    };
    const withdrawRules = {
      validateToken: [{ validator: validateAuthInput, trigger: "blur" }],
      my_auth_input: [{ validator: validateAuthInput, trigger: "blur" }],
    };
    watch(
      walletUser,
      (data) => {
        if (visible.value) {
          initGoogle(data);
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );
    watch(
      visible,
      (data) => {
        if (data) {
          initGoogle(walletUser.value);
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );
    watch(
      walletType,
      (data) => {
        if (data === "wallet" && walletUser.value) {
          form.receiver = walletUser.value;
          isWalletUser.value = true;
        } else {
          form.receiver = "";
          isWalletUser.value = false;
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );
    watch(
      withDrawMoney,
      (data) => {
        if (data) {
          oldWalletMoney.value = data;
          actualMoeny.value = Number(
            Number(oldWalletMoney.value) / 1.01
          ).toFixed(4);
          form.walletMoney = actualMoeny.value;
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );
    function getAll() {
      form.walletMoney = actualMoeny.value;
    }
    //初始化google二维码
    async function initGoogle() {
      if (walletUser.value) {
        dialogLoading.value = true;
        let res = await getGoogle(walletUser.value);
        if (res && res.status === "Verification succeeded" && !res.OTP) {
          let data = {
            account: walletUser.value,
          };
          let res = await getWithdrawGoogle(data);
          scret_keyOld.value = res.secret;
          scret_key.value = Base64.decode(res.secret);
          authQrcode.value = "data:image/jpg;base64," + res.qrcode;
          dialogLoading.value = false;
        } else if (res && res.status === "Verification succeeded" && res.OTP) {
          withDrawBtn.value = true;
          dialogLoading.value = false;
        } else {
          showGoogleBtn.value = false;
          dialogLoading.value = false;
          withDrawBtn.value = false;
          no_auth_withdraw.value = res.status;
        }
      }
    }
    function next() {
      loading.value = true;
      formRef.value.validate((valid) => {
        if (valid) {
          if (withDrawBtn.value) {
            // 可提现
            showGoogleBtn.value = true;
            withdrawForm.my_auth_input = "";
            showErrorTips.value = false;
          } else {
            showGoogleQrcode.value = true;
            authorForm.validateToken = "";
          }
        }
        loading.value = false;
      });
    }
    async function showGoogleKey() {
      checkValidate(authorForm.validateToken);
      // authorFormRef.value.validate(async (valid) => {
      if (!showErrorTips.value) {
        loading.value = true;
        //验证是否手机操作google并开启google验证
        let postData = {
          token: authorForm.validateToken,
          // secret: Base64.encode(this.scret_key),
          secret: scret_keyOld.value,
        };
        let data = await verifyGoogle(postData);
        if (data.code === 400 || data.error === "Invalid OTP token!") {
          loading.value = false;
          ElNotification({
            type: "error",
            title: "Verification code error",
            message: "Please enter Google Authenticator in 6-digit format",
            position: "bottom-left",
          });
          return;
        } else {
          setGoogle();
          authorForm.validateToken = "";
        }
      }
      // });
    }
    //验证google
    async function setGoogle() {
      if (walletUser.value) {
        let data = {
          account: walletUser.value,
          // secret: Base64.encode(this.scret_key),
          secret: scret_keyOld.value,
        };
        let res = await withdrawGoogle(data);
        if (res) {
          showGoogleQrcode.value = false;
          showGoogleBtn.value = true;
          withDrawBtn.value = true;
          loading.value = false;
        }
      }
    }
    function handelWithdraw() {
      let postdata = {
        account_name: form.receiver,
      };
      checkValidate(withdrawForm.my_auth_input);
      // withdrawFormRef.value.validate((valid) => {
      if (!showErrorTips.value) {
        loading.value = true;
        checkAccount(postdata, requestTarget).then(
          (res) => {
            let data = {
              account: walletUser.value,
              amount: Number(form.walletMoney),
              receiver: form.receiver, //没有设置OTP的，account和receiver 必须⼀致
              totp_secret: withdrawForm.my_auth_input,
            };
            withdrawDMC(data).then((res) => {
              loading.value = false;
              if (res.code !== 400) {
                // let str = "vood.withdrawSuccess";
                // this.$message.success(str);
                showGoogleBtn.value = false;
                withdrawForm.my_auth_input = "";
                close();
                ElNotification({
                  title: "Withdrawal succeeded",
                  message: "Withdrawal succeeded",
                  position: "bottom-left",
                  type: "success",
                });
              } else {
                ElNotification({
                  title: "Withdrawal failed",
                  message: res.error,
                  position: "bottom-left",
                  type: "error",
                });
              }
            });
          },
          (err) => {
            loading.value = false;
            ElNotification({
              title: "Withdrawal failed",
              message:
                "The account does not exist. Please enter the correct account address",
              position: "bottom-left",
              type: "error",
            });
            return;
          }
        );
      }
      // });
    }
    function copySecret(key) {
      var input = document.createElement("textarea"); // 创建input对象
      input.value = key; // 设置复制内容
      document.body.appendChild(input); // 添加临时实例
      input.select(); // 选择实例内容
      document.execCommand("Copy"); // 执行复制
      document.body.removeChild(input); // 删除临时实例
      ElNotification({
        type: "success",
        message: "Copy succeeded",
        position: "bottom-left",
      });
    }
    function checkValidate(value) {
      let numReg = /^\d{6}$/;
      showErrorTips.value = false;
      if (!value) {
        showErrorTips.value = true;
        googleErrorTip.value = "Please enter Google Author";
        return;
      } else if (!numReg.test(value)) {
        showErrorTips.value = true;
        googleErrorTip.value =
          "Please enter Google Authenticator in 6-digit format";
        return;
      } else {
        showErrorTips.value = false;
      }
    }
    return {
      visible,
      dialogLoading,
      title,
      loading,
      form,
      formRef,
      authorFormRef,
      rules,
      withdrawRules,
      actualMoeny,
      showGoogleBtn,
      showGoogleQrcode,
      withDrawBtn,
      oldWalletMoney,
      walletUser,
      isWalletUser,
      authorForm,
      scret_key,
      authQrcode,
      close,
      getAll,
      next,
      copySecret,
      total,
      gasfee,
      withdrawForm,
      withdrawFormRef,
      showGoogleKey,
      handelWithdraw,
      no_auth_withdraw,
      showErrorTips,
      googleErrorTip,
    };
  },
};
</script>

<style lang="scss" scoped>
$light_blue: #29abff;
.withdraw-form {
  margin-top: 16px;
  :deep {
    .el-form-item {
      align-items: center;
    }
    .el-form-item__label {
      font-size: 20px;
      color: #000;
    }
    .el-form-item__content {
      span {
        font-size: 18px;
        font-weight: 700;
        color: #000;
      }
      .el-input__wrapper {
        border: 1px solid rgb(153 153 153);
        border-radius: 16px;
        background: #000;
        .el-input__suffix-inner {
          span {
            font-size: 24px;
          }
        }
        .el-input__inner {
          --el-input-placeholder-color: #727272;
        }
      }

      .gas-fee {
        font-size: 24px;
        font-weight: 700;
        color: $light_blue;
      }
      .gas-fee-tips {
        margin-left: 10px;
        font-size: 14px;
      }
      .total {
        font-size: 36px;
        color: #000;
        font-weight: 700;
      }
    }
    .all-box {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      .dmc {
        position: absolute;
        left: 260px;
      }
      .el-input-number {
        box-sizing: border-box;
        width: 320px;
      }
      .el-input__wrapper {
        padding-right: 90px;
      }
      .text-button {
        display: inline-block;
        flex: 1;
        margin-left: 16px;
        font-size: 20px;
        font-weight: 100;
        color: $light_blue;
        cursor: pointer;
      }
    }
  }
}
</style>
<style lang="scss">
.withdraw-dialog {
  position: relative;
  backdrop-filter: blur(40px);
  background: rgba(255, 255, 255, 0.6);
  .showErrorTips {
    padding-left: 200px;
    margin-bottom: 20px;
    color: #ff0000;
    text-align: left;
  }
  .no_auth_withdraw {
    margin: 50px auto;
    text-align: center;
    color: #000;
    font-size: 30px;
  }
  .qrcode-step {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .google-tips {
      margin-top: 16px;
      margin-bottom: 20px;
      font-size: 16px;
      color: #000;
    }
    .auth_input {
      display: flex;
      align-items: center;
      margin-top: 30px;
      color: #000;
      font-size: 16px;
      span {
        display: inline-block;
        width: 100%;
      }
      .copy-icon {
        cursor: pointer;
      }
      .warning-icon {
        color: #ff9200;
      }
    }
  }
  .el-loading-mask {
    background: transparent;
  }
  .el-input__wrapper {
    border: 1px solid rgb(153 153 153);
    border-radius: 16px;
    background: transparent !important;
    .el-input__suffix-inner {
      span {
        font-size: 24px;
      }
    }

    .el-input__inner {
      color: #000;
      --el-input-placeholder-color: #727272;
    }
  }
  .el-dialog__footer {
    text-align: center;
    .color-box {
      // .color-box();
      @include color-box;

      display: inline-block;
      // width: 200px;
      // height: 60px;
      margin: 0 auto;
      &.google {
        // width: auto;
        height: 46px;
      }
    }
    .el-button {
      position: relative;
      width: 200px;
      height: 60px;
      margin: 0px auto 0;
      font-size: 20px;
      border-radius: 45px;
      box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 20%);
      background: var(--btn-gradient);
      cursor: pointer;
      .ripple-ink {
        border-radius: 45px;
      }
      // &:hover {
      //   transform: scale(1.05);
      // }
    }
  }
}
</style>
