import materials from '../utils/materials.js'
import Tube from '../sceneObjects/Tube.js'
import Box from '../sceneObjects/Box.js'

function addTubeScene(renderInfo, physicsInfo, ammoHelper) {
  addTube(renderInfo, physicsInfo, ammoHelper)
  addPlateau(renderInfo, physicsInfo, ammoHelper)
}

function addTube(renderInfo, physicsInfo, ammoHelper) {
  const tube = new Tube(10, 1.55)
  tube.mesh.position.set(3.4, 4.5, -52.5)

  const compoundShape = tube.getCompoundShape(ammoHelper)

  const rigidBody = physicsInfo.createRigidBody(compoundShape, tube.mesh, 0)
  physicsInfo.addRigidBody(rigidBody, tube.mesh)
  renderInfo.scene.add(tube.mesh)
  tube.mesh.userData.rigidBody = rigidBody
  rigidBody.threeMesh = tube.mesh
}

function addPlateau(renderInfo, physicsInfo, ammoHelper) {
  const mass = 0
  // const plateau = new Box(48, 53, 10, materials.white)
  // plateau.mesh.position.set(28, 26.5, -52.5)
  const plateau = new Box(48, 1, 6, materials.wood)
  plateau.mesh.position.set(28, 52.5, -52.5)

  const rigidBody = ammoHelper.createRigidBody(
    plateau.shape,
    plateau.mesh,
    mass
  )
  rigidBody.setFriction(0.8)
  physicsInfo.addRigidBody(rigidBody, plateau.mesh)
  renderInfo.scene.add(plateau.mesh)
  plateau.mesh.userData.rigidBody = rigidBody
  rigidBody.threeMesh = plateau.mesh
}

export default addTubeScene
