<template>
  <div>
    <p class="welcome">Administrator Account</p>
    <el-form :model="form" ref="formRef" :rules="rules" label-width="200px">
      <el-form-item label="Administrator Account" prop="account">
        <el-input v-model="form.account"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="Confirm Password" prop="rePassword">
        <el-input v-model="form.rePassword"></el-input>
      </el-form-item>
    </el-form>
    <el-button @click="emit('next')">Next</el-button>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits } from "vue";
const emit = defineEmits(["next"]);
const form = reactive({
  account: "",
  password: "",
  rePassword: "",
});
const formRef = ref(null);
const rules = {};
</script>

<style lang="less" scoped>
.welcome {
  font-weight: 700;
  font-size: 30px;
}
</style>
