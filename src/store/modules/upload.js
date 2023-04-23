// 用户
export default {
  // 开启命名空间
  namespaced: true,
  state: {
    uploadIsShow: false,
  orderId: '',
  uploadFileList: {},
  },
  mutations: {
    setFileList(state, data) {
      state.uploadFileList[state.orderId] = data;
    },
    closeUpload(state, data) {
      state.uploadIsShow = false
    },
    openMyFiles(state, orderId) {
      state.orderId = orderId
    },
    openUpload(state, orderId) {
      state.orderId = orderId
      state.uploadIsShow = true
    }
  },
  actions: {
    setFileList({ commit }, data) {
      commit("setFileList", data);
    },
  },
  getters: {
    fileList: (state) => state.uploadFileList,
    uploadIsShow: (state) => state.uploadIsShow,
    orderId: (state) => state.orderId,
  },
};
