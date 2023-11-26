import * as THREE from "three";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "https://cdn.skypack.dev/dat.gui";

// Renderer //
const renderer = new THREE.WebGLRenderer();
// renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Scene //
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// const textureloader = new THREE.TextureLoader();
// scene.background = textureloader.load("./assets/img.png");

// Camera //
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  1,
  100
);

// Light //
const light1 = new THREE.AmbientLight(0xffffff, 1);

const dirLight = new THREE.DirectionalLight(0xffffff, 8);
dirLight.position.set(3, 4, 4);
dirLight.castShadow = true;
scene.add(dirLight);

const spotLight = new THREE.SpotLight(0xffffff, 100, 50, 0.9, 0.5, 2);
spotLight.position.set(0, 7, 2);
spotLight.castShadow = true;
scene.add(spotLight);

const pointLight = new THREE.PointLight(0xffffff, 200, 200);
pointLight.position.set(0, 7, -2);
pointLight.castShadow = true;
scene.add(pointLight);

scene.add(light1);

// Orbit controls //
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = false;
// controls.autoRotateSpeed = 0.05;
// controls.enableDamping = true;
// controls.dampingFactor = 0.25;
controls.target.set(0, 0, 0);
controls.maxDistance = 10;
controls.minDistance = 5;
controls.maxPolarAngle = 1.4;
controls.minPolarAngle = 0.5;

camera.position.set(0, 2, 7);
controls.update();

// Camera Helper //
const helper1 = new THREE.CameraHelper(dirLight.shadow.camera);
const helper2 = new THREE.CameraHelper(spotLight.shadow.camera);
const helper3 = new THREE.CameraHelper(pointLight.shadow.camera);

// Car loader //
const assetLoader = new GLTFLoader().setPath("./src/assets/lambo/");
assetLoader.load(
  "scene.gltf",
  function (gltf) {
    const model = gltf.scene;
    model.traverse((c) => {
      c.castShadow = true;
    });

    model.position.set(0, 0, 0);
    model.scale.set(150, 150, 150);
    // model.rotation.x = -0.5 * Math.PI;
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Plane //
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial(
  0xffffff,
  THREE.DoubleSide
);
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;

// Circular Spotlight code

// // Spotlight for circular motion above the car //
// const spotlight = new THREE.SpotLight(0xffffff, 100, 50, 0.9, 0.5, 2);
// spotlight.position.set(0, 5, 0); // Set initial position above the car
// spotlight.castShadow = true;
// scene.add(spotlight);

// // Variables for spotlight circular motion animation //
// const spotlightCenter = new THREE.Vector3(0, 0, 0); // Center point for circular motion
// const spotlightRadius = 5; // Radius of the circular path
// let spotlightAngle = 0; // Initial angle

// // Function to animate spotlight's circular motion //
// function animateSpotlightCircularMotion() {
//   const angularSpeed = 0.0005; // Constant speed for the animation
//   spotlightAngle += angularSpeed;
//   const x = spotlightCenter.x + spotlightRadius * Math.cos(spotlightAngle);
//   const z = spotlightCenter.z + spotlightRadius * Math.sin(spotlightAngle);
//   spotlight.position.set(x, 10, z); // Update spotlight position along the circular path

//   renderer.render(scene, camera);
// }

// Light Toggle Code
const lightTypes = {
  Directional: false,
  Point: false,
  Spot: false,
};

function toggleDirectionalLight(value) {
  lightTypes.Directional = value;
  dirLight.visible = value;
  if (value === true) {
    scene.add(helper1);
  } else {
    scene.remove(helper1);
  }
}

function togglePointLight(value) {
  lightTypes.Point = value;
  pointLight.visible = value;
  if (value === true) {
    scene.add(helper2);
  } else {
    scene.remove(helper2);
  }
}

function toggleSpotLight(value) {
  lightTypes.Spot = value;
  spotLight.visible = value;
  if (value === true) {
    scene.add(helper3);
  } else {
    scene.remove(helper3);
  }
}

// Light intensity code
function updateLightIntensity() {
  dirLight.intensity = lightControls.DirectionalIntensity;
  pointLight.intensity = lightControls.PointIntensity;
  spotLight.intensity = lightControls.SpotIntensity;
}

const initialIntensities = {
  DirectionalIntensity: 1,
  PointIntensity: 1,
  SpotIntensity: 1,
};

const lightControls = {
  ...initialIntensities,
};

// Dat GUI code
const gui = new dat.GUI();
const lightFolder = gui.addFolder("Lights");
// For Light Toggle
lightFolder
  .add(lightTypes, "Directional")
  .name("Directional")
  .setValue(lightTypes.Directional)
  .onChange(toggleDirectionalLight);
lightFolder
  .add(lightTypes, "Point")
  .name("Point")
  .setValue(lightTypes.Point)
  .onChange(togglePointLight);
lightFolder
  .add(lightTypes, "Spot")
  .name("Spot")
  .setValue(lightTypes.Spot)
  .onChange(toggleSpotLight);

// For Intensity
lightFolder
  .add(lightControls, "DirectionalIntensity", 0, 10)
  .name("Directional Intensity")
  .onChange(() => {
    updateLightIntensity();
  });
lightFolder
  .add(lightControls, "PointIntensity", 0, 150)
  .name("Point Intensity")
  .onChange(() => {
    updateLightIntensity();
  });
lightFolder
  .add(lightControls, "SpotIntensity", 0, 200)
  .name("Spot Intensity")
  .onChange(() => {
    updateLightIntensity();
  });

function setInitialVisibility() {
  dirLight.visible = lightTypes.Directional;
  pointLight.visible = lightTypes.Point;
  spotLight.visible = lightTypes.Spot;
}

setInitialVisibility();

// Animation function //
function animate() {
  controls.update(); // required if controls.enableDamping or controls.autoRotate are set to true
  // animateSpotlightCircularMotion(); // new
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Responsive Window //
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
