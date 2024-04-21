class ScrollButtonArrowIcon {

    static get DISPLAY_STATE_DISABLE() { return 0 };
    static get DISPLAY_STATE_ACTIVE() { return 1 };
    static get DISPLAY_STATE_ACTIVE_AGGRESSIVE() { return 2 };

    constructor() {
        this._element = this._buildElement();
    }

    setDisplayState(displayState) {
        if (displayState === ScrollButtonArrowIcon.DISPLAY_STATE_DISABLE) {
            this._element.style.borderColor = "#aaa";
        } else if (displayState === ScrollButtonArrowIcon.DISPLAY_STATE_ACTIVE) {
            this._element.style.borderColor = "#ff9b0e";
        } else if (displayState === ScrollButtonArrowIcon.DISPLAY_STATE_ACTIVE_AGGRESSIVE) {
            this._element.style.borderColor = "#c90000";
        }
    }

    getElement() {
        return this._element;
    }

    _buildElement() {
        let element = document.createElement('span');
        element.style.border = 'solid #aaa';
        element.style.borderWidth = '0 6px 6px 0';
        element.style.display = 'inline-block';
        element.style.padding = '8px';
        element.style.transform = 'rotate(45deg)';
        return element;
    }
}