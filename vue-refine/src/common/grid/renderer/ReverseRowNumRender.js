// reverse row Num
export default class ReverseRowNumRender {
    constructor(props) {
        let el = document.createElement('span');
        this.el = el
        this.render(props);
    }

    getElement() {
        return this.el;
    }

    getValue() {
        return this.el.value;
    }

    render(props) {
        const { grid, rowKey } = props;
        let str = grid.getData().length - rowKey;
        this.el.innerText = str
    }
}


