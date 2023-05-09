import { setToken, getToken, removeToken } from "@/utils/auth";
import { setTokenMap, getTokenMap } from '@/utils/tokenMap'
export default {
  namespaced: true,
  state: {
    token: getToken() || '',
    currentUser: window.localStorage.getItem('currentUser') || '',
    tokenMap: window.localStorage.getItem("tokenMap") ? JSON.parse(window.localStorage.getItem("tokenMap")) : {}
  },
  getters: {
    token: (state) => state.token,
    currentUser: (state) => state.currentUser,
    tokenMap: (state) => state.tokenMap,
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_CURRENTUSER: (state, currentUser) => {
      state.currentUser = currentUser;
    },
    REMOVE_TOKEN: (state,) => {
      state.token = '';
      state.currentUser = '';
    },
    SET_tokenMap: (state, data) => {
      state.tokenMap[data.id] = data.token
    }
  },
  actions: {
    login({ commit }, userInfo) {
      const { username, token } = userInfo;
      let SET_TOKEN = token;
      commit("SET_TOKEN", SET_TOKEN);
      setToken(SET_TOKEN); //cookies
      commit("SET_CURRENTUSER", username);
      window.localStorage.setItem("currentUser", username);
    },
    logout({ commit }) {
      removeToken()
      commit("REMOVE_TOKEN");
      window.localStorage.removeItem("currentUser");
    },
    setTokenMap({ commit }, data) {
      commit("SET_tokenMap", data);
      setTokenMap(data.id, data.token)
    }
  },
};
