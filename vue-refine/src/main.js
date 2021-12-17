import Vue from 'vue'

import App from './App.vue'
import store from '@/store'

import router from '@/router/routes.js'

// vurtify (ui)
import vuetify from './plugins/vuetify';

// plugins
import './plugins/plugin.js';

// popup message module
import VModal from 'vue-js-modal'
Vue.use(VModal)
import modals from '@/common/modal/AppModal.vue'
Vue.component('modals', modals)

// grid module
import { Grid } from '@/common/grid/index.js';
// global components
Vue.component('tui-grid', Grid);

import { VueSimpleSpinner } from "@/common/loader/index.js";
Vue.component('Spinner', VueSimpleSpinner);

import ScrollTop from "@/common/scroll/ScrollTop.vue";
Vue.component('ScrollTop', ScrollTop);

// import chart
import { Chart } from '@/common/chart/index.js'

Vue.config.productionTip = false

// 전역 event 처리 -- event bus 추가
Vue.prototype.EventBus = new Vue();  // Vue에 등록

export const vue = new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')