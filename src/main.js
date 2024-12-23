import { createApp } from "vue";
import SvgIcon from "@/components/svg-icon";
import ElementPlus, { Table } from "element-plus";
import "element-plus/dist/index.css";
import * as echarts from "echarts";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import 'element-plus/theme-chalk/dark/css-vars.css'
import router from "./router";
import store from "./store";
import uploader from "vue-simple-uploader";
import i18n from "@/static/language/index.js";


import 'normalize.css/normalize.css'
import '../src/static/style/index.scss'


const req1 = require.context("@/svg-icons", true, /\.svg$/);
const requireAll = (requireContext) => {
  requireContext.keys().map(requireContext);
};
requireAll(req1);
import App from "./App.vue";

const app = createApp(App);
app.provide("$echarts", echarts);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app
  .use(ElementPlus)
  .component("SvgIcon", SvgIcon)
  .use(uploader)
  .use(store)
  .use(router)
  .use(i18n)
  .mount("#app");
