import Vue from 'vue'

interface IPadswapTheme {
  headerLogoSrc: string,
  padLogoSrc: string,
  backgroundImageSrc: string
}

declare module 'vue/types/vue' {
  interface Vue {
    $padswapTheme: { theme: IPadswapTheme }
  }
}

const BscPadswapTheme = {
  headerLogoSrc: require('./assets/themes/bsc/logo.png'),
  padLogoSrc: require('./assets/tokens/bsc/PAD.svg'),
  backgroundImageSrc: require('./assets/themes/bsc/BG.svg')
}

const MoonriverPadswapTheme = {
  headerLogoSrc: require('./assets/themes/moonriver/logo.svg'),
  padLogoSrc: require('./assets/tokens/moonriver/PAD.svg'),
  backgroundImageSrc: require('./assets/themes/moonriver/BG.svg')
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