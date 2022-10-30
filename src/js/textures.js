import { CubeTextureLoader, TextureLoader } from "three";
import nebula from "../img/nebula.jpg";
import stars from "../img/stars.jpg";

const monkeyUrl = new URL("../assets/monkey.glb", import.meta.url);
export const textureLoader = new TextureLoader();

export function loadTexture(object, url) {
  textureLoader.load(url, function (texture) {
    object.background = texture;
  });
}

export function load3dBackground(
  object,
  urls = [nebula, nebula, stars, stars, stars, stars]
) {
  const cubeTextureLoader = new CubeTextureLoader();

  object.background = cubeTextureLoader.load([
    nebula,
    nebula,
    stars,
    stars,
    stars,
    stars,
  ]);
}
