<template>
  <div>
    <!-- header -->
    <header-bar></header-bar>

    <!-- content -->
    <v-main>
      <v-container>
        <v-layout>
          <v-flex xs10>
            <flow-stepper :step="step" @clickStep="clickStep"></flow-stepper>
          </v-flex>
          <v-flex class="next-btn">
            <v-btn
              v-if="step < compPanels.length"
              color="blue-grey lighten-1"
              class="float-right"
              dark
              small
              @click="gotoNext"
              >NEXT</v-btn
            >
          </v-flex>
        </v-layout>

        <v-divider></v-divider>
        <v-layout>
          <!-- array값이기 때문에, step에서 -1을 해준다.-->
          <card-wrapper
            class="afi-body"
            :step="step - 1"
            :component="compPanels[step - 1]"
          ></card-wrapper>
        </v-layout>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import DataSet from "./cards/data-set.vue";
import CheckMetrics from "./cards/check-metrics.vue";
import SetMitigate from "./cards/set-mitigate.vue";
import Compare from "./cards/compare.vue";

export default {
  name: "Main",

  computed: {
    tableName() {
      return this.$store.getters.tableName;
    }
  },

  data() {
    return {
      step: 1,
      compPanels: [DataSet, CheckMetrics, SetMitigate, Compare]
    }
  },

  components: {
    HeaderBar: () => import("@/views/layout/HeaderBar.vue"),
    FlowStepper: () => import("@/views/afi/cards/card-stepper.vue"),
    CardWrapper: () => import("@/views/afi/cards/card-wrapper.vue")
  },
  created() {
    this.EventBus.$on("clickStep", this.clickStep);
    this.checkTableName();
  },

  watch: {},

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
    gotoNext() {
      // checkValidation
      this.step++;
    },
    clickStep(idx) {
      this.step = idx + 1;
    }
  }
};
</script>

<style scoped>
.card-main {
  margin: 20px;
  border: 1px solid slategray;
}
.afi-body {
  margin: 20px 0;
  border: 1px solid lightblue;
  width: 100%;
  min-height: 500px;
  padding: 20px;
}
.next-btn {
  margin: auto 0;
}
</style>
