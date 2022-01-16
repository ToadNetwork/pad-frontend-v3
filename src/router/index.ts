import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Landing from '../views/Landing.vue'
import Onramp from '../views/Onramp.vue'

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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
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
