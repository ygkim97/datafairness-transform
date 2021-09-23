import CheckboxRenderer from '@/common/grid/renderer/CheckboxColumn.js'
import DraggableRenderer from '@/common/grid/renderer/DraggableRenderer.js'

import ButtonColumn from '@/common/grid/renderer/ButtonColumn.js'

const state = {
  grid: Object.freeze({
    minHeight: 100,
    minBodyHeight: 50,
    rowHeight: 50,
    theme: {
      name: "myTheme",
      value: {
        area: {
          border: 'red'
        },
        row: {
          border: 'yellow'
        },
        selection: {
          border: 'blue'
        },
        frozenBorder: {
          border: 'green'
        },
        outline: {
          showVerticalBorder: false,
          border: '#b6b6b6'
        },
        cell: {
          normal: {
            background: "#ffffff",
            showVerticalBorder: true,
            showHorizontalBorder: true
          },
          header: {
            background: "#fcfcfc",
            showVerticalBorder: true,
            showHorizontalBorder: false
          }
        }
      }
    },
    rowHeaders: {
      checkbox: {
        template : `<input type="checkbox" name="_checked" />`
      }      
    },    
    renderer: {
      buttonColumn: ButtonColumn,
      checkboxRenderer: CheckboxRenderer,
      draggableRenderer: DraggableRenderer
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