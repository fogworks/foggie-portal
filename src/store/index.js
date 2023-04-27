import { createStore } from "vuex";
import createPersistedState from 'vuex-persistedstate';
import getters from './getters'

// import global from "./modules/global.js";
// import upload from "./modules/upload.js";
// import token from "./modules/token.js";


const modulesFiles = require.context('./modules', true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});


export default createStore({
  // 公共模板直接在这里展开就可以
  // ...global,
  modules,
  getters,
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