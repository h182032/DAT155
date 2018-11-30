import {Mesh, MeshPhongMaterial, TextureLoader, Object3D} from "../lib/Three.es.js";
import Utilities from "../lib/Utilities.js";
import TerrainBufferGeometry from "./TerrainBufferGeometry.js";
import Tree from "./Tree.js";
import Stone from "./Stone.js";

export default class Terrain extends Object3D {

    constructor() {
        super();
        Utilities.loadImage('resources/images/heightmap2.png').then((heightmapImage) => {

            const terrainGeometry = new TerrainBufferGeometry({
                heightmapImage,
                numberOfSubdivisions: 128
            });

            const terrainMaterial = new MeshPhongMaterial({
                map: new TextureLoader().load("resources/images/terrain.jpg"),
                clipShadows: true
            });

            const terrain = new Mesh(terrainGeometry, terrainMaterial);

            terrain.traverse ( function (node) {
                if (node instanceof Mesh ){
                    node.castShadow = true ;
                    node.receiveShadow = true ;
                }
            });

            this.add(terrain);
            let tree = new Tree(terrainGeometry);
            this.add(tree);
            let stone = new Stone(terrainGeometry);
            this.add(stone);
        });

    }


}