<template>
  <v-card-actions class="custom-card-wrapper">
    <v-card v-for="(rd, key, i) in afiRowData" :key="'card_' + i">
      <v-card-title>{{ defaultData[key].text }}</v-card-title>
      <template v-if="defaultData[key].dataType === 'array'">
        <div class="add-button-wrap">
          <v-btn elevation="1" icon x-small @click="addRow(key)"
            ><v-icon>mdi-plus-circle</v-icon></v-btn
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
                      <p>
                        {{ defaultData[key]["params"][dataKey].desc }}
                      </p>
                    </v-col>
                    <v-col cols="5" class="value-col">
                      <v-text-field outlined dense v-model="innerRd[dataKey]">
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-row>
              </template>
            </v-col>
            <v-col cols="1" class="button-wrap">
              <v-btn
                v-if="innerI > 0"
                elevation="1"
                icon
                x-small
                @click="removeRow(key, innerI)"
              >
                <v-icon>mdi-minus-circle</v-icon>
              </v-btn></v-col
            >
          </v-row>
        </template>
      </template>

      <template v-else-if="defaultData[key].dataType === 'object'">
        <!-- object일 경우-->
        <div class="custom-card-content template-object">
          <template v-for="(_, innerKey, innerI) in rd">
            <v-row dense :key="'card_inner_' + innerI">
              <v-col cols="6" class="label-col">
                <p>{{ innerKey }}</p>
                <p>{{ defaultData[key]["params"][innerKey].desc }}</p>
              </v-col>
              <v-col cols="4" class="value-col">
                <v-text-field outlined dense v-model="rd[innerKey]">
                </v-text-field>
              </v-col>
            </v-row>
          </template>
        </div>
      </template>

      <!-- string Array 일 경우-->
      <template v-else-if="defaultData[key].dataType === 'stringArray'">
        <div class="custom-card-content none-border">
          <p>{{ defaultData[key].desc }}</p>
          <v-textarea no-resize outlined rows="3" :value="rd"></v-textarea>
        </div>
      </template>

      <!-- textarea 일 경우 = python code panel-->
      <template v-else-if="defaultData[key].dataType === 'textarea'">
        <div class="custom-card-content none-border">
          <p>{{ defaultData[key].desc }}</p>
          <!-- 여기 줄바꿈 치환하는 거 필요함-->
          <v-textarea
            no-resize
            outlined
            filled
            rows="7"
            :value="rd"
          ></v-textarea>
        </div>
      </template>
      <template v-else> </template>
    </v-card>
  </v-card-actions>
</template>

<script>
export default {
  name: "dataSet",
  props: ["step"],
  computed: {
    defaultData() {
      return this.$store.getters.defaultData[this.pageKey];
    },
    afiRowData() {
      return this.$store.getters.afiRowData[this.pageKey];
    }
  },
  watch: {},
  data() {
    return {
      pageKey: "dataset"
    };
  },
  created() {},
  methods: {
    addRow(key) {
      // 빈 object 추가
      let obj = {};
      Object.keys(this.afiRowData[key][0]).forEach((k) => {
        obj[k] = null;
      });
      this.afiRowData[key].push(obj);
    },
    removeRow(key, fi) {
      this.afiRowData[key].splice(fi, 1);
    }
  }
};
</script>

<style scoped>
.custom-card-wrapper {
  display: inline-block;
}
.custom-card-wrapper > div {
  margin: 10px 0;
}
.custom-card-content {
  padding: 5px;
  margin: 3px 20px 10px 20px;
  border: 1px solid lightblue;
  width: auto !important;
}
.custom-card-content.none-border {
  border: none !important;
}
.custom-card-content > div {
  padding: 5px;
}
.custom-card-content .v-card__text {
  padding: 5px !important;
}
.button-wrap button {
  margin: 0 50%;
}
.add-button-wrap button {
  position: absolute;
  right: 20px;
  top: 40px;
}
.v-card {
  padding-bottom: 1px;
}
.label-col p,
.value-col p {
  margin-bottom: 0;
}
.template-array {
  padding: 20px;
}
</style>
