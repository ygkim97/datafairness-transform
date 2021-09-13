<template>
  <div>
    <template v-for="(compKey) in compList">
      <div :key="compKey" class="rule_component_wrap">
        <component 
          v-bind:is="component"
          v-bind:ruleObj="ruleData[compKey]"
          v-bind:ruleTitle="compKey"
        >
        </component>
      </div>
    </template>
  </div>
</template>

<script>
import viewComp from './comp/ruleComp.vue'

import {
    api_getRuleInfo
} from '@/apis/rules.js'

export default {
    name: 'viewRule',

    computed : {
      tableName() {
        return this.$store.getters.TABLE_NAME
      }
    },

    created() {
      this.getRuleData();
    },
  
    mounted() {
    },

    data: () => ({
      component : viewComp,
      // compList는 restAPI 서버의 각각의 rule 명과 맞춰서 작성해주어야함.
      compList : ['regex', 'regex_set', 'bin_regex_set', 'unique_regex_set', 'range'],
      ruleData : {}
    }),

    methods : {
      async getRuleData() {
        await api_getRuleInfo('DQI').then((response) => {
          console.log(response);
          this.ruleData = response;
        });
      }
    }
}
</script>