<template>
  <div style="position: relative;margin-top: 10px;">
    <div class="common-layout">
      <div></div>
      <div></div>
    </div>
    <el-tabs v-model="activeName" type="card" >
      <el-tab-pane name="List">
        <template #label>
          <span class="custom-tabs-label">
            <svg-icon
              icon-class="orderFilter"
              size="20"
              style="margin-right: 10px"
            ></svg-icon>
            <span>List</span>
          </span>
        </template>
        <orderList :activeName="activeName"></orderList>
      </el-tab-pane>
      <el-tab-pane name="Options" :lazy="true">
        <template #label>
          <span class="custom-tabs-label">
            <svg-icon
              icon-class="orderList"
              size="20"
              style="margin-right: 10px"
            ></svg-icon>

            <span>Filter</span>
          </span>
        </template>
        <filterOrder :activeName="activeName"></filterOrder>
      </el-tab-pane>
      <el-tab-pane name="History" :lazy="true">
        <template #label>
          <span class="custom-tabs-label">
            <svg-icon
              icon-class="orderHistory"
              size="20"
              style="margin-right: 10px"
            ></svg-icon>
            <span>History</span>
          </span>
        </template>

        <orderHistory :activeName="activeName"></orderHistory>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup name="Orders">
import filterOrder from "@/components/orders/filterOrder";
import orderList from "@/components/orders/orderList";
import orderHistory from "@/components/orders/orderHistory";

import { ref,reactive } from "vue";
let activeName = ref("List");


</script>

<style lang="scss" scoped>
::v-deep {
  .el-tabs--card > .el-tabs__header {
    border-bottom: 1px solid transparent;
  }

  .el-tabs__header {
    margin-bottom: 50px;
  }

  .el-tabs--card > .el-tabs__header .el-tabs__item {
    border-bottom: 1px solid var(--el-border-color-light);
  }

  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border-radius: 0;
  }

  .el-tabs__item {
    padding: 0 40px !important;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    font-style: italic;
    background-color: #333333;
    border: 0px;
    text-align: center;
  }


}

.custom-tabs-label {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: var(--el-tabs-header-height);
  line-height: var(--el-tabs-header-height);
}
</style>
