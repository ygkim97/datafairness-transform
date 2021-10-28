<template>
  <div class="custom-modal">
    <div class="mu-dialog-head">
      지표 측정 RULE 설정
    </div>

    <div class="mu-dialog-body">
      <v-layout>
        <v-flex>
          <v-autocomplete
            persistent-hint
            outlined
            v-on:change="changeSelect"
            label="Column"
            v-model="column[idx]"
            items="columnList"
            required
            :disabled="!param.isEditable"
            hint="Rule을 적용할 Column을 선택해 주세요"
          ></v-autocomplete>
        </v-flex>
        <v-flex>
          <v-autocomplete
            multiple
            persistent-hint
            chips
            small-chips
            outlined
            v-if="param.type === 'select'"
            label="Regex Set Rule"
            v-model="column[idx]"
            :items="param.selectList"
            required
            :disabled="!param.isEditable"
            hint="Rule을 선택해 주세요"
          ></v-autocomplete>
        </v-flex>
      </v-layout>
      <v-layout>
        GRID
        {{ params.rules }}
      </v-layout>
    </div>
  </div>
</template>

<script>
export default {
  name: "resultRuleAdd",
  props: ["params"],

  computed: {},

  data() {
    return {
      column: []
    };
  },
  created() {
    const vm = this;
    this.params.columns.forEach((c) => {
      vm.column.push(c.value);
    });
  },
  methods: {
    createRuleParam() {
      // this.$store.commit('setColumnList', columnList);
    }
  }
};
</script>

<style scoped="">
.custom-modal {
  height: calc(100% - 40px);
}
.mu-dialog-body {
  /*overflow: hidden !important;*/
}
.mu-fix-foot .mu-dialog-body {
  top: 45px;
}
</style>
