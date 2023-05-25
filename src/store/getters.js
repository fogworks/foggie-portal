const getters = {
  uploadIsShow: state => state.upload.uploadIsShow,
  orderId: state => state.upload.orderId,
  deviceType: state => state.upload.deviceType,
  theme: state => state.global.theme,
  userInfo: state => state.global.userInfo,
  ChainId: state => state.clientGlobal.ChainId, //
  email: state => state.token.currentUser,
  clientPassword: state => state.clientGlobal.clientPassword,  // 
  uploadFileList: state => state.upload.uploadFileList,
  hasReady: state => state.global.hasReady,
  tokenMap: state => state.token.tokenMap,
}
export default getters
