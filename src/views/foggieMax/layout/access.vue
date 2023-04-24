<template>
  <div v-loading="loading" class="access-box">
    <el-form
      class="account-form"
      :model="form"
      label-position="left"
      ref="formRef"
      :rules="rules"
    >
      <el-form-item label="Password" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          :maxlength="6"
          :minlength="6"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="!hasAccessPass"
        label="Confirm Password"
        prop="confirmPassword"
      >
        <el-input
          type="password"
          :maxlength="6"
          :minlength="6"
          v-model="form.confirmPassword"
          show-password
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="foot-btn">
      <div class="color-box">
        <el-button :loading="btnLoading" @click="submit">{{
          hasAccessPass ? "Login" : "Submit"
        }}</el-button>
      </div>
    </div>

    <!-- <el-button @click="emit('next')">Next</el-button> -->
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, getCurrentInstance } from "vue";
import { access_pass, access_pass_login, check_access_pass } from "@/utils/api";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const bcryptjs = require("bcryptjs");
const emit = defineEmits(["next", "update:accessible"]);
const props = defineProps({});
const { proxy } = getCurrentInstance();
const router = useRouter();
const store = useStore();
const form = reactive({
  password: "",
  confirmPassword: "",
});
const formRef = ref(null);
const loading = ref(false);
const btnLoading = ref(false);
const hasAccessPass = ref(false);
const getAccessPass = () => {
  loading.value = true;
  check_access_pass()
    .then((res) => {
      loading.value = false;
      if (res?.result?.access_pass) {
        hasAccessPass.value = true;
      } else {
        hasAccessPass.value = false;
      }
    })
    .catch((err) => {
      getAccessPass();
    });
};
getAccessPass();
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
  password: [
    { required: true, validator: validatePass, trigger: "blur" },
    {
      min: 6,
      max: 6,
      message: "Password is 6 digits",
      trigger: "blur",
    },
  ],
  confirmPassword: [
    {
      required: true,
      validator: validatePass2,
      trigger: "blur",
    },
    {
      min: 6,
      max: 6,
      message: "Password is 6 digits",
      trigger: "blur",
    },
  ],
};
const submit = () => {
  if (btnLoading.value) return false;

  formRef.value.validate((valid) => {
    if (valid) {
      btnLoading.value = true;
      const password = form.password;
      let hashPwd = bcryptjs.hashSync(password, 10);
      let hashConfirmPwd = bcryptjs.hashSync(form.confirmPassword, 10);
      const data = {
        access_password: form.password,
        confirm_access_password: form.confirmPassword,
      };
      if (hasAccessPass.value) {
        // 登录
        access_pass_login({
          access_password: form.password,
        })
          .then(({ result }) => {
            // window.sessionStorage.setItem("accessible", true);
            // store.dispatch("setAccessible", true);
            btnLoading.value = false;
            window.localStorage.setItem(
              "access_token",
              result.token_type + " " + result.token
            );
            emit("update:accessible", true);
            // router.push("/home");
          })
          .catch((err) => {
            console.log(err);
            proxy.$notify({
              type: "error",
              message: err.message,
              position: "bottom-left",
            });
          })
          .finally(() => {
            btnLoading.value = false;
          });
      } else {
        // 新建
        access_pass(data)
          .then((res) => {
            proxy.$notify({
              type: "success",
              message: "Created successfully",
              position: "bottom-left",
            });
            hasAccessPass.value = true;
            btnLoading.value = false;
            formRef.value.resetFields();
            //   access_pass_login({
            //     access_password: form.password,
            //   })
            //     .then((res) => {
            //       btnLoading.value = false;
            //     })
            //     .finally(() => {
            //       btnLoading.value = false;
            //     });
          })
          .catch(() => {
            btnLoading.value = false;
          });
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.access-box {
  padding: 50px;
  background-color: var(--bg-color);
  border-radius: 20px;
  :deep {
    .el-loading-mask {
      background: transparent;
      z-index: 1;
    }
  }
}
.account-form {
  width: 500px;
  margin: 0 auto;
  padding: 40px 30px;
  background: transparent;
  border-radius: 10px;
  // box-shadow: 0px 0px 9px #ffffff73, 0px 0px 5px rgba(94, 104, 121, 0.288);
  :deep {
    .el-form-item {
      align-items: center;
    }
    .el-form-item__label {
      font-weight: 700;
      // color: #fff;
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
  }
}
.foot-btn {
  display: flex;
  justify-content: center;
  .color-box {
    // .color-box();
    @include color-box;

    .el-button {
      position: relative;
      width: 135px;
      color: #fff;
      border: none;
      border-radius: 45px;
      box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 20%);
      background: var(--btn-gradient);
    }
  }
}
</style>
