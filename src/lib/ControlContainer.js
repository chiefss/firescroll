class ControlContainer {

    static get DISPLAY_STATE_DISABLE() { return 0 };
    static get DISPLAY_STATE_ACTIVE() { return 1 };

    constructor(halfSkipButton) {
        if (!(halfSkipButton instanceof HalfSkipButton)) {
            throw new TypeError("halfSkipButton must be instance of HalfSkipButton");
        }
        this._halfSkipButton = halfSkipButton;
        this._element = this._buildElement();
    }

    setDisplayState(displayState) {
        if (displayState === ControlContainer.DISPLAY_STATE_DISABLE) {
            this._element.style.display = 'none';
        } else if (displayState === ControlContainer.DISPLAY_STATE_ACTIVE) {
            this._element.style.display = 'flex';
        }
    }

    getElement() {
        return this._element;
    }

    getHalfSkipButton() {
        return this._halfSkipButton;
    }

    _buildElement() {
        let element = document.createElement('div');
        element.style.display = 'none';
        element.style.alignItems = 'center';
        element.style.border = '1px solid #ccc';
        element.style.borderRadius = '10px';
        element.style.height = '40px';
        element.style.marginRight = '-20px';
        element.style.paddingLeft = '5px';
        element.style.paddingRight = '40px';
        element.style.background = '#F8F8F8FF';
        element.insertAdjacentElement('beforeend', this._halfSkipButton.getElement());
        return element;
    }
}