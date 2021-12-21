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
          <td class="table-key">{{ convertTemplates(item) }}</td>
          <td v-if="column[item] === null || column[item] === undefined">
            {{ convertTemplates("no_data") }}
          </td>
          <td v-else-if="typeof column[item] === 'object'">
            <table class="inner-table">
              <colgroup>
                <col class="inner-left" />
                <col class="inner-right" />
              </colgroup>
              <tbody>
                <tr
                  v-for="innerItem in Object.keys(column[item])"
                  :key="innerItem"
                >
                  <td class="table-key">{{ convertTemplates(innerItem) }}</td>
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
                          <td class="table-key">
                            {{ convertTemplates(thirdInner) }}
                          </td>
                          <td>
                            {{ column[item][innerItem][thirdInner] }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td v-else>
                    <template v-if="item === 'column_dqi'">
                      <percentage-bar :value="Number(column[item][innerItem].replaceAll('%', ''))" endTag="%"></percentage-bar>
                    </template>
                    <template v-else>
                      {{ column[item][innerItem] }}
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
          <td v-else>
            {{ column[item] }}
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  name: "ResultColumnSimpleTable",
  props: ["column"],
  components: {
    PercentageBar: () => import("./percentage-box")
  },
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

table td {
  border-collapse: collapse;
  border-bottom: thin solid rgba(0, 0, 0, 0.12);
  border-right: thin solid rgba(0, 0, 0, 0.12);
}
table tr td:last-child {
  border-right: none;
}
table tr:last-child > td {
  border-bottom: none;
}
.inner-table tr td:last-child {
  padding-left: 16px;
}
td.table-key {
  color: #627781;
}
</style>