<template>
  <!-- object일 경우-->
  <div class="custom-card-content template-object">
    <template v-for="(_, innerKey, innerI) in rd">
      <v-row dense :key="'card_inner_' + innerI">
        <v-col cols="6" class="label-col">
          <p>{{ innerKey }}</p>
          <p
            class="text-caption"
            v-html="getHtmlDesc(defaultData[compKey]['params'][innerKey].desc)"
          ></p>
        </v-col>
        <template v-if="defaultData[compKey]['params'][innerKey].dataType === 'array'">
          <v-col cols="4" class="value-col my-2">
            <v-autocomplete
                dense
                autocomplete="off"
                persistent-hint
                outlined
                required
                label="Column Name"
                v-model="rd.name"
                :items="labelColumnList"
                hint="Column을 선택해 주세요"
                color="text--secondary"
              ></v-autocomplete>
          </v-col>
        </template>
        <template v-else>
          <v-col cols="4" class="value-col">
            <v-text-field outlined dense v-model="rd[innerKey]" color="text--secondary"> </v-text-field>
          </v-col>
        </template>
      </v-row>
    </template>
  </div>
</template>

<script>
export default {
  name: "data-set-object",
  props: ["pageKey", "rd", "compKey", "defaultData", "afiRowData"],
  computed: {
    labelColumnList() {
      return this.$store.getters.labelColumnList; 
    }
  }
};
</script>

<style scoped></style>
