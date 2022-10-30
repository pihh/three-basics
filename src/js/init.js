import * as THREE from "three";
import { FogExp2 } from "three";
import { load3dBackground, loadTexture } from "./textures";
import stars from "../img/stars.jpg";
import nebula from "../img/nebula.jpg";
import { initMouseVector, initRaycaster } from "./raycaster";

export const initRenderer = (scene, camera, config = {}) => {
  config = {
    shadowMap: {
      enabled: true,
    },
    development: false,
    ...config,
  };

  let mouse = initMouseVector();
  let renderer = new THREE.WebGLRenderer();
  let raycaster = initRaycaster();
  let $canvas = renderer.domElement;

  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
  document.body.appendChild(renderer.domElement);

  function animate() {
    for (let child of scene.children) {
      if (child.render) {
        child.render();
      }
    }
    raycaster.render(scene, camera, mouse);
    renderer.render(scene, camera);
    if (raycaster.intersects.length > 0) {
      for (let intersect of raycaster.intersects) {
        if (intersect.object.onHover) {
          intersect.object.onHover();
        }
      }
    }
  }

  renderer.setAnimationLoop(animate);

  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  return [renderer, $canvas];
};

export const initPerspectiveCamera = (config = {}) => {
  config = {
    fov: 75,
    aspectRatio: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 1000,
    development: false,
    position: {
      x: 0,
      y: 0,
      z: 0,
      ...(config.position ? config.position : {}),
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
      ...(config.rotation ? config.rotation : {}),
    },
    ...config,
  };

  const position = {
    x: 0,
    y: 0,
    z: 0,
    ...(config.position ? config.position : {}),
  };
  const rotation = {
    x: 0,
    y: 0,
    z: 0,
    ...(config.rotation ? config.rotation : {}),
  };
  const camera = new THREE.PerspectiveCamera(
    config.fov,
    config.aspectRatio,
    config.near,
    config.far
  );

  for (let axis of ["x", "y", "z"]) {
    camera.position[axis] = position[axis];
    camera.rotation[axis] = rotation[axis];
  }

  camera.orbit = false;
  // @TODO: on camera position update, updae orbit controls

  return camera;
};

export const initScene = (config = {}) => {
  config = {
    development: false,
    fog: {
      active: true,
      color: 0xffffff,
      intensity: 0.01,
      ...(config.fog ? config.fog : {}),
    },
    background: {
      color: false,
      texture: false,
      "3d": [nebula, nebula, stars, stars, stars, stars],
    },
    ...config,
  };
  const scene = new THREE.Scene();

  if (config.fog.active) {
    scene.fog = new FogExp2(config.fog.color, config.fog.intensity);
  }
  if (config.background.color) {
    scene.background.setClearColor(config.background.color);
  }
  if (config.background.texture) {
    loadTexture(scene, config.background.texture);
  }
  if (config.background["3d"]) {
    load3dBackground(scene, config.background["3d"]);
  }
  if (config.development) {
    scene.add(new THREE.AxesHelper(5));
  }

  return scene;
};
