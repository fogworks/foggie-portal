// 全局
export default {
  state: {
    theme: window.localStorage.getItem("theme") || '',
    userInfo: {

    },
  },
  mutations: {
    SET_THEME: (state, theme) => {
      state.theme = theme;
      window.localStorage.setItem("theme", theme);
    },
    SET_userInfo: (state, data) => {
      state.userInfo = data;
    },
  },
  actions: {
    setTheme({ commit }, theme) {
      commit("SET_THEME", theme);
    },
    setUserInfo({ commit }, data) {
      commit("SET_userInfo", data);
    },
  },
  getters: {
    userInfo: (state) => state.userInfo,
    theme: (state) => state.theme,
  },
};
