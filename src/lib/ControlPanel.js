class ControlPanel {

    constructor(container, state) {
        if (!(container instanceof Container)) {
            throw new TypeError("container must be instance of Container");
        }
        if (!(state instanceof ControlPanelState)) {
            throw new TypeError("state must be instance of ControlPanelState");
        }
        this._container = container;
        this.setState(state);
    }

    getContainer() {
        return this._container;
    }

    setState(state) {
        if (!(state instanceof ControlPanelState)) {
            throw new TypeError("state must be instance of ControlPanelState");
        }
        this._state = state;
        this._state.init(this);
    }
}