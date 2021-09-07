import Vue from 'vue'

import App from './App.vue'
import store from '@/store'

import router from '@/router/routes.js'

// vurtify (ui)
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

// 전역 event 처리 -- event bus 추가
Vue.prototype.EventBus = new Vue();  // Vue에 등록

export const vue = new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
}).$mount('#app')