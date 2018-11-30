"use strict";


var canvas, gl, program;

var NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)

var points = [];
var colors = [];

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5, -0.5, -0.5, 1.0 )
];

// RGBA colors
var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];


// Parameters controlling the size of the Robot's arm

var BASE_HEIGHT             = 2.0;
var BASE_WIDTH              = 5.0;
var LOWER_ARM_HEIGHT        = 5.0;
var LOWER_ARM_WIDTH         = 0.5;
var UPPER_ARM_HEIGHT        = 5.0;
var UPPER_ARM_WIDTH         = 0.5;
let LOWER_FINGER_WIDTH      = 0.2;
let LOWER_FINGER_HEIGHT     = 1.0;
let UPPER_FINGER_WIDTH      = 0.2;
let UPPER_FINGER_HEIGHT     = 1.0;



// Shader transformation matrices

var modelViewMatrix, projectionMatrix;

// Array of rotation angles (in degrees) for each rotation axis

var Base = 0;
var LowerArm = 1;
var UpperArm = 2;
let LowerFinger = 3;
let UpperFinger = 4;
let Claw_joint = 5;


var theta= [ 0, 0, 0, 0, 0, 0];

var angle = 0;

var modelViewMatrixLoc;

var vCubeBuffer, cCubeBuffer;
    // vSphereBuffer, cSphereBuffer;
// let mySphere = sphere();
// mySphere.scale(0.6, 0.6, 0.6);
// mySphere.rotate(45.0, [ 1, 1, 1]);
// mySphere.translate(-0.1, -0.1, 0.0);

//----------------------------------------------------------------------------

function quad(  a,  b,  c,  d ) {
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[b]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[d]);
}


function colorCube() {
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


//--------------------------------------------------


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable( gl.DEPTH_TEST );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );

    gl.useProgram( program );

    colorCube();

    // Load shaders and use the resulting shader program

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create and initialize  buffer objects

    vCubeBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vCubeBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );

    cCubeBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cCubeBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var colorLoc = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( colorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorLoc );

    // cSphereBuffer = gl.createBuffer();
    // gl.bindBuffer( gl.ARRAY_BUFFER, cSphereBuffer );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    //
    // vSphereBuffer = gl.createBuffer();
    // gl.bindBuffer( gl.ARRAY_BUFFER, vSphereBuffer );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );



    document.getElementById("slider1").addEventListener('input', function(event) {
        theta[0] = event.target.value;
    });
    document.getElementById("slider2").addEventListener('input', function(event) {
         theta[1] = event.target.value;
    });
    document.getElementById("slider3").addEventListener('input', function(event) {
         theta[2] =  event.target.value;
    });

    document.getElementById("slider4").addEventListener('input', function(event) {
        theta[3] = event.target.value;
    });

    document.getElementById("slider5").addEventListener('input', function(event) {
        theta[4] = event.target.value;
    });

    document.getElementById("slider6").addEventListener('input', event => {
        theta[5] = event.target.value;
    });

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    projectionMatrix = ortho(-20, 20, -20, 20, -20, 20);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );

    render();
};

//----------------------------------------------------------------------------


function base() {
    var s = scale(BASE_WIDTH, BASE_HEIGHT, BASE_WIDTH);
    //console.log("s", s);
    var instanceMatrix = mult( translate( 0.0, 0.5 * BASE_HEIGHT, 0.0 ), s);
    //var instanceMatrix = mult(s,  translate( 0.0, 0.5 * BASE_HEIGHT, 0.0 ));

    //console.log("instanceMatrix", instanceMatrix);

    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t)  );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    //console.log("base", t);
}

//----------------------------------------------------------------------------


function upperArm() {
    var s = scale(UPPER_ARM_WIDTH, UPPER_ARM_HEIGHT, UPPER_ARM_WIDTH);
    //console.log("s", s);

    var instanceMatrix = mult(translate( 0.0, 0.5 * UPPER_ARM_HEIGHT, 0.0 ),s);
    //var instanceMatrix = mult(s, translate(  0.0, 0.5 * UPPER_ARM_HEIGHT, 0.0 ));

    //console.log("instanceMatrix", instanceMatrix);

    var t = mult(modelViewMatrix, instanceMatrix);

    //console.log("upper arm mv", modelViewMatrix);

    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t)  );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    //console.log("upper arm t", t);

}

//----------------------------------------------------------------------------


function lowerArm()
{
    var s = scale(LOWER_ARM_WIDTH, LOWER_ARM_HEIGHT, LOWER_ARM_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * LOWER_ARM_HEIGHT, 0.0 ), s);


    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t)   );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

}


function lowerFinger()
{
    let s = scale(LOWER_FINGER_WIDTH, LOWER_FINGER_HEIGHT, LOWER_FINGER_WIDTH);
    let instanceMatrix = mult(translate( 0.0, 0.5 * LOWER_FINGER_HEIGHT, 0.0 ), s);

    let t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices);
}

function upperFinger() {
    let s = scale(UPPER_FINGER_WIDTH, UPPER_FINGER_HEIGHT, UPPER_FINGER_WIDTH);
    let instanceMatrix = mult(translate( 0.0, 0.5 * UPPER_FINGER_HEIGHT, 0.0 ), s);

    let t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices);
}

// function clawJoint() {
//         let s = scale(0, UPPER_FINGER_HEIGHT, UPPER_FINGER_WIDTH);
//         let instanceMatrix = mult(translate( 0.0, 0.5 * UPPER_FINGER_HEIGHT, 0.0 ), s);
//
//         let t = mult(modelViewMatrix, instanceMatrix);
//         gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(t));
//         gl.drawArrays( gl.TRIANGLES, 0, NumVertices);
//
// }
//----------------------------------------------------------------------------


var render;
render = function () {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    modelViewMatrix = rotate(theta[Base], vec3(0, 1, 0));
    base();

    modelViewMatrix = mult(modelViewMatrix, translate(0.0, BASE_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerArm], vec3(0, 0, 1)));
    lowerArm();

    printm(translate(0.0, BASE_HEIGHT, 0.0));
    printm(modelViewMatrix);

    modelViewMatrix = mult(modelViewMatrix, translate(0.0, LOWER_ARM_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[UpperArm], vec3(0, 0, 1)));

    upperArm();

    modelViewMatrix = mult(modelViewMatrix,rotateY(theta[Claw_joint]));

    let stack = [];
    stack.push(modelViewMatrix);

    modelViewMatrix = mult(modelViewMatrix, translate(0.0, UPPER_ARM_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[UpperFinger], 0, 0, 1));

    lowerFinger();

    modelViewMatrix = mult(modelViewMatrix, translate(0.0, LOWER_FINGER_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerFinger], vec3(0, 0, 1)));

    upperFinger();


    modelViewMatrix = stack.pop();
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, UPPER_ARM_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(-theta[UpperFinger], 0, 0, 1));
    lowerFinger();


    modelViewMatrix = mult(modelViewMatrix, translate(0.0, LOWER_FINGER_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(-theta[LowerFinger], vec3(0, 0, 1)));

    upperFinger();



    requestAnimationFrame(render);
};
