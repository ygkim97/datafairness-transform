<template>
    <v-flex>
        <div class="d-inline mr-2">아이디 입력</div>
        <div class="d-inline idInput" @change="changeId">
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
        changeId(e){
            this.$emit('change-id',
                {
                    id : e.target.value,
                },
            ) 
        }
    }
}
</script>

<style scoped>
div.idInput{
    border:solid black 1px;
    box-sizing: border-box;
}
</style>