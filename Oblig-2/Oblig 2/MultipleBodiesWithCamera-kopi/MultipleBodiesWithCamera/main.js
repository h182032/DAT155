"use strict";

var gl;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    // Use this object to listen for key inputs
    var keyboardState = new THREEx.KeyboardState();

    // The camera object control's the position and orientation of the... camera
    let camera = new Camera(keyboardState);


    //
    // Set up our models
    //

    camera.setPosition(vec3(0, 0, -6));
    camera.setForwardDirection(vec3(0, 0, 1));

    //var Projection = ortho(-10, 10, -10, 10, -10, 10);
    var Projection = perspective(60, canvas.width/canvas.height, 0.01, 1000);
    var View = camera.getViewMatrix();

    // Generate our cylinder, a higher number will make the approximated cylinder
    // look like a real cylinder
    var cylinderData = generateCylinder(100);
    var cubeData = generateCube();
    var sphereData = generateSphere(20  ,20);

    var allPoints = [].concat(
        cylinderData.points,
        cubeData.points,
        sphereData.points
    );

    var cylinderOffset = 0;
    var cubeOffset = cylinderOffset + cylinderData.numVertices;
    var sphereOffset = cubeOffset + cubeData.numVertices;

    // Lets draw a cylinder, a cube and a sphere

    var cylinderDraw = {
        // From where in the buffer shall we start drawing?
        offset: cylinderOffset,
        // How many vertices?
        numVertices: cylinderData.numVertices,

        // Our current model
        model: translate(2, 0, 0),

        // Will be uploaded as uniforms
        uniforms: {
            color: vec4(1, 0, 0, 1),
            mvp: mat4()
        },

        update: function(deltaTimestamp, timestamp) {
            // The this object will point to the current enclosing object (cylinderDraw),
            // if not configured otherwise. This is kind of ugly.
            var deltaSeconds = deltaTimestamp/1000;
            this.model = mult(this.model, rotate(360*deltaSeconds/2, vec3(1, -1, 1)));
        }
    };

    var cubeDraw = {
        offset: cubeOffset,
        numVertices: cubeData.numVertices,

        model: mult(translate(-2, 0, 0), scalem(0.5, 1, 0.5)),

        uniforms: {
            color: vec4(0, 1, 0, 1),
            mvp: mat4()
        }
    };

    var sphereDraw = {
        offset: sphereOffset,
        numVertices: sphereData.numVertices,
        model: translate(0, 0, 0),

        uniforms: {
            color: vec4(0, 0, 1, 1),
            mvp: mat4()
        }
    };

    //
    //  Configure WebGL
    //

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    var ModelViewProjectionLocation = gl.getUniformLocation(program, "ModelViewProjection");
    var ColorLocation = gl.getUniformLocation(program, "Color");

    /* Load the data into the GPU*/

    var positionBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(allPoints)), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    //
    // Set up and start the render loop
    //

    var prevTimestamp = 0;

    window.requestAnimationFrame(function step(timestamp) {
        var deltaTimestamp = timestamp - prevTimestamp;
        prevTimestamp = timestamp;

        var seconds = timestamp/1000;
        var diffSeconds = deltaTimestamp/1000;

        camera.update(deltaTimestamp);
        View = camera.getViewMatrix();

        var ViewProjection = mult(Projection, View);

        // Update our models
        cylinderDraw.update(deltaTimestamp, timestamp);

        sphereDraw.uniforms.color = vec4(
            0.5*Math.sin(seconds) + 0.5,
            0.5*Math.cos(1.25*seconds) + 0.5,
            0.5*Math.sin(1.5*seconds) + 0.5,
            1.0
        );

        cubeDraw.model = mult(
            translate(-2, 0, 0),
            scalem(0.5*Math.sin(seconds) + 0.6,
                0.5*Math.cos(1.25*seconds) + 0.6,
                0.5*Math.sin(1.5*seconds) + 0.6)
        );

        // Construct a "draw command" list
        var drawableObjects = [
            cylinderDraw,
            cubeDraw,
            sphereDraw
        ];

        // Update the mvp properties
        for (var i = 0; i < drawableObjects.length; ++i) {
            drawableObjects[i].uniforms.mvp = mult(ViewProjection, drawableObjects[i].model);
        }

        render(drawableObjects, ModelViewProjectionLocation, ColorLocation);

        window.requestAnimationFrame(step);
    });


};

function render(drawableObjects, mvpLocation, colorLocation) {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (var i = 0; i < drawableObjects.length; ++i) {
        var drawableObject = drawableObjects[i];
        gl.uniformMatrix4fv(mvpLocation, false, flatten(drawableObject.uniforms.mvp));
        gl.uniform4fv(colorLocation, new Float32Array(drawableObject.uniforms.color));
        gl.drawArrays(gl.TRIANGLES, drawableObject.offset, drawableObject.numVertices);
    }
}
