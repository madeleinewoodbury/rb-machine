import * as THREE from 'three'
import Sphere from '../sceneObjects/Sphere.js'
import AmmoHelper from '../AmmoHelper.js'
import Tube from '../sceneObjects/Tube.js'

function createTubeScene(renderInfo, physicsInfo) {
  createTube(renderInfo, physicsInfo)
  createPlateau(renderInfo, physicsInfo)  
  createBall(renderInfo, physicsInfo)

}

function createBall(renderInfo, physicsInfo) {
  const ball = new Sphere(1, 1, 0xff0000)
  ball.mesh.name = 'ball'
  ball.mesh.position.set(10, 35, 0)

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

function createPlateau(renderInfo, physicsInfo) {
  const ammoHelper = new AmmoHelper()
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(20, 30, 10),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  )

  mesh.position.set(10, 15, 0)
  mesh.castShadow = true
  mesh.receiveShadow = true

  ammoHelper.setTransform(mesh)
  const shape =  new Ammo.btBoxShape(new Ammo.btVector3(10, 15, 5))
  shape.setMargin(0.05)

  const rigidBody = ammoHelper.createRigidBody(shape, mesh, 0)
  physicsInfo.addRigidBody(rigidBody, mesh)
  mesh.userData.physicsBody = rigidBody
  renderInfo.scene.add(mesh)
}

export default createTubeScene
