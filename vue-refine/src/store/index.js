import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

import constants from './modules/constants.js'

const store = new Vuex.Store({
    modules : {
        CONSTANTS: constants
    },
    plugins: [
        createPersistedState({ paths: ['CONSTANTS']})
    ]    
});
export default store;