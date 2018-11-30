import {Mesh, MTLLoader, OBJLoader, Object3D} from "../lib/Three.es.js";
import Utilities from "../lib/Utilities.js";




export default class Tree extends Object3D{

    constructor(terrainGeometry) {
        super();
        new MTLLoader()
            .load('resources/models/lowPolyTree/Tree2.mtl', (materials) => {
                materials.preload();
                new OBJLoader()
                    .setMaterials(materials)
                    .load('resources/models/lowPolyTree/Tree2.obj', (object) => {

                        object.traverse((node) => {
                            if (node instanceof Mesh) {
                                node.castShadow = true;
                                node.receiveShadow = true;
                            }

                        });

                        const trees = Utilities.cloneObjects(object, 40);
                        for (let i = 0; i < trees.length; i++) {
                            trees[i].position.xyz = Utilities.randomXAndZCord(trees[i].position, terrainGeometry);
                            trees[i].position.x -=50;
                            trees[i].position.z -=50;
                            trees[i].scale.set(0.4, 0.4, 0.4);
                            this.add( trees[i] );
                        }

                        this.add(object);

                    });

            });
    }
}

