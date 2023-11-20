import * as THREE from "three";
import materials from "../utils/materials.js";
import Pillar from "../sceneObjects/Pillar.js";
import Cylinder from "../sceneObjects/Cylinder.js";
import Box from "../sceneObjects/Box.js";

// Add the pillar scene with a pillar, a food container, dominos and fish food.
function addPillarScene(renderInfo, physicsInfo, ammoHelper) {
  const baseSize = { x: 1, y: 30, z: 7 };
  const plateauSize = { x: 25, y: 1, z: 7 };
  const basePosition = { x: 0, y: 0, z: 25 };
  const foodContainerSize = { radius: 1.5, height: 5 };
  const foodContainerPosition = {
    x: basePosition.x - plateauSize.x + 7,
    y: baseSize.y + plateauSize.y / 2 + foodContainerSize.height / 2,
    z: basePosition.z,
  };
  const dominoSize = { x: 0.5, y: 6, z: 3 };
  const dominoPosition = {
    x: basePosition.x + 0.22,
    y: baseSize.y,
    z: basePosition.z,
  };

  addPillar(
    renderInfo,
    physicsInfo,
    ammoHelper,
    baseSize,
    plateauSize,
    basePosition
  );
  addFoodContainer(
    renderInfo,
    physicsInfo,
    ammoHelper,
    foodContainerSize,
    foodContainerPosition
  );
  addDominos(renderInfo, physicsInfo, ammoHelper, dominoSize, dominoPosition);
  addFishFood(renderInfo);
}

// Add the pillar to the scene.
function addPillar(
  renderInfo,
  physicsInfo,
  ammoHelper,
  baseSize,
  plateauSize,
  basePosition
) {
  const pillar = new Pillar(
    baseSize,
    plateauSize,
    basePosition.x,
    basePosition.z
  );

  const compoundShape = pillar.getCompoundShape(ammoHelper);
  const rigidBody = ammoHelper.createRigidBody(compoundShape, pillar.mesh, 0);
  rigidBody.setFriction(0.8);

  physicsInfo.addRigidBody(rigidBody, pillar.mesh);
  renderInfo.scene.add(pillar.mesh);

  pillar.mesh.userData.rigidBody = rigidBody;
}

// Add the food container to the scene.
function addFoodContainer(renderInfo, physicsInfo, ammoHelper, size, position) {
  const mass = 3;
  const foodContainer = new Cylinder(
    size.radius,
    size.height,
    materials.foodContainer
  );
  foodContainer.mesh.position.set(position.x, position.y, position.z);
  foodContainer.mesh.rotateY(1.2)
  foodContainer.mesh.name = "foodContainer";
  
  const rigidBody = ammoHelper.createRigidBody(
    foodContainer.shape,
    foodContainer.mesh,
    mass
  );
  rigidBody.setFriction(0.8);
  rigidBody.setRestitution(0.7);

  // Set the collision group and mask so that the food container can collide with
  // the dominos
  rigidBody.setCollisionGroup = physicsInfo.collisionGroup.foodContainer;
  rigidBody.setCollisionMask = physicsInfo.collisionGroup.domino;

  physicsInfo.addRigidBody(rigidBody, foodContainer.mesh);
  renderInfo.scene.add(foodContainer.mesh);

  foodContainer.mesh.userData.rigidBody = rigidBody;
  rigidBody.threeMesh = foodContainer.mesh;

  const top = new THREE.Mesh(
    new THREE.CircleGeometry(size.radius, 32),
    materials.foodContainerTop
  );
  top.name = "foodContainerTop";
  top.position.set(position.x, position.y + size.height / 2 + 0.01, position.z);
  top.rotateX(-Math.PI / 2);
  renderInfo.scene.add(top);

  }

// Add the fish food to the scene. The fish food is made of particles. The
// particles are initially transparent. When the food container is hit by a
// domino, the particles become visible.
function addFishFood(renderInfo) {
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 300;

  const positions = new Float32Array(particleCount * 3);

  // Approach based on examples from Threejs-journey by Bruno Simon
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] = (Math.random() - 0.5) * 5;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 2.5;
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const particles = new THREE.Points(particleGeometry, materials.fishFood);
  particles.position.set(-30, 26, 25);
  particles.name = "fishFood";

  renderInfo.scene.add(particles);
}

// Add the dominos to the scene. The dominos are placed on the pillar.
function addDominos(renderInfo, physicsInfo, ammoHelper, size, position) {
  for (let i = 0; i < 5; i++) {
    const name = "domino" + i;
    addDomino(renderInfo, physicsInfo, ammoHelper, size, position, name);
    position.x -= 3.25;
  }
}

// Add a domino to the scene with the given size, position and name.
function addDomino(renderInfo, physicsInfo, ammoHelper, size, position, name) {
  const mass = 5;

  const domino = new Box(size.x, size.y, size.z, materials.white);
  domino.mesh.position.set(position.x, position.y + size.y / 2, position.z);
  domino.mesh.name = name;

  const rigidDomino = ammoHelper.createRigidBody(
    domino.shape,
    domino.mesh,
    mass
  );

  physicsInfo.addRigidBody(rigidDomino, domino.mesh);
  renderInfo.scene.add(domino.mesh);

  // Set the collision group and mask so that the dominos can collide with the
  // food container and other dominos.
  rigidDomino.setCollisionGroup = physicsInfo.collisionGroup.domino;
  rigidDomino.setCollisionMask =
    physicsInfo.collisionGroup.foodContainer ||
    physicsInfo.collisionGroup.domino;

  domino.mesh.userData.rigidBody = rigidDomino;
  rigidDomino.threeMesh = domino.mesh;
}

export default addPillarScene;
