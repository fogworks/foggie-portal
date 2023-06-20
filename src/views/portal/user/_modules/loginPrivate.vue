<template>
  <div class="logincontent">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          {{
            passwordIsExist && !isRegisterPassword ? "Private key" : "Pin Code"
          }}
        </div>
      </template>
      <div class="text item my_login_box">
        <el-form
          @submit.native.prevent
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
        >
          <el-form-item
            prop="password"
            v-if="!passwordIsExist || isRegisterPassword"
            :style="
              passwordIsExist ? 'margin-bottom:25px  ;margin-top:10px' : ''
            "
          >
            <div class="my_login_right_input_img">
              <svg-icon icon-class="password3" size="23"></svg-icon>
            </div>
            <el-input
              class=""
              show-password
              type="password"
              v-model="registerForm.password"
              placeholder="Please input a Pin Code"
            />
          </el-form-item>

          <el-form-item
            prop="confirmPassword"
            v-if="!passwordIsExist || isRegisterPassword"
          >
            <div class="my_login_right_input_img">
              <svg-icon icon-class="password3" size="23"></svg-icon>
            </div>
            <el-input
              class=""
              show-password
              type="password"
              v-model="registerForm.confirmPassword"
              placeholder="Please confirm the Pin Code"
            />
          </el-form-item>
          <el-form-item
            prop="privateKey"
            v-if="passwordIsExist && !isRegisterPassword"
          >
            <div class="my_login_right_input_img">
              <svg-icon icon-class="password3" size="23"></svg-icon>
            </div>
            <el-input
              class=""
              show-password
              type="password"
              v-model="registerForm.privateKey"
              placeholder="Please input the private key"
            />
          </el-form-item>
          <el-button
            v-if="!passwordIsExist"
            class="ejUnNt loginButtom"
            type="primary"
            :loading="loading"
            style="width: 100%; margin-bottom: 30px; height: 46px"
            @click="submit(registerFormRef)"
          >
            Confirm
          </el-button>
          <el-button
            v-if="passwordIsExist"
            class="ejUnNt loginButtom"
            type="primary"
            :loading="loading"
            style="width: 100%; margin-bottom: 30px; height: 46px"
            @click="importPrivateKey"
          >
            Confirm
          </el-button>
          <!-- <el-button
            v-if="passwordIsExist && isRegisterPassword"
            class="ejUnNt loginButtom"
            type="primary"
            :loading="loading"
            style="width: 100%; margin-bottom: 30px; height: 46px"
            @click="resetPassword"
          >
            Confirm
          </el-button> -->
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script setup>
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import { ref, reactive, watch, toRefs, onMounted, computed } from "vue";
import {
  getUserLoginStatus,
  setImportPrivateKey,
  getValidatePassword,
  setresetPassword,
  getDmcUsername,
} from "@/api/common";
import { updateUser } from "@/utils/api";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const emits = defineEmits(["closeDialog", "login"]);
const store = useStore();
const router = useRouter();
const registerFormRef = ref();
let loading = ref(false);
let isRegisterPassword = ref(false);
let passwordIsExist = ref(true);
const props = defineProps(["userInfo"]);
const loginForm = reactive({
  registerForm: {
    password: "",
    confirmPassword: "",
    privateKey: "",
  },
  registerRules: {
    password: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (passwordIsExist.value) {
            if (loginForm.registerForm.password != "") {
              callback();
            } else {
              callback(new Error("Please input a Pin Code!"));
            }
          } else {
            if (loginForm.registerForm.confirmPassword != "") {
              if (value == loginForm.registerForm.confirmPassword) {
                callback();
              } else if (value == "") {
                callback(new Error("Please enter a confirmation Pin Code!"));
              } else {
                callback(new Error("The two Pin Code entered do not match!"));
              }
            } else {
              callback();
            }
          }
        },
      },
    ],
    confirmPassword: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (loginForm.registerForm.password != "") {
            if (value == loginForm.registerForm.password) {
              callback();
            } else if (value == "") {
              callback(new Error("Please enter a confirmation Pin Code!"));
            } else {
              callback(new Error("The two Pin Code entered do not match!"));
            }
          } else {
            callback();
          }
        },
      },
    ],
    privateKey: {
      required: true,
      message: "Please enter the private key",
      trigger: "blur",
    },
  },
});
const { registerForm, registerRules } = toRefs(loginForm);

watch(
  passwordIsExist,
  (newVal, oldVal) => {
    console.log(newVal, oldVal);
    if (newVal) {
      loginForm.registerRules.confirmPassword[0].required = false;
    } else {
      loginForm.registerRules.confirmPassword[0].required = true;
    }
  },
  { immediate: true }
);

function submit(FormRef) {
  if (!FormRef) return;

  FormRef.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      if (passwordIsExist.value) {
        if (isRegisterPassword.value) {
          setresetPassword({
            password: loginForm.registerForm.password,
            email: props.userInfo.email,
            username: props.userInfo.dmc,
          })
            .then(async (res) => {
              if (res.code == 200) {
                store.commit("clientGlobal/SAVE_PASSWORD", res.data);
                await SAVE_PASSWORD();
                await loadUserLoginStatus();
              }
              loading.value = false;
            })
            .catch((error) => {
              loading.value = false;
            });
        } else {
          getValidatePassword({
            password: loginForm.registerForm.password,
            email: props.userInfo.email,
          })
            .then((res) => {
              if (res.code == 200) {
                store.commit(
                  "clientGlobal/SAVE_PASSWORD",
                  res.data.encryptedPassword
                );

                loading.value = false;

                emits("closeDialog");

                // router.push({ path: '/Alltemplate/Home' })
              } else {
                ElMessage({
                  showClose: true,
                  message: "Password error",
                  type: "error",
                });

                loading.value = false;
              }
            })
            .catch((error) => {
              loading.value = false;
            });
        }
      } else {
        await SAVE_PASSWORD();
        await loadUserLoginStatus();
        loading.value = false;
      }
    } else {
      loading.value = false;
      return false;
    }
  });
}

async function SAVE_PASSWORD() {
  await store.dispatch("clientGlobal/setSavePassword", {
    password: loginForm.registerForm.password,
    email: props.userInfo.email,
    username: props.userInfo.dmc,
  });
}
const userId = computed(() => store.getters.userInfo?.id || "");
async function importPrivateKey() {
  getDmcUsername({ privateKey: loginForm.registerForm.privateKey }).then(
    (res) => {
      if (res.code == 200) {
        if (props.userInfo?.dmc && res.data === props.userInfo.dmc) {
          setImportPrivateKey({
            privateKey: loginForm.registerForm.privateKey,
            email: props.userInfo.email,
          }).then((res) => {
            if (res.code == 200) {
              store.dispatch("global/setHasReady", true);

              emits("login");
            }
          });
        } else if (!props.userInfo?.dmc && res.data) {
          let postdata = {
            dmc: res.data,
            wallet_type: "wallet",
          };
          updateUser(userId.value, postdata).then((res) => {
            if (res && res.data && res.data.dmc) {
              setImportPrivateKey({
                privateKey: loginForm.registerForm.privateKey,
                email: props.userInfo.email,
              }).then((res) => {
                if (res.code == 200) {
                  store.dispatch("global/setHasReady", true);

                  // store.commit('global/SAVE_USERNAME', res.data)
                  emits("login");
                }
              });
            }
          });
        } else {
          ElNotification({
            customClass: "notify-error",
            message: "Incorrect private key filling",
            position: "bottom-left",
          });
        }
      } else {
        ElNotification({
          customClass: "notify-error",
          message: "Incorrect private key filling",
          position: "bottom-left",
        });
      }
    }
  );
}

function loadUserLoginStatus() {
  let params = {
    email: props.userInfo.email,
    // username: props.userInfo.dmc,
  };

  getUserLoginStatus(params).then((res) => {
    if (res.code == 10001) {
      passwordIsExist.value = false;
    } else if (res.code == 10002) {
      passwordIsExist.value = true;
      emits("login");
    } else if (res.code == 10007) {
      emits("login");
      passwordIsExist.value = true;
      // importPrivateKey();
    }
  });
}
onMounted(() => {
  sessionStorage;
  loadUserLoginStatus();
});
</script>

<style lang="scss" scoped>
.logincontent {
  width: 450px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ejUnNt {
  background: linear-gradient(
    91.4deg,
    rgb(47, 184, 255) 0%,
    rgb(158, 236, 217) 100%
  );
  border: none;
  border-radius: 30px;
  box-shadow: rgb(147 231 221 / 30%) 0px 20px 40px;
  cursor: pointer;
  text-align: center;
  padding: 12px 0px;
  width: 100%;
  position: relative;
  -webkit-box-pack: center;
  justify-content: center;
  margin-bottom: 0 !important;
}

.loginButtom {
  font-style: normal;
  font-size: 17px;
  line-height: 130%;
  color: rgb(14, 67, 92);
  font-weight: 600;
  margin: 0px;
}

.my_login_box ::v-deep .el-input__wrapper {
  padding: 0px;
  border-radius: 30px;
  height: 45px;
  .el-input__suffix {
    width: 35px;
  }
}

.my_login_box ::v-deep .el-input__inner {
  border: none;
  background: transparent;
  height: 45px;
  width: 100%;
  border-radius: 30px;
  box-sizing: border-box;
  padding: 10px 10px 10px 56px;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 130%;

  transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
  width: 360px;
}

::v-deep .el-card {
  width: 100%;
  justify-items: center;
  background: rgba(50, 61, 109, 0.2);
  background: #f2f6ff;
  border-radius: 20px;
  opacity: 1;
  border: none;
}

.Register_btn {
  margin-bottom: 10px;
  width: 100%;
  text-align: center;
  color: #ccc;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  cursor: pointer;

  span:hover {
    transform: scale(1.1);
  }

  & > div {
    width: 50%;
    height: 25px;
    flex: 1 1 auto;
    margin: 0px 10px;
  }

  & > div:first-child {
    text-align: left;
  }

  & > div:last-child {
    text-align: right;
  }

  span {
    color: rgb(47, 184, 255);
    text-decoration: underline;
    font-weight: bold;
  }

  .password_login {
    color: rgb(47, 184, 255);
    display: inline-block;
  }

  .el-checkbox__inner {
    background: rgba(255, 255, 255, 0.3);
  }
}
</style>
