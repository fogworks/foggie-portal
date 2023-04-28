
const getters = {
  uploadIsShow: state => state.upload.uploadIsShow,
  orderId: state => state.upload.orderId,
  theme: state => state.global.theme,
  userInfo: state => state.global.userInfo,
  ChainId: state => state.clientGlobal.ChainId, //链ID
  clientPassword: state => state.clientGlobal.clientPassword,  // 用户加密密码
}
export default getters
