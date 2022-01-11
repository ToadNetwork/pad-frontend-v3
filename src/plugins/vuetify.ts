import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true
    },
    breakpoint: {
        thresholds: {
            xs: 700,
            sm: 970
        }
    }
});
