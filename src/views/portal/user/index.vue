<template>
  <div class="box" v-loading="loading">
    <div v-if="needLogin" class="login-box">
      <img src="@/assets/login-left.png" alt="" />
      <el-form
        class="account-form"
        :model="form"
        label-position="top"
        ref="formRef"
        :rules="rules"
      >
        <p class="top-title">
          <span v-if="isLogin" @click="isLogin = !isLogin"
            >No account, go register!</span
          >
          <span v-else @click="isLogin = !isLogin">Go log in</span>
        </p>
        <el-form-item label="Foggie Email" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            type="password"
            v-model="form.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="!isLogin"
          label="Confirm Password"
          prop="confirmPassword"
        >
          <el-input
            type="password"
            v-model="form.confirmPassword"
            show-password
          ></el-input>
        </el-form-item>
        <div class="foot-btn">
          <el-button
            v-if="isLogin"
            :loading="loading"
            type="primary"
            @click="submit"
          >
            {{ "Login" }}
          </el-button>
          <el-button v-else :loading="loading" @click="handleRegister">
            {{ "Register" }}
          </el-button>
        </div>
      </el-form>
      <!-- <LoginBox></LoginBox> -->
    </div>

    <div class="info-box" v-else>
      <div class="info-content">
        <div class="foot-btn">
          <!-- <el-button type="danger" @click="unbindVisible = true"
            >Unbind</el-button
          > -->
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
            <!-- <el-icon
              class="light"
              color="#fff"
              v-if="currentTheme === 'light' || ''"
              ><Sunny
            /></el-icon> -->
            <svg-icon
              icon-class="sun"
              v-if="currentTheme === 'light' || ''"
            ></svg-icon>
            <svg-icon icon-class="moon" v-else></svg-icon>
            <!-- <el-icon class="dark" color="#000" v-else><Moon /></el-icon> -->
          </div>
          <el-button type="primary" @click="logout"
            ><svg-icon icon-class="switch"></svg-icon> Switch
            Accounts</el-button
          >
        </div>
      </div>

      <Web3Link></Web3Link>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, computed, inject } from "vue";
import Web3Link from "./_modules/web3Link";
import { login, register, user, unbind_foggie } from "@/utils/api";
import { useStore } from "vuex";
import LoginBox from "./_modules/loginBox";
import { useRouter } from "vue-router";
const bcryptjs = require("bcryptjs");
const store = useStore();
const router = useRouter();
const isNew = ref(false); //
// const form = reactive(props.form);
const { proxy } = getCurrentInstance();
const requestTarget = inject("requestTarget");
const form = reactive({
  password: "",
  email: "",
  confirmPassword: "",
});
const isLogin = ref(true);
const formRef = ref(null);
const unbindVisible = ref(false);
const needLogin = ref(true);
const currentTheme = computed(() => store.getters.theme);
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
      needLogin.value = false;
      loading.value = false;
    })
    .catch(() => {
      needLogin.value = true;
      loading.value = false;
    });
};
getUserInfo();
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
              type: "success",
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
const handleRegister = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      let postData = {
        email: form.email,
        register_type: "email",
      };
      register(postData).then((res) => {
        proxy.$notify({
          type: "success",
          message: "Successfully register",
          position: "bottom-left",
        });
      });
    }
  });
};
const logout = () => {
  store.dispatch("token/logout");
  store.dispatch("global/setUserInfo", {});
  getUserInfo();
};
const unbind = () => {
  unbindVisible.value = false;
  unbind_foggie(requestTarget).then((res) => {
    logout();
  });
};
</script>

<style lang="scss" scoped>
.box {
  padding-top: 50px;
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
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 900px;
  margin: 0 auto;
  padding: 50px 0;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.6);

  img {
    width: 300px;
    margin: 0 50px;
  }
  .top-title {
    cursor: pointer;
    margin-bottom: 10px;
    span:hover {
      color: $light_blue;
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
</style>
