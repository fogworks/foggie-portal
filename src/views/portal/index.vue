<template>
  <div class="portal-main">
    <el-menu default-active="Device" @select="handleSelect">
      <el-menu-item index="Device">
        <span>My device</span>
      </el-menu-item>
      <el-menu-item index="Discover">
        <span>Discover</span>
      </el-menu-item>
      <el-menu-item index="Setting">
        <span>Setting</span>
      </el-menu-item>
    </el-menu>
    <div class="main">
      <Device v-show="active === 'Device'"></Device>
      <Discover v-show="active === 'Discover'"></Discover>
      <Setting v-show="active === 'Setting'"></Setting>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Device from "./_modules/device";
import Discover from "./_modules/discover";
import Setting from "./_modules/setting";
const active = ref("Device");
const handleSelect = (key, keyPath) => {
  console.log(key);
  active.value = key;
};
</script>

<style lang="less" scoped>
.portal-main {
  display: flex;
  height: 100%;
  :deep {
    .el-menu {
      width: 150px;
      background-color: #f2f6ff;
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
