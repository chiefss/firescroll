class ScrollButton {

    static get DISPLAY_STATE_DISABLE() { return 0 };
    static get DISPLAY_STATE_ACTIVE() { return 1 };

    constructor(scrollButtonArrowIcon) {
        if (!(scrollButtonArrowIcon instanceof ScrollButtonArrowIcon)) {
            throw new TypeError("scrollButtonArrowIcon must be instance of ScrollButtonArrowIcon");
        }
        this._scrollButtonArrowIcon = scrollButtonArrowIcon;
        this._element = this._buildElement();
    }

    setDisplayState(displayState) {
        if (displayState === ScrollButton.DISPLAY_STATE_ACTIVE) {
            this._element.style.background = "#41dc00"
        } else {
            this._element.style.background = "#eee"
        }
    }

    getElement() {
        return this._element;
    }

    getScrollButtonArrowIconElement() {
        return this._scrollButtonArrowIcon;
    }

    initListeners(callback) {
        if (!(callback instanceof Function)) {
            throw new TypeError("callback must be instance of Function");
        }
        this._element.addEventListener('click', callback);
    }

    _buildElement() {
        let element = document.createElement('div');
        element.style.width = '48px';
        element.style.height = '48px';
        element.style.border = '1px solid #ccc';
        element.style.borderRadius = '10px';
        element.style.cursor = 'pointer';
        element.style.background = '#eee';
        element.insertAdjacentElement('beforeend', this._wrapIcon(this._scrollButtonArrowIcon.getElement(), {lineHeight: '48px'}));
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