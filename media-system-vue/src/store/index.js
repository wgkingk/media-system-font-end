import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: window.localStorage.getItem('token' || '[]') == null ? '' : window.localStorage.getItem('token' || '[]')
  },
  mutations: {
    login (state, token) {
      state.token = token
      window.localStorage.setItem('token', token)
    }
  }
})
