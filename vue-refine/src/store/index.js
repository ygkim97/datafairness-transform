import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

import grid from './modules/grid.js'
import tableName from './modules/tableName.js'
import constants from './modules/constants.js'
import rule from './modules/rule.js'

const store = new Vuex.Store({
    modules: {
        tableName : tableName,
        CONSTANTS: constants,
        GRID: grid,
        ruleJson : rule
    },
    plugins: [
        // createPersistedState({ paths: ['ruleJson']})
    ]    
});
export default store;