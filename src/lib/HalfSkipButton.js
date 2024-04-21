class HalfSkipButton {

    constructor(halfSkipButtonArrowIcon, halfSkipButtonSubArrowIcon) {
        if (!(halfSkipButtonArrowIcon instanceof HalfSkipButtonArrowIcon)) {
            throw new TypeError("halfSkipButtonArrowIcon must be instance of HalfSkipButtonArrowIcon");
        }
        if (!(halfSkipButtonSubArrowIcon instanceof HalfSkipButtonSubArrowIcon)) {
            throw new TypeError("halfSkipButtonSubArrowIcon must be instance of HalfSkipButtonSubArrowIcon");
        }
        this._halfSkipButtonArrowIcon = halfSkipButtonArrowIcon;
        this._halfSkipButtonSubArrowIcon = halfSkipButtonSubArrowIcon;
        this._element = this._buildElement();
    }

    getElement() {
        return this._element;
    }

    getHalfSkipButtonArrowIconElement() {
        return this._halfSkipButtonArrowIcon;
    }

    getHalfSkipButtonSubArrowIconElement() {
        return this._halfSkipButtonSubArrowIcon;
    }

    initListeners() {
        this._element.addEventListener('click', this._halfSkipPage);
    }

    _halfSkipPage() {
        window.scrollTo(0, window.scrollY + window.innerHeight / 2);
    }

    _buildElement() {
        let element = document.createElement('div');
        element.style.width = '30px';
        element.style.height = '30px';
        element.style.border = '1px solid #ccc';
        element.style.borderRadius = '10px';
        element.style.cursor = 'pointer';
        element.style.background = '#f5f5f5';
        element.insertAdjacentElement('beforeend', this._wrapIcon(this._halfSkipButtonSubArrowIcon.getElement(), {lineHeight: '10px'}));
        element.insertAdjacentElement('beforeend', this._wrapIcon(this._halfSkipButtonArrowIcon.getElement(), {lineHeight: '10px'}));
        return element;
    }

    _wrapIcon(element, style) {
        let div = document.createElement('div');
        div.style.textAlign = 'center';
        div.style.lineHeight = style.lineHeight;
        div.insertAdjacentElement('beforeend', element);
        return div;
    }
}