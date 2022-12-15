"use strict";

// Global variables that are set and used
// across the application
let gl;


var myCube = null;
var myCylinder = null;
var myCone = null;
var mySphere = null;

// GLSL programs

let globalProgram;

// VAOs for the objects

// textures
let newTexture;
// rotation

//
// create shapes and VAOs for objects.
// Note that you will need to bindVAO separately for each object / program based
// upon the vertex attributes found in each program
//
function createShapes() {
  // myCylinder = new Cylinder(19, 10);
  // myCylinder.VAO = bindVAO(myCylinder);

  myCube = new Cube (20);
  mySphere = new Sphere (20,20);
  //myCylinder = new Cylinder (20,20);
  myCone = new Cone (20,20);  


  myCube.VAO = bindShaderVAO(myCube, globalProgram);
  myCone.VAO = bindShaderVAO(myCone, globalProgram);
  //myCylinder.VAO = bindShaderVAO(myClinder, globalProgram);
  mySphere.VAO = bindShaderVAO(mySphere, globalProgram);
  console.log("Bound All VAOS");
  // myCone= new Cone(40,4)
  // myTeapot.VAO = bindVAO(myTeapot);
  // myCube.VAO = bindVAO(myCube);
  // myCylinder.VAO = bindVAO(myCylinder);
  // myCone.VAO=bindVAO(myCone)
}

//
// Here you set up your camera position, orientation, and projection
// Remember that your projection and view matrices are sent to the vertex shader
// as uniforms, using whatever name you supply in the shaders
//
function setUpCamera(program) {
  gl.useProgram(program);

  // set up your projection

  // set up your view

  // let viewMatrix = glMatrix.mat4.create();
  // glMatrix.mat4.lookAt(viewMatrix, [0, 4, -13], [0, 0, 0], [0, 1, 0]);
  // gl.uniformMatrix4fv(program.uViewT, false, viewMatrix);

  // let projMatrix = glMatrix.mat4.create();
  // glMatrix.mat4.perspective(projMatrix, radians(60), 1, 0, null);
  // gl.uniformMatrix4fv(program.uProjT, false, projMatrix);
  // console.log("Camera  Space Initialized");

  let projMatrix = glMatrix.mat4.create();

  glMatrix.mat4.perspective(projMatrix, radians(75), 1, 0, null);

  gl.uniformMatrix4fv(program.phonguProjT, false, projMatrix);

  // set up your view
  // defaut is at (0,0,-5) looking at the origin
  let viewMatrix = glMatrix.mat4.create();
  glMatrix.mat4.lookAt(viewMatrix, [0, 4, -9], [0, 0, 0], [0, 1, 0]);
  gl.uniformMatrix4fv(program.phonguViewT, false, viewMatrix);
}

//
// load up the textures you will use in the shader(s)
// The setup for the globe texture is done for you
// Any additional images that you include will need to
// set up as well.
//
// function setUpTextures() {
//   // flip Y for WebGL
//   // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

//   // get some texture space from the gpu

//   // load the actual image
//   var worldImage = document.getElementById("");
//   worldImage.crossOrigin = "";

//   // bind the texture so we can perform operations on it

//   // load the texture data

//   // set texturing parameters
// }

function doLoad(theTexture, theImage) {
  gl.bindTexture(gl.TEXTURE_2D, theTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, theImage);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.bindTexture(gl.TEXTURE_2D, null);

  draw();
}

//
// load up the textures you will use in the shader(s)
// The setup for the globe texture is done for you
// Any additional images that you include will need to
// set up as well.
//
function setUpTextures() {
  newTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, newTexture);

  // loading the personalized image 1_earth_16k.jpg
  var im_age = new Image();
  im_age.src = "ima.jpg";

  im_age.onload = () => {
    doLoad(newTexture, im_age);
  };

  console.log("Initialized Textures");
}

function setUpPhong(program, x, y, z) {
  gl.useProgram(program);
  var aL = gl.getUniformLocation(program, "ambientLight");
  gl.uniform3fv(aL, [x, 0.5, y]);
  var lC = gl.getUniformLocation(program, "lightColor");
  gl.uniform3fv(lC, [1.0, y, z]);
  var lP = gl.getUniformLocation(program, "lightPosition");
  gl.uniform3fv(lP, [10, 10, 4]);
  var bC = gl.getUniformLocation(program, "baseColor");
  gl.uniform3fv(bC, [x, z, 1.5]);
  var specHighlightColor = gl.getUniformLocation(program, "specHighlightColor");
  gl.uniform3fv(specHighlightColor, [1.5, 1.5, 1.5]);
  var ka = gl.getUniformLocation(program, "ka");
  gl.uniform1f(ka, 1);
  var ks = gl.getUniformLocation(program, "ks");
  gl.uniform1f(ks, 0.1);
  var kd = gl.getUniformLocation(program, "kd");
  gl.uniform1f(kd, 0.5);
  var ke = gl.getUniformLocation(program, "ke");
  gl.uniform1f(ke, 1);
}

//
//  This function draws all of the shapes required for your scene
//
function drawShapes(program) {
  // modelMatrix = glMatrix.mat4.create();
  // glMatrix.mat4.translate(modelMatrix, modelMatrix, [x, -1.62, 0]);
  // glMatrix.mat4.scale(modelMatrix, modelMatrix, [1, 2.25, 1]);
  // gl.uniformMatrix4fv(program.uModelT, false, modelMatrix);
  // gl.bindVertexArray(myCylinder.VAO);
  // gl.drawElements(
  //   gl.TRIANGLES,
  //   myCylinder.indices.length,
  //   gl.UNSIGNED_SHORT,
  //   0
  // );
  gl.useProgram(program);
  let cubeMatrix = glMatrix.mat4.create();
  glMatrix.mat4.scale(cubeMatrix, cubeMatrix, [2, 0.5, 3]);

  glMatrix.mat4.translate(cubeMatrix, cubeMatrix, [0, -5, 0]);
  gl.uniformMatrix4fv(program.phonguModelT, false, cubeMatrix);
  setUpPhong(program, 1.0, 0.2, 0.6);
  gl.bindVertexArray(myCube.VAO);
  gl.drawElements(gl.TRIANGLES, myCube.indices.length, gl.UNSIGNED_SHORT, 0);
  console.log("Cube here", myCube);


  let coneMatrix = glMatrix.mat4.create();
  glMatrix.mat4.scale(coneMatrix, coneMatrix, [2, 1, 4]);

  glMatrix.mat4.translate(coneMatrix, coneMatrix, [-2, -5, 0]);
  gl.uniformMatrix4fv(program.phonguModelT, false, coneMatrix);
  setUpPhong(program, 0.7, 0.6, 0.0);
  gl.bindVertexArray(myCone.VAO);
  gl.drawElements(gl.TRIANGLES, myCone.indices.length, gl.UNSIGNED_SHORT, 0);
  console.log("Cube here", myCone);


  let sphereMatrix = glMatrix.mat4.create();
  glMatrix.mat4.scale(sphereMatrix, sphereMatrix, [2, 1, 4]);

  glMatrix.mat4.translate(sphereMatrix, sphereMatrix, [2, -5, 0]);
  gl.uniformMatrix4fv(program.phonguModelT, false, sphereMatrix);
  setUpPhong(program, 0.6, 0.9, 0.3);
  gl.bindVertexArray(mySphere.VAO);
  gl.drawElements(gl.TRIANGLES, mySphere.indices.length, gl.UNSIGNED_SHORT, 0);
  console.log("Cube here", mySphere);
  //   let cylinderMatrix = glMatrix.mat4.create();
  //   glMatrix.mat4.scale(cylinderMatrix, cylinderMatrix, [4, 2, 3])
  // glMatrix.mat4.translate(cylinderMatrix, cylinderMatrix, [0, 5, 0])
  // gl.uniformMatrix4fv(program.sphereuModelT, false, cylinderMatrix);
  // gl.bindVertexArray(myCylinder.VAO);

  //     gl.uniform1i(program.uTxValue, 0);
  //     gl.activeTexture (gl.TEXTURE0);
  //     gl.bindTexture (gl.TEXTURE_2D, newTexture);
  // gl.uniform1i(program.uTheTexture, 0);
  // console.log("Cylinder here",myCylinder);

  //   gl.drawElements(gl.TRIANGLES, myCylinder.indices.length, gl.UNSIGNED_SHORT, 0);
}

//
// Use this function to create all the programs that you need
// You can make use of the auxillary function initProgram
// which takes the name of a vertex shader and fragment shader
//
// Note that after successfully obtaining a program using the initProgram
// function, you will beed to assign locations of attribute and unifirm variable
// based on the in variables to the shaders.   This will vary from program
// to program.
//
// function initPrograms() {

// }

//Important variables
// perVertexProgram = initProgram('phong-per-vertex-V', 'phong-per-vertex-F');
// ('sphereMap-V', 'sphereMap-F');

function initPrograms() {
  const phongVertexShader = getShader("phong-per-vertex-V");
  const phongFragmentShader = getShader("phong-per-vertex-F");
  const textureVertexShader = getShader("sphereMap-V");
  const textureFragmentShader = getShader("sphereMap-F");
  console.log("Shaders Compiled !!");

  // Create a program
  let program = gl.createProgram();
  // Attach the shaders to this program
  gl.attachShader(program, phongVertexShader);
  gl.attachShader(program, phongFragmentShader);
  gl.attachShader(program, textureVertexShader);
  gl.attachShader(program, textureFragmentShader);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Could not initialize shaders");
  }
  console.log("WE COULD INITIALIZE SHADERS !!");

  // Use this program instance
  gl.useProgram(program);
  // We attach the location of these shader values to the program instance
  // for easy access later in the code
  // program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
  // program.uModelT = gl.getUniformLocation(program, "modelT");
  // program.uViewT = gl.getUniformLocation(program, "viewT");
  // program.uProjT = gl.getUniformLocation(program, "projT");

  program.phongAVertexPosition = gl.getAttribLocation(
    program,
    "phongAVertexPosition"
  );
  program.sphereAVertexPosition = gl.getAttribLocation(
    program,
    "sphereAVertexPosition"
  );
  program.phonguModelT = gl.getUniformLocation(program, "phongmodelT");
  program.phonguViewT = gl.getUniformLocation(program, "phongviewT");
  program.phonguProjT = gl.getUniformLocation(program, "phongprojT");

  program.sphereuModelT = gl.getUniformLocation(program, "spheremodelT");
  program.sphereViewT = gl.getUniformLocation(program, "sphereviewT");
  program.sphereProjT = gl.getUniformLocation(program, "sphereprojT");

  //Shading Unique Uniforms
  program.aNormal = gl.getAttribLocation(program, "aNormal");

  // uniforms
  program.uModelT = gl.getUniformLocation(program, "modelT");
  program.uViewT = gl.getUniformLocation(program, "viewT");
  program.uProjT = gl.getUniformLocation(program, "projT");
  program.ambientLight = gl.getUniformLocation(program, "ambientLight");
  program.lightPosition = gl.getUniformLocation(program, "lightPosition");
  program.lightColor = gl.getUniformLocation(program, "lightColor");
  program.baseColor = gl.getUniformLocation(program, "baseColor");
  program.specHighlightColor = gl.getUniformLocation(
    program,
    "specHighlightColor"
  );
  program.ka = gl.getUniformLocation(program, "ka");
  program.kd = gl.getUniformLocation(program, "kd");
  program.ks = gl.getUniformLocation(program, "ks");
  program.ke = gl.getUniformLocation(program, "ke");

  //Texture Unique Uniforms
  program.aUV = gl.getAttribLocation(program, "aUV");

  // uniforms - you will need to add references for any additional
  // uniforms that you add to your shaders
  program.uTheTexture = gl.getUniformLocation(program, "theTexture");
  program.uCreatedTexture = gl.getUniformLocation(program, "createdTexture");
  program.uTxValue = gl.getUniformLocation(program, "txValue");
  // program.uTheta = gl.getUniformLocation(program, 'theta');

  console.log("Initialized Program");
  return program;
}

//shader VAO
function bindShaderVAO(shape, program) {
  console.log("Binding Shader VAO", shape, "\n now program", program);

  var VAO = gl.createVertexArray();
  gl.bindVertexArray(VAO);

  var vB = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vB);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(shape.points),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(program.phongAVertexPosition);
  gl.vertexAttribPointer(program.phongAVertexPosition, 3, gl.FLOAT, true, 0, 0);

  var nB = gl.createBuffer();
  gl.bindBuffer(gl.NORMAL_ARRAY_BUFFER, nB);
  gl.bufferData(
    gl.NORMAL_ARRAY_BUFFER,
    new Float32Array(shape.normals),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(program.aNormal);
  gl.vertexAttribPointer(program.aNormal, 3, gl.FLOAT, true, 0, 0);

  var iB = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iB);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(shape.indices),
    gl.STATIC_DRAW
  );

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  gl.bindBuffer(gl.NORMAL_ARRAY_BUFFER, null);

  return VAO;
}

//Texture VAO
function bindTextureVAO(shape, program) {
  //create and bind VAO
  let theVAO = gl.createVertexArray();
  gl.bindVertexArray(theVAO);

  // create, bind, and fill buffer for vertex locations
  // vertex locations can be obtained from the points member of the
  // shape object.  3 floating point values (x,y,z) per vertex are
  // stored in this array.
  let myVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(shape.points),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(program.sphereAVertexPosition);
  gl.vertexAttribPointer(
    program.sphereAVertexPosition,
    3,
    gl.FLOAT,
    false,
    0,
    0
  );

  // create, bind, and fill buffer for uv's
  // uvs can be obtained from the uv member of the
  // shape object.  2 floating point values (u,v) per vertex are
  // stored in this array.
  let uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.uv), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(program.aUV);
  gl.vertexAttribPointer(program.aUV, 2, gl.FLOAT, false, 0, 0);

  // Setting up element array
  // element indicies can be obtained from the indicies member of the
  // shape object.  3 values per triangle are stored in this
  // array.
  let myIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(shape.indices),
    gl.STATIC_DRAW
  );

  // Do cleanup
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return theVAO;
}

// // creates a VAO and returns its ID
// function bindVAO(shape, program) {
//   //create and bind VAO
//   let theVAO = gl.createVertexArray();
//   gl.bindVertexArray(theVAO);

//   // create and bind vertex buffer
//   let myVertexBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
//   gl.bufferData(
//     gl.ARRAY_BUFFER,
//     new Float32Array(shape.points),
//     gl.STATIC_DRAW
//   );
//   gl.enableVertexAttribArray(program.aVertexPosition);
//   gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

//   // add code for any additional vertex attribute

//   // Setting up the IBO
//   let myIndexBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
//   gl.bufferData(
//     gl.ELEMENT_ARRAY_BUFFER,
//     new Uint16Array(shape.indices),
//     gl.STATIC_DRAW
//   );

//   // Clean
//   gl.bindVertexArray(null);
//   gl.bindBuffer(gl.ARRAY_BUFFER, null);
//   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

//   return theVAO;
// }

/////////////////////////////////////////////////////////////////////////////
//
//  You shouldn't have to edit anything below this line...but you can
//  if you find the need
//
/////////////////////////////////////////////////////////////////////////////

// Given an id, extract the content's of a shader script
// from the DOM and return the compiled shader
function getShader(id) {
  const script = document.getElementById(id);
  console.log("GOT SHADER SCRIPT as", script);
  const shaderString = script.text.trim();

  // Assign shader depending on the type of shader
  let shader;
  if (script.type === "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else if (script.type === "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else {
    return null;
  }

  // Compile the shader using the supplied shader code
  gl.shaderSource(shader, shaderString);
  gl.compileShader(shader);

  // Ensure the shader is valid
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

//
// compiles, loads, links and returns a program (vertex/fragment shader pair)
//
// takes in the id of the vertex and fragment shaders (as given in the HTML file)
// and returns a program object.
//
// will return null if something went wrong
//
function initProgram(vertex_id, fragment_id) {
  const vertexShader = getShader(vertex_id);
  const fragmentShader = getShader(fragment_id);

  // Create a program
  let program = gl.createProgram();

  // Attach the shaders to this program
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Could not initialize shaders");
    return null;
  }

  return program;
}

//
// We call draw to render to our canvas
//
function draw() {
  // Clear the scene
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // draw your shapes
  drawShapes(globalProgram);

  // Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

// Entry point to our application
function init() {
  // Retrieve the canvas
  const canvas = document.getElementById("webgl-canvas");
  if (!canvas) {
    console.error(`There is no canvas with id ${"webgl-canvas"} on this page.`);
    return null;
  }

  // deal with keypress
  window.addEventListener("keydown", gotKey, false);

  // Retrieve a WebGL context
  gl = canvas.getContext("webgl2");
  if (!gl) {
    console.error(`There is no WebGL 2.0 context`);
    return null;
  }

  // deal with keypress
  window.addEventListener("keydown", gotKey, false);

  // Set the clear color to be black
  gl.clearColor(0, 0, 0, 1);

  // some GL initialization
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  gl.cullFace(gl.BACK);
  gl.frontFace(gl.CCW);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.depthFunc(gl.LEQUAL);
  gl.clearDepth(1.0);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); //Only for texture

  // Read, compile, and link your shaders
  globalProgram = initPrograms();

  // create and bind your current object
  createShapes();

  // set up your textures
  setUpTextures();

  setUpCamera(globalProgram);
  // do a draw
  draw();
}
