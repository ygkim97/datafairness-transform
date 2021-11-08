// https://ux.stories.pe.kr/149

// Data Type 정의
/*
 * 쉽게 말하면 프로젝트에서 공통으로 사용할 변수 정의
 * 프로젝트 내의 모든 곳에서 참조 및 사용이 가능
 * state를 통해 각 컴포넌트에 동일한 값을 사용 가능
 */
const state = {
    tableName: null
}
// 동기 처리
/*
 * 주요 목적은 state를 변경시키는 역할(Mutations를 통해서만 state를 변경해야 함)
 * 위의 함수가 실행되고 종료된 후 그 다음 아래의 함수가 실행됨
 * commit('함수명', '전달인자')으로 실행 가능
 * mutations 내에 함수 형태로 작성
 */
const mutations = {
    setTableName(state, { tableName }) {
        state.tableName = tableName;
    }
}
/*
 * 각 Components의 계산된 속성(computed)의 공통 사용 정의
 * 여러 Components에서 동일한 computed가 사용 될 경우 Getters에 정의하여 공통으로 쉽게 사용 가능
 * 하위 모듈의 getters를 불러오기 위해서는 특이하게 this.$store.getters["경로명/함수명"]을 사용해야함
 */
const getters = {
    tableName: state => state.tableName    
}
// 비동기 처리
/*
 * 주요 목적은 Mutations를 실행시키는 역할
 * 순서에 상관없이 먼저 종료된 함수의 피드백을 받아 후속 처리를 하게 된다.
 * dispatch('함수명', '전달인자')로 실행시키기 가능 ex) dispatch('함수명', '전달인자', {root:true})
 * actions 내에 함수 형태로 작성
 * 비동기 처리이므로 콜백함수로 주로 작성
 */
const actions = {
    setTableName({ commit }, tableName) {
        commit('setTableName', { tableName: tableName });
    }
}

export default {
    state,
    mutations,
    getters,
    actions
}

/*
 * Vuex 특징 - 아래 순서대로 데이터를 단방향으로 관리
 * 각각 컴포넌트 (dispatch) --> actions (commit) --> mutations (state) --> state --> 모든 컴포넌트에서 활용
 */