<template>
  <!-- object일 경우-->
  <div class="custom-card-content template-object">
    <template v-for="(_, innerKey, innerI) in rd">
      <v-row dense :key="'card_inner_' + innerI">
        <v-col cols="6" class="label-col">
          <p>{{ innerKey }}</p>
          <p
            v-html="getHtmlDesc(defaultData[compKey]['params'][innerKey].desc)"
          ></p>
        </v-col>
        <v-col cols="4" class="value-col">
          <v-text-field outlined dense v-model="rd[innerKey]"> </v-text-field>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script>
export default {
  name: "data-set-object",
  props: ["pageKey", "rd", "compKey", "defaultData", "afiRowData"]
};
</script>

<style scoped></style>
