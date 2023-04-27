// 用户

const state = {
  uploadIsShow: false,
  orderId: '',
  uploadFileList: {},
}
const mutations = {
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
}
const actions = {
  // setFileList({ commit }, data) {
  //   commit("setFileList", data);
  // }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions,
  // getters
}
