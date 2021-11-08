<template>
  <div class="custom-modal">
    <div class="mu-dialog-head blue-grey darken-3 white--text">
      {{ params.title }}
    </div>

    <div class="mu-dialog-body">
      <v-form>
        <template v-for="(param, idx) in params.columns">
          <v-autocomplete
            multiple
            persistent-hint
            chips
            small-chips
            outlined
            v-if="param.type === 'select'"
            :label="param.label"
            :key="'column_' + idx"
            v-model="column[idx]"
            :items="param.selectList"
            required
            :disabled="!param.isEditable"
            hint="select box를 클릭해 값을 선택해 주세요."
          ></v-autocomplete>
          <v-textarea
            clearable
            dense
            no-resize
            outlined
            rows="3"
            v-else-if="param.type === 'textarea'"
            class="text-body-2"
            :key="'column_' + idx"
            v-model="column[idx]"
            :label="param.label"
            :v-show="param.useColumn"
            :type="param.type"
            required
            :disabled="!param.isEditable"
            hint="줄바꿈은 저장되지 않습니다. (한줄로 처리됨)"
            color="text--secondary"
          ></v-textarea>
          <v-text-field
            v-else
            clearable
            outlined
            class="text-body-2"
            :key="'column_' + idx"
            v-model="column[idx]"
            :label="param.label"
            :v-show="param.useColumn"
            :type="param.type"
            required
            :disabled="!param.isEditable"
            color="text--secondary"
          ></v-text-field>
        </template>
      </v-form>
    </div>
  </div>
</template>

<script>
import RuleMixin from "@/mixins/RuleMixin.js";

export default {
  name: "ruleEditor",
  mixins: [RuleMixin],
  props: ["params"],
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
      let addRuleParam = {
        [this.params.ruleKey]: []
      };
      // column값을 기반으로, 새로 입력받은 값을
      const vm = this;
      let obj = {};
      let columnValue = null;
      this.params.columns.forEach((c, i) => {
        columnValue = vm.column[i];

        if (Array.isArray(columnValue)) {
          // input box가 select(autoComplted)인 경우, modal value가 array로 되어있다.
          // array를 String으로 변환해서 API에 전송한다.
          columnValue = columnValue.join(",");
        } else {
          columnValue = this.removeEnter(columnValue)
        }
        obj[c.label] = columnValue;
      });
      addRuleParam[vm.params.ruleKey].push(obj);
      return addRuleParam;
    },
    async confirm() {
      /**
       * Model Adapor의 '저장' 버튼을 클릭하면, confirm 메소드가 호출된다.
       * 1. parameter 생성
       * 2. validation 체크
       * 3. api 통신
       * 4. api 결과값에 따라 vuex 에 데이터 반영
       */

      // 1. parameter 생성
      const addRuleParam = this.createRuleParam();

      // 2. validation체크
      if (this.isInValid(addRuleParam[this.params.ruleKey])) {
          this.EventBus.$emit("modalAlert", {
              title: "경고",
              text: "입력되지 않은 값이 있습니다. 확인 후 다시 시도해 주세요.",
              okTitle: "확인"
          });
          return;
      }

      // 3. api 통신 및 결과값 처리
      // 결과값이 success 면 vuex에 업데이트 해준다. (mixins 함수에서 모두 처리)
      // 결과값이 fail 이면 alert 메시지를 표시해준다.
      const result = await this.ruleChange(addRuleParam);
      if (result) {
        // API 호출이 정상적으로 완료된 경우에만, modal창을 닫아준다.
        this.EventBus.$emit("modalClose");
      }
    }
  }
};
</script>

<style scoped="">
.custom-modal {
  height: calc(100% - 40px);
}
.mu-fix-foot .mu-dialog-body {
  top: 45px;
}
</style>
