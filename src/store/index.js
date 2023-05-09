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
  // ...global,
  modules,
  getters,
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      key: 'FoggieV',
      // paths: ['global',],

      reducer: (state) => ({
        clientGlobal: {
          ChainId: state.clientGlobal.ChainId,
          clientPassword: state.clientGlobal.clientPassword,
        },
        upload: {
          orderId: state.upload.orderId,
          
        }
      })
    }),
  ],
});