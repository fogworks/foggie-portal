<template>
  <div class="portal-main">
    <div>
      <el-menu :default-active="defaultActive" router>
        <el-menu-item index="user" class="user">
          <svg-icon icon-class="user"></svg-icon>
          <div v-if="userName" :title="userName">
            {{ userName }}
          </div>
        </el-menu-item>
        <el-menu-item index="device" v-if="userName !== 'Login'">
          <span><svg-icon icon-class="devices"></svg-icon>Device</span>
        </el-menu-item>
        <el-menu-item index="discover">
          <span><svg-icon icon-class="discover"></svg-icon>Discover</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="main">
      <!-- <User v-if="active === 'User'"></User>
      <Device v-if="active === 'Device'"></Device>
      <Discover v-if="active === 'Discover'"></Discover> -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
const store = useStore();
const route = useRoute();
const defaultActive = ref(route.path.slice(1, route.path.length));

const userName = computed(() => store.getters["token/currentUser"] || "Login");
</script>

<style lang="scss" scoped>
.portal-main {
  display: flex;
  height: 100%;
  background: url("~@/assets/cool-background.png") no-repeat;
  background-size: cover;

  :deep {
    .el-menu {
      width: 250px;
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
          width: 250px;
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
            padding: 0 10px;
            font-size: 16px;
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
