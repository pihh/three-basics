import * as THREE from "three";
import * as dat from "dat.gui";
import { initRenderer, initPerspectiveCamera, initScene } from "./init";
import {
  boxFactory,
  orbitControls,
  planeFactory,
  sphereFactory,
} from "./objects";
import { BASE_CONFIG } from "./constants";
import {
  ambientLightFactory,
  directionalLightFactory,
  spotLightFactory,
} from "./lights";
import nebula from "../img/nebula.jpg";

let renderer;
let camera;
let scene;

let $canvas;

let gui = new dat.GUI();

const init = () => {
  scene = initScene({ development: true });
  camera = initPerspectiveCamera({
    fov: 45,
    position: { x: -10, y: 30, z: 30 },
  });
  [renderer, $canvas] = initRenderer(scene, camera);
};

init();

const box = boxFactory(
  scene,
  {
    position: {
      y: 1,
    },
    rotation: {
      x: 5,
      y: 5,
    },
    map: nebula,
    onHover: function () {
      this.rotation.x += 0.01;
      this.rotation.y += 0.01;
    },
  },
  function () {
    this.rotation.x += 0.01;
    this.rotation.y += 0.01;
  }
);
const plane = planeFactory(scene, {
  color: 0xffffff,
  castShadow: false,
  rotation: { x: -0.5 * Math.PI },
});

const sphere = sphereFactory(
  scene,
  {
    color: 0x0000ff,
    position: {
      x: -10,
      y: 10,
    },
    gui: {
      instance: gui,
      name: "sphere",
      color: true,
      speed: 0.01,
    },
  },
  function () {
    if (!this.step) {
      this.step = 0;
      this.speed = 0.01;
    }
    this.step += this.speed;
    this.position.y = 10 * Math.abs(Math.sin(this.step));
  }
);

const orbit = orbitControls(camera, $canvas);

const ambientLight = ambientLightFactory(scene, {
  color: 0x333333,
});
const directionalLight = directionalLightFactory(scene, {
  intensity: 1,
  shadow: {
    camera: {
      bottom: -12,
    },
  },
  position: {
    x: -30,
    y: 50,
    z: 0,
  },
});

const spotLight = spotLightFactory(scene, {
  position: {
    x: -100,
    y: 100,
    z: 0,
  },
  angle: 0.2,
  gui: {
    instance: gui,
    name: "spotLight",
    angle: [0, 1],
    penumbra: [0, 1],
    intensity: [0, 1],
  },
});
