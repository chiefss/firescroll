class Firescroll {

    static get SPEED_STOP() { return 1 };
    static get SPEED_SLOW() { return 2 };
    static get SPEED_SLOW_COEFF() { return 50 };
    static get SPEED_NORMAL() { return 3 };
    static get SPEED_NORMAL_COEFF() { return 50 };
    static get SPEED_FAST() { return 4 };
    static get SPEED_FAST_COEFF() { return 50 };

    static get DOUBLE_CLICK_CHANGE_SPEED_TIMEOUT() { return 2000 };
    static get SLEEP_TIMEOUT() { return 1000 * 60 * 20 };

    constructor(controlPanel) {
        if (!(controlPanel instanceof ControlPanel)) {
            throw new TypeError("controlPanel must be instance of ControlPanel");
        }
        this._firescrollControlPanel = controlPanel;
        this._scrollTimer = null;
        this._sleepTimer = null;
        this._speed = Firescroll.SPEED_STOP;
        this._currentSpeed = Firescroll.SPEED_SLOW;
        this._doubleClickFastSpeedTimeout = null;
        this._stopScrollingBound = this._stopScrolling.bind(this);
    }

    init(element) {
        this._firescrollControlPanel.getContainer().addElementTo(element);
        this._initListeners();
    }

    _initListeners() {
        let that = this;
        this._firescrollControlPanel.getContainer().getControlContainer().getHalfSkipButton().initListeners();
        this._firescrollControlPanel.getContainer().getScrollButton().initListeners(function(e) {
            e.preventDefault();
            if (that._firescrollControlPanel.getContainer().getDraggingState().getState()) {
                that._firescrollControlPanel.getContainer().getDraggingState().setState(false);
                return;
            }
            that._startScrolling();
        });
        window.addEventListener('wheel', this._stopScrollingBound);
        this._firescrollControlPanel.getContainer().initListeners();
    }

    _startScrolling() {
        let that = this;
        if (this._scrollTimer == null) {
            this._initDoubleClickFastSpeedTimeout(that);
            this._startScrollingSpeedSlow(that);
        } else if (this._doubleClickFastSpeedTimeout !== null) {
            if (this._currentSpeed === Firescroll.SPEED_SLOW) {
                this._startScrollingSpeedNormal(that);
            } else if (this._currentSpeed === Firescroll.SPEED_NORMAL) {
                this._startScrollingSpeedFast(that);
            } else if (this._currentSpeed === Firescroll.SPEED_FAST) {
                this._stopScrolling();
            }
        } else {
            this._stopScrolling();
        }
    }

    _stopScrolling() {
        this._clearSleepTimer();
        this._clearScrollTimer();
        this._currentSpeed = Firescroll.SPEED_STOP;
        this._firescrollControlPanel.setState(new ControlPanelStateDisable());
    }

    _startScrollingSpeedSlow(that) {
        browser.storage.local.get(Constant.FIRESCROLL_SLOW_SPEED_VALUE_OPTION_NAME).then(res => {
            this._speed = Constant.SPEED_VALUE + (res.firescrollSlowSpeedValue || Constant.SPEED_SLOW_VALUE);
        }).catch(error => {
            this._speed = Constant.SPEED_VALUE + Constant.SPEED_SLOW_VALUE;
        });
        this._firescrollControlPanel.setState(new ControlPanelStateActive());
        this._clearScrollTimer();
        this._scrollTimer = setInterval(function () {
            that._scrollWindow()
        }, Firescroll.SPEED_SLOW_COEFF);
        this._currentSpeed = Firescroll.SPEED_SLOW;
        this._clearSleepTimer();
        this._initSleepTimer(that);
    }

    _startScrollingSpeedNormal(that) {
        browser.storage.local.get(Constant.FIRESCROLL_NORMAL_SPEED_VALUE_OPTION_NAME).then(res => {
            this._speed = Constant.SPEED_VALUE + (res.firescrollNormalSpeedValue || Constant.SPEED_NORMAL_VALUE);
        }).catch(error => {
            this._speed = Constant.SPEED_VALUE + Constant.SPEED_NORMAL_VALUE;
        });
        this._firescrollControlPanel.setState(new ControlPanelStateNormal());
        this._clearScrollTimer();
        this._scrollTimer = setInterval(function () {
            that._scrollWindow()
        }, Firescroll.SPEED_NORMAL_COEFF);
        this._currentSpeed = Firescroll.SPEED_NORMAL;
        this._clearSleepTimer();
        this._initSleepTimer(that);
    }

    _startScrollingSpeedFast(that) {
        browser.storage.local.get(Constant.FIRESCROLL_FAST_SPEED_VALUE_OPTION_NAME).then(res => {
            this._speed = Constant.SPEED_VALUE + (res.firescrollFastSpeedValue || Constant.SPEED_FAST_VALUE);
        }).catch(error => {
            this._speed = Constant.SPEED_VALUE + Constant.SPEED_FAST_VALUE;
        });
        this._firescrollControlPanel.setState(new ControlPanelStateFast());
        this._clearScrollTimer();
        this._scrollTimer = setInterval(function () {
            that._scrollWindow()
        }, Firescroll.SPEED_FAST_COEFF);
        this._currentSpeed = Firescroll.SPEED_FAST;
        this._clearSleepTimer();
        this._initSleepTimer(that);
    }

    _scrollWindow() {
        window.scroll({
            top: parseFloat(window.scrollY) + parseFloat(this._speed),
            behavior: 'smooth'
        });
    }

    _initDoubleClickFastSpeedTimeout(that) {
        this._doubleClickFastSpeedTimeout = setTimeout(function () {
            that._clearDoubleClickFastSpeedTimeout();
        }, Firescroll.DOUBLE_CLICK_CHANGE_SPEED_TIMEOUT);
    }

    _clearDoubleClickFastSpeedTimeout () {
        clearTimeout(this._doubleClickFastSpeedTimeout);
        this._doubleClickFastSpeedTimeout = null;
    }

    _clearScrollTimer() {
        clearInterval(this._scrollTimer);
        this._scrollTimer = null;
    }

    _clearSleepTimer() {
        clearTimeout(this._sleepTimer);
        this._sleepTimer = null;
    }

    _initSleepTimer(that) {
        this._sleepTimer = setTimeout(function () {
            that._stopScrolling();
        }, Firescroll.SLEEP_TIMEOUT);
    }
}