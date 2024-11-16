class ContainerPositionDto {

    static build(firescrollContainerPositionElement) {
        return new ContainerPositionDto(firescrollContainerPositionElement._right, firescrollContainerPositionElement._bottom);
    }

    constructor(right, bottom) {
        this._right = right;
        this._bottom = bottom;
    }

    getRight() {
        return this._right;
    }

    getBottom() {
        return this._bottom;
    }
}