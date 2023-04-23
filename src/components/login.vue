<template>
  <div class="logincontent">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          Sign In
        </div>
      </template>
      <div class="text item my_login_box">



        <!-- 注册 -->
        <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules">

          <el-form-item prop="password" :style="passwordIsExist ? 'margin-bottom:25px  ;margin-top:10px' : ''">
            <div class="my_login_right_input_img">
              <svg-icon icon-class="password3" size="23"></svg-icon>
            </div>
            <el-input class="" :show-password="false" type="password" v-model="registerForm.password"
              placeholder="请输入密码" />
          </el-form-item>

          <el-form-item prop="confirmPassword" v-if="!passwordIsExist">
            <div class="my_login_right_input_img">
              <svg-icon icon-class="password3" size="23"></svg-icon>
            </div>
            <el-input class="" :show-password="false" type="password" v-model="registerForm.confirmPassword"
              placeholder="请确认密码" />
          </el-form-item>


          <el-button class="ejUnNt loginButtom" type="primary" :loading="loading"
            style="width: 100%; margin-bottom: 30px; height: 46px" @click="submit(registerFormRef)">
            登录/注册为新用户
          </el-button>
        </el-form>

      </div>
    </el-card>
  </div>
</template>
<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, watch, toRefs, onMounted } from "vue";
import { getUserLoginStatus, setImportPrivateKey, getValidatePassword } from "@/api/common";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore()
const router = useRouter()
const registerFormRef = ref()
let loading = ref(false)
let passwordIsExist = ref(true)  // 密码是否存在 true 存在  false 不存在
const loginForm = reactive({
  registerForm: {
    password: '',
    confirmPassword: ""
  },
  registerRules: {
    password: [
      {
        required: true, trigger: "blur",
        validator: (rule, value, callback) => {
          if (passwordIsExist.value) {
            /* 密码存在 */
            if (loginForm.registerForm.password != "") {
              callback();
            } else {
              callback(new Error("请输入密码!"));
            }
          } else {
            if (loginForm.registerForm.confirmPassword != "") {
              if (value == loginForm.registerForm.confirmPassword) {
                callback();
              } else if (value == "") {
                callback(new Error("请输入确认密码!"));
              } else {
                callback(new Error("两次输入密码不一致!"));
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
              callback(new Error("请输入确认密码!"));
            } else {
              callback(new Error("两次输入密码不一致!"));
            }
          } else {
            callback();
          }
        },
      }

    ],
  },
})
const { registerForm, registerRules } = toRefs(loginForm)

watch(passwordIsExist, (newVal, oldVal) => {
  console.log(newVal, oldVal);
  if (newVal) {
    /* 密码存在 */
    loginForm.registerRules.confirmPassword[0].required = false

  } else {
    /* 密码不存在 */
    loginForm.registerRules.confirmPassword[0].required = true
  }

}, { immediate: true })

function submit(FormRef) {

  if (!FormRef) return

  FormRef.validate(async (valid) => {

    if (valid) {
      loading.value = true
      if (passwordIsExist.value) {
        //如果密码存在
        getValidatePassword({ password: loginForm.registerForm.password }).then(res => {
          if (res.code == 200) {
            store.commit('global/SAVE_PASSWORD', res.data)
            loading.value = false
            router.push({ path: '/Alltemplate/Home' })

          } else {
            loading.value = false

          }
        }).catch((error) => {
          loading.value = false
        })


      } else {
        /* 密码不存在 */
        // await store.dispatch('global/setSavePassword', loginForm.registerForm.password)

        ElMessageBox.prompt('请输入私钥', 'Tip', {
          'show-close': false,
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          inputPlaceholder: "请输入私钥",
          // inputPattern:
          //   /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          // inputErrorMessage: 'Invalid Email',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {

              setImportPrivateKey({ privateKey: instance.inputValue }).then(res => {
                if (res.code == 200) {
                  done()
                  router.push({ path: '/Alltemplate/Home' })

                }
              })
            } else {
              done()
            }
          },
        })
          .then(({ value }) => {
          })
          .catch(() => {
          })
        loading.value = false;
      }
    } else {
      loading.value = false;
      return false
    }
  });
}

function loadUserLoginStatus() {
  getUserLoginStatus().then(res => {
    
    if (res.code == 10001) {
      /* 密码不存在 */
      passwordIsExist.value = false

    } else if (res.code == 10002) {
      /* 密码存在 */
      passwordIsExist.value = true
    }
  })
}
onMounted(() => {
  sessionStorage
  loadUserLoginStatus()
})


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
  background: linear-gradient(91.4deg,
      rgb(47, 184, 255) 0%,
      rgb(158, 236, 217) 100%);
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
  border-radius: 20px;
  opacity: 1;
}
</style>
