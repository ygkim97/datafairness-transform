// button in column
export default class CheckboxColumn {
    constructor(props) {
        const { grid, rowKey } = props;

        const label = document.createElement('label');
        label.className = 'checkbox';
        label.setAttribute('for', String(rowKey));

        const hiddenInput = document.createElement('input');
        hiddenInput.className = 'hidden-input';
        hiddenInput.id = String(rowKey);

        const customInput = document.createElement('span');
        customInput.className = 'custom-input';

        label.appendChild(hiddenInput);
        label.appendChild(customInput);

        hiddenInput.type = 'checkbox';
        hiddenInput.addEventListener('change', () => {
            if (hiddenInput.checked) {
                grid.check(rowKey);
            } else {
                grid.uncheck(rowKey);
            }
        });

        this.el = label;
        this.render(props);
    }

    getElement() {
        return this.el;
    }

    render(props) {
        const hiddenInput = this.el.querySelector('.hidden-input');
        hiddenInput.checked = Boolean(props.value);
    }
}