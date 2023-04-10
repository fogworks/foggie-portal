// 全局
export default {
  state: {
    theme:window.localStorage.getItem("theme")||''
  },
  mutations: {
    SET_THEME: (state, theme) => {
      state.theme = theme;
      window.localStorage.setItem("theme", theme);
    },
  },
  actions: {
    setTheme({ commit }, theme) {
      commit("SET_THEME", theme);
    },
  },
  getters: {
    theme: (state) => state.theme,
  },
};
