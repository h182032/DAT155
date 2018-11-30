import {OBJLoader, MTLLoader, CubicBezierCurve3, Vector3, CurvePath, Group} from "../lib/Three.es.js";
import Utilities from "../lib/Utilities.js";

export default class Balloon extends Group {

    constructor() {
        super();

        this.ballon = new Group();
        this.up = new Vector3(0, 1, 0);
        this.placeInCurve = 0;
        this.line = new CurvePath();
        this.path();
        this.previousAngle = Utilities.getAngle(this.placeInCurve, this.line);
        this.previousPoint = this.line.getPointAt( this.placeInCurve );

        new MTLLoader()
            .load('resources/models/Balloon/Air_Balloon.mtl', (materials) => {
                materials.preload();
                new OBJLoader()
                    .setMaterials(materials)
                    .load('resources/models/Balloon/Air_Balloon.obj', (object) => {


                        object.position.y = 0;
                        object.position.x = 5;
                        object.castShadow = true;

                        object.scale.set(0.15, 0.15, 0.15);


                        this.ballon.add(object);
                        this.add(this.ballon);

                    });

            });
    }


    path() {
        let path1 = new CubicBezierCurve3(
            new Vector3(-40, 25, -50),
            new Vector3(-70, 35, 20),
            new Vector3(-95, 30, 10),
            new Vector3(40, 25, 50)
        );

        let path2 = new CubicBezierCurve3(
            new Vector3(40, 25, 50),
            new Vector3(20, 27, -40),
            new Vector3(5, 30, -50),
            new Vector3(-40, 25, -50)
        );

        this.line.add(path1);
        this.line.add(path2);
    }


    fly() {
        this.placeInCurve += 0.0001;

        let point = this.line.getPointAt(this.placeInCurve);
        if (point === null) {
            this.placeInCurve = 0.0001;
            point = this.line.getPointAt(this.placeInCurve);
        }
        this.ballon.position.x = point.x;
        this.ballon.position.y = point.y;
        this.ballon.position.z = point.z;


        let angle = Utilities.getAngle(this.placeInCurve, this.line);
        this.ballon.quaternion.setFromAxisAngle(this.up, angle);


        this.previousPoint = point;
        this.previousAngle = angle;

    }
}