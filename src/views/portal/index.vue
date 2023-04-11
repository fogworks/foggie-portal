<template>
  <div class="portal-main">
    <el-menu default-active="Device" @select="handleSelect">
      <el-menu-item index="Device">
        <span>My device</span>
      </el-menu-item>
      <el-menu-item index="Discover">
        <span>Discover</span>
      </el-menu-item>
    </el-menu>
    <div class="main">
      <Device v-show="active === 'Device'"></Device>
      <Discover v-show="active === 'Discover'"></Discover>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Device from "./_modules/device";
import Discover from "./_modules/discover";
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
    overflow-y: auto;
    height: calc(100% - 60px);
    flex: 1;
    padding: 30px;
    background: linear-gradient(
      220deg,
      rgba(174, 176, 238, 1) 0%,
      rgba(148, 187, 233, 1) 100%
    );
  }
}
</style>
