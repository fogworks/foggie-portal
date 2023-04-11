<template>
  <div>
    <p class="welcome">Device Discovery</p>
    <ul class="deviceList">
      <WifiSearching v-if="loading"></WifiSearching>
      <li v-else v-for="item in deviceList.list">
        {{ item.name }}
      </li>
    </ul>
    <NextButton @click="emit('next')"></NextButton>
    <!-- <el-button @click="emit('next')">Next</el-button> -->
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits } from "vue";
import WifiSearching from "@/components/wifiSearching";
import NextButton from "@/components/nextButton";
const loading = ref(false);
const deviceList = reactive({
  list: [
    {
      name: "xx",
      url: "dasdas",
    },
    {
      name: "xx",
      url: "dasdas",
    },
    {
      name: "xx",
      url: "dasdas",
    },
    {
      name: "xx",
      url: "dasdas",
    },
    {
      name: "xx",
      url: "dasdas",
    },
    {
      name: "xx",
      url: "dasdas",
    },
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
  width: 280px;
  overflow-y: auto;
  height: 400px;
  margin: 20px auto;
  padding: 0;
  list-style: none;
  :deep {
    #wifi-loader {
      margin: 100px auto;
    }
  }
  li {
    box-sizing: border-box;
    width: 250px;
    height: 60px;
    margin: 20px auto;
    background: rgba(251, 251, 251, 0.58);
    border: 1px solid white;
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(6px);
    border-radius: 17px;
    text-align: center;
    cursor: pointer;
    transition: all 0.5s;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    font-weight: bolder;
    color: black;
    cursor: pointer;
    &:hover {
      border: 1px solid black;
      transform: scale(1.05);
    }
    &:active {
      transform: scale(0.95);
    }
  }
}
</style>
