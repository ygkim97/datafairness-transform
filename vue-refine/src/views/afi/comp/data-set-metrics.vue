<template>
  <div v-if="params !== null">
    <v-card
      v-for="(pa, i) in params.protected_attributes"
      :key="'pa_card_' + i"
      class="mb-12"
    >
      <v-toolbar
        color="blue-grey darken-2"
        dark
        height="40"
        flat
      >{{ defaultData.text + ": " + pa }}
      </v-toolbar>
      <div class="comp_wrap mt-10 mb-4 mx-6">
        <div class="text-h6">
          Privileged Group:
        </div>
        <div>
          <span class="key"
            >{{ Object.keys(params.privileged_groups[0])[0] }}:
          </span>
          <span class="value"
            >{{ Object.values(params.privileged_groups[0])[0] }}:
          </span>
        </div>
        <div class="text-h6">
          Unprivileged Group:
        </div>

        <div>
          <span class="key"
            >{{ Object.keys(params.unprivileged_groups[0])[0] }}:
          </span>
          <span class="value"
            >{{ Object.values(params.unprivileged_groups[0])[0] }}:
          </span>
        </div>
        <div class="text-h6 mitigation-wrap" v-if="params.mitigation !== null">
          <span class="key">
            Mitigation:
          </span>
          <span class="value">{{ params.mitigation }}</span>
        </div>

        <div class="cart-wrap">
          <div>CHART</div>
          <div>CHART</div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "data-set-metrics",
  props: ["compKey", "params"],
  computed: {
    defaultData() {
      return this.$store.getters.defaultData[this.compKey];
    }
  },
  methods: {}
};
</script>

<style scoped>
.comp_wrap{
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 20px;
}
.comp_wrap > div:nth-child(2n) {
  margin-bottom: 20px;
}
.comp_wrap > div:last-child {
  margin-bottom: 0;
}
span.key {
  font-weight: 700;
}
.mitigation-wrap {
  margin-top: 20px;
}
.cart-wrap {
  margin: 20px;
}
</style>
