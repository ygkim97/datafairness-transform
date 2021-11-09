<template>
  <div>
    <div class="add-button-wrap">
      <v-btn elevation="1" small color="blue-grey lighten-1"
      class="white--text" @click="addRow(compKey)"
        >추가</v-btn
      >
    </div>
    <!-- array일 경우-->
    <template v-for="(innerRd, innerI) in rd">
      <v-row
        :key="'card_inner_' + innerI"
        class="custom-card-content template-array"
      >
        <v-col>
          <template v-for="(d, dataKey, pi) in innerRd">
            <v-row :key="'array_param_' + pi">
              <v-row dense :key="'card_inner_' + innerI">
                <v-col cols="7" class="label-col">
                  <p>{{ dataKey }}</p>
                  <p
                    class="text-caption"
                    v-html="
                      getHtmlDesc(defaultData[compKey]['params'][dataKey].desc)
                    "
                  ></p>
                </v-col>
                <v-col cols="5" class="value-col">
                  <v-text-field outlined dense v-model="innerRd[dataKey]" color="text--secondary">
                  </v-text-field>
                </v-col>
              </v-row>
            </v-row>
          </template>
        </v-col>
        <v-col cols="1" class="button-wrap">
          <v-btn
            v-if="innerI > 0"
            small
            color="blue-grey lighten-1"
            class="white--text"
            icon
            @click="removeRow(compKey, innerI)"
          ><v-icon>mdi-close-box</v-icon>
          </v-btn></v-col
        >
      </v-row>
    </template>
  </div>
</template>

<script>
export default {
  name: "data-set-array",
  props: ["pageKey", "rd", "compKey", "defaultData", "afiRowData"],
  methods: {
    addRow(k) {
      // 빈 object 추가
      let obj = {};
      Object.keys(this.afiRowData[k][0]).forEach((k) => {
        obj[k] = null;
      });
      this.afiRowData[k].push(obj);
    },
    removeRow(k, fi) {
      this.afiRowData[k].splice(fi, 1);
    }
  }
};
</script>

<style scoped></style>
