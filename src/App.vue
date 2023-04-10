<template>
  <!-- <router-view></router-view> -->
  <!-- <div id="app">
    <router-view />
  </div> -->
  <router-view />

  <!-- <Layout></Layout> -->
</template>

<script>
import Layout from "./views/layout/index";
// import mainVue from './views/main/main.vue'
export default {
  name: "App",
  components: {
    Layout,
  },
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-width: 1200px;
  text-align: center;
  color: #2c3e50;
  background: var(--bg-color);
  height: 100vh;
}
::-webkit-scrollbar {
  display: none;
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
