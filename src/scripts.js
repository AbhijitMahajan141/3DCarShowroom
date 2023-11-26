import * as THREE from "three";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js";
// import stars from "./assets/img1.jpg";
// import galaxy from "./assets/img2.jpg";

const car = new URL("./assets/car2/scene.gltf", import.meta.url);

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.01,
  100
);

// Lighting
const light1 = new THREE.AmbientLight(0x404040, 30); // does not cast shadows
// const light = new THREE.SpotLight({
//   color: 0xffffff,
//   intensity: 30,
//   distance: 0.1,
//   angle: 0.9,
//   // penumbra: 0.9,
//   // decay: 0.9,
// });
// const light = new THREE.PointLight(0xffffff, 10, 100);
const light = new THREE.DirectionalLight(0xffffff, 1);
// const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1); // Does not cast shadows

light.position.set(0, 5, 8);
light.castShadow = true;
scene.add(light);
scene.add(light1);

// Set up shadow properties for the light
light.shadow.mapSize.width = 2048; // default
light.shadow.mapSize.height = 2048; // default
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

// OrbitControls
const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 2, 7);
orbit.update(); // Must be called after any manual changes to camera's transform as above

// Mesh
const geometry = new THREE.BoxGeometry(2, 2, 2); // defines size at x,y,z co-ordinates
const material = new THREE.MeshStandardMaterial();
const mesh = new THREE.Mesh(geometry, material);
mesh.castShadow = true;
mesh.receiveShadow = true;
mesh.position.set(-2, 2, 0);
scene.add(mesh);

// Plane
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// plane.position.y = -0.2;
plane.receiveShadow = true;
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;

// Grid helper for plane
const gridHelper = new THREE.GridHelper(10);
// gridHelper.position.y = -0.2;
scene.add(gridHelper);

// Sphere
const sphereGeometry = new THREE.SphereGeometry(1, 100, 100); // radius, segments
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  //   wireframe: false, // displays skeleton
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true; //default is false
sphere.receiveShadow = false;
sphere.position.set(-2, 4, 3);
scene.add(sphere);

const helper = new THREE.CameraHelper(light.shadow.camera);
scene.add(helper);

// Car loader //
const assetLoader = new GLTFLoader();
assetLoader.load(
  car.href,
  function (gltf) {
    const model = gltf.scene;
    model.traverse((c) => {
      c.castShadow = true;
    });
    scene.add(model);
    model.position.set(0, 0, 3);
    model.castShadow = true;
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// animation
let step = 2;
let speed = 0.01;
function animation(time) {
  mesh.rotation.x = time / 2000;
  mesh.rotation.y = time / 1000;

  step += speed;
  sphere.position.y = 3 * Math.abs(Math.sin(step));

  renderer.render(scene, camera);
}

// Responsive Window //
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
