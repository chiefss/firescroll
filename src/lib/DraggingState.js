class DraggingState {

    constructor() {
        this._state = false;
    }

    getState() {
        return this._state;
    }

    setState(state) {
        this._state = state;
    }
}