<template>
  <div class="custom-json-body">
    <v-layout row wrap justify-end>
      <v-flex align-self-center shrink>
        <v-btn elevation="1" small plain @click="getResult">데이터 조회</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row justify-center class="result-body">
      <v-flex align-self-end shrink>
        <pre v-if="resultResponse.column_stats.length > 0">
            {{ resultResponse }}
        </pre>
        <p v-else>
          조회된 데이터가 없습니다.
        </p>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "result-body",
  props: ["mode"],
  computed: {
    resultResponse() {
      return this.$store.getters.resultResponse[this.mode];
    }
  },
  methods: {
    getResult() {
      this.$emit("getResult");
    }
  }
};
</script>

<style scoped>
.custom-json-body {
  margin: 30px 10px 10px 10px;
}
.result-body {
  margin-top: 30px;
  padding: 20px;
  /*border: 1px solid lightgray;*/
}
</style>
