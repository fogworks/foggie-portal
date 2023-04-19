<template>
  <div>
    <el-dialog
      :before-close="cancel"
      :title="isLogin ? 'Login' : 'Associated Account'"
      width="700px"
      :model-value="visible"
    >
      <div class="title-btn" v-if="!isLogin">
        <el-button type="primary" text @click="changeType">{{
          tipTitle
        }}</el-button>
      </div>
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
        <el-form-item
          v-if="isNew"
          label="Confirm Password"
          prop="confirmPassword"
        >
          <el-input
            type="password"
            v-model="form.confirmPassword"
            show-password
          ></el-input>
        </el-form-item>

        <template v-if="!isLogin">
          <el-form-item
            v-if="showDMC || (isNew && !isLogin)"
            label="DMC Account"
            prop="dmc_account"
          >
            <el-input type="text" v-model="form.dmc_account"></el-input>
          </el-form-item>
          <el-form-item
            class="check-item"
            label="Modify MAX name?"
            prop="is_sync"
          >
            <el-checkbox v-model="form.is_sync" size="large" />
          </el-form-item>
          <template v-if="form.is_sync">
            <el-form-item label="Foggie Max name" prop="foggie_max_name">
              <el-input v-model="form.foggie_max_name"></el-input>
            </el-form-item>
          </template>
        </template>
      </el-form>
      <div class="foot-btn">
        <el-button :loading="loading" type="primary" @click="submit">
          {{ isLogin && !isNew ? "Login" : "Submit" }}
        </el-button>
      </div>
    </el-dialog>
    <!-- <el-button @click="emit('next')">Next</el-button> -->
  </div>
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
import {
  adminRegister,
  adminLogin,
  login,
  get_foggie_dmc,
  bind_foggie,
} from "@/utils/api";
import { useStore } from "vuex";
const bcryptjs = require("bcryptjs");
const emit = defineEmits(["next", "update:visible", "update:preShow"]);
const props = defineProps({
  visible: Boolean,
  isLogin: {
    type: Boolean,
    default: false,
  },
});
const store = useStore();
const isNew = ref(false); //是否是新用户
const tipTitle = computed(() => {
  if (isNew.value) {
    return "Already have an account? Disassociation";
  } else {
    return "No account? Go to register";
  }
});
// const form = reactive(props.form);
const { visible, isLogin } = toRefs(props);
const { proxy } = getCurrentInstance();
const form = reactive({
  password: "",
  confirmPassword: "",
  is_sync: false,
  bind: true,
  email: "",
  dmc_account: "",
  foggie_max_name: "",
});
const formRef = ref(null);
const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Please input the password"));
  } else {
    if (form.confirmPassword !== "") {
      if (!formRef.value) return;
      formRef.value.validateField("confirmPassword", () => null);
    }
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
  dmc_account: {
    required: true,
    message: "Please enter DMC Account",
    trigger: "blur",
  },
};
const loading = ref(false);
const showDMC = ref(false);
const cancel = () => {
  emit("update:visible", false);
};
const changeType = () => {
  formRef.value.resetFields();
  isNew.value = !isNew.value;
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
      if (isNew.value || form.dmc_account) {
        bind_foggie(postData)
          .then((res) => {
            loading.value = false;
            formRef.value.resetFields();
            emit("update:visible", false);
            proxy.$notify({
              type: "success",
              message: "Successfully associated",
              position: "bottom-left",
            });
          })
          .catch(() => {
            proxy.$notify({
              type: "error",
              message: "Association failed",
              position: "bottom-left",
            });
            loading.value = false;
          });
      } else if (isLogin.value) {
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
              emit("update:visible", false);
              proxy.$notify({
                type: "success",
                message: "Successfully Login",
                position: "bottom-left",
              });
              loading.value = false;
            }
          })
          .catch(() => {
            loading.value = false;
          });
      } else {
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
              get_foggie_dmc({ email: form.email })
                .then((res) => {
                  // 获取钱包信息
                  if (!res.data.dmc_account && !form.dmc_account) {
                    proxy.$notify({
                      type: "info",
                      message: "Please fill in the DMC Account",
                      position: "bottom-left",
                    });
                    loading.value = false;
                    showDMC.value = true;
                  } else {
                    if (res.data?.dmc_account) {
                      form.dmc_account = res.data.dmc_account;
                    }
                    loading.value = false;
                    showDMC.value = true;
                    // 绑定
                  }
                })
                .catch(() => {
                  proxy.$notify({
                    type: "error",
                    message: "Information acquisition failed",
                    position: "bottom-left",
                  });
                  loading.value = false;
                });
            }
          })
          .catch(() => {
            loading.value = false;
          });
      }

      // adminRegister(form)
      //   .then((res) => {
      //     proxy.$notify({
      //       type: "success",
      //       message: "Created successfully",
      //       position: "bottom-left",
      //     });
      //     adminLogin({
      //       username: form.username,
      //       password: form.password,
      //     }).then((res) => {
      //       loading.value = false;
      //       emit("next");
      //       emit("update:preShow", true);
      //     });
      //   })
      //   .catch((err) => {
      //     emit("update:preShow", false);
      //     loading.value = false;
      //   });
    }
  });
};
</script>

<style lang="less" scoped>
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
</style>
