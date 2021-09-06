const state = {
  grid: Object.freeze({
    minHeight: 100,
    minBodyHeight: 50,
    rowHeight: 50,
    theme: {
      name: "myTheme",
      value: {
        outline: {
          showVerticalBorder: false
        },
        cell: {
          normal: {
            background: "#ffffff",
            border: "#d1d8e5",
            showVerticalBorder: false,
            showHorizontalBorder: true
          },
          header: {
            background: "#ffffff",
            showVerticalBorder: false,
            showHorizontalBorder: false
          }
        }
      }
    },
    rowHeaders: {
      checkbox: `
            <label for="all-checkbox" class="mu-checkbox">
                <input type="checkbox" id="all-checkbox" name="_checked" />
                <label for="all-checkbox"></label>
            </label>
        `
    }
  })
};
const mutations = {
}
const getters = {
  GRID: state => {
    return state.grid;
  }
}
const actions = {
}

export default {
  state,
  mutations,
  getters,
  actions
}