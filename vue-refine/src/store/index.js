import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import constants from './modules/constants.js'
import grid from "./modules/grid.js";

export default new Vuex.Store({
    modules: {
        CONSTANTS: constants,
        GRID : grid
    }
});