<template>
  <div>
    <p class="welcome">Modify Password</p>
    <el-form
      @submit.native.prevent
      class="account-form"
      :model="form"
      label-position="top"
      ref="formRef"
      :rules="rules"
    >
      <el-form-item label="Password" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="Confirm Password" prop="confirmPassword">
        <el-input
          type="password"
          v-model="form.confirmPassword"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="old Password" prop="old_password">
        <el-input
          type="password"
          v-model="form.old_password"
          show-password
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="foot-btn">
      <NextButton @click="submit"></NextButton>
    </div>

    <!-- <el-button @click="emit('next')">Next</el-button> -->
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, getCurrentInstance, inject } from "vue";
import NextButton from "@/components/nextButton";
import { adminRegister, adminLogin, modifyPassword } from "@/utils/api";
const emit = defineEmits(["next", "update:preShow"]);
// const props = defineProps({
//   form: Object,
// });
// const form = reactive(props.form);
const { proxy } = getCurrentInstance();
const form = reactive({
  password: "",
  confirmPassword: "",
  old_password: "",
});
const requestTarget = inject("requestTarget");
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
  old_password: {
    required: true,
    message: "Please enter the old password",
    trigger: "blur",
  },
};
const loading = ref(false);
const submit = () => {
  if (loading.value) return false;
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      modifyPassword(form)
        .then((res) => {
          proxy.$notify({
            type: "success",
            message: "Created successfully",
            position: "bottom-left",
          });
          adminLogin({
            username: form.username,
            password: form.password,
          }).then((res) => {
            loading.value = false;
          });
        })
        .catch((err) => {
          loading.value = false;
        });
    }
  });
};
</script>

<style lang="scss" scoped>
.welcome {
  font-weight: 700;
  font-size: 30px;
  text-align: center;
}
.account-form {
  width: 500px;
  margin: 100px auto;
  padding: 40px 30px;
  background: #dde1e7;
  border-radius: 10px;
  box-shadow: -3px -3px 7px #ffffff73, 2px 2px 5px rgba(94, 104, 121, 0.288);
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
}
</style>
