export let DEVELOPMENT = true;
export const BASE_CONFIG = {
  color: 0x00ff00,
  fov: 75,
  aspectRatio: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 1000,
  wireframe: false,
  receiveShadow: true,
  castShadow: true,
  position: {
    x: 0,
    y: 0,
    z: 0,
  },
  rotation: {
    x: 0,
    y: 0,
    z: 0,
  },
  gui: {
    instance: false,
    color: false,
    wireframe: false,
    angle: false,
    penumbra: false,
    intensity: false,
  },
  development: DEVELOPMENT,
};

export function parseConfig(config = {}) {
  let _gui = {
    instance: false,
    color: false,
    wireframe: false,
    ...(config.gui ? config.gui : {}),
  };
  let _position = {
    x: 0,
    y: 0,
    z: 0,
    ...(config.position ? config.position : {}),
  };
  let _rotation = {
    x: 0,
    y: 0,
    z: 0,
    ...(config.rotation ? config.rotation : {}),
  };
  let _config = {
    ...BASE_CONFIG,
    ...config,
  };

  _config.position = _position;
  _config.rotation = _rotation;
  _config.gui = _gui;

  return _config;
}

export function setObjectAxes(object, config) {
  object.position.set(config.position.x, config.position.y, config.position.z);
  object.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z);

  return object;
}

export function setShadows(object, config) {
  object.receiveShadow = config.receiveShadow;
  object.castShadow = config.castShadow;
  if (
    object.shadow &&
    object.shadow.camera &&
    config.shadow &&
    config.shadow.camera
  ) {
    for (let key of Object.keys(config.shadow.camera)) {
      object.shadow.camera[key] = config.shadow.camera[key];
    }
  }
}

export function setGui(object, config) {
  if (config.gui.instance) {
    let options = Object.keys(config.gui).filter(
      (el) => el.indexOf(["instance", "name"]) == -1 && config.gui[el]
    );
    let name = config.gui.name;

    for (let option of options) {
      if (option == "wireframe") {
        let key = name + "_wireframe";
        let opt = {};
        opt[key] = object.material.wireframe;
        config.gui.instance.add(opt, key).onChange(function (e) {
          object.material.wireframe = e; //.set(e)
        });
      } else if (option == "color") {
        let key = name + "_color";
        let opt = {};
        opt[key] = object.material.color;
        config.gui.instance.addColor(opt, key).onChange(function (e) {
          console.log("onColorChange", e, object.material);
          object.material.color.r = e.r / 255;
          object.material.color.g = e.g / 255;
          object.material.color.b = e.b / 255;
          if (object.updateHelper) {
            object.updateHelper();
          }
        });
      } else if (option == "speed") {
        const optConfig = {
          min: 0,
          max: 0.1,
        };
        if (Array.isArray(config.gui[option])) {
          optConfig.min = config.gui[option][0];
          optConfig.max = config.gui[option][2];
        }

        if (!object.speed) {
          object.speed = 0.01;
        }

        let key = name + "_speed";
        let opt = {};
        opt[key] = object.speed;
        config.gui.instance
          .add(opt, key, optConfig.min, optConfig.max)
          .onChange(function (e) {
            object.speed = e;
          });
      } else if (option == "angle") {
        const optConfig = {
          min: 0,
          max: 1,
        };
        if (Array.isArray(config.gui[option])) {
          optConfig.min = config.gui[option][0];
          optConfig.max = config.gui[option][1];
        }

        if (!object.angle) {
          object.angle = (optConfig.max - optConfig.min) / 2;
        }

        let key = name + "_angle";
        let opt = {};
        opt[key] = object.angle;
        config.gui.instance
          .add(opt, key, optConfig.min, optConfig.max)
          .onChange(function (e) {
            object.angle = e;
            if (object.updateHelper) {
              object.updateHelper();
            }
          });
      } else if (option == "penumbra") {
        const optConfig = {
          min: 0,
          max: 1,
        };
        if (Array.isArray(config.gui[option])) {
          optConfig.min = config.gui[option][0];
          optConfig.max = config.gui[option][1];
        }

        if (!object.penumbra) {
          object.penumbra = (optConfig.max - optConfig.min) / 2;
        }

        let key = name + "_penumbra";
        let opt = {};
        opt[key] = object.penumbra;
        config.gui.instance
          .add(opt, key, optConfig.min, optConfig.max)
          .onChange(function (e) {
            object.penumbra = e;

            if (object.updateHelper) {
              object.updateHelper();
            }
          });
        console.log({ object });
      } else if (option == "intensity") {
        const optConfig = {
          min: 0,
          max: 1,
        };
        if (Array.isArray(config.gui[option])) {
          optConfig.min = config.gui[option][0];
          optConfig.max = config.gui[option][1];
        }

        if (!object.intensity) {
          object.intensity = (optConfig.max - optConfig.min) / 2;
        }

        let key = name + "_intensity";
        let opt = {};
        opt[key] = object.intensity;
        config.gui.instance
          .add(opt, key, optConfig.min, optConfig.max)
          .onChange(function (e) {
            object.intensity = e;
            if (object.updateHelper) {
              object.updateHelper();
            }
          });
      }
    }
  }
  // for (let axis of ["x", "y", "z"]) {
  //   object.position[axis] = config.position[axis];
  //   object.rotation[axis] = config.rotation[axis];
  // }
  // return object;
}
