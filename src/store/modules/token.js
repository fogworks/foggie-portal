import { setToken, getToken ,removeToken} from "@/utils/auth";
export default {
  // 开启命名空间
  namespaced: true,
  state: {
    token: getToken()||'',
    currentUser:window.localStorage.getItem('currentUser')||''
  },
  getters: {
    token: (state) => state.token,
    currentUser: (state) => state.currentUser,
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_CURRENTUSER: (state, currentUser) => {
      state.currentUser = currentUser;
    },
    REMOVE_TOKEN: (state, ) => {
      state.token = '';
      state.currentUser = '';
    },
  },
  actions: {
    login({ commit }, userInfo) {
      const { username, token } = userInfo;
      let SET_TOKEN = token;
      commit("SET_TOKEN", SET_TOKEN);
      setToken(SET_TOKEN); //cookies
      commit("SET_CURRENTUSER", username);
      window.localStorage.setItem("currentUser", username);
    },
    logout({ commit }) {
      removeToken()
      commit("REMOVE_TOKEN");
      window.localStorage.removeItem("currentUser");
    },
  },
};
