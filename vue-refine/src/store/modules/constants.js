const state = {
  constants: Object.freeze({
    compList: [
      "regex",
      "regex_set",
      "bin_regex_set",
      "unique_regex_set",
      "range"
    ],
    actions: {
      CREATE: "create",
      DELETE: "delete",
      DISPLAY: "display"
    },
    popupType: {
      CREATE: "create",
      EDIT: "edit"
    },
    inputType: {
      SELECT: "select",
      TEXT: "text",
      NUMBER: "number"
    },
    mode: {
      AUTO: "auto",
      RULE: "rule",
      GET_COLUMN: "get_name"
    },
    result: {
      SUCCESS: "success",
      FAIL: "fail"
    },
    loadingMessage: {
      LOADING: "로딩중입니다.",
      SAVING: "저장중입니다.",
      PROCESSING: "처리중입니다."
    },
    gridNoData: "데이터가 없습니다.",
    result_str: {
      column_name: "컬럼 명",
      column_type: "해당 컬럼의 데이터 타입",
      column_pattern: "해당 컬럼의 패턴",
      Named_entity_recognition: "ko electra-ner 결과",
      row_count: "컬럼 row 수",
      missing_count: "결측 값 수",
      pattern: "패턴 통계",
      type: "데이터 타입 통계",
      mode_key: "빈도 수가 가장 높은 값과 해당 값의 빈도 수",
      column_dqi: "해당 컬럼의 데이터 지표",
      "len min": "문자열 길이 최소 값인 문자열과 해당 문자열 길이",
      "len max": "문자열 길이 최대 값인 문자열과 해당 문자열 길이",
      "len mean": "평균",
      "len std": "표준편차",
      "len median": "중위 값",
      missing_rate: "결측률",
      type_missmatch_rate: "타입 불일치율",
      pattern_mismatch_rate: "패턴 불일치율",
      consistency_violation_rate: "일관성 위배율",
      outlier_ratio: "이상치비율",
      uniqueness_violation_rate: "유일성 위배율",
      range_violation_rate: "범위 위배율",
      binary_violation_rate: "이진값 위배율",
      min: "최소 값",
      max: "최대 값",
      mean: "평균",
      std: "표준편차",
      median: "중위 값",
      quartile: "데이터 분포 표현"
    }
  })
};
const mutations = {};
const getters = {
  CONSTANTS: (state) => {
    return state.constants;
  }
};
const actions = {};

export default {
  state,
  mutations,
  getters,
  actions
};
