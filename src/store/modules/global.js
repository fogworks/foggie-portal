// 全局
export default {
  state: {
    theme: window.localStorage.getItem("theme") || '',
    userInfo: {},
    detected_net: false,
    deviceList: [],
    currentOODItem: {
      data: {
        device_id: "",
      },
    },
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
    SET_DeviceList: (state, data) => {
      state.deviceList = data;
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
  },
  getters: {
    userInfo: (state) => state.userInfo,
    theme: (state) => state.theme,
    detected_net: (state) => state.detected_net,
    deviceList: (state) => state.deviceList,
    currentOODItem: (state) => state.currentOODItem,
  },
};
