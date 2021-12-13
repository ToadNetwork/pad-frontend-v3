import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { PadswapThemePlugin } from './padswap-theme'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(PadswapThemePlugin)

const store = new Vuex.Store({
  state: {
    web3: null,
    address: null,
    padPrice: null
  },
  mutations: {
    setWeb3Connection(state, { web3, address }) {
      state.web3 = web3
      state.address = address
    },
    setPadPrice(state, padPrice) {
      state.padPrice = padPrice
    }
  },
  getters: {
    isConnected(state) {
      return state.address != null
    }
  }
})

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
