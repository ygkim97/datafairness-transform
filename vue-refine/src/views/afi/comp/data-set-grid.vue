<template>
  <v-simple-table>
    <template v-slot:default>
      <tbody>
        <tr v-for="(obj, paramKey, i) in rd" :key="'grid_body_' + i">
          <!-- text-->
          <td>
            {{ paramKey }}
          </td>
          <!-- desc-->
          <td>
            <span
              class="text-caption"
              v-html="
                getHtmlDesc(defaultData[compKey]['params'][paramKey].desc)
              "
            ></span>
          </td>
          <!-- checkbox-->
          <td>
            <v-checkbox v-model="rd[paramKey]"></v-checkbox>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  name: "",
  props: ["pageKey", "rd", "compKey", "defaultData", "afiRowData"]
};
</script>

<style scoped></style>
