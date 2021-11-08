<template>
    <v-flex>
        <h1>test</h1>
        <id-input @change-id="changeId"></id-input>
        <pw-input @change-pw="changePw"></pw-input>

        <div>아이디 : {{ id }}</div>
        <div>비밀번호 : {{ pw }}</div>
    </v-flex>
</template>

<script>
import IdInput from "./comp/idInput.vue"
import PwInput from "./comp/pwInput.vue"

export default {
    name: "test",
    data(){
        return{
            id: '',
            pw: ''
        }
    },
    components: {
        IdInput,
        PwInput
    },
    methods: {
        changeId({id}){
            console.log(id); 
            this.id = id
        },
        changePw({pw}){
            this.pw = pw
        }
    }
}
</script>