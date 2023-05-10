import { savePassword } from "@/api/common";
export default {
  namespaced: true,
  state: {
    theme: window.localStorage.getItem("theme") || "light",
    userInfo: {},
    detected_net: false,
    deviceList: [],
    currentOODItem:
      window.localStorage.currentOODItem &&
      window.localStorage.currentOODItem !== "undefined"
        ? { data: JSON.parse(window.localStorage.getItem("currentOODItem")) }
        : {
            data: {
              device_id: "",
            },
          },
    discoverData: {},
  },
  mutations: {
    SET_THEME: (state, theme) => {
      state.theme = theme;
      window.localStorage.setItem("theme", theme);
    },
    SET_currentOODItem: (state, data) => {
      state.currentOODItem = data;
    },
    SET_userInfo: (state, data) => {
      state.userInfo = data;
    },
    SET_Detected_net: (state, bool) => {
      state.detected_net = bool;
    },

    setSystemTheme: (state, theme) => {
      state.theme = theme;
    },

    SET_DeviceList: (state, data) => {
      state.deviceList = data;
    },
    SET_DiscoverData: (state, data) => {
      state.discoverData = data;
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

    setDeviceList({ commit }, data) {
      commit("SET_DeviceList", data);
    },
    setCurrentOODItem({ commit }, data) {
      commit("SET_currentOODItem", data);
    },
    setDiscoverData({ commit }, data) {
      commit("SET_DiscoverData", data);
    },
  },
  getters: {
    userInfo: (state) => state.userInfo,
    theme: (state) => state.theme,
    detected_net: (state) => state.detected_net,
    activeIndex: (state) => state.activeIndex,
    ChainId: (state) => state.ChainId,
    Password: (state) => state.Password,
    deviceList: (state) => state.deviceList,
    currentOODItem: (state) => state.currentOODItem,
    discoverData: (state) => state.discoverData,
  },
};
