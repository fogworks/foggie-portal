// 用户
export default {
  // 开启命名空间
  namespaced: true,
  state: {
    uploadFileList: [],
  },
  mutations: {
    setFileList(state, data) {
      state.uploadFileList = data;
    },
  },
  actions: {
    setFileList({ commit }, data) {
      commit("setFileList", data);
    },
  },
  getters: {
    fileList: (state) => state.uploadFileList,
  },
};
