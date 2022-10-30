import {
  AmbientLight,
  CameraHelper,
  DirectionalLight,
  DirectionalLightHelper,
  SpotLight,
  SpotLightHelper,
} from "three";
import { parseConfig, setGui, setObjectAxes, setShadows } from "./constants";

export function ambientLightFactory(scene, config = {}) {
  config = parseConfig({
    color: 0xffffff,
    ...config,
  });

  const light = new AmbientLight(config.color);

  scene.add(light);
  return light;
}

export function directionalLightFactory(scene, config = {}) {
  config = parseConfig({
    color: 0xffffff,
    intensity: 0.8,
    helperSize: 5,
    shadow: {
      camera: {
        bottom: -12,
      },
    },
    ...config,
  });

  const light = new DirectionalLight(config.color, config.intensity);

  setShadows(light, config);
  setObjectAxes(light, config);

  if (config.development) {
    scene.add(new DirectionalLightHelper(light, config.helperSize));
    scene.add(new CameraHelper(light.shadow.camera));
  }

  scene.add(light);

  return light;
}

export function spotLightFactory(scene, config = {}) {
  config = parseConfig({
    color: 0xffffff,
    angle: 1,
    ...config,
  });

  const light = new SpotLight(config.color);
  light.angle = config.angle;

  setShadows(light, config);
  setObjectAxes(light, config);
  setGui(light, config);

  if (config.development) {
    const helper = new SpotLightHelper(light);
    light.updateHelper = () => {
      helper.update();
    };
    scene.add(helper);
  }

  scene.add(light);

  return light;
}
