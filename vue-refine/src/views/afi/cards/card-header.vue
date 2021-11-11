<template>
  <div>
    <v-card-title>
      {{ params.title }}
    </v-card-title>
    <v-card-subtitle>
      {{ params.subtitle }}
    </v-card-subtitle>
  </div>
</template>

<script>
export default {
  name: "card-header",
  props: ["params"]
};
</script>

<style scoped></style>
