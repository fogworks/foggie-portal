<template>
  <div class="portal-main" id="portal-main">
    <div class="left-box">
      <div class="collapse" @click="changeCollapse">
        <svg-icon
          icon-class="collapse"
          :class="[isCollapse ? 'isCollapse' : '']"
        ></svg-icon>
      </div>

      <el-menu
        class="left-menu"
        :collapse="isCollapse"
        :default-active="defaultActive"
        router
      >
        <el-menu-item index="user" class="user">
          <svg-icon icon-class="user"></svg-icon>
          <!-- <div v-if="userName" :title="userName">
            {{ userName }}
          </div> -->
          <template #title v-if="userName">
            <div :title="userName">
              {{ userName }}
            </div>
          </template>
        </el-menu-item>
        <el-menu-item index="device" v-if="userName !== 'Login'">
          <svg-icon icon-class="devices"></svg-icon>
          <template #title> Device </template>
        </el-menu-item>
        <el-menu-item index="discover">
          <svg-icon icon-class="discover"></svg-icon>
          <template #title> Discover </template>
        </el-menu-item>
        <el-menu-item index="assets" v-if="userName !== 'Login'">
          <svg-icon icon-class="income"></svg-icon>
          <template #title> Assets </template>
        </el-menu-item>
        <el-menu-item index="shop">
          <svg-icon icon-class="shop"></svg-icon>
          <template #title> Shop </template>
        </el-menu-item>
      </el-menu>
    </div>
    <teleport to="body">
      <upload v-show="uploadIsShow"></upload>
    </teleport>
    <div class="main" id="main">
      <!-- <User v-if="active === 'User'"></User>
      <Device v-if="active === 'Device'"></Device>
      <Discover v-if="active === 'Discover'"></Discover> -->
      <router-view v-slot="{ Component }">
        <component :is="Component" v-if="!$route.meta.keepAlive"></component>
        <keep-alive>
          <component :is="Component" v-if="$route.meta.keepAlive"></component>
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import upload from "@/components/upload";
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
const store = useStore();

let uploadIsShow = computed(() => store.getters.uploadIsShow);
const route = useRoute();
const isCollapse = ref(false);
const defaultActive = ref(route.path.slice(1, route.path.length));

const userName = computed(() => store.getters["token/currentUser"] || "Login");
const changeCollapse = () => {
  isCollapse.value = !isCollapse.value;
};
</script>

<style lang="scss" scoped>
.portal-main {
  display: flex;
  height: 100%;
  background: url("~@/assets/cool-background.png") no-repeat;
  background-size: cover;

  .left-box {
    position: relative;

    .collapse {
      position: absolute;
      right: -20px;
      top: 50%;
      font-size: 30px;
      border-radius: 50%;
      width: 35px;
      height: 35px;
      background-color: #fff;
      cursor: pointer;
      z-index: 1;
      box-shadow: 0 0 7px #727272;

      svg {
        transform: rotate(-90deg);
        transition: all 0.5s;

        &.isCollapse {
          transform: rotate(90deg);
        }

        color: #fff;
        cursor: pointer;
      }
    }
  }

  .left-menu {
    position: relative;
  }

  :deep {
    .el-menu {
      // width: 250px;
      height: 100%;
      background-color: #f2f6ff;

      .el-menu-item {
        display: flex;
        text-align: left;
        align-items: center;
        font-size: 20px;

        svg {
          margin-right: 15px;
          font-size: 30px;
          cursor: pointer;
          vertical-align: middle;
        }

        &.user {
          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
          // width: 250px;
          padding: 10px 20px;
          // height: 50px;
          height: unset;
          line-height: unset;
          color: #fff;
          // background: #8b49ec;
          background: #495dd0;

          // background: rgb(28, 42, 237);
          // background: linear-gradient(
          //   93deg,
          //   rgba(28, 42, 237, 1) 0%,
          //   rgba(126, 12, 247, 1) 52%
          // );
          svg {
            margin-right: 0;
          }

          div {
            padding: 5px 0px;
            font-size: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 100%;
          }
        }
      }

      &.el-menu--collapse {
        // width: 200px;
        // min-height: 400px;
        .user {
          height: 56px;

          div {
            padding: 0 20px;
          }

          svg {
            font-size: 30px;
            margin: 0;
          }
        }

        .el-menu-item {
          svg {
            margin: 0;
            font-size: 30px;
          }
        }
      }

      &:not(.el-menu--collapse) {
        width: 220px;
      }
    }
  }

  .main {
    position: relative;
    overflow-y: auto;
    // height: calc(100% - 60px);
    flex: 1;
    padding: 30px;
    padding-right: 20px;
    // background: linear-gradient(
    //   220deg,
    //   rgba(174, 176, 238, 1) 0%,
    //   rgba(148, 187, 233, 1) 100%
    // );

    > div {
      z-index: 1;
    }

    // &::after {
    //   content: "";
    //   position: absolute;
    //   left: 0;
    //   top: 0;
    //   width: 100%;
    //   height: 100%;
    //   background: url("~@/assets/cool-background.png") no-repeat;
    //   background-size: cover;
    //   z-index: 0;
    // }
  }
}
</style>
