<template>
  <div class="portal-main">
    <div>
      <!-- <div class="user">
        <svg-icon icon-class="user" @click="visible = true"></svg-icon>
        <div v-if="userName" :title="userName">
          {{ userName }}
        </div>
      </div> -->
      <el-menu default-active="User" @select="handleSelect">
        <el-menu-item index="User" class="user">
          <svg-icon icon-class="user" @click="visible = true"></svg-icon>
          <div v-if="userName" :title="userName">
            {{ userName }}
          </div>
        </el-menu-item>
        <el-menu-item index="Device">
          <span><svg-icon icon-class="devices"></svg-icon>Device</span>
        </el-menu-item>
        <el-menu-item index="Discover">
          <span><svg-icon icon-class="discover"></svg-icon>Discover</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="main">
      <User v-if="active === 'User'"></User>
      <Device v-if="active === 'Device'"></Device>
      <Discover v-if="active === 'Discover'"></Discover>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Device from "./_modules/device";
import Discover from "./_modules/discover";
import User from "./_modules/user";
import { useStore } from "vuex";
const store = useStore();
const active = ref("User");
const visible = ref(false);
const handleSelect = (key, keyPath) => {
  console.log(key);
  active.value = key;
};
const userName = computed(() => store.getters["token/currentUser"] || "Login");
</script>

<style lang="less" scoped>
.portal-main {
  display: flex;
  height: 100%;

  :deep {
    .el-menu {
      width: 250px;
      background-color: #f2f6ff;
      .el-menu-item {
        display: flex;
        text-align: left;
        align-items: center;
        font-size: 20px;
        svg {
          margin-right: 10px;
          font-size: 30px;
          cursor: pointer;
          vertical-align: middle;
        }
        &.user {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          box-sizing: border-box;
          width: 250px;
          padding: 0 20px;
          height: 50px;

          div {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
  .main {
    position: relative;
    overflow-y: auto;
    height: calc(100% - 60px);
    flex: 1;
    padding: 30px;
    background: linear-gradient(
      220deg,
      rgba(174, 176, 238, 1) 0%,
      rgba(148, 187, 233, 1) 100%
    );
    background: url("~@/assets/cool-background.png") no-repeat;
    background-size: cover;
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
