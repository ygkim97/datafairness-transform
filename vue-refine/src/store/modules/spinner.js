// Data Type 정의
const state = {
    spinnerStatus: false,
    spinnerMessage : "로딩중입니다"
}
// 동기 처리
const mutations = {
    spinnerOn(state, message) {
        state.spinnerStatus = true;
        if (message) {
            state.spinnerStatus = message;
        }
    },
    spinnerOff(state) {
        state.spinnerStatus = false
    }
}
const getters = {
    spinnerStatus: state => state.spinnerStatus,
    spinnerMessage: state => state.spinnerMessage
}
// 비동기 처리
const actions = {
}

export default {
    state,
    mutations,
    getters,
    actions
}