
const getters = {
  uploadIsShow: state => state.upload.uploadIsShow,
  orderId: state => state.upload.orderId,
  activeIndex:state => state.global.activeIndex,
  theme:state => state.global.theme,
  ChainId:state => state.global.ChainId, //链ID
  Password:state => state.global.Password,  // 用户加密密码
  userInfo:state => state.global.userInfo 
}
export default getters
