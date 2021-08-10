export default {
  namespaced: true,
  state: {
    showLogin: false,
    loginRedirect: "",
    isLogin: false,
    name: "name",
    token: "token"
  },
  mutations: {
    setUser(state, { name, token, remember }) {
      if (name && token) {
        state.isLogin = true;
        state.showLogin = false;
        state.name = name;
        state.token = token;
        if (remember) {
          localStorage.setItem("auth", JSON.stringify(state));
        }
      } else {
        state.isLogin = false;
        state.name = "";
        state.token = "";
        localStorage.removeItem("auth");
      }
    },
    setLogin(state, data) {
      if (data.redirect) {
        state.loginRedirect = data.redirect;
      }
      state.showLogin = data.value;
    }
  },
  actions: {
    async login({ commit }, { name, password, remember }) {
      return new Promise((resolve, reject) => {
        if (name && password) {
          commit("setUser", {
            name: name,
            token: Number(
              Math.random().toString().substr(3, length) + Date.now()
            ).toString(36),
            remember: remember
          });
          resolve();
        } else {
          reject("信息不全");
        }
      });
    },
    async logout({ commit }) {
      commit("setUser", { name: false, token: false });
    },
    async showLogin({ commit }, { redirect }) {
      commit("setLogin", { value: true, redirect: redirect });
    },
    async closeLogin({ commit }) {
      commit("setLogin", { value: false });
    }
  },
  getters: {
    isLogin: (state) => state.isLogin,
    getName: (state) => state.name,
    getToken: (state) => state.token
  }
};
