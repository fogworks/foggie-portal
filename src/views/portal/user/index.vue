<template>
  <div class="box" v-loading="loading">
    <div v-if="!userId" class="login-box">
      <img src="@/assets/login-left.png" alt="" />
      <LoginBox></LoginBox>
    </div>
    <div class="info-box" v-if="userId">
      <div class="info-content" v-if="userId">
        <div class="foot-btn">
          <div
            class="theme"
            @click="
              handleThemeChange(
                currentTheme === 'light' || currentTheme == ''
                  ? 'dark'
                  : 'light'
              )
            "
          >
            <svg-icon
              icon-class="sun"
              v-if="currentTheme === 'light' || ''"
            ></svg-icon>
            <svg-icon icon-class="moon" v-else></svg-icon>
          </div>
          <el-button type="primary" @click="logout"
            ><svg-icon icon-class="switch"></svg-icon> Switch
            Accounts</el-button
          >
        </div>
      </div>

      <Web3Link v-if="isLogin && userId"></Web3Link>
    </div>
    <div v-if="userId && !isLogin" class="login-box">
      <img src="@/assets/login-left.png" alt="" />
      <LoginPrivate
        class="loginPrivate"
        :userInfo="userInfo"
        @login="emitLogin"
      ></LoginPrivate>
    </div>

    <!-- <div v-if="!isLogin" class="story-content">
      <div class="story-box">
        <img src="@/assets/nft.png" alt="" />
        <span>
          In a land far away, young Hans lived, Working hard,<br />
          for a farmer he served, a gold piece he received.<br />
          A gold piece sparked the desire for adventure, a journey began,<br />
          On the path, he met Foggie, the loyal and clever little dog, hand in
          hand.<br />
          Hans and Foggie, together they conquered rivers and mountains,<br />
          Through forests they ventured, climbing steep peaks, sharing joyful
          moments.<br />
          The thirst for wealth lingered, always present in Hans' mind,<br />
          Foggie revealed a magical skill, traces of treasure to find.
        </span>
      </div>
    </div> -->
  </div>
  <div class="index-foot">
    <div class="product-foot">
      <div class="product-foot-content2">
        <img
          src="@/assets/system/logo.png"
          style="width: 150px; margin-left: 40px; object-fit: contain"
          alt=""
        />
        <div class="foot-content-right">
          <div class="foot-content-right-top">
            <p>CONTACT</p>
            <p class="line"></p>
            <p style="font-size: 14px">Get in Touch</p>
          </div>
          <div class="foot-content-right-bottom">
            <a href="https://twitter.com/fogworksinc" target="_blank">
              <img src="@/assets/index/twitter.svg" alt="" />
            </a>
            <a href="https://discord.com/invite/fogworks" target="_blank">
              <img src="@/assets/index/discord.png" alt="" />
            </a>
            <a href="https://www.facebook.com/fogworksinc" target="_blank">
              <img src="@/assets/index/facebook.svg" alt="" />
            </a>
            <a href="https://www.youtube.com/@fogworksinc.2753" target="_blank">
              <img src="@/assets/index/youtube.png" alt="" />
            </a>
            <a href="https://www.instagram.com/fog_works/" target="_blank">
              <img src="@/assets/index/camera.png" alt="" />
            </a>
            <a
              href="https://www.linkedin.com/company/fog-works/"
              target="_blank"
            >
              <img src="@/assets/index/linkedin.png" alt="" />
            </a>
            <a href="https://medium.com/fog-works-inc" target="_blank">
              <img
                style="width: 40px"
                src="@/assets/index/3radius.png"
                alt=""
              />
            </a>
            <a href="mailto:support@fogworks.io" target="_blank">
              <img src="@/assets/index/email.svg" alt="" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 支付底部说明 -->
    <div class="product-foot" style="padding-top: 20px">
      <div class="product-foot-content2 product-foot-content3">
        <!-- <a href="payment-policy" style="text-decoration: none"> -->
        <div class="product-foot-content-logo" @click="gotoPayment('Terms')">
          <div class="product-foot-content-icon">
            <p class="eTYfuI">{{ $t("vood.Terms") }}</p>
          </div>
        </div>
        <div
          class="product-foot-content-logo"
          @click="gotoPayment('paymentPolicy')"
        >
          <div class="product-foot-content-icon">
            <p class="eTYfuI">
              {{ $t("vood.paymentPolicy") }}
            </p>
          </div>
        </div>
        <!-- </a > -->
        <!-- <a href="#terms-and-conditions" style="text-decoration: none"> -->

        <!-- </a> -->
        <!-- <a
          aria-current="page"
          class=""
          href="#privacy-policy"
          style="text-decoration: none"
        > -->
        <div
          class="product-foot-content-logo"
          @click="gotoPayment('PrivacyPolicy')"
        >
          <div class="product-foot-content-icon">
            <p class="eTYfuI">{{ $t("vood.PrivacyPolicy") }}</p>
          </div>
        </div>
        <div class="product-foot-content-logo">
          <div class="product-foot-content-icon">
            <a href="https://fogworks.io/">
              <p class="eTYfuI">© 2023 Fog Works,Inc.</p>
            </a>
          </div>
        </div>
        <!-- </a> -->
        <!-- <div class="product-foot-content-logo">
          <div class="product-foot-content-icon">
            <img
              src="@/assets/system/visa.svg"
              alt="icon"
              class="product-foot-content-img"
            />
            <img
              src="@/assets/system/master.svg"
              alt="icon"
              class="product-foot-content-img"
            />
            <img
              src="@/assets/system/discover.svg"
              alt="icon"
              class="product-foot-content-img"
            />
            <img
              src="@/assets/system/amex.svg"
              alt="icon"
              class="product-foot-content-img"
            />
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  getCurrentInstance,
  computed,
  inject,
  watch,
  nextTick,
} from "vue";
import Web3Link from "./_modules/web3Link";
import { login, register, user, unbind_foggie, updateUser } from "@/utils/api";
import { useStore } from "vuex";
import LoginBox from "./_modules/loginBox";
import LoginPrivate from "./_modules/loginPrivate";
import { useRouter } from "vue-router";
import { getChain_id } from "@/api/common";
const bcryptjs = require("bcryptjs");
const store = useStore();
const router = useRouter();
const isNew = ref(false); //
// const form = reactive(props.form);
const { proxy } = getCurrentInstance();

const form = reactive({
  password: "",
  email: "",
  confirmPassword: "",
  dmcAccount: "",
});
const isLogin = ref(false);
const formRef = ref(null);
const unbindVisible = ref(false);
const currentTheme = computed(() => store.getters.theme);
const email = computed(() => store.getters.userInfo?.email);
const handleThemeChange = (val) => {
  document.documentElement.setAttribute("class", val);
  // window.localStorage.setItem("theme", val);
  store.dispatch("global/setTheme", val);
};

const getTimeState = () => {
  let timeNow = new Date();

  let hours = timeNow.getHours();

  if (hours >= 0 && hours <= 18) {
    handleThemeChange(currentTheme.value || "light");
  } else if (hours > 18 && hours <= 24) {
    handleThemeChange(currentTheme.value || "dark");
  }
};
getTimeState();
const userInfo = computed(() => store.getters["global/userInfo"]);
const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Please input the password"));
  } else {
    callback();
  }
};
const validatePass2 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Please input the password again"));
  } else if (value !== form.password) {
    callback(new Error("Two inputs don't match!"));
  } else {
    callback();
  }
};
const rules = {
  email: {
    required: true,
    message: "Please enter an Foggie Email",
    trigger: "blur",
  },
  password: [
    { required: true, validator: validatePass, trigger: "blur" },
    {
      min: 6,
      message: "Password length not less than 6 digits",
      trigger: "blur",
    },
  ],
  dmcAccount: [
    { required: true, message: "Please enter DMC Account", trigger: "blur" },
    {
      min: 12,
      max: 12,
      message: "DMC Account length is 12 digits",
      trigger: "blur",
    },
  ],
  confirmPassword: {
    required: true,
    validator: validatePass2,
    trigger: "blur",
  },
};
const loading = ref(false);
const getUserInfo = () => {
  loading.value = true;
  user()
    .then(({ data }) => {
      store.dispatch("global/setUserInfo", data);
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
};
getUserInfo();

const emitLogin = () => {
  isLogin.value = true;
  getChainId();
  getUserInfo();
};
const submit = () => {
  if (loading.value) return false;
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      // emit("update:preShow", false);
      const password = form.password;
      let hashPwd = bcryptjs.hashSync(password, 10);
      let postData = {
        email: form.email,
        password: hashPwd,
      };

      login(postData)
        .then((res) => {
          if (res.next_step === "captcha") {
            // that.getCaptcha();
            // that.showCaptcha = true;
          } else if (res && res.data) {
            let data = res.data;
            let token = data.token_type + " " + data.access_token;
            let refresh_token = data.token_type + " " + data.refresh_token;
            let user_id = data.user_id;
            window.localStorage.setItem("user_id", user_id);
            window.localStorage.setItem("refresh_token", refresh_token);
            let userInfo = {
              username: form.email,
              token: token, //res.token
              user_id: user_id,
            };
            store.dispatch("token/login", userInfo);
            formRef.value.resetFields();
            proxy.$notify({
              customClass: "notify-success",
              message: "Successfully Login",
              position: "bottom-left",
            });
            getUserInfo();
          }
        })
        .catch(() => {
          loading.value = false;
        });
    }
  });
};

const userId = computed(() => store.getters.userInfo?.id || "");
const hasDMC = computed(() => store.getters.userInfo?.dmc || "");
const logout = () => {
  store.dispatch("token/logout");
  store.dispatch("global/setUserInfo", {});
  store.dispatch("global/setHasReady", false);
  window.localStorage.removeItem("tokenMap");
  getUserInfo();
  isLogin.value = false;
};

// const unbind = () => {
//   unbindVisible.value = false;
//   unbind_foggie().then((res) => {
//     logout();
//   });
// };
// watch(
//   email,
//   (val) => {
//     if (val && userId.value) {
//       loadUserLoginStatus();
//     }
//   },
//   {
//     immediate: true,
//   }
// );
function getChainId() {
  getChain_id().then((res) => {
    if (res.code == 200) {
      store.commit("clientGlobal/SAVE_ChainId", res.data);
    }
  });
}
</script>

<style lang="scss" scoped>
.box {
  position: relative;
  width: 100%;
  height: calc(100% - 210px);
  min-height: 500px;
  :deep {
    .el-loading-mask {
      background: transparent;
      z-index: 1;
    }
  }
}
.welcome {
  font-weight: 700;
  font-size: 30px;
  text-align: center;
}
.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 900px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.6);

  img {
    width: 380px;
    margin: 0 30px;
  }
  .top-title {
    cursor: pointer;
    margin-bottom: 10px;
    span:hover {
      color: $light_blue;
    }
  }
  .loginPrivate {
    position: unset;
    transform: none;
    :deep {
      .el-card {
        background: transparent;
        box-shadow: none;
        .el-card__header {
          border-bottom: none;
        }
      }
    }
  }
}
.story-content {
  margin-top: 10px;
  .story-box {
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 900px;
    border-radius: 20px;
    text-align: left;
    // background: rgba(255, 255, 255, 0.6);
    // box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 0.5px inset;
    // backdrop-filter: blur(20px);

    img {
      width: 200px;
      opacity: 0.5;
    }
    span {
      font-size: 20px;
      font-style: italic;
      font-family: Luthier Regular !important;
      color: #000;
    }
  }
}
.account-form {
  width: 400px;
  // margin: 0 auto;
  padding: 20px 30px;
  background: transparent;
  // box-shadow: 0px 0px 9px #ffffff73, 0px 0px 5px rgba(94, 104, 121, 0.288);
  :deep {
    .el-form-item__label {
      font-weight: 700;
      color: #000;
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
    .check-item {
      display: flex;
      align-items: center;
      .el-form-item__label {
        margin: 0;
      }
    }
  }
}
.theme {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  margin-right: 25px;
  background-color: var(--theme-box-bg);
  border-radius: 50%;
  cursor: pointer;
}
.foot-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  :deep {
    .el-button {
      min-width: 100px;
      width: unset;
      font-size: 16px;
      border-radius: 50px;
    }
  }
}
.info-box {
  margin: 0 auto;
  :deep {
    .light-box {
      margin: 0 auto;
    }
  }
  .info-content {
    width: 100%;
    padding: 20px;
    border-radius: 20px;
    .info-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 10px;
      div:first-child {
        width: 50px;
        margin-right: 10px;
        text-align: left;
        font-weight: 700;
      }
    }
    .foot-btn {
      justify-content: flex-end;
      text-align: center;
      svg {
        font-size: 20px;
      }
    }
  }
}
.unbind-dialog {
  .el-dialog__body {
    margin: 20px 0;
  }
}
.index-foot {
}
.product-foot {
  font-family: Yahei;
  // background: linear-gradient(to right, #7964e3 0%, #334ab3 50%, #013690 100%);
}

.product-foot-content2 {
  width: 1160px;
  margin: auto;
  display: flex;
  justify-content: center;
  gap: 20px;
}
.foot-content-right {
  width: 350px;
  margin-left: 100px;
}
.line {
  width: 250px;
  height: 2px;
  box-shadow: 0 0 3px 2px #29abff;
  background: #fff;
}
.foot-content-right-top p {
  margin: 15px 0;
  color: #fff;
  font-weight: 600;
  font-size: 25px;
  text-align: left;
}

.foot-content-right-bottom {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.foot-content-right-bottom img {
  width: 30px;
  object-fit: contain;
}
.product-foot-content3 {
  width: 1160px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 20px;
}
.product-foot-content-logo {
  height: 44px;
  transition: all 0.3s ease-in-out 0s;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
}
.foot-word {
  margin-left: 50px;
  width: 280px;
  color: rgba(255, 255, 255, 0.7);
  /* padding: 64px 0px; */
  font-size: 13px;
}
.ceQOIN {
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.6);
  margin: 20px 0px;
}
.foot-word a {
  font-style: normal;
  font-weight: bold;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0px;
  text-decoration: none;
}
.product-foot-content-logo {
  height: 44px;
  transition: all 0.3s ease-in-out 0s;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
}
.product-foot-content-icon {
  display: inline-flex;
}
.product-foot-content-img {
  width: 30px;
  /* height: 30px; */
  margin: auto;
}
.eTYfuI {
  font-style: normal;
  font-size: 15px;
  font-weight: normal;
  line-height: 130%;
  color: rgb(255, 255, 255);
  text-align: center;
  margin: auto auto auto 10px;
  text-decoration: underline;
}
</style>
