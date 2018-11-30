import {LOD, TextureLoader, MeshBasicMaterial, PointLight, IcosahedronBufferGeometry, Mesh} from "../lib/Three.es.js";


export default class Sun extends LOD {

    constructor() {
        super();

        const texture = new TextureLoader().load('./resources/images/sunTexture.jpg');

        const material = new MeshBasicMaterial({
            map: texture,
            fog: false,
            wireframe: true
        });




        for( let i = 0; i < 3; i++ ) {

            let geometry = new IcosahedronBufferGeometry( 5, 3 - i );
            this.addLevel( new Mesh(geometry, material), (i * 30));

        }


        this.position.y = 80;
        this.position.x = 42;
        let light = new PointLight(0xFFFFFF, 1.0, 1500.0,);
        light.castShadow = true;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;

        this.add(light);


    }

}
