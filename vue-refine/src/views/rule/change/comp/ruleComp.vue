<template>
    <div>
        <v-chip
        class="ma-2"
            label
            outlined
            >{{ruleKey}}</v-chip>
        <div>
            {{ruleObj}}
        </div>
        <!-- <button @click="setMyData()">btn</button> -->
    </div>
</template>

<script>
export default {
    name : 'ruleComp',

    props: ['ruleKey'],

    computed : {
        ruleObj() {
            return this.$store.getters.ruleJson[this.ruleKey]
        },
        ruleSample() {
            return this.$store.getters.ruleSample[this.ruleKey]
        }
    },

    created() {
    },

    data: () => ({
    }),

    methods : {
        // when value changed, update value
        setMyData() {
            this.ruleSample
            this.ruleJson[this.ruleKey].push({name:'testName', expression:'testExp'})
            this.$store.dispatch("KATIB_DELETE_EXPERIMENT", this.ruleJson);
        }
    }
}
</script>