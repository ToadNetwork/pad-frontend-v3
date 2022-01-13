import Vue from 'vue'

interface IPadswapTheme {
  headerLogoSrc: string,
  padLogoSrc: string,
  backgroundImageSrc: string,
  toadPadImageSrc: string
}

declare module 'vue/types/vue' {
  interface Vue {
    $padswapTheme: { theme: IPadswapTheme }
  }
}

const BscPadswapTheme = {
  headerLogoSrc: require('./assets/themes/bsc/logo.svg'),
  padLogoSrc: require('./assets/tokens/bsc/PAD.svg'),
  backgroundImageSrc: require('./assets/themes/bsc/BG.svg'),
  toadPadImageSrc: require('./assets/themes/bsc/toad-pad.svg')
}

const MoonriverPadswapTheme = {
  headerLogoSrc: require('./assets/themes/moonriver/logo.svg'),
  padLogoSrc: require('./assets/tokens/moonriver/PAD.svg'),
  backgroundImageSrc: require('./assets/themes/moonriver/BG.svg'),
  toadPadImageSrc: require('./assets/themes/moonriver/toad-pad.svg')
}

const MoonbeamPadswapTheme = {
  headerLogoSrc: require('./assets/themes/moonbeam/logo.png'),
  padLogoSrc: require('./assets/tokens/moonbeam/PAD.svg'),
  backgroundImageSrc: require('./assets/themes/moonbeam/BG.svg'),
  toadPadImageSrc: require('./assets/themes/moonbeam/toad-pad.svg')
}

const PadswapThemePlugin = {
  install(vue: typeof Vue, options?: Object) {
    vue.prototype.$padswapTheme = Vue.observable({
      theme: MoonbeamPadswapTheme
    })
  }
}

Vue.use(PadswapThemePlugin)

export {
  IPadswapTheme,
  BscPadswapTheme,
  MoonriverPadswapTheme,
  MoonbeamPadswapTheme
}