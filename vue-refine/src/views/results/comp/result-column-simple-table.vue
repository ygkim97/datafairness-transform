<template>
  <v-simple-table dense>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">
            Key
          </th>
          <th class="text-left">
            Value
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in Object.keys(column)" :key="item">
          <td>{{ convertTemplates(item) }}</td>
          <td v-if="column[item] === null || column[item] === undefined">
            {{ convertTemplates("no_data") }}
          </td>
          <td v-else-if="typeof column[item] === 'object'">
            <table class="table-border">
              <colgroup>
                <col class="inner-left" />
                <col class="inner-right" />
              </colgroup>
              <tbody>
                <tr
                  v-for="innerItem in Object.keys(column[item])"
                  :key="innerItem"
                >
                  <td>{{ convertTemplates(innerItem) }}</td>
                  <td
                    v-if="
                      column[item][innerItem] === null ||
                        column[item][innerItem] === undefined
                    "
                  >
                    {{ convertTemplates("no_data") }}
                  </td>
                  <td v-else-if="typeof column[item][innerItem] === 'object'">
                    <table>
                      <colgroup>
                        <col class="inner-left" />
                        <col class="inner-right" />
                      </colgroup>
                      <tbody>
                        <tr
                          v-for="thirdInner in Object.keys(
                            column[item][innerItem]
                          )"
                          :key="thirdInner"
                        >
                          <td>{{ convertTemplates(thirdInner) }}</td>
                          <td>
                            {{ column[item][innerItem][thirdInner] }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td v-else>
                    {{ column[item][innerItem] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
          <td v-else>
            {{ column[item] }}
          </td>

          <!--&lt;!&ndash;          <td>{{ JSON.stringify(column[item]) }}</td>&ndash;&gt;-->
          <!--            {{typeof column[item]}}-->
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  name: "ResultColumnSimpleTable",
  props: ["column"],
  computed: {
    strTemplate() {
      return this.$store.getters.CONSTANTS.result_str;
    }
  },
  methods: {
    convertTemplates(str) {
      return this.strTemplate[str] === undefined ? str : this.strTemplate[str];
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
}
.inner-left {
  width: 50%;
}
.inner-right {
  width: 50%;
}
.table-border td {
  border-bottom: thin solid rgba(0, 0, 0, 0.12);
}
.table-border tr:last-child td {
  border-bottom: none;
}
</style>
