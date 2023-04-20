// 全局
export default {
  state: {
    theme: window.localStorage.getItem("theme") || '',
    userInfo: {},
    detected_net: false,
  },
  mutations: {
    SET_THEME: (state, theme) => {
      state.theme = theme;
      window.localStorage.setItem("theme", theme);
    },
    SET_userInfo: (state, data) => {
      state.userInfo = data;
    },
    SET_Detected_net: (state, bool) => {
      state.detected_net = bool;
    },
  },
  actions: {
    setTheme({ commit }, theme) {
      commit("SET_THEME", theme);
    },
    setUserInfo({ commit }, data) {
      commit("SET_userInfo", data);
    },
    setDetected_net({ commit }, bool) {
      commit("SET_Detected_net", bool);
    },
  },
  getters: {
    userInfo: (state) => state.userInfo,
    theme: (state) => state.theme,
    detected_net: (state) => state.detected_net,
  },
};
