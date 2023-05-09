// 用户

const state = {
  uploadIsShow: false,
  orderId: '',
  deviceType: '', //1 foggie 2 foggieMax 3 client
  uploadFileList: {},
}
const mutations = {
  setFileList(state, data) {
    state.uploadFileList[state.orderId] = data;
  },
  closeUpload(state, data) {
    state.uploadIsShow = false
  },
  setOrderId(state, orderId) {
    state.orderId = orderId
  },
  openUpload(state, orderId) {
    state.orderId = orderId
    state.uploadIsShow = true
  },
  setDeviceType(state, DeviceType) {
    state.deviceType = DeviceType
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
