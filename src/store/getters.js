const getters = {
  uploadIsShow: (state) => state.upload.uploadIsShow,
  orderId: (state) => state.upload.orderId,
  deviceType: (state) => state.upload.deviceType,
  theme: (state) => state.global.theme,
  userInfo: (state) => state.global.userInfo,
  ChainId: (state) => state.clientGlobal.ChainId,
  clientPassword: (state) => state.clientGlobal.clientPassword,
};
export default getters;
