
export default class CollisionObject {

    constructor(mesh) {

        this.mesh = mesh;

        this._onIntersect = null;

        this._destroy = false;

        this._dynamic = false;

    }

    setOnIntersectListener(listener) {
        this._onIntersect = listener.bind(this);
    }

    destroy() {
        this._destroy = true;
    }

    dynamic() {
        this._dynamic = true;
    }
}