import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Cylinder from "../sceneObjects/Cylinder.js";
import materials from "../utils/materials.js";

// Add a laser gun scene with a laser gun, a laser stand and a laser.
function addLaserGunScene(renderInfo, physicsInfo, ammoHelper) {
  addLaserGun(renderInfo, physicsInfo, ammoHelper);
  addLaserStand(renderInfo, physicsInfo, ammoHelper);
  addLaser(renderInfo);
}

// Add the laser gun model to the scene.
function addLaserGun(renderInfo) {
  const loader = new GLTFLoader();
  loader.load("./models/LaserGun.glb", (gltf) => {
    const laserGun = gltf.scene;
    laserGun.position.set(-66, 41, -52.5);
    laserGun.rotateY(Math.PI / 4);
    laserGun.scale.set(7, 7, 7);
    laserGun.name = "laserGun";
    renderInfo.scene.add(laserGun);
  });
}

// Add the laser to the scene. The laser is made of a line. The line is
// initially transparent. When the laser button is pressed, the laser becomes
// visible.
function addLaser(renderInfo) {
  const material = new THREE.LineBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0,
  });
  const points = [];

  points.push(new THREE.Vector3(-66.3, 46.6, -52.5));
  points.push(new THREE.Vector3(27, 46.75, 25));

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  line.name = "laser";

  renderInfo.scene.add(line);
}

// Add the laser stand to the scene. The laser gun is placed on the laser stand.
function addLaserStand(renderInfo, physicsInfo, ammoHelper) {
  const stand = new Cylinder(5, 41, materials.sciFiWall);
  stand.mesh.position.x = -66;
  stand.mesh.position.z = -52.5;
  stand.mesh.name = "stand";
  stand.mesh.castShadow = true;

  const rigidBody = ammoHelper.createRigidBody(stand.shape, stand.mesh, 0);
  physicsInfo.addRigidBody(rigidBody, stand.mesh);
  renderInfo.scene.add(stand.mesh);
  stand.mesh.userData.rigidBody = rigidBody;
}

export default addLaserGunScene;
