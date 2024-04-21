class HalfSkipButtonSubArrowIcon {

    constructor() {
        this._element = this._buildElement();
    }

    getElement() {
        return this._element;
    }

    _buildElement() {
        let element = document.createElement('span');
        element.style.border = 'solid #aaa';
        element.style.borderWidth = '0 2px 2px 0';
        element.style.display = 'inline-block';
        element.style.padding = '2px';
        element.style.transform = 'rotate(45deg)';
        return element;
    }
}