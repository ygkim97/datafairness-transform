<template>
  <div class="check-button-wrap">
    <v-btn color="blue-grey lighten-1" class="float-right" dark small>
      <v-checkbox dense v-model="useNER" :label="`NER 사용`"></v-checkbox>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "ner-check",
  props: ["mode"],
  computed: {
    useNER: {
      get() {
        return this.$store.getters.useNER[this.mode];
      },
      set(bool) {
        this.$store.commit("setUseNER", { mode: this.mode, useNER: bool });
      }
    }
  },
  methods: {}
};
</script>

<style scoped>
.check-button-wrap {
  font-size: 10px !important;
}
</style>
