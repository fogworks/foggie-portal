<template>
  <div>
    <p class="welcome">My device</p>
    <ul class="deviceList">
      <li v-for="item in deviceList.list">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits } from "vue";

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
  display: flex;
  align-items: center;
  text-align: left;
  font-weight: 700;
  font-size: 24px;
}

.deviceList {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  margin: 20px;
  padding: 0;
  list-style: none;
  li {
    box-sizing: border-box;
    width: 200px;
    height: 180px;
    margin: 20px;
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
