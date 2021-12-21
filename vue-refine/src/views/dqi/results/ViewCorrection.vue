<template>
   <div class="mt-10">
      <v-card elevation="2" class="mb-11">
         <v-toolbar
            color="blue-grey darken-3"
            dark
            height="40"
            flat
         >Column selection
         </v-toolbar>
         <div class="selection-wrap">
            <v-autocomplete
               dense
               autocomplete="off"
               persistent-hint
               outlined
               required
               label="Column Name"
               v-model="columnName"
               :items="columnNameList"
               color="text--secondary"
            ></v-autocomplete>
         </div>
      </v-card>
      <v-card elevation="2">
         <v-toolbar
            color="blue-grey darken-3"
            dark
            height="40"
            flat
         >Property setting
         </v-toolbar>
         <div class="setting-wrap">
            <v-row class="mb-4">
               <v-col cols="6" class="mt-2 pb-10">
                  <v-autocomplete
                     dense
                     autocomplete="off"
                     persistent-hint
                     outlined
                     required
                     label="setting"
                     v-model="dataIndex"
                     :items="dataIndexList"
                     item-text="item"
                     item-disabled="disable"
                     color="text--secondary"
                  ></v-autocomplete>
               </v-col>
               <template v-if="dataIndex==='null'">
                  <v-col cols="2" class="d-flex justify-center pt-0">
                     <v-radio-group v-model="selected">
                        <v-radio
                           label="보정"
                           color="blue-grey darken-4"
                           value="imputation"
                        >
                        </v-radio>
                        <v-radio
                           label="삭제"
                           color="blue-grey darken-4"
                           value="delete"
                        >
                        </v-radio>
                     </v-radio-group>
                  </v-col>
               </template>
            </v-row>
            <v-btn
               color="blue-grey lighten-1"
               dark
               mideum
               class="float-right"
               @click="btnClick"
               >
               실행
            </v-btn>
         </div>
      </v-card>
   </div>
   
</template>

<script>
import { api_dataCorrection, api_dataDqi } from "@/apis/results.js"
export default {
   data() {
      return {
         selected : 'imputation',
         dataIndexList : [{item:'null', disable: false}, {item:'패턴 불일치', disable: false}, {item: '타입 불일치', disable: false}],
         columnNameList : [],
         columnName : '',
         dataIndex : 'null',
         columnPattern: '',
         columnType: ''
      }
   },
   methods: {
      async btnClick() {
         const vm = this;
         if(this.columnName === ''){
            vm.EventBus.$emit("modalAlert", {
               title: "경고",
               text: "Column Name 값을 설정 후, 다시 시도해 주세요.",
               okTitle: "확인"
            });
            return;
         }

         this.setCorrectionParam();
         // console.log(this.correctionParam);

         await api_dataCorrection(this.correctionParam).then((response) => {
            
            if (response.result !== "SUCCESS") {
            // 데이터 조회를 하지 못한 경우
               vm.EventBus.$emit("modalAlert", {
                  title: "경고",
                  text: "데이터 조회를 하지 못했습니다. 잠시후 다시 시도해 주세요",
                  okTitle: "확인"
               });
            } else {
               let ruleModeParam = this.ruleModeParam;
               ruleModeParam.table_name = response.correction_table_name;

               api_dataDqi(ruleModeParam).then((response) => {
                  if (response.result !== "SUCCESS") {
                  // 데이터 조회를 하지 못한 경우
                     vm.EventBus.$emit("modalAlert", {
                        title: "경고",
                        text: "데이터 조회를 하지 못했습니다. 잠시후 다시 시도해 주세요",
                        okTitle: "확인"
                     });
                  } else {
                     response.data_dqi.column_stats.forEach((columnObj) => {
                        if(columnObj.column_name === this.columnName){
                           console.log(columnObj.column_dqi);
                        }
                     });
                  }
               });
            }
         });
      },
      setCorrectionParam() {
         let dataIndex = null;
         if (this.dataIndex === 'null'){
            dataIndex = 'missing_rate';
         } else if(this.dataIndex === '패턴 불일치'){
            dataIndex = 'pattern_mismatch_rate';
         } else if(this.dataIndex === '타입 불일치'){
            dataIndex = 'type_missmatch_rate';
         }

         let columnOptArray = []
         columnOptArray.push({
            data_index: dataIndex,
            correction: this.selected,
            column_name: this.columnName,
            column_pattern: this.columnPattern,
            column_type:  this.columnType,
            table_name: this.tableName
         });
         this.$store.commit("setCorrectionParam", columnOptArray[0]);
      },
      setColumnNameList() {
         this.resultResponse.auto.column_stats.forEach((columnObj) => {
            this.columnNameList.push(columnObj.column_name);
         });
      }
   },
   computed: {
      resultResponse() {
         return this.$store.getters.resultResponse;
      },
      correctionParam() {
         return this.$store.getters.correctionParam;
      },
      tableName() {
         return this.$store.getters.tableName;
      },
      ruleModeParam() {
         return this.$store.getters.ruleModeParam;
      }
   },
   created() {
      this.setColumnNameList();
   },
   watch: {
      columnName(columnName){
         this.dataIndexList[1].disable = false;
         this.dataIndexList[2].disable = false;

         this.resultResponse.auto.column_stats.forEach((columnObj)=> {
            if(columnObj.column_name === columnName){
               this.columnPattern = columnObj.column_pattern;
               this.columnType = columnObj.column_type;
            }
         });

         if(this.columnPattern === null){
            this.dataIndexList[1].disable = true;
         }

         if(this.columnType === null){
            this.dataIndexList[2].disable = true;
         }
      }
   }
}
</script>

<style scoped>
.selection-wrap{
   padding: 20px 32px 0px;
}
.setting-wrap{
   padding: 20px 32px 65px;
}
</style>