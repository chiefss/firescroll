class ControlPanelStateActive extends ControlPanelState {

    init(context) {
        context.getContainer().getControlContainer().setDisplayState(ControlContainer.DISPLAY_STATE_ACTIVE);
        context.getContainer().getScrollButton().setDisplayState(ScrollButton.DISPLAY_STATE_ACTIVE);
        context.getContainer().getScrollButton().getScrollButtonArrowIconElement().setDisplayState(ScrollButtonArrowIcon.DISPLAY_STATE_DISABLE);
    }
}