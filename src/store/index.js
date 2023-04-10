import { createStore } from "vuex";
import {  setToken,getToken } from "@/utils/auth";

import global from "./modules/global.js";
import upload from "./modules/upload.js";
import token from "./modules/token.js";

export default createStore({
  // 公共模板直接在这里展开就可以
  ...global,
  modules: {
    upload,
    token,
  },
});
