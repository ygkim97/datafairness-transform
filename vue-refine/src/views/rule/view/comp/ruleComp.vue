<template>
    <div>
        <v-chip
        class="ma-2 text-h5"
        label
        outlined
        >{{ruleKey}}</v-chip>

        <div class="grid-wrap">                    
                    <v-btn
                        elevation="1"
                        icon
                        x-small
                        @click="addTemp()">
                        <v-icon>mdi-plus-circle</v-icon>
                    </v-btn>
            <div class="float-right">
                <div class="float-left grid-button">
                    <component
                        :is="vBtn"
                        :eventType="'add'"
                        :iconName="'mdi-plus-circle'"
                        @addRow="addRow"
                    ></component>
                </div>
            </div>

            <tui-grid
                :id="`tuiGrid_` + ruleKey"
                :ref="`tuiGrid_` + ruleKey"
                :data="ruleObj"
                :columns="gridProps.columns"
                :options="gridProps.options"
                :theme="gridProps.theme"
            ></tui-grid>                
        </div>
    </div>
</template>

<script>
import vBtn from './rowBtn.vue'

export default {
    name : 'ruleComp',

    props: ['ruleKey'],

    computed : {
        allRuleObj() {
            return this.$store.getters.ruleJson
        },
        ruleObj() {
            return this.$store.getters.ruleJson[this.ruleKey]
        },
        ruleSample() {
            return this.$store.getters.ruleSample[this.ruleKey]
        },
        ruleDataSet() {
            return this.$store.getters.ruleDataSet[this.ruleKey]
        },
        gridInfo() {
            return this.$store.getters.GRID
        }
    },

    watch : {
        ruleObj(obj) {
            // ruleObj가 업데이트 되면, grid를 리셋한다.
            this.$refs[`tuiGrid_${this.ruleKey}`].invoke('resetData', obj);
        }
    },
    async created() {
        await this.createGrid()
        await this.gridAfterChange();
    },

    mounted() {
    },

    data: () => ({
        btnElement : null,
        vBtn : vBtn,
        gridProps : {},
        gridData : [],
        testObj : []
    }),                         

    methods : {
        addTemp() {
            console.log(this.ruleDataSet)
        },
        createGrid() {
            let columns = [];
            let ruleParam = null;
            let editorParam = null;
            
            Object.keys(this.ruleSample.dataSet).forEach((rs, ri) => {
                ruleParam = this.ruleSample.dataSet[rs];

                if (ruleParam.editorUse) {
                    editorParam.type = ruleParam.type;
                    if (editorParam.type === 'select')  {
                        
                        // editorParam.dependOn.split('.').pop()
                        // editorParam.dependOn.split('.').pop();
                        // editorParam.dependOn.split('.').shift();
                    }
                }

                columns.push({
                    header: rs,
                    name: rs,
                    align : Object.prototype.hasOwnProperty.call(ruleParam, 'align') ? ruleParam.align : 'center',
                    width : Object.prototype.hasOwnProperty.call(ruleParam, 'width') ? ruleParam.width : '',
                    sortable : false,
                    editor : {
                        type : 'text'
                    }
                });
            });

            // add delete button column
            columns.push({
                header: "",
                name: "",
                align: "center",
                width: 40, // pixel
                renderer: {
                    type: this.gridInfo.renderer.buttonColumn,
                    options: {
                        btnText: "view",
                        vueIns: this,
                        iClass : 'fas fa-minus-circle',
                        keyColumnName : this.ruleSample.columnKey
                    }
                }
            });
          
            this.gridProps = {
                theme : this.gridInfo.theme,
                options : {
                    draggableRow: true,
                    scrollX : false,
                    scrollY : false
                },
                columns: columns
            }
        },
        addRow() {
            this.$store.commit('addEmptyRow', {key : this.ruleKey})
        },
        deleteRow(keyParam) {
            this.$store.dispatch('deleteRow', {key : this.ruleKey, keyParam : keyParam});
        },
        buttonColumnClick(attr) {
            const keyParam = JSON.parse(attr.getAttribute('params'));
            this.deleteRow(keyParam);
        },
        gridAfterChange() {
            const vm = this;
            this.$refs[`tuiGrid_${this.ruleKey}`].gridInstance.on('afterChange', (ev) => {
                const newRow = ev.changes[0];
                // 변경한 내용을 vuex에 반영해준다.
                vm.$store.dispatch('changeRow', {
                    key : vm.ruleKey,
                    columnName : newRow.columnName,
                    rowIdx : newRow.rowKey,
                    value : newRow.value
                });
            })            
        }
    }
}
</script>