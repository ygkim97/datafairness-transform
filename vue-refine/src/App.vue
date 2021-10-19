<template>
  <v-app id="app">
    <router-view></router-view>

    <!-- Global Component -->
    <modals></modals>

<!--    <div class="spinner-custom">-->
<!--      <spinner-->
<!--        ref="spinner"-->
<!--        :size="88"-->
<!--        :line-size="12"-->
<!--        :font-size="20"-->
<!--        :message="message"-->
<!--      ></spinner>-->
<!--    </div>-->
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  mounted() {
    this.EventBus.$on("loaderOpen", this.loaderOpen);
    this.EventBus.$on("loaderClose", this.loaderClose);
  },

  created() {},

  data() {
    return {
      message : 'Loading 중...'
    }
  },

  methods: {
    test() {
      this.message = new Date() + '_LOADING'
    },

    loaderOpen() {
        console.log("here");
        this.$refs['spinner-wrap'].show();
    },
    loaderClose() {
        console.log("here");
        this.$refs['spinner-wrap'].hide();
    }
  }
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