<template>
  <div>
    <v-btn
            elevation="1"
            icon
            x-small
            @click="temp()">
      <v-icon>mdi-plus-circle</v-icon>
    </v-btn>
    <template v-for="(ruleKey) in compList">
      <div :key="ruleKey" class="rule_component_wrap">
        <component 
          v-bind:is="component"
          v-bind:ruleKey="ruleKey"
          v-bind:selectList="selectList"
          v-bind:allRuleObj="ruleJson"
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
      ruleJson() {
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
      ruleJson(obj) {
        // 데이터가 변경되면
        this.resetSelectList();

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
      resetSelectList() {
        this.selectList = {
          regex : {
            name : []
          },
          regex_set : {
            name : []
          }
        }
      },
      setDataChanged(isChanged) {
        this.dataChanged = isChanged;
      }
    }
}
</script>