import {
    PerspectiveCamera,
    WebGLRenderer,
    Scene,
    BoxBufferGeometry,
    MeshBasicMaterial,
    Mesh,
    Color,
    Fog,
    PCFSoftShadowMap
} from './lib/Three.es.js';


import MouseLookController from './controls/MouseLookController.js';
import KeyboardController from './controls/KeyboardControls.js';

import SkyDome from "./terrain/SkyDome.js";
import Balloon from "./terrain/Balloon.js";
import Water from "./terrain/Water.js";
import Terrain from "./terrain/Terrain.js";
import Utilities from "./lib/Utilities.js";
import SunNode from "./terrain/SunNode.js";


let fogColor = new Color(0x808080);
const scene = new Scene();


 scene.fog = new Fog(fogColor, -10, 175);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new WebGLRenderer();
renderer.setClearColor(0xffffff);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;


/**
 * Handle window resize:
 *  - update aspect ratio.
 *  - update projection matrix
 *  - update renderer size
 */
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

/**
 * Add canvas element to DOM.
 */
document.body.appendChild(renderer.domElement);

camera.position.z = 55;
camera.position.y = 15;


/**
 * Set up camera and keyboard controller:
 */

const mouseLookController = new MouseLookController(camera);
const keyboardController = new KeyboardController(camera);

// We attach a click lister to the canvas-element so that we can request a pointer lock.
// https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
const canvas = renderer.domElement;

canvas.addEventListener('click', () => {
    canvas.requestPointerLock();
});

let yaw = 0;
let pitch = 0;
const mouseSensitivity = 0.001;

function updateCamRotation(event) {
    yaw += event.movementX * mouseSensitivity;
    pitch += event.movementY * mouseSensitivity;
}

document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === canvas) {
        canvas.addEventListener('mousemove', updateCamRotation, false);
    } else {
        canvas.removeEventListener('mousemove', updateCamRotation, false);
    }
});


/**
 * Creates a skydome
 */

let skydome = new SkyDome();
scene.add(skydome);

let water = new Water();
scene.add(water);

let balloon = new Balloon();
scene.add(balloon);
// scene.add(Utilities.drawPath(balloon.line));

let terrain = new Terrain();
scene.add(terrain);

let sun = new SunNode();
scene.add(sun);


let then = performance.now();
let start = Date.now();
let deltaTime = 0;

function loop(now) {
    // update controller rotation.
    const delta = now - then;
    then = now;
    deltaTime = Date.now()-start;

    mouseLookController.update(pitch, yaw);
    yaw = 0;
    pitch = 0;

    keyboardController.update(delta);
    sun.rotation.y += 0.004;

    water.flow(deltaTime);

    balloon.fly();
    sun.updateLOD(camera);

    // render scene:
    renderer.render(scene, camera);

    requestAnimationFrame(loop);

}

loop();

