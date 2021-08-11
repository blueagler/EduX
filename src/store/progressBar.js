export default {
  namespaced: true,
  state: {
    active: false,
  },
  mutations: {
    SET_STATE(state, value) {
      state.active = value;
    },
  },
  actions: {
    async startProgressBar({ commit }) {
      commit("SET_STATE", true);
    },
    async stopProgressBar({ commit }) {
      commit("SET_STATE", false);
    },
  },
  getters: {
    isProgressBarActive: (state) => state.active,
  },
};
