<template>
  <v-stepper>
    <v-stepper-header value="step">
      <template v-for="(s, idx) in stepper">
        <v-stepper-step
          :step="idx + 1"
          :key="'stepper_' + idx + 1"
          :complete="step > idx"
          :editable="step > idx + 1"
          @click="step > idx + 1 ? clickStepper(idx) : ''"
        >
          {{ s.text }}
        </v-stepper-step>

        <v-divider
          v-if="idx < stepper.length - 1"
          :key="'stepper_divider_' + idx"
        ></v-divider>
      </template>
    </v-stepper-header>
  </v-stepper>
</template>

<script>
export default {
  name: "card-stepper",
  props: ["step"],
  data() {
    return {};
  },
  computed: {
    stepper() {
      return this.$store.getters.stepper;
    }
  },
  methods: {
    clickStepper(idx) {
      this.$emit("clickStep", idx);
    }
  }
};
</script>

<style scoped>
.v-sheet.v-stepper {
  box-shadow: none;
}
</style>
