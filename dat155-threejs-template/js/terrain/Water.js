import {Vector2, Mesh, MeshPhongMaterial, CircleBufferGeometry, Object3D, TextureLoader} from "../lib/Three.es.js";



export default class Water extends Object3D {
    constructor (){
        super();
        let loader = new TextureLoader();
        let waterGeometry = new CircleBufferGeometry(100, 50);
        let normalMap = loader.load("resources/images/normalMap.png");
        let waterTexture = loader.load("resources/images/waterTexture.jpg");

        let waterMaterial = new MeshPhongMaterial({
            // map: waterTexture,
            color: 0x5e807f,
            // emissive: 0x5e807f,
            emissiveIntensity: 0.8,
            normalMap: normalMap,
            normalScale: new Vector2(1.0, 1.0),
            shininess: 0.5,
            side: 2,
            receiveShadow: true,
            lights: true,
            skinning: true,
            reflectivity: 0.2,

        });

        this.water = new Mesh(waterGeometry, waterMaterial);
        this.water.rotation.x = Math.PI * -0.5;
        this.add(this.water);

    }

    flow(deltaTime) {
        this.water.position.y = Math.sin(deltaTime/4000) + 2;
        this.water.position.z = Math.sin(deltaTime/2000);
        this.water.material.normalScale.set(Math.sin(deltaTime/800), 1.0);
    }



}