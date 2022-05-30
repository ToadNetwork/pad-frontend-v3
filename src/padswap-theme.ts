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
  toadPadImageSrc: require('./assets/themes/bsc/toad-pad.svg'),
  launchpadRocketSrc: require('./assets/images/launchpad-rocket-bsc.svg'),
  backgroundTextureSrc: require('./assets/images/launchpad-texture-bsc.jpg')
}

const MoonriverPadswapTheme = {
  headerLogoSrc: require('./assets/themes/moonriver/logo.svg'),
  padLogoSrc: require('./assets/tokens/moonriver/PAD.svg'),
  backgroundImageSrc: require('./assets/themes/moonriver/BG.svg'),
  toadPadImageSrc: require('./assets/themes/moonriver/toad-pad.svg'),
  launchpadRocketSrc: require('./assets/images/launchpad-rocket-moonriver.svg'),
  backgroundTextureSrc: require('./assets/images/launchpad-texture-moonriver.jpg')
}

const MoonbeamPadswapTheme = {
  headerLogoSrc: require('./assets/themes/moonbeam/logo.png'),
  padLogoSrc: require('./assets/tokens/moonbeam/PAD.svg'),
  backgroundImageSrc: require('./assets/themes/moonbeam/BG.svg'),
  toadPadImageSrc: require('./assets/themes/moonbeam/toad-pad.svg'),
  launchpadRocketSrc: require('./assets/images/launchpad-rocket-moonbeam.svg'),
  backgroundTextureSrc: require('./assets/images/launchpad-texture-moonbeam.jpg')
}

const PadswapThemePlugin = {
  install(vue: typeof Vue, options: { store: any }) {
    vue.prototype.$padswapTheme = Vue.observable({
      theme: MoonbeamPadswapTheme
    })

    // auto-update theme whenever ecosystem changes
    // TODO: return theme from computed property and remove setters
    new Vue({
      created() {
        this.$watch(() => options.store.getters.ecosystem.theme, val => {
          vue.prototype.$padswapTheme.theme = val
        })
      }
    })
  }
}

export {
  IPadswapTheme,
  BscPadswapTheme,
  MoonriverPadswapTheme,
  MoonbeamPadswapTheme,
  PadswapThemePlugin
}