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
  state: {}
})

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
