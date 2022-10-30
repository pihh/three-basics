import {
  BoxGeometry,
  DoubleSide,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  SphereGeometry,
} from "three";
import * as dat from "dat.gui";
import { parseConfig, setGui, setObjectAxes, setShadows } from "./constants";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { textureLoader } from "./textures";

export function boxFactory(scene, config = {}, renderFn = false) {
  config = parseConfig(config);

  const geometry = new BoxGeometry();
  const material = new MeshStandardMaterial({
    color: config.map ? null : config.color,
    wireframe: config.wireframe,
  });
  const mesh = new Mesh(geometry, material);

  if (config.map) {
    textureLoader.load(config.map);
  }
  setShadows(mesh, config);
  setObjectAxes(mesh, config);
  setGui(mesh, config);

  if (renderFn) {
    mesh.render = renderFn.bind(mesh);
  } else {
    mesh.render = function () {};
  }

  scene.add(mesh);
  return mesh;
}

export function sphereFactory(scene, config = {}, renderFn = false) {
  config = parseConfig({
    radius: 4,
    segmentsX: 50,
    segmentsY: 50,
    ...config,
  });

  const geometry = new SphereGeometry(
    config.radius,
    config.segmentsX,
    config.segmentsY
  );
  const material = new MeshStandardMaterial({
    color: config.color,
    wireframe: config.wireframe,
  });
  const mesh = new Mesh(geometry, material);

  setShadows(mesh, config);
  setObjectAxes(mesh, config);
  setGui(mesh, config);

  if (renderFn) {
    mesh.render = renderFn.bind(mesh);
  } else {
    mesh.render = function () {};
  }

  scene.add(mesh);
  return mesh;
}

export function planeFactory(scene, config = {}, renderFn = false) {
  config = parseConfig({
    width: 30,
    height: 30,
    gridSquares: config.gridSquares || this.width,
    side: DoubleSide,
    ...config,
  });

  const geometry = new PlaneGeometry(config.width, config.height);
  const material = new MeshStandardMaterial({
    color: config.color,
    side: config.side,
    wireframe: config.wireframe,
  });
  const mesh = new Mesh(geometry, material);

  setShadows(mesh, config);
  setObjectAxes(mesh, config);
  setGui(mesh, config);

  if (config.development) {
    const helper = new GridHelper(config.width, config.gridSquares);
    scene.add(helper);
  }

  if (renderFn) {
    mesh.render = renderFn.bind(mesh);
  } else {
    mesh.render = function () {};
  }

  scene.add(mesh);
  return mesh;
}

export function orbitControls(camera, $canvas) {
  const orbit = new OrbitControls(camera, $canvas);
  camera.orbit = orbit;

  orbit.update();
  return orbit;
}
