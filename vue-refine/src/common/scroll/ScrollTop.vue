<template>
    <div class="scroll-top" v-if="showScrollTop">
        <v-btn 
          icon
          dark
          x-large
          @click="btnClick"
        >
            <v-col>
                <v-row justify="center">
                    <v-icon class="pt-3">mdi-chevron-up</v-icon>
                </v-row>
                <v-row justify="center" class="pb-4">
                    <span>TOP</span>
                </v-row>
            </v-col>    
        </v-btn>
    </div>
</template>

<script>
export default {
    name:"ScrollTop",

    data() {
        return{
            showScrollTop: false
        }
    },

    created() {
        this.EventBus.$on("scrollView", this.scrollView);
        console.log('scroll created');
    },

    mounted() {
        console.log('scroll mounted');
    },

    methods: {
        btnClick(){
            window.scrollTo({top: 0, behavior:'smooth'});
        },
        scrollView() {
            this.showScrollTop = true;
        }
    }
}
</script>

<style>
.scroll-top{
    position: fixed;
    bottom: 30px;
    right: 9px;
    border-radius: 50px;
    background-color: #455A64;
}
</style>