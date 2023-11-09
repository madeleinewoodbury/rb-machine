import Sphere from '../sceneObjects/Sphere.js'
import AmmoHelper from '../AmmoHelper.js'
import Tube from '../sceneObjects/Tube.js'

function createTubeScene(renderInfo, physicsInfo) {
  createTube(renderInfo, physicsInfo)
  createBall(renderInfo, physicsInfo)
}

function createBall(renderInfo, physicsInfo) {
  const ball = new Sphere(1, 1, 0xff0000)
  ball.mesh.position.set(-10, 50, 0)

  const rigidBody = physicsInfo.createRigidBody(ball.shape, ball.mesh, 2)
  physicsInfo.addRigidBody(rigidBody, ball.mesh)
  ball.mesh.userData.physicsBody = rigidBody
  renderInfo.scene.add(ball.mesh)
}

function createTube(renderInfo, physicsInfo) {
  const tube = new Tube(10, 3, 0x00ffff)
  const ammoHelper = new AmmoHelper()
  const compoundShape = tube.getCompoundShape(ammoHelper)

  const rigidBody = physicsInfo.createRigidBody(compoundShape, tube.mesh, 0)
  physicsInfo.addRigidBody(rigidBody, tube.mesh)
  tube.mesh.userData.physicsBody = rigidBody
  renderInfo.scene.add(tube.mesh)
}

export default createTubeScene
