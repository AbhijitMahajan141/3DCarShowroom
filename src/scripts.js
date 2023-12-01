import * as THREE from "three";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "https://threejs.org/examples/jsm/loaders/FBXLoader.js";

// const car = new URL("./assets/centenario/scene.gltf", import.meta.url);
const character = new URL("./assets/character/char.fbx", import.meta.url);
const characterAnim = new URL("./assets/character/hiphop.fbx", import.meta.url);
const characterAnim2 = new URL(
  "./assets/character/hiphop2.fbx",
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
  30,
  window.innerWidth / window.innerHeight,
  1,
  100
);
camera.position.set(0, 4, 8);

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

// Fog //
// scene.fog = new THREE.Fog(0xffffff, 0, 20);
// scene.fog = new THREE.FogExp2(0xffffff, 0.1);

// Texture Loaders //
// const textureloader = new THREE.TextureLoader();
// scene.background = textureloader.load("./assets/img1.jpg");
// const cubeTextureLoader = new THREE.CubeTextureLoader();
// scene.background = cubeTextureLoader.load([
//   "./assets/img1.jpg",
//   "./assets/img1.jpg",
//   "./assets/img1.jpg",
//   "./assets/img1.jpg",
//   "./assets/img1.jpg",
//   "./assets/img1.jpg",
// ]);

// Orbit Controls //
const orbit = new OrbitControls(camera, renderer.domElement);
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

// Car loader //
// const assetLoader = new GLTFLoader();
// assetLoader.load(
//   car.href,
//   function (gltf) {
//     const model = gltf.scene;
//     model.traverse((c) => {
//       c.castShadow = true;
//     });
//     model.position.set(0, 0, 0);
//     model.scale.set(1, 1, 1);

//     scene.add(model);
//   },
//   undefined,
//   function (error) {
//     console.error(error);
//   }
// );

// Character Loader //
let mixer = null;
let animationAction = null;
const fbxLoader = new FBXLoader();
fbxLoader.load(character.href, (obj) => {
  obj.scale.setScalar(0.01);
  obj.traverse((c) => {
    c.castShadow = true;
  });

  fbxLoader.load(characterAnim.href, (anim) => {
    mixer = new THREE.AnimationMixer(obj);
    const action = mixer.clipAction(anim.animations[0]);
    // action.play();
    animationAction = action;
  });
  scene.add(obj);
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (mixer && mixer._actions.length > 0) {
      const action = mixer._actions[0]; // Assuming only one animation action
      action.play(); // Start playing the animation
    }
  } else if (e.code === "Tab") {
    if (animationAction) {
      animationAction.stop();
    }
  }
});

function animation() {
  if (mixer !== null) {
    // Check if mixer is initialized
    mixer.update(clock.getDelta()); // Update the animation mixer
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animation);
}
const clock = new THREE.Clock();
animation();

// Responsive Window //
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
