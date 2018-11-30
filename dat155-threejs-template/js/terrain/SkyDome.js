import {Mesh, MeshPhongMaterial, SphereBufferGeometry, TextureLoader, Object3D} from "../lib/Three.es.js";


export default class SkyDome extends Object3D{
    constructor() {
        super();
        let loader = new TextureLoader();
        let skyGeometry = new SphereBufferGeometry(100, 32, 16, Math.PI / 2, Math.PI * 2, 0, 0.5 * Math.PI);
        let skyTexture = loader.load("resources/skydome/skyTexture.jpg");


        let skyMaterial = new MeshPhongMaterial({
            map: skyTexture,
            opacity: 5.0,
            side: 2

        });

        let sky = new Mesh(skyGeometry, skyMaterial);


        this.add(sky);
    }
}