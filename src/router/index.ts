import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Landing from '../views/Landing.vue'
import Onramp from '../views/Onramp.vue'
import { ECOSYSTEMS } from '@/ecosystem'
import store from '@/store'
import { equalsInsensitive } from '@/utils'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'PadSwap Overview',
    component: Landing
  },
  {
    path: '/farms',
    name: 'PadSwap Farms',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/onramp',
    name: 'Buy crypto with fiat',
    component: Onramp
  },
  {
    path: '/swap',
    name: 'Swap',
    component: () => import('../views/Swap.vue')
  },
  {
    path: '/vault',
    name: 'Vault',
    component: () => import('../views/Vault.vue')
  },
  {
    path: '/bridge',
    name: 'Bridge',
    component: () => import('../views/Bridge.vue')
  },
  {
    path: '/launchpad',
    name: 'LaunchPAD',
    component: () => import('../views/Launchpad.vue')
  },
  {
    path: '/token-list',
    name: 'Token List',
    component: () => import('../views/TokenList.vue')
  },
  {
    path: '/faucet',
    name: 'Faucet',
    component: () => import('../views/Faucet.vue')
  },
  {
    path: '/launch-token',
    name: 'Launch Token',
    component: () => import('../views/LaunchToken.vue')
  },
  {
    path: '/:ecosystem/presale/:address',
    name: 'Launchpad Presale',
    component: () => import('../views/LaunchpadPresale.vue')
  },
  {
    path: '/old',
    name: 'Launchpad Presale',
    component: () => import('../views/LaunchpadOld.vue')
  },
  {
    path: '/:ecosystem/swap',
    name: 'EcosystemSwap',
    component: () => import ('../views/Swap.vue')
  },
  {
    path: '/:ecosystem/farms',
    name: 'EcosystemFarms',
    component: () => import ('../views/Home.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (!to.params.ecosystem) {
    next()
    return
  }

  const ecosystem = Object.values(ECOSYSTEMS).find(e => equalsInsensitive(to.params.ecosystem, e.routeName))
  if (!ecosystem) {
    // TODO: 404 page
    return
  }

  store.commit('setEcosystemId', ecosystem.ecosystemId)
  to.params.ecosystem = to.params.ecosystem.toLowerCase()
  next()
})

//checks if its an external or internal link and redirects the external ones
router.beforeEach((to, from, next) => {
  let url;
  try {
    url = new URL(to.fullPath.replace('/',''));
    location.href=url.href
  } catch (_) {
    next()
  }
})

export default router
