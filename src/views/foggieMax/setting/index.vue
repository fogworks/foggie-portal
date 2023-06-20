<template>
  <div>
    <el-tabs v-model="active" tab-position="top" class="demo-tabs">
      <el-tab-pane label="Change Password" name="Password">
        <changePassword></changePassword>
      </el-tab-pane>
      <el-tab-pane label="Set" name="Setup">
        <Setting></Setting>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from "vue";
import changePassword from "./_modules/changePassword";
import Setting from "./_modules/setting";
const active = ref("Password");
</script>

<style lang="scss" scoped>
.demo-tabs {
  margin: 40px 0;
  :deep {
    .el-tabs__item {
      font-size: 20px;
      color: var(--text-color);
      &.is-active {
        color: $light_blue;
      }
    }
    .el-tabs__active-bar {
      background: $light_blue;
    }
    .el-tabs__content {
      padding: 10px 0;
    }
  }
}
</style>
