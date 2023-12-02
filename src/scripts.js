import * as THREE from "three";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
// import { GLTFLoader } from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "https://threejs.org/examples/jsm/loaders/FBXLoader.js";
import { characterControls as CharacterControls } from "./characterControls.js";

const jamesIdle = new URL(
  "./assets/character/jamesIdleSkin.fbx",
  import.meta.url
);
const jamesWalk = new URL(
  "./assets/character/jamesWalkSpot.fbx",
  import.meta.url
);

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setAnimationLoop(animation); // dont use this when playing animations.
document.body.appendChild(renderer.domElement);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 5, 5);

// Lighting
const light1 = new THREE.AmbientLight(0x404040, 1); // does not cast shadows

const light = new THREE.DirectionalLight(0xffffff, 10);

light.position.set(0, 5, 8);
light.castShadow = true;
scene.add(light);
scene.add(light1);

// Set up shadow properties for the light
light.shadow.mapSize.width = 1024; // default
light.shadow.mapSize.height = 1024; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

// Orbit Controls //
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;
orbit.minDistance = 5;
orbit.maxDistance = 15;
orbit.enablePan = false;
orbit.maxPolarAngle = Math.PI / 2 - 0.05;
orbit.update(); // Must be called after any manual changes to camera's transform as above

// Plane
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.position.set(0, 0, 0);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;

// Grid helper //
const gridHelper = new THREE.GridHelper(10);
scene.add(gridHelper);

// Camera Helper //
const helper = new THREE.CameraHelper(light.shadow.camera);
scene.add(helper);

// Character Loader //
let mixer = null;

const fbxLoader = new FBXLoader();
const animationsMap = new Map();
// Instance of CharacterControlls //
let characterControlsInstance;
fbxLoader.load(jamesIdle.href, (jamesIdle) => {
  jamesIdle.scale.setScalar(0.01);
  jamesIdle.traverse((c) => {
    c.castShadow = true;
  });
  scene.add(jamesIdle);

  // Mixer is used to Clip 2 or more animations so no need to use multiple instances of mixer
  // Have only one mixer
  mixer = new THREE.AnimationMixer(jamesIdle);
  animationsMap.set("Idle", mixer.clipAction(jamesIdle.animations[0]));

  fbxLoader.load(jamesWalk.href, (jamesWalk) => {
    animationsMap.set("Walk", mixer.clipAction(jamesWalk.animations[0]));
    // Calling the CharacterController after both the models are added in animationsMap
    characterControlsInstance = new CharacterControls(
      jamesIdle,
      mixer,
      animationsMap,
      orbit,
      camera,
      "Idle"
    );
  });
});

// Key Controls for character //
const keysPressed = {}; // store every keyup or down event in this object
document.addEventListener(
  "keydown",
  (e) => {
    if (e.shiftKey && characterControlsInstance) {
      characterControlsInstance.switchRunToggle();
    } else {
      keysPressed[e.key.toLowerCase()] = true; // added to keyspressed object
    }
  },
  false
);

document.addEventListener(
  "keyup",
  (e) => {
    keysPressed[e.key.toLowerCase()] = false; // removed from keyspressed object
  },
  false
);

// The Animate function //
const clock = new THREE.Clock();
function animation() {
  let mixerUpdateDelta = clock.getDelta();
  if (characterControlsInstance) {
    // Calling update method of characterControls, passing deltaTime and keysPressed
    characterControlsInstance.update(mixerUpdateDelta, keysPressed);
    // Check if mixer is initialized
    // mixer.update(clock.getDelta()); // Update the animation mixer
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animation);
}

animation();

// Responsive Window //
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
