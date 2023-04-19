<template>
  <!-- <router-view></router-view> -->
  <!-- <div id="app">
    <router-view />
  </div> -->
  <router-view />

  <!-- <Layout></Layout> -->
</template>

<script setup>
import { user } from "@/utils/api.js";
import { useStore } from "vuex";
const store = useStore();
const initFoggieDate = async () => {
  // get is have net

  // let data = {
  //   pn: 1,
  //   ps: 50,
  // };
  let data = await user();
  console.log(data, "data");
  if (data) {
    store.dispatch("setUserInfo", {
      ...data.data,
    });
  }

  // if (oodData && oodData.data && oodData.data.length > 0) {
  //   currentOODItem.value.data = oodData.data[0];
  // }
};
initFoggieDate();
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-width: 1200px;
  // text-align: left;
  color: #2c3e50;
  background: var(--bg-color);
  height: 100vh;
  overflow-y: auto;
}
::-webkit-scrollbar {
  // display: none;
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/

  border-radius: 5px;

  background: rgba(0, 0, 0, 0.2);
}

@font-face {
  font-family: Farrington7B;
  src: url("~@/assets/Farrington-7B.ttf");
  src: url("~@/assets/Farrington7B.woff2");
}

img {
  height: auto;
  vertical-align: middle;
}

div,
p,
span,
button,
input {
  font-family: GalanoGrotesqu-apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif,
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
    Cantarell, "Open Sans", "Helvetica Neue", sans-serifeAlt !important;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif, -apple-system,
    BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
    "Open Sans", "Helvetica Neue", sans-serif !important;
  margin: 0;
  padding: 0;
}
</style>
