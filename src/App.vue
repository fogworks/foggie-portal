<template>
  <router-view />
</template>

<script setup>
import { user, detected_net } from "@/utils/api.js";
import { useStore } from "vuex";
const store = useStore();
const initFoggieDate = async () => {
  detected_net().then((res) => {
    if (res.result.detected_net) {
      store.dispatch("global/setDetected_net", true);
    } else {
      store.dispatch("global/setDetected_net", false);
    }
  });
  let data = await user();
  if (data) {
    store.dispatch("global/setUserInfo", {
      ...data.data,
    });
  }
};
initFoggieDate();
</script>

<style lang="scss">
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
  text-align: center;
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
