import * as THREE from 'three'
import materials from '../materials'
import Pillar from '../sceneObjects/Pillar.js'
import Cylinder from '../sceneObjects/Cylinder.js'

function createPillarScene(renderInfo, physicsInfo, ammoHelper) {
  const baseSize = { x: 1, y: 30, z: 7 }
  const plateauSize = { x: 25, y: 1, z: 7 }
  const pillar = new Pillar(baseSize, plateauSize, 0, 25)

  const compoundShape = pillar.getCompoundShape(ammoHelper)
  const rigidBody = ammoHelper.createRigidBody(compoundShape, pillar.mesh, 0)
  rigidBody.setFriction(0.8)

  physicsInfo.addRigidBody(rigidBody, pillar.mesh)
  renderInfo.scene.add(pillar.mesh)

  pillar.mesh.userData.rigidBody = rigidBody
  rigidBody.threeMesh = pillar.mesh

  addFoodContainer(renderInfo, physicsInfo, ammoHelper, pillar)
  addDominos(renderInfo, physicsInfo, ammoHelper, pillar)
}

function addFoodContainer(renderInfo, physicsInfo, ammoHelper, pillar) {
  const mass = 2
  const radius = 1.5
  const height = 5
  const xPos = pillar.baseX - pillar.plateauSize.x + 7
  const yPos = pillar.baseSize.y + pillar.plateauSize.y / 2 + height / 2
  const zPos = pillar.baseZ

  const foodContainer = new Cylinder(radius, height, materials.foodContainer)
  foodContainer.mesh.position.set(xPos, yPos, zPos)

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

function addDominos(renderInfo, physicsInfo, ammoHelper, pillar) {
  const position = {
    x: pillar.baseX,
    y: pillar.baseSize.y,
    z: pillar.baseZ,
  }

  for (let i = 0; i < 5; i++) {
    addDomino(renderInfo, physicsInfo, ammoHelper, position)
    position.x -= 3.25
  }
}

function addDomino(renderInfo, physicsInfo, ammoHelper, position) {
  const scale = { x: 0.5, y: 6, z: 2 }
  const mass = 2

  const domino = new THREE.Mesh(
    new THREE.BoxGeometry(scale.x, scale.y, scale.z),
    materials.domino
  )
  domino.position.set(position.x, position.y + scale.y / 2, position.z)

  const shape = new Ammo.btBoxShape(
    new Ammo.btVector3(scale.x / 2, scale.y / 2, scale.z / 2)
  )
  shape.setMargin(0.05)
  const rigidDomino = ammoHelper.createRigidBody(shape, domino, mass)

  physicsInfo.addRigidBody(rigidDomino, domino)
  renderInfo.scene.add(domino)

  domino.userData.rigidBody = rigidDomino
  rigidDomino.threeMesh = domino
}

export default createPillarScene
