<template>
  <div class="custom-rule-wrap text-body-1 set-result-rule-wrap mb-7">
    <v-expansion-panels focusable ex v-model="expansionPanel">
      <v-expansion-panel>
        <v-expansion-panel-header color="blue-grey darken-2">
          <span class="white--text" style="z-index: 2;"
            >결과 조회 Rule 지표 설정</span
          >
          <template v-slot:actions>
            <v-icon color="white">
              $expand
            </v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="my-8">
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Column Name [Column type]</th>
                  <th>Rule</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(opt, i) in resultRuleParam" :key="'ruleOpt_' + i">
                  <td>{{ i + 1 }}</td>
                  <td>
                    <span>{{ opt.column }}</span>
                    [
                    <span class="text-caption" v-if="opt.type === null">-</span>
                    <span v-else>{{ opt.type }}</span>
                    ]
                  </td>
                  <td class="rule-select">
                    <v-autocomplete
                      dense
                      autocomplete="false"
                      outlined
                      rounded
                      v-model="resultRuleParam[i].rule"
                      :items="regexSet"
                      required
                      item-text="key"
                      item-value="value"
                    ></v-autocomplete>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  name: "set-result-rules",
  props: ["regexSet"],

  computed: {
    resultResponse() {
      return this.$store.getters.resultResponse;
    },
    resultRuleParam() {
      return this.$store.getters.resultRuleParam;
    }
  },

  data() {
    return {
      expansionPanel: 0
    };
  },
  created() {
    this.createOptionList();
  },
  methods: {
    createOptionList() {
      let columnOptArray = [];
      let columnPattern = null;
      const regexSetNameValues = this.regexSet.map((e) => {
        return e.value;
      });

      this.resultResponse.auto.column_stats.forEach((columnObj) => {
        columnPattern =
          regexSetNameValues.indexOf(columnObj.column_pattern) > -1
            ? columnObj.column_pattern
            : "STATS";

        columnOptArray.push({
          column: columnObj.column_name,
          type: columnObj.column_type,
          rule: columnPattern
        });
      });
      this.$store.commit("setResultRuleParam", columnOptArray);
    }
  }
};
</script>

<style scoped>
.custom-rule-wrap {
  padding: 0 10px;
}
td.rule-select {
  padding: 5px 0 !important;
}
</style>
