import Vue from 'vue'

interface IPadswapTheme {
  headerLogoSrc: String
}

declare module 'vue/types/vue' {
  interface Vue {
    $padswapTheme: { theme: IPadswapTheme }
  }
}

const BscPadswapTheme = {
  headerLogoSrc: require('./assets/themes/bsc/logo.png')
}

const MoonriverPadswapTheme = {
  headerLogoSrc: require('./assets/themes/moonriver/logo.svg')
}

const PadswapThemePlugin = {
  install(vue: typeof Vue, options?: Object) {
    vue.prototype.$padswapTheme = Vue.observable({
      theme: BscPadswapTheme
    })
  }
}

export {
  IPadswapTheme,
  BscPadswapTheme,
  MoonriverPadswapTheme,
  PadswapThemePlugin
}