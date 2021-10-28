<template>
  <div>
    <result-select></result-select>
    <result-body></result-body>
  </div>
</template>

<script>
export default {
  name: "viewResult",

  components: {
    ResultSelect: () => import("./comp/resultSelect.vue"),
    ResultBody: () => import("./comp/resultBody.vue")
  },

  computed: {},

  watch: {},

  created() {
    // Rule 기반 지표 값에서 사용할 ColumnNameList를 조회해준다.
    this.$store.commit("getColumnName");
  },

  mounted() {},

  data: () => ({}),

  methods: {}
};
</script>
