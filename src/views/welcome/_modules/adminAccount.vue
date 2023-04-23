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
      <el-form-item label="Account" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
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
      <el-form-item
        class="check-item"
        label="Synchronize or not"
        prop="is_sync"
      >
        <el-checkbox v-model="form.is_sync" size="large" />
      </el-form-item>
      <el-form-item label="Foggie Max name" prop="foggie_max_name">
        <el-input v-model="form.foggie_max_name"></el-input>
      </el-form-item>
      <template v-if="form.is_sync">
        <el-form-item prop="email">
          <template #label>
            <span>Email</span>
            <el-tooltip
              placement="top"
              content="Bottom center"
              effect="customized"
            >
              <svg-icon
                icon-class="info"
                style="color: #29abff; margin-left: 10px"
              ></svg-icon>
            </el-tooltip>
          </template>
          <el-input type="email" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="DMC Account" prop="dmc_account">
          <el-input v-model="form.dmc_account"></el-input>
        </el-form-item>
      </template>
    </el-form>
    <div class="foot-btn">
      <NextButton @click="submit"></NextButton>
    </div>

    <!-- <el-button @click="emit('next')">Next</el-button> -->
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, getCurrentInstance } from "vue";
import NextButton from "@/components/nextButton";
import { adminRegister, adminLogin } from "@/utils/api";
const emit = defineEmits(["next", "update:preShow"]);
// const props = defineProps({
//   form: Object,
// });
// const form = reactive(props.form);
const { proxy } = getCurrentInstance();
const form = reactive({
  username: "",
  password: "",
  confirmPassword: "",
  is_sync: false,
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
  username: {
    required: true,
    message: "Please enter an account name",
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
const submit = () => {
  if (loading.value) return false;
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      emit("update:preShow", false);
      adminRegister(form)
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
            emit("next");
            emit("update:preShow", true);
          });
        })
        .catch((err) => {
          emit("update:preShow", false);
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
  background: transparent;
  border-radius: 10px;
  box-shadow: 0px 0px 9px #ffffff73, 0px 0px 5px rgba(94, 104, 121, 0.288);
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
