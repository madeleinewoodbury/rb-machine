import materials from '../materials'
import Pillar from '../sceneObjects/Pillar.js'
import Cylinder from '../sceneObjects/Cylinder.js'
import Box from '../sceneObjects/Box.js'

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
  const dominoSize = { x: 0.5, y: 6, z: 2 };
  const dominoPosition = {
    x: basePosition.x + 0.22,
    y: baseSize.y,
    z: basePosition.z,
  };

  addPillar(renderInfo, physicsInfo, ammoHelper, baseSize, plateauSize, basePosition)
  addFoodContainer(renderInfo, physicsInfo, ammoHelper, foodContainerSize, foodContainerPosition)
  addDominos(renderInfo, physicsInfo, ammoHelper, dominoSize, dominoPosition)
}

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
  rigidBody.threeMesh = pillar.mesh;
}

function addFoodContainer(renderInfo, physicsInfo, ammoHelper, size, position) {
  const mass = 2

  const foodContainer = new Cylinder(size.radius, size.height, materials.blue)
  foodContainer.mesh.position.set(position.x, position.y, position.z)

  const rigidBody = ammoHelper.createRigidBody(
    foodContainer.shape,
    foodContainer.mesh,
    mass
  )
  rigidBody.setFriction(0.8)
  rigidBody.setRestitution(0.7)

  physicsInfo.addRigidBody(rigidBody, foodContainer.mesh)
  renderInfo.scene.add(foodContainer.mesh)

  foodContainer.mesh.userData.rigidBody = rigidBody
  rigidBody.threeMesh = foodContainer.mesh
}

function addDominos(renderInfo, physicsInfo, ammoHelper, size, position) {
  for (let i = 0; i < 5; i++) {
    addDomino(renderInfo, physicsInfo, ammoHelper, size, position)
    position.x -= 3.25
  }
}

function addDomino(renderInfo, physicsInfo, ammoHelper, size, position) {
  const mass = 8

  const domino = new Box(size.x, size.y, size.z, materials.white)
  domino.mesh.position.set(position.x, position.y + size.y / 2, position.z)

  const rigidDomino = ammoHelper.createRigidBody(domino.shape, domino.mesh, mass)

  physicsInfo.addRigidBody(rigidDomino, domino.mesh)
  renderInfo.scene.add(domino.mesh)

  domino.mesh.userData.rigidBody = rigidDomino
  rigidDomino.threeMesh = domino.mesh
}

export default addPillarScene
