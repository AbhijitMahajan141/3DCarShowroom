import * as THREE from "three";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
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
const jamesRun = new URL("./assets/character/jamesRun.fbx", import.meta.url);

// Renderer //
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Scene //
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// Textures //
// const textureloader = new THREE.TextureLoader();
// scene.background = textureloader.load("./assets/img.png");

// Camera //
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1, 1);

// Light //
const light1 = new THREE.AmbientLight(0xffffff, 1);
scene.add(light1);
const dirLight = new THREE.DirectionalLight(0xffffff, 8);
dirLight.position.set(3, 4, 4);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

// Orbit controls //
const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
controls.minDistance = 4;
controls.maxDistance = 6;
controls.enablePan = false;
controls.maxPolarAngle = Math.PI / 2 - 0.05;
controls.update();

// Plane //
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial(
  0x000000,
  THREE.DoubleSide
);
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;

// Car switching code //
const carModels = [
  "./src/assets/aventador/scene.gltf",
  "./src/assets/aventador2/scene.gltf",
  "./src/assets/urus/scene.gltf",
  "./src/assets/vision/scene.gltf",
];

// const loaderElement = document.getElementById("loader");

// DracoLoader configuration
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

const assetLoader = new GLTFLoader();
assetLoader.setDRACOLoader(dracoLoader); // Attach DRACOLoader to GLTFLoader

// Car loading function
function loadCarModel(modelPath, x, y, z) {
  assetLoader.load(
    modelPath,
    function (gltf) {
      const model = gltf.scene;
      model.traverse((c) => {
        c.castShadow = true;
        c.receiveShadow = true;
      });

      model.position.set(x, y, z);

      model.scale.set(1, 1, 1);

      scene.add(model);

      // loaderElement.innerText = "";
    },
    (xhr) => {
      const percentLoaded = (xhr.loaded / xhr.total) * 10;
      // loaderElement.innerHTML = percentLoaded.toFixed(1) + "% loaded";
    },
    function (error) {
      console.error(error);
    }
  );
}

loadCarModel(carModels[0], 2, 0, 0);
loadCarModel(carModels[1], -2, 0, 0);
loadCarModel(carModels[2], 2, 0.8, -6);
loadCarModel(carModels[3], -2, 0, -4);
// Car Switching code till here //

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
  jamesIdle.position.set(0, 0, 0);
  scene.add(jamesIdle);

  // Mixer is used to Clip 2 or more animations so no need to use multiple instances of mixer
  // Have only one mixer
  mixer = new THREE.AnimationMixer(jamesIdle);
  animationsMap.set("Idle", mixer.clipAction(jamesIdle.animations[0]));

  fbxLoader.load(jamesWalk.href, (jamesWalk) => {
    animationsMap.set("Walk", mixer.clipAction(jamesWalk.animations[0]));
    // Calling the CharacterController after both the models are added in animationsMap
    fbxLoader.load(jamesRun.href, (jamesRun) => {
      animationsMap.set("Run", mixer.clipAction(jamesRun.animations[0]));
      characterControlsInstance = new CharacterControls(
        jamesIdle,
        mixer,
        animationsMap,
        controls,
        camera,
        "Idle"
      );
    });
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

// Animation function //
const clock = new THREE.Clock();
function animate() {
  // required if controls.enableDamping or controls.autoRotate are set to true
  // controls.update();
  let mixerUpdateDelta = clock.getDelta();
  if (characterControlsInstance) {
    // Calling update method of characterControls, passing deltaTime and keysPressed
    characterControlsInstance.update(mixerUpdateDelta, keysPressed);
    // Check if mixer is initialized
    // mixer.update(clock.getDelta()); // Update the animation mixer
  }

  renderer.render(scene, camera);
  // a method used to create smooth and efficient animations by synchronizing with the browser's repaint cycle.
  // Needed only when there are moving objects in seen.
  // requestAnimationFrame(animate);
}
animate();

// Responsive Window //
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
