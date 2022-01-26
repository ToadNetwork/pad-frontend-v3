import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

import { PadswapThemePlugin } from './padswap-theme'
import store from './store'

Vue.use(PadswapThemePlugin, { store })
Vue.config.productionTip = false

const vm = new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
})
vm.$watch('$store.state.ecosystemId', function (val) {
  // auto-update browser url when ecosystem changes
  if (this.$route.params.ecosystem) {
    this.$router.replace({
      params: { ecosystem: this.$store.getters.ecosystem.routeName }
    })
  }
})
vm.$mount('#app')
