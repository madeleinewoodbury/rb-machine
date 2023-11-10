import * as THREE from 'three'
import Pillar from '../sceneObjects/Pillar.js'
import FoodContainer from '../sceneObjects/FoodContainer.js'
import Sphere from '../sceneObjects/Sphere.js'
import Cylinder from '../sceneObjects/Cylinder.js'

function createPillarScene(renderInfo, physicsInfo, ammoHelper) {
  const pillar = new Pillar()

  const compoundShape = pillar.getCompoundShape(ammoHelper)
  const rigidBody = ammoHelper.createRigidBody(compoundShape, pillar.mesh, 0)
  rigidBody.setFriction(0.8)

  physicsInfo.addRigidBody(rigidBody, pillar.mesh)
  pillar.mesh.userData.physicsBody = rigidBody
  rigidBody.threeMesh = pillar.mesh
  renderInfo.scene.add(pillar.mesh)

  addDominos(renderInfo, physicsInfo, ammoHelper)
  addFoodContainer(renderInfo, physicsInfo, ammoHelper)
  // addFood(renderInfo, physicsInfo, ammoHelper)
}

function addFoodContainer(renderInfo, physicsInfo, ammoHelper) {
  // const foodContainer = new FoodContainer(1.5, 5)
  const foodContainer = new Cylinder(1.5, 5, 0x0000ff)
  foodContainer.mesh.position.set(-19, 30.5, 0)
  // const compoundShape = foodContainer.getCompoundShape(ammoHelper)

  const rigidBody = ammoHelper.createRigidBody(foodContainer.shape, foodContainer.mesh, 2)
  rigidBody.setFriction(0.8)
  rigidBody.setRestitution(0.7)
  physicsInfo.addRigidBody(rigidBody, foodContainer.mesh)
  foodContainer.mesh.userData.physicsBody = rigidBody
  rigidBody.threeMesh = foodContainer.mesh
  renderInfo.scene.add(foodContainer.mesh)
}

function addFood(renderInfo, physicsInfo, ammoHelper) {
  const radius = 0.2
  const mass = 0.1
  const pos = { x: -21, y: 30.5, z: 0 }
  const material = new THREE.MeshStandardMaterial({ color: 0xffff00 })
  
  for(let i = 0; i < 200; i++) {
    const food = new Sphere(radius, mass, 0xffff00, pos, material)
    const rigidBody = ammoHelper.createRigidBody(food.shape, food.mesh, mass)
    physicsInfo.addRigidBody(rigidBody, food.mesh)
    food.mesh.userData.physicsBody = rigidBody
    renderInfo.scene.add(food.mesh)

    pos.y += 0.25
  } 
}

function addDominos(renderInfo, physicsInfo, ammoHelper) {
  const pos = { x: 3.25, y: 34, z: 0 }
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })

  for (let i = 0; i < 5; i++) {
    pos.x -= 3.25
    addDomino(pos, material, renderInfo, physicsInfo, ammoHelper)
  }
}

function addDomino(pos, material, renderInfo, physicsInfo, ammoHelper) {
  const scale = { x: 0.5, y: 6, z: 2 }
  const mass = 2

  const domino = new THREE.Mesh(
    new THREE.BoxGeometry(scale.x, scale.y, scale.z),
    material
  )
  domino.position.set(pos.x, pos.y, pos.z)

  const shape = new Ammo.btBoxShape(
    new Ammo.btVector3(scale.x / 2, scale.y / 2, scale.z / 2)
  )
  shape.setMargin(0.05)
  const rigidDomino = ammoHelper.createRigidBody(shape, domino, mass)

  physicsInfo.addRigidBody(rigidDomino, domino)
  domino.userData.physicsBody = rigidDomino
  renderInfo.scene.add(domino)
}

export default createPillarScene
