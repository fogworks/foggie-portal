<template>
  <div>
    <p class="welcome">Administrator Account</p>
    <el-form
      class="account-form"
      :model="form"
      label-position="top"
      ref="formRef"
      :rules="rules"
    >
      <el-form-item label="Account" prop="account">
        <el-input v-model="form.account"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="Confirm Password" prop="checkPass">
        <el-input
          type="password"
          v-model="form.checkPass"
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
import { ref, reactive, defineEmits } from "vue";
import NextButton from "@/components/nextButton";
const emit = defineEmits(["next"]);

const props = defineProps({
  form: Object,
});
const form = reactive(props.form);
const formRef = ref(null);
const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Please input the password"));
  } else {
    if (form.checkPass !== "") {
      if (!formRef.value) return;
      formRef.value.validateField("checkPass", () => null);
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
  account: {
    required: true,
    message: "Please enter an account name",
    trigger: "blur",
  },
  password: { required: true, validator: validatePass, trigger: "blur" },
  checkPass: { required: true, validator: validatePass2, trigger: "blur" },
};
const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      emit("next");
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
.account-form {
  width: 500px;
  margin: 100px auto;
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
}
</style>
