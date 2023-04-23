import { createStore } from "vuex";
import createPersistedState from 'vuex-persistedstate';
import getters from './getters'

import global from "./modules/global.js";
import upload from "./modules/upload.js";
import token from "./modules/token.js";

export default createStore({
  // 公共模板直接在这里展开就可以
  // ...global,
  modules: {
    global,
    upload,
    token,
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      key: 'FoggieV',
      // paths: ['global',],

      reducer: (state) => ({
        global: {
          ChainId: state.global.ChainId,
          Password: state.global.Password,
        },
        upload: {
          orderId: state.upload.orderId
        }
      })
    }),
  ],
});