import Hammer from '../sceneObjects/Hammer.js'
import LaserButton from '../sceneObjects/LaserButton.js'

// Add a hammer scene with a hammer and a button.
function addHammerScene(renderInfo, physicsInfo, ammoHelper) {
  addHammer(renderInfo, physicsInfo, ammoHelper)
  addButton(renderInfo, physicsInfo, ammoHelper)
}

// Add the hammer to the scene.
function addHammer(renderInfo, physicsInfo, ammoHelper) {
  const mass = 1
  const hammer = new Hammer(1, 25, 3, 10)
  hammer.group.position.set(-26, 0, -52.75)
  const hammerShape = hammer.getCompoundShape(ammoHelper)

  const rigidBody = ammoHelper.createRigidBody(hammerShape, hammer.group, mass)
  physicsInfo.addRigidBody(rigidBody, hammer.group)
  renderInfo.scene.add(hammer.group)
  hammer.group.userData.rigidBody = rigidBody
  rigidBody.threeMesh = hammer.group
}

// Add the button to the scene.
function addButton(renderInfo, physicsInfo, ammoHelper) {
  const mass = 10
  const button = new LaserButton(10, 2, 20, 3, 2)
  button.mesh.position.set(-55, 1.5, -52.5)
  const compoundShape = button.getCompoundShape(ammoHelper)

  const rigidBody = ammoHelper.createRigidBody(compoundShape, button.mesh, mass)
  physicsInfo.addRigidBody(rigidBody, button.mesh)
  renderInfo.scene.add(button.mesh)
  button.mesh.userData.rigidBody = rigidBody
  rigidBody.threeMesh = button.mesh
}

export default addHammerScene
