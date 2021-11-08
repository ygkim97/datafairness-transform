<template>
  <div>
    <!-- header -->
    <header-bar></header-bar>

    <!-- content -->
    <v-main>
      <v-container>
        <rule-buttons></rule-buttons>
        <router-view></router-view>
      </v-container>
    </v-main>
  </div>
</template>

<script>
export default {
  name: "Main",

  computed: {
    tableName() {
      return this.$store.getters.tableName;
    }
  },

  components: {
    HeaderBar: () => import("@/views/layout/HeaderBar.vue"),
    RuleButtons: () => import("@/views/layout/RuleButtons.vue")
  },
    created() {
        this.checkTableName();
        this.getRuleData();
    },

  methods: {
    checkTableName() {
      // router에서 값을 가져 오거나, 이전에 조회한 값을 가져온다
      const tableName = this.$route.params.tableName || this.tableName;
      if (tableName === undefined || tableName === null || tableName === "") {
        // table 명이 존재하지 않을 경우, error 페이지로 redirect한다.
        this.$router.push({ name: "error" });
      } else {
        // table명이 존재 할 경우, vuex에 저장한다.
        this.$store.commit("setTableName", {
          tableName: tableName
        });
      }
    },

    getRuleData() {
      // Table Name 기반으로 Rule 정보를 조회한다.
      // 동기로 조회
      this.$store.commit("getJsonRules");
    }
  }
};
</script>
