<template>
  <div class="top">
    <div class="header-left">
      <a href="https://fogworks.io/" target="_blank">
        <img
          v-if="currentTheme === 'light'"
          class="logo"
          src="@/assets/logo-top-left.png"
          alt=""
        />
        <img v-else class="logo" src="@/assets/logo-top-left-dark.png" alt="" />
      </a>
      <span class="line" />
      <router-link class="name-link" to="/home">
        <img class="foggie" src="@/assets/foggie.jpg" alt="" />
      </router-link>

      <div class="beta">Max Beta</div>
    </div>
    <div class="header-right">
      <!-- <img v-if="userName" src="@/assets/user.png" alt="" /> -->
      <el-dropdown
        ref="logoutRef"
        v-if="userName"
        trigger="click"
        @command="userCommand"
        @visible-change="LogoutVisibleChange"
      >
        <div>
          <img src="@/assets/user.png" alt="" />
        </div>
        <template #dropdown>
          <el-dropdown-menu class="logout-dropdown">
            <el-dropdown-item command="setting">Set</el-dropdown-item>
            <!-- <el-dropdown-item command="logout">Logout</el-dropdown-item> -->
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div v-if="userName && accessible" class="user-info">
        <div
          class="user-name"
          :title="userName"
          @click="logoutShow ? logoutRef.handleClose() : logoutRef.handleOpen()"
        >
          {{ userName }}
        </div>
        <!-- <el-dropdown trigger="click" @command="userCommand">
          <template #dropdown>
            <el-dropdown-menu class="logout-dropdown">
              <el-dropdown-item command="logout">Logout</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->
        <div class="free">Max</div>
      </div>
      <div
        class="theme"
        @click="handleThemeChange(currentTheme === 'light' ? 'dark' : 'light')"
      >
        <el-icon class="light" v-if="currentTheme === 'light' || ''"
          ><Sunny
        /></el-icon>
        <el-icon class="dark" v-else><Moon /></el-icon>
      </div>
      <!-- <div class="language">
        <el-dropdown trigger="click" @command="handleCommand">
          <svg-icon icon-class="language" class="language-icon"></svg-icon>
          <template #dropdown>
            <el-dropdown-menu class="lan-dropdown">
              <el-dropdown-item
                v-for="item in lanList"
                :class="{ 'is-active': currentLanguage === item }"
                :command="item"
                >{{ item }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div> -->
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  name: "LayoutHeader",
  setup() {
    const store = useStore();
    const router = useRouter();
    const logoutShow = ref(false);
    const logoutRef = ref(null);
    const userName = computed(() => {
      return store.getters["token/currentUser"];
    });
    const accessible = computed(() => {
      return store.getters.accessible;
    });
    const LogoutVisibleChange = (val) => {
      logoutShow.value = val;
    };
    const currentLanguage = ref("EN");
    const lanList = ["EN", "繁体中文"];

    const currentTheme = ref(window.localStorage.getItem("theme") || "light");
    const themeList = ["light", "dark"];
    const handleCommand = (lan) => {
      currentLanguage.value = lan;
    };
    const handleThemeChange = (val) => {
      currentTheme.value = val;
      document.documentElement.setAttribute("class", val);
      // window.localStorage.setItem("theme", val);
      store.dispatch("global/setTheme", val);
    };

    const getTimeState = () => {
      let timeNow = new Date();
      let hours = timeNow.getHours();
      if (hours >= 0 && hours <= 18) {
        handleThemeChange(window.localStorage.getItem("theme") || "light");
      } else if (hours > 18 && hours <= 24) {
        handleThemeChange(window.localStorage.getItem("theme") || "dark");
      }
    };
    function userCommand(command) {
      if (command === "logout") {
        store.dispatch("token/logout");
        router.push("/login");
      } else if (command === "setting") {
        router.push({
          name: "Setting",
        });
      }
    }

    // getTimeState();
    return {
      userName,
      accessible,
      currentLanguage,
      handleCommand,
      lanList,
      currentTheme,
      themeList,
      handleThemeChange,
      userCommand,
      logoutShow,
      logoutRef,
      LogoutVisibleChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 96px;

  .header-left {
    position: relative;
    display: flex;
    align-items: center;
    .logo {
      height: 36px;
    }
    .fog {
      height: 28px;
    }
    img + img {
      margin-left: 12px;
    }
    .line {
      display: inline-block;
      width: 1px;
      height: 30px;
      margin: 0 16px;
      background: #d8d8d8;
    }
    .foggie {
      height: 40px;
    }
    .beta {
      margin-top: -15px;
      margin-left: 10px;
      padding: 0 5px;
      background: #000;
      font-size: 12px;
      color: #fff;
      border-radius: 99px;
    }
  }
  .header-right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    img {
      width: 40px;
      margin-right: 8px;
      cursor: pointer;
    }
    .user-info {
      .user-name {
        max-width: 220px;
        font-weight: 700;
        font-size: 24px;
        color: var(--text-color);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        cursor: pointer;
      }
      .free {
        width: 54px;
        font-size: 12px;
        font-weight: 700;
        color: $light_blue;
        text-align: center;
        background: #29abff33;
        border: 1px solid rgb(41 171 255);
        border-radius: 99px;
      }
    }
    .logout-dropdown {
    }
    .theme {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 25px;
      height: 25px;
      margin-left: 20px;
      background-color: var(--theme-box-bg);
      border-radius: 50%;
      cursor: pointer;
      .light {
        color: #fff;
      }
      .dark {
        color: #000;
      }
    }
    .language-icon {
      margin-left: 20px;
      color: var(--text-color);
      font-size: 25px;
      cursor: pointer;
    }
    .el-dropdown-link {
      display: flex;
      align-items: center;
      margin-left: 40px;
      cursor: pointer;
      color: $light_blue;
    }
    .lan-button {
      width: 36px;
      height: 36px;
      margin-left: 20px;
      font-size: 16px;
      border-radius: 50%;
    }
  }
}
.lan-dropdown {
  :deep(.el-dropdown-menu__item) {
    font-size: 16px !important;
    font-weight: 100 !important;
    & + .el-dropdown-menu__item {
      border: none !important;
    }
    &.is-active {
      color: $light_blue;
    }
  }
}
</style>
