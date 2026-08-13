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
        this._isInitialized = false;
        this._appendToElement = null;
        this._listenersInitialized = false;
        this._isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        this._contextMenuElement = null;
        this._suppressNextClick = false;
        this._initMessageListener();
    }

    init(element) {
        this._appendToElement = element;
        if (this._isInitialized) {
            return;
        }
        browser.storage.local.get(Constant.FIRESCROLL_EXCLUDED_DOMAINS_OPTION_NAME).then(result => {
            let excludedDomains = result.firescrollExcludedDomains || [];
            let currentDomain = window.location.hostname.trim().toLowerCase();
            if (excludedDomains.indexOf(currentDomain) === -1) {
                this._initElement();
            }
        });
    }

    hide() {
        if (!this._isInitialized) {
            return;
        }
        this._isInitialized = false;
        this._hideContextMenu();
        this._firescrollControlPanel.getContainer().getElement().remove();
    }

    isInitialized() {
        return this._isInitialized;
    }

    _initMessageListener() {
        browser.runtime.onMessage.addListener(message => {
            if (message.type === 'FIRESCROLL_HIDE') {
                this.hide();
            } else if (message.type === 'FIRESCROLL_SHOW') {
                this.init(this._appendToElement);
            }
        });
    }

    _initElement() {
        if (this._isInitialized) {
            return;
        }
        this._isInitialized = true;
        this._firescrollControlPanel.getContainer().addElementTo(this._appendToElement);
        this._initListeners();
    }

    _initListeners() {
        if (this._listenersInitialized) {
            return;
        }
        this._listenersInitialized = true;
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
        document.addEventListener('fullscreenchange', function() {
          if (document.fullscreenElement == null) {
            that._firescrollControlPanel.getContainer().showElement();
          } else {
            that._firescrollControlPanel.getContainer().hideElement();
          }
        });
        this._initContextMenu();
    }

    _initContextMenu() {
        let that = this;
        let element = this._firescrollControlPanel.getContainer().getElement();

        element.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            if (!that._isTouchDevice) {
                that._hideContextMenu();
                that._showContextMenu(e.clientX, e.clientY);
            }
        });

        element.addEventListener('click', function(e) {
            if (that._suppressNextClick) {
                e.preventDefault();
                e.stopPropagation();
                that._suppressNextClick = false;
            }
        }, true);

        document.addEventListener('click', function(e) {
            if (that._contextMenuElement != null && !that._contextMenuElement.contains(e.target)) {
                that._hideContextMenu();
            }
        }, true);

        if (this._isTouchDevice) {
            let longPressTimer = null;
            element.addEventListener('touchstart', function(e) {
                that._hideContextMenu();
                that._suppressNextClick = false;
                clearTimeout(longPressTimer);
                let touch = e.changedTouches[0];
                let x = touch.clientX;
                let y = touch.clientY;
                longPressTimer = setTimeout(function() {
                    that._suppressNextClick = true;
                    that._showContextMenu(x, y);
                }, Constant.LONG_PRESS_TIMEOUT);
            });
            element.addEventListener('touchmove', function() {
                clearTimeout(longPressTimer);
            });
            element.addEventListener('touchend', function() {
                clearTimeout(longPressTimer);
            });
        }
    }

    _showContextMenu(x, y) {
        this._hideContextMenu();
        let menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.zIndex = '10001';
        menu.style.background = '#F8F8F8FF';
        menu.style.border = '1px solid #ccc';
        menu.style.borderRadius = '8px';
        menu.style.padding = '4px';
        menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        let button = document.createElement('div');
        button.textContent = 'Hide on current domain';
        button.style.padding = '8px 12px';
        button.style.fontSize = '13px';
        button.style.color = '#333';
        button.style.cursor = 'pointer';
        button.style.userSelect = 'none';
        button.style.whiteSpace = 'nowrap';
        menu.insertAdjacentElement('beforeend', button);
        document.body.insertAdjacentElement('beforeend', menu);
        let rect = menu.getBoundingClientRect();
        menu.style.left = Math.max(0, Math.min(x, window.innerWidth - rect.width - 2)) + 'px';
        menu.style.top = Math.max(0, Math.min(y, window.innerHeight - rect.height - 2)) + 'px';
        this._contextMenuElement = menu;
        let that = this;
        button.addEventListener('click', function() {
            that._hideElementOnCurrentDomain();
        });
    }

    _hideContextMenu() {
        if (this._contextMenuElement != null) {
            this._contextMenuElement.remove();
            this._contextMenuElement = null;
        }
    }

    _hideElementOnCurrentDomain() {
        this._hideContextMenu();
        let currentDomain = window.location.hostname.trim().toLowerCase();
        browser.storage.local.get(Constant.FIRESCROLL_EXCLUDED_DOMAINS_OPTION_NAME).then(result => {
            let excludedDomains = result.firescrollExcludedDomains || [];
            if (excludedDomains.indexOf(currentDomain) === -1) {
                excludedDomains.push(currentDomain);
                browser.storage.local.set({ firescrollExcludedDomains: excludedDomains });
            }
            this.hide();
        });
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