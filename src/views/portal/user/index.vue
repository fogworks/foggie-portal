<template>
  <div class="box" v-loading="loading">
    <div v-if="needLogin" class="login-box">
      <img src="@/assets/welcome-asset.png" alt="" />
      <el-form
        class="account-form"
        :model="form"
        label-position="top"
        ref="formRef"
        :rules="rules"
      >
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
        <div class="foot-btn">
          <el-button :loading="loading" type="primary" @click="submit">
            {{ "Login" }}
          </el-button>
        </div>
      </el-form>
    </div>

    <div class="info-box" v-else>
      <div class="info-content">
        <div class="foot-btn">
          <!-- <el-button type="danger" @click="unbindVisible = true"
            >Unbind</el-button
          > -->
          <el-button type="primary" @click="logout"
            ><svg-icon icon-class="switch"></svg-icon> Switch
            Accounts</el-button
          >
        </div>
      </div>
      <!-- <el-descriptions :column="3" size="large" border>
        <template #extra>
          <el-button type="default" @click="unbindVisible = true"
            >Unbind</el-button
          >
          <el-button type="primary" @click="logout">Logout</el-button>
        </template>
        <el-descriptions-item label="Email">
          {{ userInfo.email }}
        </el-descriptions-item>
        <el-descriptions-item label="DMC">
          {{ userInfo.dmc }}
        </el-descriptions-item>
      </el-descriptions> -->
      <Web3Link></Web3Link>
      <!-- <Assets></Assets> -->
    </div>

    <!-- <el-button @click="emit('next')">Next</el-button> -->
  </div>
  <el-dialog
    class="unbind-dialog"
    title="Unbinding"
    v-model="unbindVisible"
    width="400px"
  >
    <span> Are you sure you want to unbind the account </span>
    <template #footer>
      <el-button @click="unbindVisible = false">NO</el-button>
      <el-button type="primary" @click="unbind">YES</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {
  ref,
  reactive,
  defineEmits,
  defineProps,
  getCurrentInstance,
  computed,
  toRefs,
  inject,
} from "vue";
import Web3Link from "./_modules/web3Link";
import { login, get_foggie_dmc, user, unbind_foggie } from "@/utils/api";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const bcryptjs = require("bcryptjs");
const store = useStore();
const router = useRouter();
const isNew = ref(false); //是否是新用户
// const form = reactive(props.form);
const { proxy } = getCurrentInstance();
const requestTarget = inject("requestTarget");
const form = reactive({
  password: "",
  email: "",
});
const formRef = ref(null);
const unbindVisible = ref(false);
const needLogin = ref(true);
const userInfo = computed(() => store.getters["global/userInfo"]);
const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Please input the password"));
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
.foot-btn {
  display: flex;
  justify-content: center;
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
