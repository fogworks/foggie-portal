import { savePassword } from "@/api/common";

const state = {
  clientPassword: '',
  activeIndex: '',
  ChainId: '',
  usernmae: '',
}
const mutations = {
  SAVE_ChainId(state, chainID) {
    state.ChainId = chainID;
  },

  SAVE_PASSWORD(state, encryptionPassword) {
    state.clientPassword = encryptionPassword;
  },

}
const actions = {
  /* 保存密码 */
  async setSavePassword({ commit }, password) {
    const res = await savePassword(password)
    commit("SAVE_PASSWORD", res.data);
  }
}



export default {
  namespaced: true,
  state,
  mutations,
  actions,

}
