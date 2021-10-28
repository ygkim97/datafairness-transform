<template>
  <v-app id="app">
    <router-view></router-view>

    <!-- Global Component -->
    <modals></modals>

    <spinner-comp
      :spinnerOn="$store.getters.spinnerStatus"
      :message="$store.getters.spinnerMessage"
    ></spinner-comp>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {
    SpinnerComp: () => import("@/common/loader/Spinner.vue")
  },

  mounted() {
    this.EventBus.$on("loaderOpen", this.loaderOpen);
    this.EventBus.$on("loaderClose", this.loaderClose);
  },

};
</script>

<style lang="scss">
@import "./assets/css/all.min.css";

@import "./assets/css/dev.scss";

.spinner-custom {
  padding: 20%;
  z-index: 99999;
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: grey;
  opacity: 0.5;
}
</style>
