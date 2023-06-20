<template>
  <div>
    <div class="vofo_head_center">
      <div class="order_sub_head">
        <el-tabs v-model="activeName">
          <el-tab-pane label="Product" name="index"> </el-tab-pane>
          <el-tab-pane label="Order" name="Order"> </el-tab-pane>
          <!-- <el-tab-pane :label="$t('index.setting')" name="User"> </el-tab-pane> -->
        </el-tabs>
      </div>
    </div>
    <FoggieProduct v-if="activeName === 'index'"> </FoggieProduct>
    <Order v-else-if="activeName === 'Order'"> </Order>
  </div>
</template>

<script setup>
import { ref } from "vue";
import FoggieProduct from "./_foggieModules/index";
import Order from "./_foggieModules/index1";
const activeName = ref("index");
</script>

<style lang="scss">
.vofo_head_center {
  margin-bottom: 20px;
}
.order_sub_head {
  display: flex;
  justify-content: center;
}
.order_sub_head .el-tabs__item {
  color: #fff !important;
  font-size: 16px;
  font-weight: normal;
  width: 200px;
  width: 120px;
  text-align: center;
  font-family: Microsoft YaHei;
  // padding: 0 20px !important;
  // margin-right: 10px;
}
.order_sub_head .el-tabs__nav-wrap::after {
  background-color: transparent !important;
}

.order_sub_head .is-active {
  color: #fff !important;
  font-weight: bolder;
}
.order_sub_head .el-tabs__active-bar {
  height: 4px;
  border-radius: 60px;
  border-radius: 10px;
  text-align: center;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: rgb(31 47 71 / 25%) 0px 20px 40px, rgb(0 0 0 / 10%) 0px 1px 5px,
    rgb(255 255 255 / 40%) 0px 0px 0px 0.5px inset;
  background-color: #fff !important;
}
.el-tabs__item:hover {
  // border-radius: 10px;
  // text-align: center;
  // background: rgba(255, 255, 255, 0.2);
  // box-shadow: rgb(31 47 71 / 25%) 0px 20px 40px, rgb(0 0 0 / 10%) 0px 1px 5px,
  //   rgb(255 255 255 / 40%) 0px 0px 0px 0.5px inset;
}

.order_sub_head .el-tabs__content {
  overflow: initial !important;
}
.order_sub_head .el-tabs__header {
  margin: 0;
}
</style>
