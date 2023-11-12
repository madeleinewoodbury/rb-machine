import * as THREE from 'three'
import Hammer from '../sceneObjects/Hammer.js'
import Box from '../sceneObjects/Box.js'
import materials from '../materials.js'

function createHammerScene(renderInfo, physicsInfo, ammoHelper) {
  addHammer(renderInfo, physicsInfo, ammoHelper)
  addButton(renderInfo, physicsInfo, ammoHelper)
}

function addHammer(renderInfo, physicsInfo, ammoHelper) {
  const mass = 10
  const hammer = new Hammer(1.25, 25, 3, 8)
  hammer.group.position.set(-25, 0, -52.75)
  const hammerShape = hammer.getCompoundShape(ammoHelper)

  const rigidBody = ammoHelper.createRigidBody(hammerShape, hammer.group, mass)
  physicsInfo.addRigidBody(rigidBody, hammer.group)
  renderInfo.scene.add(hammer.group)
  hammer.group.userData.rigidBody = rigidBody
  rigidBody.threeMesh = hammer.group
}

function addButton(renderInfo, physicsInfo, ammoHelper) {
  const mass = 2
  const button = new Box(6, 2, 12, materials.laserButton)
  button.mesh.name = 'laserButton'
  button.mesh.position.set(-55, 1.5, -52.5)

  const rigidBody = ammoHelper.createRigidBody(button.shape, button.mesh, mass)
  physicsInfo.addRigidBody(rigidBody, button.mesh)
  renderInfo.scene.add(button.mesh)
  button.mesh.userData.rigidBody = rigidBody
  rigidBody.threeMesh = button.mesh
}

export default createHammerScene
