<template>
    <v-flex class="rule-buttons">
        <div>
            <!-- <v-btn
                elevation="1"
                small
                plain
                @click="change()"
            >CHANGE</v-btn> -->
            <v-btn
                elevation="1"
                small
                plain
                @click="save()"
            >SAVE</v-btn>
            <v-btn
                elevation="1"
                small
                plain
                @click="remove()"
            >DELETE</v-btn>
        </div>
    </v-flex>
</template>

<script>
import {
    api_deleteRule
} from '@/apis/rules.js'

export default {
    name : 'ruleButtons',

    computed : {
      tableName() {
        return this.$store.getters.tableName
      }
    },

    methods : {
        save() {
            // await api_saveRule({tableName : this.tableName}).then((response) => {
            // })
            this.$store.dispatch("setAction", this.$store.getters.CONSTANTS.actions.CREATE);
        },        
        remove() {
            const _vm = this;

            this.EventBus.$emit("modalConfirm", {
                title: "Rule 삭제",
                text: `[ ${this.tableName} ] 테이블의 Rule을 삭제하시겠습니까?  <br>(* 삭제가 완료되면 이전 Rule 정보를 복구 할 수 없습니다.)`,
                okTitle: "확인",
                cancelTitle: "취소",
                okRes: function() {
                    _vm.removeRule();
                }
            });
        },
        async removeRule() {
            const _vm = this;

            await api_deleteRule().then((response) => {
                // 테스트 backend API에서 return해주는 success값으로, 
                // 추후에 실 API에서 return 해주는 값으로 변경해서 처리해야함.
                console.log(response)
                
                if (response.result === 'SUCCESS') {
                    console.log('success')
                    setTimeout( function() {
                            _vm.EventBus.$emit("modalAlert", {
                            title: "Alert",
                            text: "삭제되었습니다.",
                            okTitle: "확인",
                            okRes : function() {
                                // viewRule로 이동시키지 않고, vuex의 데이터를 삭제한 후에 화면을 다시 그리는 방안으로 해야함.
                                // 같은 url을 router를 통해서 다시 실행하게 되면, 에러가 발생하기 때문.
                                // _vm.$router.push({name: 'viewRule'})
                            }
                        });
                    }, 500);
                } else {
                    _vm.EventBus.$emit("modalAlert", {
                        title: "Alert",
                        text: "삭제가 정상적으로 처리되지 않았습니다. <br>잠시 후 다시 시도해 주세요.",
                        okTitle: "확인"
                    });
                }        
                
            });
        }
    }

    

};
</script>

<style>
</style>
