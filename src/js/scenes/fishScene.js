import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import materials from "../utils/materials.js";
import Aquarium from "../sceneObjects/Aquarium.js";

// Add a fish scene with an aquarium, water, and a fish.
function addFishScene(renderInfo, physicsInfo, ammoHelper) {
  const aquariumSize = { width: 30, height: 10, depth: 20, edgeWith: 0.2 };
  const position = { x: -30, y: 0, z: 25 };

  addAquarium(renderInfo, physicsInfo, ammoHelper, aquariumSize, position);
  addWater(renderInfo, aquariumSize, position);
  addFish(renderInfo, position);
}

// Add the fish model to the scene.
function addFish(renderInfo, position) {
  const loader = new GLTFLoader();
  // Goldfish model by Poly by Google [CC-BY] via Poly Pizza
  loader.load("./models/Goldfish.glb", (gltf) => {
    const fish = gltf.scene.children[0];
    fish.position.set(position.x, 7, position.z);
    fish.rotateY(Math.PI / 2);
    fish.scale.set(0.175, 0.175, 0.175);
    fish.name = "fish";
    renderInfo.scene.add(fish);
  });
}

// Add the aquarium to the scene.
function addAquarium(renderInfo, physicsInfo, ammoHelper, size, position) {
  const mass = 0;

  const aquarium = new Aquarium(
    size.width,
    size.height,
    size.depth,
    size.edgeWith
  );
  aquarium.mesh.position.set(position.x, position.y, position.z);

  const compoundShape = aquarium.getCompoundShape(ammoHelper);
  const rigidBody = ammoHelper.createRigidBody(
    compoundShape,
    aquarium.mesh,
    mass
  );

  physicsInfo.addRigidBody(rigidBody, aquarium.mesh);
  renderInfo.scene.add(aquarium.mesh);
  aquarium.mesh.userData.rigidBody = rigidBody;
}

// Add the water to the scene. The water is made of two planes, one for the
// bottom and one for the top. The top plane is transparent. The bottom plane
// has a cloud texture to make the water look more realistic.
function addWater(renderInfo, size, position) {
  const height = size.height * 0.9;

  const geometry = new THREE.PlaneGeometry(
    size.width - 0.01,
    size.depth - 0.01
  );
  const waterBottom = new THREE.Mesh(geometry, materials.waterCloud);
  waterBottom.rotateX(-Math.PI / 2);
  waterBottom.name = "water";
  waterBottom.material.transparent = true;

  const waterTop = new THREE.Mesh(geometry, materials.water);
  waterTop.rotateX(-Math.PI / 2);

  waterBottom.position.set(position.x - 0.01, 2, position.z - 0.01);
  waterTop.position.set(position.x - 0.01, height, position.z - 0.01);
  renderInfo.scene.add(waterBottom, waterTop);
}

export default addFishScene;
