<template>
    <v-flex>
        <div class="d-inline mr-2">비밀번호 입력</div>
        <div class="d-inline pwInput" @change="changePw">
            <input type="text">
        </div>
    </v-flex>
</template>

<script>
export default {
    data(){
        return{
            
        }
    },
    methods: {
        changePw(e){
            this.$emit('change-pw', {
                pw : e.target.value
            })
        }
    }
}
</script>

<style scoped>
div.pwInput{
    border:solid black 1px;
    box-sizing: border-box;
}
</style>