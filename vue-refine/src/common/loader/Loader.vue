<template>
    <div>
        <loader
                ref="loader"
                object="#ff9633"
                color1="#ffffff"
                color2="#17fd3d"
                size="5"
                speed="2"
                bg="#343a40"
                objectbg="#999793"
                opacity="80"
                name="circular"
        ></loader>

    </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  mounted() {
    console.log('loader')
    // this.EventBus.$on("loaderOpen", this.loaderOpen);
    // this.EventBus.$on("loaderClose", this.loaderClose);
  },
  methods: {
    loaderOpen() {
      console.log("here");
      // this.$refs["loader"].show();
    },
    loaderClose() {
      console.log("here");
      // this.$refs["loader"].hide();
    }
  }
};
</script>

<style></style>
