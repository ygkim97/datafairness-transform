class DraggableRenderer {
    constructor(props) {
        const el = document.createElement('span');
        el.innerHTML = 'TEMP';
        el.style.cursor = 'pointer'
        this.el = el;
    }

    getElement() {
        return this.el;
    }
    getValue() {
        return this.el.value;
    }

    render(props) {
        this.el.innerHTML = 'TEMP';
        this.el.value = String(props.value);
    }
}