import * as THREE from "three";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "https://cdn.skypack.dev/dat.gui";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { FBXLoader } from "https://threejs.org/examples/jsm/loaders/FBXLoader.js";

const character = new URL("./assets/character/char.fbx", import.meta.url);
const characterAnim = new URL("./assets/character/hiphop.fbx", import.meta.url);

// const canvas = document.querySelector("#c1");

// Car switching code //
const carModels = [
  "./src/assets/aventador/scene.gltf",
  "./src/assets/aventador2/scene.gltf",
];
let currentModelIndex = 0;

const nextButton = document.getElementById("next");
const loaderElement = document.getElementById("loader");

// DracoLoader configuration
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

const assetLoader = new GLTFLoader();
assetLoader.setDRACOLoader(dracoLoader); // Attach DRACOLoader to GLTFLoader

// Car loading function
function loadCarModel(modelPath) {
  assetLoader.load(
    modelPath,
    function (gltf) {
      const model = gltf.scene;
      model.traverse((c) => {
        c.castShadow = true;
      });

      model.position.set(0, 0, 0);

      model.scale.set(0.5, 0.5, 0.5);

      const previousModel = scene.getObjectByName("carModel");
      if (previousModel) {
        scene.remove(previousModel);
      }

      model.name = "carModel"; // Set a name for the model to easily identify and remove it later
      scene.add(model);

      loaderElement.innerText = "";
    },
    (xhr) => {
      const percentLoaded = (xhr.loaded / xhr.total) * 10;
      loaderElement.innerHTML = percentLoaded.toFixed(1) + "% loaded";
    },
    function (error) {
      console.error(error);
    }
  );
}

nextButton.addEventListener("click", () => {
  currentModelIndex = (currentModelIndex + 1) % carModels.length; // Increment index or loop back to 0 when reaching the end
  loadCarModel(carModels[currentModelIndex]); // Load the next car model
});

loadCarModel(carModels[currentModelIndex]); // Load initial car model
// Car Switching code till here //

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

// const textureloader = new THREE.TextureLoader();
// scene.background = textureloader.load("./assets/img.png");

// Camera //
const camera = new THREE.PerspectiveCamera(
  20,
  window.innerWidth / window.innerHeight,
  1,
  50
);

// Light //
const light1 = new THREE.AmbientLight(0xffffff, 1);

const dirLight = new THREE.DirectionalLight(0xffffff, 8);
dirLight.position.set(3, 4, 4);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

const spotLight = new THREE.SpotLight(0xffffff, 100, 50, 0.9, 0.5, 2);
spotLight.position.set(0, 7, 2);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;
scene.add(spotLight);

const pointLight = new THREE.PointLight(0xffffff, 200, 200);
pointLight.position.set(0, 7, -2);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 2048;
pointLight.shadow.mapSize.height = 2048;
scene.add(pointLight);

scene.add(light1);

// Orbit controls //
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = false;
// controls.autoRotateSpeed = 0.05;
controls.enableDamping = true;
controls.dampingFactor = 0.5;
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
// const assetLoader = new GLTFLoader().setPath("./src/assets/lambo/");
// assetLoader.load(
//   "scene.gltf",
//   function (gltf) {
//     const model = gltf.scene;
//     model.traverse((c) => {
//       c.castShadow = true;
//     });

//     model.position.set(0, 0, 0);
//     model.scale.set(50, 50, 50);
//     scene.add(model);
//   },
//   undefined,
//   function (error) {
//     console.error(error);
//   }
// );

// Plane //
const planeGeometry = new THREE.PlaneGeometry(5, 5);
const planeMaterial = new THREE.MeshStandardMaterial(
  0xffffff,
  THREE.DoubleSide
);
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;

// Light Toggle Code
const lightTypes = {
  Directional: true,
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

// Loading Animated Model //
let mixer = null;
let animationAction = null;
const fbxLoader = new FBXLoader();
fbxLoader.load(character.href, (obj) => {
  console.log(obj);
  obj.position.set(-1, 0, 0);
  obj.scale.setScalar(0.005);
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

// Character Movement //
const characterSpeed = 0.03;
const characterPosition = { x: -1, y: 0, z: 0 };
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

function updateCharacterPosition() {
  if (moveForward) characterPosition.z -= characterSpeed;
  if (moveBackward) characterPosition.z += characterSpeed;
  if (moveLeft) characterPosition.x -= characterSpeed;
  if (moveRight) characterPosition.x += characterSpeed;

  // console.log(scene.getObjectById(42));

  const character = scene.getObjectById(42);
  if (character) {
    character.position.set(
      characterPosition.x,
      characterPosition.y,
      characterPosition.z
    );
  }
}

document.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "KeyW":
      moveForward = true;
      break;
    case "KeyS":
      moveBackward = true;
      break;
    case "KeyA":
      moveLeft = true;
      break;
    case "KeyD":
      moveRight = true;
      break;
    default:
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.code) {
    case "KeyW":
      moveForward = false;
      break;
    case "KeyS":
      moveBackward = false;
      break;
    case "KeyA":
      moveLeft = false;
      break;
    case "KeyD":
      moveRight = false;
      break;
    default:
      break;
  }
});
// Animation function //
function animate() {
  // required if controls.enableDamping or controls.autoRotate are set to true
  // controls.update();
  if (mixer !== null) {
    // Check if mixer is initialized
    mixer.update(clock.getDelta()); // Update the animation mixer
  }

  updateCharacterPosition(); // character positioning function call

  renderer.render(scene, camera);
  // a method used to create smooth and efficient animations by synchronizing with the browser's repaint cycle.
  // Needed only when there are moving objects in seen.
  // requestAnimationFrame(animate);
}
const clock = new THREE.Clock();
animate();

// Responsive Window //
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
