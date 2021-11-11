<template>
  <div class="scroll-top" v-if="showScrollTop">
    <v-btn
      icon
      class="blue-grey lighten-5"
      x-large
      elevation="2"
      @click="btnClick"
    >
      <v-col>
        <v-row justify="center">
          <v-icon class="pt-3">mdi-chevron-up</v-icon>
        </v-row>
        <v-row justify="center" class="pb-4">
          <span class="text-body-2">TOP</span>
        </v-row>
      </v-col>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "ScrollTop",

  data() {
    return {
      showScrollTop: false
    };
  },

  created() {
    this.EventBus.$on("scrollView", this.scrollView);
  },

  methods: {
    btnClick() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    scrollView() {
      this.showScrollTop = true;
    }
  }
};
</script>

<style>
.scroll-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  border-radius: 50px;
  background-color: #455a64;
}
</style>
