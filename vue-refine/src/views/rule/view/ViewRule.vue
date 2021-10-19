<template>
  <div>
    <v-btn elevation="1" icon x-small @click="temp()">
      <v-icon>mdi-plus-circle</v-icon>
    </v-btn>
    <template v-for="ruleKey in compList">
      <div :key="ruleKey" class="rule_component_wrap">
        <component
          v-bind:is="component"
          v-bind:ruleKey="ruleKey"
          v-if="selectList !== null" :selectList="selectList"
          v-bind:allRuleObj="ruleJson"
        >
        </component>
      </div>
    </template>
  </div>
</template>

<script>
import viewComp from "./comp/ruleComp.vue";

export default {
  name: "viewRule",

  computed: {
    ruleJson() {
      return this.$store.getters.ruleJson;
    },
    compList() {
      return this.$store.getters.CONSTANTS.compList;
    },
    selectList() {
      return this.$store.getters.selectList;
    }
  },

  watch: {
    selectList(obj) {
      // this.selectList = obj;
      // console.log(obj)
    }
    // selectList: {
    //   handle(obj) {
    //     console.log(obj);
    //   },
    //   deep: true
    // }
  },

  created() {},

  mounted() {},

  data: () => ({
    component: viewComp,
    // compList는 restAPI 서버의 각각의 rule 명과 맞춰서 작성해주어야함.
    ruleData: {},
    dataChanged: false
  }),

  methods: {
    temp() {
      console.log("here");
    }
  }
};
</script>
