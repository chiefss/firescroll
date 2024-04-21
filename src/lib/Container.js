class Container {

    constructor(scrollButton, controlContainer, draggingState) {
        if (!(scrollButton instanceof ScrollButton)) {
            throw new TypeError("scrollButton must be instance of ScrollButton");
        }
        if (!(controlContainer instanceof ControlContainer)) {
            throw new TypeError("controlContainer must be instance of ControlContainer");
        }
        if (!(draggingState instanceof DraggingState)) {
            throw new TypeError("draggingState must be instance of DraggingState");
        }
        this._scrollButton = scrollButton;
        this._controlContainer = controlContainer;
        this._draggingState = draggingState;
        this._element = this._buildElement();
        this._mouseOffsetX;
        this._mouseOffsetY;
        this._mouseMoveHandlerBound = this._mouseMoveHandler.bind(this)
        this._mouseUpHandlerBound = this._mouseUpHandler.bind(this)
        this._touchMoveHandlerBound = this._touchMoveHandler.bind(this)
        this._touchEndHandlerBound = this._touchEndHandler.bind(this)
        this._dragEventListenerBound = this._dragEventListener.bind(this)
    }

    getElement() {
        return this._element;
    }

    getScrollButton() {
        return this._scrollButton;
    }

    getControlContainer() {
        return this._controlContainer;
    }

    getDraggingState() {
        return this._draggingState;
    }

    addElementTo(element) {
        element.insertAdjacentElement('beforeend', this._element);
    }

    initListeners() {
        this._element.addEventListener('mousedown', this._dragEventListenerBound);
        this._element.addEventListener('touchstart', this._dragEventListenerBound);
    }

    _dragEventListener(e) {
        // Если это событие touch, используем первое касание
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let clientY = e.touches ? e.touches[0].clientY : e.clientY;

        // Вычисляем смещение курсора относительно верхнего левого угла элемента
        this._mouseOffsetX = clientX - this._element.getBoundingClientRect().right;
        this._mouseOffsetY = clientY - this._element.getBoundingClientRect().bottom;

        // Добавляем обработчики событий для перемещения и отпускания мыши/касания
        document.addEventListener('mousemove', this._mouseMoveHandlerBound);
        document.addEventListener('mouseup', this._mouseUpHandlerBound);
        document.addEventListener('touchmove', this._touchMoveHandlerBound);
        document.addEventListener('touchend', this._touchEndHandlerBound);
    }

    _mouseMoveHandler(e) {
        this._draggingState.setState(true);
        this._moveElement(e.clientX, e.clientY);
    }

    _touchMoveHandler(e) {
        e.preventDefault();
        this._draggingState.setState(true);
        this._moveElement(e.touches[0].clientX, e.touches[0].clientY);
    }

    _moveElement(clientX, clientY) {
        this._element.style.right = `${document.documentElement.clientWidth - clientX + this._mouseOffsetX}px`;
        this._element.style.bottom = `${document.documentElement.clientHeight - clientY + this._mouseOffsetY}px`;
    }

    _mouseUpHandler() {
        this._removeEventListeners();
    }

    _touchEndHandler() {
        this._removeEventListeners();
        this._draggingState.setState(false);
    }

    _removeEventListeners() {
        document.removeEventListener('mousemove', this._mouseMoveHandlerBound);
        document.removeEventListener('mouseup', this._mouseUpHandlerBound);
        document.removeEventListener('touchmove', this._touchMoveHandlerBound);
        document.removeEventListener('touchend', this._touchEndHandlerBound);
    }

    _buildElement() {
        let element = document.createElement('div');
        let subElement = document.createElement('div');
        element.style.position = 'fixed';
        element.style.zIndex = '10000';
        element.style.right = '15px';
        element.style.bottom = '15px';
        element.style.touchAction = 'none';
        subElement.style.display = 'flex';
        subElement.style.alignItems = 'center';
        subElement.insertAdjacentElement('beforeend', this._controlContainer.getElement());
        subElement.insertAdjacentElement('beforeend', this._scrollButton.getElement());
        element.insertAdjacentElement('beforeend', subElement);
        return element;
    }
}