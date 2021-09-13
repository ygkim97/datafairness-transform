<template>
    <div>
        <v-chip
        class="ma-2"
            label
            outlined
            >{{ruleTitle}}</v-chip>
        <div>
            {{ruleObj}}            
        </div>
    </div>
</template>

<script>
export default {
    name : 'ruleComp',

    props: ['ruleTitle', 'ruleObj'],

    created() {
console.log(this.ruleObj)
    },

    data: () => ({
    }),

    methods : {
        getRuleData() {
            console.log('getRuleDataTemp')
        }
    }
}
</script>