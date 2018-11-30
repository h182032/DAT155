import {Object3D} from "../lib/Three.es.js";
import Sun from "./Sun.js";

export default class SunNode extends Object3D {

    constructor() {
        super();

        this.sun = new Sun();
        this.rotation.x += Math.PI/180;
        this.add(this.sun);
    }

    updateLOD(camera) {
        this.sun.update(camera);
    }

}