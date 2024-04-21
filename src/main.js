let halfSkipButtonArrowIcon = new HalfSkipButtonArrowIcon();
let halfSkipButtonSubArrowIcon = new HalfSkipButtonSubArrowIcon();
let halfSkipButton = new HalfSkipButton(halfSkipButtonArrowIcon, halfSkipButtonSubArrowIcon);
let scrollButtonArrowIcon = new ScrollButtonArrowIcon();
let scrollButton = new ScrollButton(scrollButtonArrowIcon);
let controlContainer = new ControlContainer(halfSkipButton);
let container = new Container(scrollButton, controlContainer, new DraggingState());
let controlPanel = new ControlPanel(container, new ControlPanelStateDisable());
let firescroll = new Firescroll(controlPanel);

firescroll.init(document.querySelector(Constant.APPEND_TO_ELEMENT_CSS_SELECTOR));