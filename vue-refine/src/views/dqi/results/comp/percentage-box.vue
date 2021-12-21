<template>
  <div id="percentage-bar">
    <!-- value bar-->
    <div
      id="percentage-inner-bar"
      :style="{
        width: innerWidth + 'px',
        height: innerHeight + 'px',
        border: useBorder ? '1px solid #396eb0;' : ''
      }"
    ></div>
    <div id="percentage-span">
      <span>{{ value + endTag }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "percentage-bar",
  props: ["value", "endTag"],
  data() {
    return {
      el: null,
      innerWidth: 0,
      innerHeight: 0,
      useBorder: true
    };
  },
  mounted() {
    this.el = document.getElementById("percentage-bar");
    this.setInnerBarWidth();
  },
  methods: {
    setInnerBarWidth() {
      this.innerWidth = (this.el.offsetWidth * this.value) / 100;
      this.innerHeight = this.el.offsetHeight - 2; // border

      if (this.innerWidth === 0) {
        this.useBorder = false;
      }
    }
  }
};
</script>

<style scoped>
#percentage-bar {
  border: 1px solid #e7e7e7;
  width: 100%;
  height: 17px;
  max-width: 250px;
  position: relative;
}
#percentage-inner-bar {
  background-color: #396eb0;
  opacity: 0.5;
}
#percentage-span {
  font-size: 11px;
  vertical-align: middle;
  position: absolute;
  right: 10px;
  top: 0;
  margin: auto;
}
</style>
