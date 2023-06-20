<template>
  <div v-loading="loading" class="access-box">
    <img
      v-if="deviceData.device_type === 'foggie_max'"
      src="@/assets/welcome-asset.png"
      alt=""
    />
    <img v-else src="@/assets/login-left.png" alt="" />
    <div>
      <el-form
        @submit.native.prevent
        class="account-form"
        :model="form"
        ref="formRef"
        :rules="rules"
      >
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="form.password"
            placeholder="PIN code"
            :maxlength="6"
            :minlength="6"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item v-if="!hasAccessPass" prop="confirmPassword">
          <el-input
            placeholder="Confirm PIN code"
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
    </div>

    <!-- <el-button @click="emit('next')">Next</el-button> -->
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, getCurrentInstance, inject } from "vue";
import { access_pass, access_pass_login, check_access_pass } from "@/utils/api";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const bcryptjs = require("bcryptjs");
const emit = defineEmits(["accessCallback", "update:accessible"]);
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
const hasAccessPass = ref(true);
const deviceData = inject("deviceData");
const requestTarget = inject("requestTarget");
const getAccessPass = () => {
  loading.value = true;
  check_access_pass(requestTarget)
    .then((res) => {
      loading.value = false;
      if (res?.result?.access_pass) {
        hasAccessPass.value = true;
      } else {
        hasAccessPass.value = false;
      }
    })
    .catch((err) => {
      loading.value = false;
      // getAccessPass();
    });
};
getAccessPass();
const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Please input the Pin code"));
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
    callback(new Error("Please input the Pin code again"));
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
      message: "Pin code is 6 digits",
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
      message: "Pin code is 6 digits",
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
        //
        access_pass_login(
          {
            access_password: form.password,
          },
          requestTarget
        )
          .then(({ result }) => {
            // window.sessionStorage.setItem("accessible", true);
            // store.dispatch("setAccessible", true);
            btnLoading.value = false;
            // window.localStorage.setItem(
            //   "access_token",
            //   result.token_type + " " + result.token
            // );

            // setTokenMap(
            //   deviceData.device_id,
            //   result.token_type + " " + result.token
            // );
            emit("accessCallback");
            // emit("update:accessible", true);
            // router.push("/home");
          })
          .catch((err) => {
            // proxy.$notify({
            //   type: "error",
            //   message: err.message,
            //   position: "bottom-left",
            // });
          })
          .finally(() => {
            btnLoading.value = false;
          });
      } else {
        //
        access_pass(data, requestTarget)
          .then((res) => {
            proxy.$notify({
              customClass: "notify-success",
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
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 50px 0;
  background-color: #f2f6ff;
  border-radius: 20px;
  width: 900px;
  margin: 0 auto;
  > img {
    width: 300px;
    margin: 0 50px;
  }
  :deep {
    .el-loading-mask {
      background: transparent;
      z-index: 1;
    }
  }
}
.account-form {
  width: 400px;
  padding: 20px 30px;
  // padding: 40px 30px;
  background: transparent;
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
      padding: 0px 15px;
      border-radius: 30px;
      height: 45px;
      .el-input__suffix-inner {
        span {
          font-size: 24px;
        }
      }

      .el-input__inner {
        color: #000;
        --el-input-placeholder-color: #727272;
        border: none;
        background: transparent;
        height: 45px;
        // width: 100%;
        border-radius: 30px;
        box-sizing: border-box;
        // padding: 10px;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 130%;

        transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
        // width: 340px;
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
