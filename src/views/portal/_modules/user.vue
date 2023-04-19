<template>
  <div class="box" v-loading="loading">
    <el-form
      v-if="needLogin"
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
          {{ isLogin && !isNew ? "Login" : "Submit" }}
        </el-button>
      </div>
    </el-form>
    <div class="info-box" v-else>
      <el-descriptions :column="3" size="large" border>
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
      </el-descriptions>
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
} from "vue";
import NextButton from "@/components/nextButton";
import { login, get_foggie_dmc, user, unbind_foggie } from "@/utils/api";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const bcryptjs = require("bcryptjs");
const store = useStore();
const router = useRouter();
const isNew = ref(false); //是否是新用户
// const form = reactive(props.form);
const { proxy } = getCurrentInstance();
const form = reactive({
  password: "",
  email: "",
});
const formRef = ref(null);
const unbindVisible = ref(false);
const needLogin = ref(true);
const userInfo = computed(() => store.getters.userInfo);
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
      store.dispatch("setUserInfo", data);
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
  store.dispatch("setUserInfo", {});
  getUserInfo();
};
const unbind = () => {
  unbindVisible.value = false;
  unbind_foggie().then((res) => {
    logout();
  });
};
</script>

<style lang="less" scoped>
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
.title-btn {
  margin-top: 20px;
  text-align: center;
  :deep {
    .el-button {
      background: transparent !important;

      &:hover {
        background: transparent;
        transform: scale(1.1);
      }
    }
  }
}
.account-form {
  width: 500px;
  margin: 0 auto;
  padding: 20px 30px;
  background: transparent;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.6);
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
      border-radius: 50px;
    }
  }
}
.info-box {
  width: 500px;
  margin: 0 auto;
}
</style>
<style lang="less">
.unbind-dialog {
  .el-dialog__body {
    margin: 20px 0;
  }
}
</style>
