const state = {
    constants: Object.freeze({
        userDefaultRoutes: 'personalizeMain',
        gridNoData : '데이터가 없습니다',

        // highcharts
        chartInfo : {
            TEST : 'red',
            TEXT_COLOR : '#e1e1e1',
            Y_BORDER_COLOR : '#234973',
            NO_DATA : 'No data to display.',
            NOW_LOADING : 'data loading...',
            NO_DATA_SIZE : '15px',
            PIE_COLOR : {
                cpu : '#e6e26a',
                mem : '#008abd',
                disk : '#00bbbd',
                other : '#384758'
            },
            BAR_COLOR : {
                netIn : '#6854c9',
                netOut : '#00a8ff'
            },
            TIMESTAMP_COLOR : {
                left : '#384758',
                cpu : ['#e6e26a'],
                mem : ['#008abd'],
                net : [
                    '#6854c9',
                    '#00a8ff'
                ],
                disk : [
                    '#64a12d',
                    '#6f6f6f',
                    '#6ae6e6',
                    '#6a8be6',
                    '#e66a9f',
                    '#e6e26a',
                    '#6854c9',
                    '#00a8ff'
                ],
                PLOT_BACKGROUND : '#050916'
            },
            SANKEY_COLOR : [
                '#3a598e'
                , '#1e5dca'
                , '#736ed8'
                , '#3aa5c7'
                , '#c7643a'
                , '#c7365e'
                , '#a0b846'
                , '#3dc8b6'
                , '#3cc747'
                , '#536f4f'
                , '#74c09d'
                , '#44afc2'
            ],
            ANOMALY_DETECTION : {
                RESULT : '#b54e4c'
                , STATUS : '#0f8ed8'
            }
        }
        // -- highcharts
    })
};
const mutations = {
}
const getters = {
    CONSTANTS: state => {
        return state.constants;
    }
}
const actions = {
}

export default {
    state,
    mutations,
    getters,
    actions
}