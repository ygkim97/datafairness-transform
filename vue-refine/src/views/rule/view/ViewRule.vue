<template>
  <div>
    <template v-for="(ruleKey) in compList">
      <div :key="ruleKey" class="rule_component_wrap">
        <component 
          v-bind:is="component"
          v-bind:ruleKey="ruleKey"
          v-bind:selectList="selectList"
          v-bind:allRuleObj="allRuleObj"
        >
        </component>
      </div>
    </template>
  </div>
</template>

<script>
import viewComp from './comp/ruleComp.vue'

export default {
    name: 'viewRule',

    computed : {      
      allRuleObj() {
          return this.$store.getters.ruleJson
      },
      compList() {
        return this.$store.getters.CONSTANTS.compList
      },
      tableName() {
        return this.$store.getters.tableName
      }
    },

    watch : {
        allRuleObj(obj) {
          // ruleObject가 변경되면, select list를 갱신해줘야한다.
          // 상위 컴퍼넌트에서 작성하는 이유는, 하위 컴퍼넌트에서 동작하게 되면
          // 각 grid 별로 5번의 같은 동작이 반복되기 때문에, 상위에서 동작하게 하고
          // 하위 컴퍼넌트에서 데이터를 받아 동작하게 함.
          obj.regex.forEach( r => {
            this.selectList.regex.name.push({ text: r.name, value: r.name});
          })

          obj.regex_set.forEach( r => {
            this.selectList.regex.name.push({ text: r.name, value: r.name});
          })
        }
    },

    created() {
    },
  
    mounted() {
    },

    data: () => ({
      component : viewComp,
      // compList는 restAPI 서버의 각각의 rule 명과 맞춰서 작성해주어야함.      
      ruleData : {},
      selectList : {
          regex : {
            name : []
          },
          regex_set : {
            name : []
          }
      },
      dataChanged : false
    }),

    methods : {
      setDataChanged(isChanged) {
        this.dataChanged = isChanged;
      }
    }
}
</script>