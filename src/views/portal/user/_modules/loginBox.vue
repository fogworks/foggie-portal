<template>
  <div class="my_login_box">
    <div class="my_login_main">
      <div class="my_login_div">
        <div class="my_login_right">
          <h1 class="my_login_right_title stagger1">
            Sign In
            <!-- <el-tooltip
              class="item"
              content="A new account will be registered during the first login, please enter the verification code to log in your account."
              placement="top-start"
            >
              <el-icon class="el-icon-info question_icon"
                ><InfoFilled
              /></el-icon>
            </el-tooltip> -->
          </h1>
          <el-form
            @submit.native.prevent
            class="account-form"
            ref="loginForm"
            :model="loginForm"
            :rules="formRules"
            autocomplete="on"
            label-position="left"
          >
            <el-form-item prop="email">
              <div class="my_login_right_input_img">
                <img
                  src="@/assets//system/envelope-blue.svg"
                  alt="email icon"
                  class=""
                />
              </div>
              <el-input
                ref="email"
                v-model="loginForm.email"
                :placeholder="'Enter your Email'"
                name="email"
                type="text"
                tabindex="1"
                autocomplete="on"
              />
            </el-form-item>

            <el-form-item prop="password">
              <div class="my_login_right_input_img">
                <img
                  src="@/assets/system/lock-blue.svg"
                  alt="password icon"
                  class=""
                />
              </div>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                :placeholder="'Please enter password'"
                name="password"
                tabindex="2"
                autocomplete="on"
                class=""
              />
            </el-form-item>
            <el-form-item v-if="!haveUser" prop="confirmPassword">
              <div class="my_login_right_input_img">
                <img
                  src="@/assets/system/lock-blue.svg"
                  alt="password icon"
                  class=""
                />
              </div>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.confirmPassword"
                :type="passwordType"
                :placeholder="'Please confirm password'"
                name="password"
                tabindex="2"
                autocomplete="on"
                class=""
              />
            </el-form-item>
            <!-- <el-form-item
              prop="promo_code"
              v-if="!haveUser && promo_code_checked"
            >
              <div class="my_login_right_input_img">
                <img
                  src="@/assets/system/promo_code.svg"
                  alt="email icon"
                  class=""
                />
              </div>
              <el-input
                ref="promo_code"
                v-model="loginForm.promo_code"
                :placeholder="'Invitation code (optional)'"
                name="promo_code"
                type="text"
                tabindex="1"
                autocomplete="on"
              />
            </el-form-item> -->

            <el-form-item prop="captcha_text" v-if="haveUser && showCaptcha">
              <el-input
                ref="captcha_text"
                v-model="loginForm.captcha_text"
                :placeholder="'Please enter verification code!'"
                name="captcha_text"
                tabindex="2"
                autocomplete="on"
                class="captcha_text"
              />
              <img :src="codeSrc" class="code_src" @click="updateCatpure" />
            </el-form-item>
            <!-- v-if="haveChoose && !haveUser" -->
            <!-- <div class="Register_btn">
              <span @click="emailLogin"> {{ ("login.emailLogin") }}?</span>
              OR
              <span @click="passwordLogin" class="password_login">
                {{ ("login.passwordLogin") }}?</span
              >
            </div> -->
            <el-button
              :loading="loading"
              type="primary"
              style="width: 100%; margin-bottom: 30px; height: 46px"
              @click.native.prevent="goToRegister"
              v-if="!haveUser && !haveChoose"
              class="ejUnNt"
              >{{ "Register" }}</el-button
            >
            <el-button
              :loading="loading"
              type="primary"
              style="width: 100%; margin-bottom: 30px; height: 46px"
              @click.native.prevent="handlepasswordLogin"
              v-if="haveUser"
              class="ejUnNt"
              >{{ "Sign in with Password" }}</el-button
            >
            <div class="Register_btn" v-if="!haveUser">
              <!-- <el-checkbox
                v-model="promo_code_checked"
                class="invitation_code_name"
                >{{ "Invitation code" }}</el-checkbox
              > -->
              <span @click="passwordLogin" class="password_login">
                {{ "Sign in with Password" }}</span
              >
            </div>
            <div class="Register_btn" v-if="haveUser">
              <span @click="haveUser = false" class="password_login">
                {{ "Register" }}</span
              >
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <el-dialog
      append-to-body
      :title="'Sign in with Email'"
      :visible.sync="showInvitationTips"
      width="30%"
      class="invitationTips-dialog"
      :before-close="isInvitationTipsClose"
    >
      <p>
        {{
          "Your email has not been registered, please use the invitation code!"
        }}
      </p>
      <el-button
        @click="callbackRegister"
        size="medium"
        class="callbackRegister-btn"
        >{{ "Return" }}</el-button
      >
      <el-button
        @click="confirmRegister"
        type="primary"
        size="medium"
        class="invitationTips-btn"
        >{{ "Continue" }}</el-button
      >
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";
import { Message } from "element-plus";
import {
  register,
  emailLogin,
  login,
  Captcha,
  user,
  githubReq,
  userOrderListPage,
  productLogin,
  payStripe,
  check_email_register,
  orderTransaction,
} from "@/utils/api.js";
import { getQueryString } from "@/utils/util.js";
const bcryptjs = require("bcryptjs");
export default {
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password again"));
      } else if (value !== this.loginForm.password) {
        callback(new Error("Two inputs don't match!"));
      } else {
        callback();
      }
    };
    const validateEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please Enter email address"));
      } else if (
        !/^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/.test(value)
      ) {
        callback(new Error("Please enter the correct email format!"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        email: "",
        password: "",
        confirmPassword: "",
        captcha_text: "",
        promo_code: "",
      },
      loading: false,
      formRules: {
        email: [
          {
            required: true,
            message: "Please Enter email address",
            trigger: "blur",
          },
          {
            validator: validateEmail,
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Please enter password",
            trigger: "blur",
          },
          {
            min: 8,
            max: 16,
            message: "The password length must be 8-16 characters.",
            trigger: "blur",
          },
        ],
        confirmPassword: {
          required: true,
          validator: validatePass2,
          trigger: "blur",
        },
      },
      haveChoose: false,
      haveUser: true,
      showCaptcha: false,
      passwordType: "password",
      capsTooltip: false,
      codeSrc: "",
      timer: null,
      intervalTime: 8 * 60 * 1000,
      captcha_id: "",
      fromOrigin: false,
      is_verified: false,
      getQueryString,
      nextPath: "index",
      promo_code_checked: false,
      showInvitationTips: false,
    };
  },
  created() {
    if (location.href.indexOf("pcode=") > -1) {
      this.promo_code_checked = true;
      this.loginForm.promo_code = location.href.split("pcode=")[1].substr(0, 6);
    }
  },
  watch: {
    haveUser() {
      this.loginForm = {
        email: "",
        password: "",
        confirmPassword: "",
        captcha_text: "",
        promo_code: "",
      };
    },
  },
  methods: {
    async getUserInfo() {
      let res = await user();
      if (res.data) {
        window.sessionStorage.setItem("walletUser", res.data.dmc);
        store.dispatch("global/setUserInfo", res.data);
      }
    },
    closeLogin() {
      this.$emit("closeLogin");
    },
    handleQuers() {
      let url = this.getQueryString("url");
      let desc = this.getQueryString("desc");
      if (url) {
        url = unescape(url);
        window.sessionStorage.setItem("cyberURL", url);
      }
      if (desc) {
        desc = unescape(desc);
        window.sessionStorage.setItem("cyberDESC", desc);
      }
      console.log(url, desc, "handleQuers");
    },
    initMessage() {
      var aData = localStorage.getItem("aPageData");
      if (aData) {
        this.fromOrigin = true;
        var currentProduct = JSON.parse(aData);
        window.localStorage.setItem(
          "activeProduct",
          JSON.stringify(currentProduct)
        );
        localStorage.removeItem("aPageData");
      } else {
        window.addEventListener("message", this.receiveMessage, false);
      }
    },
    receiveMessage(event) {
      if (event.origin !== "http://www.vofocorp.com") return;
      if (event.data) {
        this.fromOrigin = true;
        let currentProduct = event.data;
        console.log(this.fromOrigin, "this.fromOrigin");
        window.localStorage.setItem("activeProduct", currentProduct);
        window.localStorage.setItem("aPageData", currentProduct);
      }
    },
    // checkCapslock(e) {
    //   const { key } = e;
    //   this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    // },
    updateCatpure() {
      this.getCaptcha();
    },
    getCaptcha() {
      Captcha().then((res) => {
        this.codeSrc = res.data.image;
        this.captcha_id = res.data.id;
        this.timegetCaptcha();
      });
    },
    timegetCaptcha() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        Captcha().then((res) => {
          this.codeSrc = res.data.image;
          this.captcha_id = res.data.id;
          this.timegetCaptcha();
        });
      }, this.intervalTime);
    },
    emailLogin() {
      const that = this;
      this.haveUser = false;
      this.$alert(
        "A verification link has been sent to your email address, please check your email to verify and sign in your account.",
        "Sign in with Email",
        {
          confirmButtonText: "OK",
          callback: () => {
            that.$refs.loginForm.validate((valid) => {
              if (valid) {
                // if (this.is_verified) {
                let postData = {
                  email: that.loginForm.email,
                  redirect: window.location.origin,
                };
                emailLogin(postData).then((res) => {
                  if (res && res.data) {
                    that.$message({
                      type: "success",
                      message: res.data,
                      // message: that.("login.haveseedEmail"),
                    });
                  }
                });
                // }
              } else {
                console.log("error submit!!");
                return false;
              }
            });
          },
        }
      );
    },
    passwordLogin() {
      this.haveUser = true;
    },
    toEmailLogin() {
      this.haveUser = false;
    },
    async geNotFreeInfo() {
      let res = await user();
      if (res.data && res.data.dmc) {
        window.sessionStorage.setItem("walletUser", res.data.dmc);
      }
    },
    handlepasswordLogin() {
      const that = this;
      this.$refs.loginForm.validate(async (valid) => {
        // let reCaptchaV3Token = "";
        // await window.grecaptcha
        //   .execute(require("../utils/recaptchaRender").baseUrl, {
        //     action: "login",
        //   })
        //   .then((token) => {
        //     reCaptchaV3Token = token;
        //   });

        if (valid) {
          const password = this.loginForm.password;
          let hashPwd = bcryptjs.hashSync(password, 10);
          let postData = {
            email: that.loginForm.email,
            password: hashPwd,
            // recaptcha_token: reCaptchaV3Token,
          };
          login(postData).then((res) => {
            that.loading = false;
            if (res.next_step === "captcha") {
              that.getCaptcha();
              that.showCaptcha = true;
            } else if (res && res.data) {
              let data = res.data;
              let token = data.token_type + " " + data.access_token;
              let refresh_token = data.token_type + " " + data.refresh_token;
              let user_id = data.user_id;
              window.localStorage.setItem("user_id", user_id);
              window.localStorage.setItem("refresh_token", refresh_token);
              let userInfo = {
                username: that.loginForm.email,
                token: token, //res.token
                user_id: user_id,
              };
              if (this.timer) {
                clearInterval(this.timer);
              }
              store.dispatch("token/login", userInfo);

              that.loading = false;

              this.getUserInfo();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    stripePay(res, order_data) {
      let id = res.id;
      let len = res.order_transaction.length - 1;
      let trans_id = res.order_transaction && res.order_transaction[len].id;
      window.localStorage.setItem("order_id", id);
      let success_url = window.location.origin + `/#/order`;
      let cancel_url = window.location.origin + `/#/index`;
      let total_price = order_data.order_transaction[len].total_price;
      let postData = {
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              product_data: {
                name:
                  res.order_product_detail &&
                  res.order_product_detail[0] &&
                  res.order_product_detail[0].product.name,
                images: ["https://vfoggie.fogworks.io/favicon_ood.png"], //""https://i.imgur.com/EHyR2nP.png
              },
              // unit_amount: Number(order_data.total_price) * 100, //50
              unit_amount: this.numMulti(Number(total_price), 100),
              // unit_amount: 50, //50
            },
          },
        ],
        mode: "payment",
        payment_method_types: ["card"],
        success_url: success_url,
        cancel_url: cancel_url,
        trans_id: trans_id,
        isRenewal: false,
      };
      // this.loading = true;
      // this.loadingText = "Getting Card payment";
      payStripe(postData).then((res) => {
        this.loading = false;
        if (res && res.data && res.data.url) {
          window.location.href = res.data.url;
        }
      });
    },
    numMulti(num1, num2) {
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
    },
    handleLogin() {
      const that = this;
      // gtag("event", "verified_account");

      if (!this.loginForm.promo_code) {
        check_email_register(that.loginForm.email).then((rr) => {
          if (rr.data && rr.data.email) {
            this.goToRegister();
          } else {
            this.showInvitationTips = true;
            this.promo_code_checked = true;
          }
        });
      } else {
        this.goToRegister();
      }
    },
    confirmRegister() {
      this.showInvitationTips = false;
      this.goToRegister();
    },
    callbackRegister() {
      this.showInvitationTips = false;
    },
    goToRegister() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // let hashPwd = bcryptjs.hashSync(this.loginForm.password, 10);
          let hashPwd = this.loginForm.password;
          let postData = {
            email: this.loginForm.email,
            password: hashPwd,
            confirm: hashPwd,
          };
          register(postData).then((res) => {
            if (res && res.data && res.data.is_verified) {
              this.haveUser = true;
              this.$notify({
                type: "success",
                message: "Registration successful, please log in",
                position: "bottom-left",
              });
            } else if (res && res.data) {
              this.$alert(
                "A verification link has been sent to your email address, please check your email to verify and sign in your account.",
                "Activate your account",
                {
                  confirmButtonText: "OK",
                  callback: () => {
                    this.haveUser = true;
                  },
                }
              );
            }
          });
        }
      });
    },
    // goToRegister() {
    //   let postData = {
    //     register_type: "email",
    //     email: this.loginForm.email,
    //     redirect: window.location.origin,
    //     promo_code: this.loginForm.promo_code,
    //   };
    //   // gtag("event", "email_sent");
    //   register(postData).then((res) => {
    //     if (res && res.data && res.data.is_verified) {
    //       this.emailLogin();
    //     } else if (res && res.data) {
    //       this.$alert(
    //         "A verification link has been sent to your email address, please check your email to verify and sign in your account.",
    //         "Sign in with Email",
    //         {
    //           confirmButtonText: "OK",
    //           callback: () => {},
    //         }
    //       );
    //     }
    //   });
    // },
    isInvitationTipsClose() {
      this.showInvitationTips = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.stagger1 {
  text-align: left;
  font-size: 20px;
  i {
    vertical-align: bottom;
  }
}
.account-form {
  width: 350px;
  // margin: 0 auto;
  padding: 20px 0px;
  background: transparent;
  // box-shadow: 0px 0px 9px #ffffff73, 0px 0px 5px rgba(94, 104, 121, 0.288);
  :deep {
    .el-form-item__label {
      font-weight: 700;
      color: #000;
    }
    .el-input__wrapper {
      padding: 0;
      border: 1px solid rgb(153 153 153);
      border-radius: 99px;
      background: transparent !important;
      .el-input__suffix-inner {
        span {
          font-size: 24px;
        }
      }

      .el-input__inner {
        height: 100%;
        border-radius: 99px;
        color: #000;
        --el-input-placeholder-color: #727272;
      }
    }
    .check-item {
      display: flex;
      align-items: center;
      .el-form-item__label {
        margin: 0;
      }
    }
    .el-button {
      border: none;
      background: linear-gradient(91.4deg, #2fb8ff, #9eecd9);
      border-radius: 99px;
      font-size: 18px;
    }
  }
}
.Register_btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #409eff;
  font-weight: 700;
  cursor: pointer;
  :deep {
    .el-checkbox {
      .el-checkbox__label {
        color: #409eff;
      }
    }
  }
}
</style>
<!-- <style lang="scss">
$spanFontColor: #c0c4cc;
.my_login_box {
  .el-input__wrapper {
    padding: 0;
  }
  .el-form-item__content {
    display: flex;
    height: 44px;
  }
  .el-input__inner {
    border: none;
    background: transparent;
    height: 100%;
    width: 100%;
    background: linear-gradient(
      rgba(99, 106, 150, 0.4) 0%,
      rgba(182, 186, 214, 0.25) 100%
    );
    border: none;
    border-radius: 30px;
    box-shadow: rgb(0 0 0 / 15%) 0px 20px 40px,
      rgb(255 255 255 / 30%) 0px 0px 0px 0.5px inset;
    box-sizing: border-box;
    padding: 10px 10px 10px 56px;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: rgb(255, 255, 255);
    transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
    width: 360px;
  }
  .el-input.is-active .el-input__inner,
  .el-input__inner:focus {
    outline: none;
    padding-left: 42px;
    box-shadow: rgb(47 184 255 / 30%) 0px 10px 40px,
      rgb(47 184 255) 0px 0px 0px 1px inset;
    background: linear-gradient(
      rgba(24, 32, 79, 0.4) 0%,
      rgba(24, 32, 79, 0.25) 100%
    );
    padding-left: 56px;
  }
  .el-input__inner:visited {
    outline: none;
    padding-left: 42px;
    box-shadow: rgb(47 184 255 / 30%) 0px 10px 40px,
      rgb(47 184 255) 0px 0px 0px 1px inset;
    background: linear-gradient(
      rgba(24, 32, 79, 0.4) 0%,
      rgba(24, 32, 79, 0.25) 100%
    );
    padding-left: 56px;
  }
  @media screen and (-webkit-min-device-pixel-ratio: 0) and (min-resolution: 0.001dpcm) and (prefers-color-scheme: light) {
    .el-input__inner {
      background: linear-gradient(
        rgba(99, 106, 150, 0.8) 0%,
        rgba(182, 186, 214, 0.6) 100%
      );
    }
  }

  .ejUnNt:hover {
    transform: translateY(-2px);
    box-shadow: rgb(0 0 0 / 15%) 0px 20px 40px,
      rgb(0 0 0 / 30%) 0px 0px 0px 0.5px inset,
      rgb(0 0 0 / 10%) 0px 10px 40px inset;
    background: linear-gradient(
      91.4deg,
      rgb(47, 184, 255) 0%,
      rgb(158, 236, 217) 100%
    );
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-text-fill-color: rgb(255, 255, 255);
    transition: background-color 5000s ease-in-out 0s;
    box-shadow: rgb(47 184 255 / 30%) 0px 10px 40px,
      rgb(47 184 255) 0px 0px 0px 1px inset;
    background: linear-gradient(
      rgba(24, 32, 79, 0.4) 0%,
      rgba(24, 32, 79, 0.25) 100%
    );
  }

  input:-internal-autofill-previewed,
  input:-internal-autofill-selected {
    -webkit-text-fill-color: rgb(255, 255, 255);
    transition: background-color 5000s ease-in-out 0s;
    box-shadow: rgb(47 184 255 / 30%) 0px 10px 40px,
      rgb(47 184 255) 0px 0px 0px 1px inset;
    background: linear-gradient(
      rgba(24, 32, 79, 0.4) 0%,
      rgba(24, 32, 79, 0.25) 100%
    );
  }

  .ejUnNt span {
    font-style: normal;
    font-size: 17px;
    line-height: 130%;
    color: rgb(14, 67, 92);
    font-weight: 600;
    margin: 0px;
  }
  .Register_btn {
    margin-bottom: 10px;
    text-align: center;
    color: #ccc;
    font-size: 18px;
    font-size: 14px;
    cursor: pointer;
    &:hover {
      transform: scale(1.1);
    }
    span {
      color: rgb(47, 184, 255);
      text-decoration: underline;
      font-weight: bold;
    }
    .password_login {
      color: rgb(47, 184, 255);
      margin-top: 10px;
      display: inline-block;
    }
    .el-checkbox__inner {
      background: rgba(255, 255, 255, 0.3);
    }
  }
}
</style>

<style lang="scss">
@import "@/static/style/login.scss";
.question_icon {
  font-size: 20px;
  margin-left: 10px;
  margin-top: 10px;
  cursor: pointer;
}
.githubBtn {
  margin-top: -10px;
  box-shadow: 1px 0 6px rgb(0 0 0 / 10%) !important;
  background: rgba(117, 122, 155, 0.15) !important;
  border: 0.0625rem solid rgba(255, 255, 255, 0.5) !important;
  span {
    display: flex;
    justify-content: center;
    align-content: center;
    color: #fff !important;
    line-height: 24px !important;
    img {
      width: 24px;
      height: 24px;
      margin-right: 10px;
    }
  }
  &:hover {
    outline: 0;
    border-color: rgba(255, 255, 255, 0.25) !important;
    transition: border-color 0.3s !important;
  }
}
.storiesFounderLine {
  width: 100%;
  overflow: hidden;
}
.storiesFounder {
  position: relative;
  padding-left: calc(50% - 30px);
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: -0.02em;
  color: #fff;
}
.storiesFounder::before {
  content: "";
  position: absolute;
  display: block;
  width: calc(50% - 40px);
  height: 1px;
  top: 50%;
  left: 0;
  z-index: 0;
  background: #fff;
  // color: var(--button-text-color, #fff);
}
.storiesFounder::after {
  content: "";
  position: absolute;
  display: block;
  width: calc(50% - 40px);
  height: 1px;
  top: 50%;
  left: calc(50% + 46px);
  z-index: 0;
  background: #fff;
}
// .more_option {
//   font-style: normal;
//   font-weight: normal;
//   margin: 0px;
//   font-size: 15px;
//   line-height: 130%;
//   color: rgba(255, 255, 255, 0.7);
//   text-align: center;
//   border-top: 1px dashed #ccc;
//   position: relative;
//   span {
//     position: absolute;
//     top: -10px;
//     left: calc(50% - 60px);
//     position: absolute;
//     background: #100a0d;
//     padding: 0 10px;
//     border-radius: 20px;
//     width: 120px;
//     box-sizing: border-box;
//     z-index: 10000;
//     color: #fff;
//     font-size: 12px;
//   }
// }
// .github_wrap {
//   display: flex;
//   justify-content: center;
//   align-items: end;
//   color: rgba(255, 255, 255, 0.7);
//   text-decoration: underline;
//   margin-top: -10px;
//   &:hover {
//     transform: scale(1.1);
//   }
//   .login_github {
//     width: 30px;
//     height: 30px;
//     cursor: pointer;
//   }
// }
// .login_github {
//   width: 32px;
//   height: 32px;
//   margin-left: 10px;
//   margin-right: 10px;
//   cursor: pointer;

//   &:hover {
//     transform: scale(1.1);
//   }
// }
.invitation_code_name {
  margin-right: 40px !important;
}
.invitationTips-dialog .el-dialog {
  height: 170px;
  p {
    margin: 0;
  }
}
.invitationTips-btn {
  position: absolute;
  bottom: 20px;
  right: 30px;
  background: #737ebc;
  border-radius: 20px;
  border: 1px solid #737ebc;
}
.invitationTips-btn:hover {
  background: #737ebc;
  border: 1px solid #737ebc;
}
.callbackRegister-btn {
  position: absolute;
  bottom: 20px;
  right: 150px;
  background: transparent;
  color: #fff;
  border-radius: 20px;
  border: 1px solid #ccc;
}
.callbackRegister-btn:hover {
  background: transparent;
  color: #fff;
  border-radius: 20px;
  border: 1px solid #ccc;
}
</style> -->
