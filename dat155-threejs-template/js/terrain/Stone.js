import {TextureLoader, Object3D, SpriteMaterial, Sprite} from "../lib/Three.es.js";
import Utilities from "../lib/Utilities.js";




export default class Stone extends Sprite{

    constructor(terrainGeometry) {
        super();

        let spriteMap = new TextureLoader().load("resources/images/stone.png");
        let spriteMaterial = new SpriteMaterial({
            map: spriteMap,
            color: 0xffffff,
            fog: true,

            transparent: true

        });

        let sprite = new Sprite(spriteMaterial);

        let stones = Utilities.cloneObjects(sprite, 100);

        for (let i = 0; i < stones.length; i++) {
            stones[i].position.xyz = Utilities.randomXAndZCord(stones[i].position, terrainGeometry);
            stones[i].position.y += 0.5;
            this.add(stones[i]);
        }

        this.position.x -= 50;
        this.position.z -= 50;

    }
}