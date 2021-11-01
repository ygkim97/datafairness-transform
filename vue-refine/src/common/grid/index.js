import 'tui-grid/dist/tui-grid.css';
import { Grid } from '@toast-ui/vue-grid';

import TuiGrid from 'tui-grid';
import store from '@/store'
TuiGrid.setLanguage('ko', {
    display: {
        noData: store.getters.CONSTANTS.gridNoData
    }
});
TuiGrid.applyTheme('striped');

export {Grid};