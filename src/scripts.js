import * as THREE from "three";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js";

const car = new URL("./assets/lambo/scene.gltf", import.meta.url);

// Car switching code //
const carModels = [
  "./src/assets/aventador/scene.gltf",
  "./src/assets/aventador2/scene.gltf",
  // "./src/assets/huracan/scene.gltf",
];
let currentModelIndex = 0;

const nextButton = document.getElementById("next");

nextButton.addEventListener("click", () => {
  currentModelIndex = (currentModelIndex + 1) % carModels.length; // Increment index or loop back to 0 when reaching the end
  loadCarModel(carModels[currentModelIndex]); // Load the next car model
});
// Car loading function
function loadCarModel(modelPath) {
  // console.log(index);
  const assetLoader = new GLTFLoader();
  assetLoader.load(
    modelPath,
    function (gltf) {
      const model = gltf.scene;
      model.traverse((c) => {
        c.castShadow = true;
      });

      model.position.set(0, 0, 0);
      // if (index === 0) {
      model.scale.set(0.5, 0.5, 0.5);
      // } else {
      //   model.scale.set(0.5, 0.5, 0.5);
      // }

      // Remove the previous car model from the scene if exists
      const previousModel = scene.getObjectByName("carModel");
      if (previousModel) {
        scene.remove(previousModel);
      }

      model.name = "carModel"; // Set a name for the model to easily identify and remove it later
      scene.add(model);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
}

loadCarModel(carModels[currentModelIndex]);
// Car Switching code till here //

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  1,
  50
);
camera.position.set(0, 2, 7);

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
const planeGeometry = new THREE.PlaneGeometry(5, 5);
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
const gridHelper = new THREE.GridHelper(5);
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
//     model.scale.set(100, 100, 100);
//     scene.add(model);
//   },
//   undefined,
//   function (error) {
//     console.error(error);
//   }
// );

// animation
// let step = 2;
// let speed = 0.01;
function animation(time) {
  // mesh.rotation.x = time / 2000;
  // mesh.rotation.y = time / 1000;
  // step += speed;
  // sphere.position.y = 3 * Math.abs(Math.sin(step));

  renderer.render(scene, camera);
}

// Responsive Window //
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
