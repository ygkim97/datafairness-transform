// button in column
export default class ButtonColumn {
    constructor(props) {
        const options = props.columnInfo.renderer.options;
        const vueIns = options.vueIns;

        let el = document.createElement('button');
        let iEl = null

        // 버튼 이미지를 아이콘으로 한 경우, 버튼에 아이콘 이미지를 추가해준다.
        if (Object.prototype.hasOwnProperty.call(options, 'iClass')) {
            iEl = document.createElement('i')
            iEl.className = options.iClass;
            el.appendChild(iEl);

            iEl.addEventListener("click", ev => {
                // 자식(tag i) click 이벤트는 중지하고, 부모 이벤트를 발생한다.
                ev.stopPropagation();
                ev.target.parentElement.click();
            });
        } else {
            // 텍스트로 버튼 표시
            el.innerHTML = String(options.btnText)
        }
        el.value = props.grid.getRow(props.rowKey).id;
        
        el.setAttribute('style', "min-width : 5px !important;")

        el.addEventListener('click', (ev) => {
            vueIns.buttonColumnClick(ev.target);
        });

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
        const options = props.columnInfo.renderer.options;

        // row data        
        const row = props.grid.getRow(props.rowKey);

        this.el.setAttribute('idx', props.rowKey);        
        this.el.setAttribute('params', JSON.stringify({
            rowIdx : props.rowKey,
            keyColumnName: options.keyColumnName,
            keyValue: row[options.keyColumnName]
        }));

        this.el.style.display = '';
        this.el.value = String(props.value);
    }
}