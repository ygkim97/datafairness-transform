// button in column
export default class ButtonColumn {
    constructor(props) {
        const options = props.columnInfo.renderer.options;
        const vueIns = options.vueIns;
        
        let pEl = document.createElement('div')

        // options에서 설정한 btnCnt 만큼 버튼을 한 Column안에 생성한다.
        // btnCnt와 btnText의 length가 일치해야 한다. 
        for (var i = 0; i < options.btnCnt; i++) {
            let el = document.createElement('button');
            let iEl = null
    
            if (Object.prototype.hasOwnProperty.call(hasOwnProperty, 'iClass')) {
                 iEl = document.createElement('i')
                iEl.className = options.iClass;
                el.appendChild(iEl);
                
                iEl.addEventListener("click", ev => {
                    // 자식(tag i) click 이벤트는 중지하고, 부모 이벤트를 발생한다.
                    ev.stopPropagation();
                    ev.target.parentElement.click();
                });
            } else {
                el.innerHTML = String(options.btnText[i])
            }
            el.value = props.grid.getRow(props.rowKey).id;
            // el.className = "v-btn v-btn--contained theme--light v-size--small"
            if (options.params.muBtnUse !== false) {
                el.className = "mu-btn "
            }
            el.className += options.btnClass;
            el.setAttribute('style', "min-width : 20px !important;")
            
            el.setAttribute('params', JSON.stringify(options.params));
            
            const btnId = i;
            el.addEventListener('click', (ev) => {
                // 정보는 parentNode인 div가 가지고 있기 때문에, parentElement를 전달한다.
                vueIns.buttonColumnClick(ev.target.parentElement, btnId);
            });

            pEl.appendChild(el)
        }
        this.el = pEl;
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
        let disabledNo = -1;
        if (row.total == '_RUNNING') {
            // 상태가 '실행중' 이라면, 0번이 disabled
            disabledNo = 0
        } else {
            // 상태가 '중지' 이라면, 1번이 disabled
            disabledNo = 1
        }
        for (var i = 0; i < this.el.children.length; i++) {
            if (i == disabledNo) {
                this.el.children[i].setAttribute('disabled', true)
            } else {
                this.el.children[i].removeAttribute('disabled')
            }
        }
        // if (disabledNo > -1) {
        //     this.el.children[disabledNo].setAttribute('disabled', true)
        // }

        this.el.setAttribute('idx', props.rowKey);
        this.el.setAttribute('row', JSON.stringify(props.grid.getRow(props.rowKey)))

        this.el.value = String(props.value);
    }
}