import { createStore } from 'vuex'

export default createStore({
  state: {
    dbData: null
  },
  getters: {
    dbData: state => state.dbData
  },
  mutations: {
    setDbData(state, data){
      state.dbData = data;
    }
  },
  actions: {
    updateDbData({commit}, data){
      commit('setDbData', data)
    }
  },
  modules: {
  }
})
