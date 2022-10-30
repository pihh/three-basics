// Camera is the source
// Mouse is the second end of the ray

import { Raycaster, Vector2 } from "three";

export function initMouseVector() {
  const mousePosition = new Vector2();

  window.addEventListener("mousemove", function (e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  return mousePosition;
}

export function initRaycaster() {
  const raycaster = new Raycaster();
  raycaster.render = (scene, camera, mouse) => {
    raycaster.setFromCamera(mouse, camera);
    raycaster.intersects = raycaster.intersectObjects(scene.children) || [];
  };

  return raycaster;
}
