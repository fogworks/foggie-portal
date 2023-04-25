<template>
  <div>
    <el-form
      class="account-form"
      :model="form"
      label-position="top"
      ref="formRef"
      :rules="rules"
    >
      <el-form-item label="Original Password" prop="oldPassword">
        <el-input
          type="password"
          v-model="form.oldPassword"
          show-password
          :maxlength="6"
          :minlength="6"
          @keyup.enter.native="submit"
        ></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          :maxlength="6"
          :minlength="6"
          @keyup.enter.native="submit"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="Confirm Password" prop="confirmPassword">
        <el-input
          type="password"
          v-model="form.confirmPassword"
          @keyup.enter.native="submit"
          :maxlength="6"
          :minlength="6"
          show-password
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="foot-btn">
      <div class="color-box">
        <el-button @click="submit">Submit</el-button>
      </div>
    </div>
    <!-- <el-button @click="emit('next')">Next</el-button> -->
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, getCurrentInstance, inject } from "vue";
import {
  access_pass,
  access_pass_login,
  modify_access_password,
} from "@/utils/api";
const emit = defineEmits(["next", "update:preShow"]);
const { proxy } = getCurrentInstance();
const goHome = inject("goHome");
const form = reactive({
  oldPassword: "",
  password: "",
  confirmPassword: "",
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
  oldPassword: [
    {
      required: true,
      message: "Please enter the original password",
      trigger: "blur",
    },
    {
      min: 6,
      max: 6,
      message: "Password is 6 digits",
      trigger: "blur",
    },
  ],
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
    { required: true, validator: validatePass2, trigger: "blur" },
    {
      min: 6,
      max: 6,
      message: "Password is 6 digits",
      trigger: "blur",
    },
  ],
};
const loading = ref(false);
const submit = () => {
  if (loading.value) return false;
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      const data = {
        access_password: form.password,
        confirm_access_password: form.confirmPassword,
        old_access_password: form.oldPassword,
      };
      modify_access_password(data).then((res) => {
        proxy.$notify({
          type: "success",
          message: "Successfully modified",
          position: "bottom-left",
        });
        access_pass_login({
          access_password: form.password,
        }).then(({ result }) => {
          window.localStorage.setItem(
            "access_token",
            result.token_type + " " + result.token
          );
          proxy.$notify({
            type: "success",
            message: "Logged in again",
            position: "bottom-left",
          });
          formRef.value.resetFields();
          loading.value = false;
          goHome();
        });
      });
    }
  });
};
</script>

<style lang="scss" scoped>
.account-form {
  width: 500px;
  margin: 0px auto;
  padding: 40px 30px;
  background: transparent;
  border-radius: 10px;
  // box-shadow: 0px 0px 9px #ffffff73, 0px 0px 5px rgba(94, 104, 121, 0.288);
  :deep {
    .el-form-item__label {
      font-weight: 700;
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
