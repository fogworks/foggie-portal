<template>
  <div class="all_header">
    <el-icon size="25" color="#000" @click="closeOpenAside">
      <Expand />
    </el-icon>

    <div style="display: flex; align-items: center">
      <el-switch
        style="margin-right: 20px"
        v-model="theme"
        inline-prompt
        :active-icon="Sunny"
        :inactive-icon="Moon"
        @click="toggle()"
      />

      <el-dropdown trigger="click" @command="handleChange">
        <el-avatar>
          <el-icon size="20">
            <Avatar />
          </el-icon>
        </el-avatar>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="log_out"> Logout </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { Sunny, Moon } from "@element-plus/icons-vue";
import { useDark, useToggle } from "@vueuse/core";
import {
  ref,
  onMounted,
  nextTick,
  watch,
  markRaw,
  reactive,
  toRefs,
} from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
let theme = ref(true);

const emit = defineEmits(["setlanguage_key"]);

const isDark = useDark({
  storageKey: "useDarkKEY",
  valueDark: "dark",
  valueLight: "light",
});
const toggle = useToggle(isDark);

watch(theme, (newVal) => {
  store.commit("global/setSystemTheme", newVal);
});

// onMounted(() => {
//   if (window.localStorage.getItem("useDarkKEY")) {
//     window.localStorage.getItem("useDarkKEY") == "auto" ? (theme.value = true) : (theme.value = false);
//   } else {
//     theme.value = true;
//   }
//   store.commit('global/setSystemTheme', theme.value)

// });

function closeOpenAside() {
  // emit('closeOpenAside')
}

function handleChange(item) {
  if (item == "log_out") {
  }
}
</script>

<style lang="scss" scoped>
.all_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  line-height: 80px;
}

.userInfo {
  line-height: 80px;
}

.dropdownName {
  color: #fff;
  cursor: default;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100px;
  flex: 0 0 auto;
  text-align: center;
}

.slidingBlock {
  position: absolute;
  bottom: -3px;
  left: 0px;
  width: 50px;
  height: 5px;
  border-radius: 2px;
  font-weight: bolder;
  background-color: #fff;
  transition: left 0.3s ease;
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

.my_login_box {
  padding: 20px 40px;
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

// .my_login_box ::v-deep .el-input__wrapper {
//   width: 360px;
//   transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
//   padding: 10px 10px 10px 56px;
//   border-radius: 30px;
//   box-sizing: border-box;
// }

::v-deep .el-card {
  width: 100%;
  justify-items: center;
  background: rgba(50, 61, 109, 0.2);
  border-radius: 20px;
  opacity: 1;
}

.my_login_box ::v-deep .el-input__inner {
  outline: none;
  padding-left: 42px;
  box-shadow: rgb(47 184 255 / 30%) 0px 10px 40px,
    rgb(28, 170, 241) 0px 0px 0px 1px inset;
  padding-left: 56px;
}

.my_login_box input:-internal-autofill-selected {
  -webkit-text-fill-color: rgb(255, 255, 255);
  transition: background-color 5000s ease-in-out 0s;
  box-shadow: rgb(47 184 255 / 30%) 0px 10px 40px,
    rgb(47 184 255) 0px 0px 0px 1px inset;
  background: linear-gradient(
    rgba(24, 32, 79, 0.4) 0%,
    rgba(24, 32, 79, 0.25) 100%
  );
}

.my_login_box ::placeholder {
  color: "#999999";
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.my_login_box .my_login_right_input_img {
  background: rgba(167, 162, 162, 0.2);
  border-radius: 50%;
  position: absolute;
  top: 4px;
  left: 4px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.my_login_box ::v-deep .el-form-item__content {
  display: flex;
  height: 44px;
}

.extraTip {
  font-size: 12px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #ff6e6e;
  line-height: 22px;
}
</style>
