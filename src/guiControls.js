import * as dat from "https://cdn.skypack.dev/dat.gui";

// const dirLight = new THREE.DirectionalLight(0xffffff, 8);
// dirLight.position.set(3, 4, 4);
// dirLight.castShadow = true;
// dirLight.shadow.mapSize.width = 2048;
// dirLight.shadow.mapSize.height = 2048;
// scene.add(dirLight);

// const spotLight = new THREE.SpotLight(0xffffff, 100, 50, 0.9, 0.5, 2);
// spotLight.position.set(0, 7, 2);
// spotLight.castShadow = true;
// spotLight.shadow.mapSize.width = 2048;
// spotLight.shadow.mapSize.height = 2048;
// scene.add(spotLight);

// const pointLight = new THREE.PointLight(0xffffff, 200, 200);
// pointLight.position.set(0, 7, -2);
// pointLight.castShadow = true;
// pointLight.shadow.mapSize.width = 2048;
// pointLight.shadow.mapSize.height = 2048;
// scene.add(pointLight);

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
