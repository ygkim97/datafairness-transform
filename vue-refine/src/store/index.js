import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import grid from "./modules/grid.js";
import tableName from "./modules/tableName.js";
import spinner from "./modules/spinner.js";
import constants from "./modules/constants.js";
import rule from "./modules/rule.js";
import results from "./modules/results.js";
import afi from "./modules/afi.js";

const store = new Vuex.Store({
  modules: {
    tableName: tableName,
    spinner: spinner,
    CONSTANTS: constants,
    GRID: grid,
    ruleJson: rule,
    results: results,
    afi: afi
  }
});
export default store;
