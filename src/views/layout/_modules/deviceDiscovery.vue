<template>
  <div>
    <p class="welcome">Device Discovery</p>
    <ul class="deviceList">
      <li v-for="item in deviceList.list">
        {{ item.name }}
      </li>
    </ul>
    <el-button @click="emit('next')">Next</el-button>
  </div>
</template>

<script setup>
import { reactive, defineEmits } from "vue";
const deviceList = reactive({
  list: [
    {
      name: "xx",
      url: "dasdas",
    },
  ],
});
const emit = defineEmits(["next"]);
</script>

<style lang="less" scoped>
.welcome {
  font-weight: 700;
  font-size: 30px;
}
.deviceList {
  margin: 0;
  padding: 0;
  list-style: none;
  li {
    width: 250px;
    height: 100px;
    margin: 0 auto;
    border-radius: 30px;
    background: #e0e0e0;
    box-shadow: 15px 15px 30px #bebebe, -15px -15px 30px #ffffff;
  }
}
</style>
