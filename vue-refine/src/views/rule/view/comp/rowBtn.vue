<template>
    <div>
        <v-btn
            elevation="1"
            icon
            x-small
            @click="btnClick()">
            <v-icon>{{iconName}}</v-icon>
        </v-btn>
    </div>
</template>

<script>
export default {
    name : 'rowBtn',

    props : ['eventType', 'iconName'],

    methods : {
        btnClick() {
            if (this.eventType === 'add') {
                this.$emit('addRow');
            } else if (this.eventType === 'delete') {
                this.$emit('deleteRow', {key : this.eventType});
            }
        }
    }
}
</script>