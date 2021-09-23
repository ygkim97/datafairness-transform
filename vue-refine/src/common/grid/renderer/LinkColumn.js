// button in column
export default class LinkColumn {
    constructor(props) {
        // row data
        const row = props.grid.getRow(props.rowKey)
        let el = document.createElement('span');

        el.setAttribute('rowSate', row.state)

        this.el = el;
        this.render(props);
    }
    getElement() {
        return this.el;
    }
    getValue() {
        return this.el.value;
    }
    render(props) {
        const row = props.grid.getRow(props.rowKey)
        const options = props.columnInfo.renderer.options;
        const vueIns = options.vueIns;

        if (this.el.firstChild != undefined) {
            // 기존이 생성한 element를 지운다.
            this.el.removeChild(this.el.firstChild);
        }

        let subEl = document.createElement('a');
        subEl.setAttribute('style', "text-decoration : underline; cursor: pointer;")
        subEl.value = String(props.value);
        subEl.text = String(row[options.textColumnName])
        
        subEl.setAttribute('params', JSON.stringify(row))
        // 그리고 다시 append 한다.
        this.el.appendChild(subEl);
        subEl.addEventListener('click', (ev) => {
            const _p = JSON.parse(ev.target.getAttribute('params'));
            vueIns.linkColumnClick(_p);
        });
    }
}