<template>
  <div>
    <template v-for="ruleKey in compList">
      <v-btn
        :key="ruleKey"
        rounded
        x-small
        color="blue-grey lighten-5"
        class="mr-4"
        @click="btnClick(ruleKey)"
        >{{ ruleKey }}
      </v-btn>
    </template>
  </div>
</template>

<script>
export default {
  name: "propertyBtns",

  computed: {
    compList() {
      return this.$store.getters.CONSTANTS.compList;
    }
  },

  methods: {
    btnClick(ruleKey) {
      const scrollTop = document.querySelector(`#${ruleKey}`).offsetTop;
      window.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
  }
};
</script>

<style scoped></style>
