const state = {
  uploadIsShow: false,
  orderId: '',
  deviceType: '', //1 foggie 2 foggieMax 3 client
  uploadFileList: {},
  peerId: '',
  deviceData: {}
};
const mutations = {
  setFileList(state, data, fileOrderId) {
    if (fileOrderId) {
      state.uploadFileList[fileOrderId] = data;
    } else {
      state.uploadFileList[state.orderId] = data;
    }
  },
  closeUpload(state, data) {
    state.uploadIsShow = false;
  },
  setOrderId(state, orderId) {
    state.orderId = orderId;
  },
  openUpload(state, orderId) {
    state.orderId = orderId;
    state.uploadIsShow = true;
  },
  setDeviceType(state, DeviceType) {
    state.deviceType = DeviceType;
  },
  setPeerId(state, peerId) {
    state.peerId = peerId;
  },
  setDeviceData(state, data) {
    state.deviceData = data
  },
  setUploadOptions(state, data) {
    state.deviceData = data
    if (data.device_type == "foggie_max" ||
      data.device_type == "foggie" ||
      data.device_type == "") {

      // state.orderId = data.device_id
      state.orderId = data.device_id

      if (data.device_type == "foggie_max") {
        state.deviceType = 2
      } else {
        state.deviceType = 1
      }
    } else {
      state.orderId = data.space_order_id
      state.deviceType = 3
    }
    state.peerId = data.peer_id
    state.uploadIsShow = true;
  }
};
const actions = {
  // setFileList({ commit }, data) {
  //   commit("setFileList", data);
  // }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  // getters
};
