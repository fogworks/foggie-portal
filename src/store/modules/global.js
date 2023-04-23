import { savePassword } from "@/api/common";
// 全局
export default {
  namespaced: true,
  state: {
    theme: window.localStorage.getItem("theme") || "",
    userInfo: {},
    detected_net: false,
    Password: "",
    activeIndex: "",
    theme: "",
    ChainId: "",
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
    SAVE_ChainId: (state, chainID) => {
      state.ChainId = chainID;
    },
    setSystemTheme: (state, theme) => {
      state.theme = theme;
    },
    SAVE_PASSWORD: (state, encryptionPassword) => {
      state.Password = encryptionPassword;
    },
    setActiveIndex: (state, data) => {
      state.activeIndex = data;
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
    /* 保存密码 */
    async setSavePassword({ commit }, password) {
      const res = await savePassword({ password: password });
      commit("SAVE_PASSWORD", res.data);
    },
  },
  getters: {
    userInfo: (state) => state.userInfo,
    theme: (state) => state.theme,
    detected_net: (state) => state.detected_net,
    activeIndex: (state) => state.activeIndex,
    ChainId: (state) => state.ChainId,
    Password: (state) => state.Password,
  },
};
