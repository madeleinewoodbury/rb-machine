import * as THREE from 'three'
import Elevator from '../sceneObjects/Elevator.js'
import Box from '../sceneObjects/Box.js'
import Sphere from '../sceneObjects/Sphere.js'

function createElevatorScene(renderInfo, physicsInfo) {
  addEleveator(renderInfo, physicsInfo)
  addWall(renderInfo, physicsInfo)
  addBall(renderInfo, physicsInfo)

  addTop(renderInfo, physicsInfo)
  addTorus(renderInfo, physicsInfo)
}

function addEleveator(renderInfo, physicsInfo) {
  const width = 5
  const height = 5
  const depth = 0.5
  const color = 0x0000ff

  const elevator = new Elevator(width, height, depth, color)
  const rigidBody = physicsInfo.createRigidBody(
    elevator.shape,
    elevator.mesh,
    elevator.mass
  )

  rigidBody.setFriction(elevator.friction)
  rigidBody.setRestitution(elevator.restituition)
  rigidBody.setCollisionFlags(elevator.collisionFlag)
  rigidBody.setActivationState(elevator.activatuonState)

  physicsInfo.addRigidBody(rigidBody, elevator.mesh)
  renderInfo.scene.add(elevator.mesh)
  elevator.mesh.userData.physicsBody = rigidBody
  rigidBody.threeMesh = elevator.mesh
}

function addBall(renderInfo, physicsInfo) {
  const radius = 1.5
  const mass = 10
  const color = 0xff0000
  const pos = { x: 2.5, y: 1, z: 0 }

  const ball = new Sphere(radius, mass, color, pos)
  ball.mesh.name = 'ball'

  const rigidBody = physicsInfo.createRigidBody(ball.shape, ball.mesh, mass)
  ball.setFriction(rigidBody)
  ball.setRestituition(rigidBody)
  ball.setRollingFriction(rigidBody)

  physicsInfo.addRigidBody(rigidBody, ball.mesh)
  renderInfo.scene.add(ball.mesh)
  ball.mesh.userData.physicsBody = rigidBody
}

function addElevatorShaft(elevator) {
  const elevatorShaft = new THREE.Group()
  elevatorShaft.name = 'elevatorShaft'

  const height = elevator.height + 12
  const width = elevator.width + 4
  const depth = elevator.depth * 2
  const wall = new Box(width, height, depth, 0x0000ff)
}

function addWall(renderInfo, physicsInfo) {
  const width = 10
  const height = 10
  const depth = 0.5
  const color = 0xc2c2c2

  const wall = new Box(width, height, depth, color)
  wall.mesh.name = 'wall'
  wall.mesh.position.set(2, 5, -2.75)

  const rigidBody = physicsInfo.createRigidBody(
    wall.shape,
    wall.mesh,
    wall.mass
  )

  physicsInfo.addRigidBody(rigidBody, wall.mesh)
  wall.mesh.userData.physicsBody = rigidBody
  renderInfo.scene.add(wall.mesh)
}

function addTorus(renderInfo, physicsInfo) {
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(2, 0.2, 16, 32),
    new THREE.MeshStandardMaterial({ color: 0xff00ff })
  )
  torus.name = 'torus'
  torus.position.set(2, 14, 0)
  torus.rotateY(Math.PI / 2)

  const shape = new Ammo.btCylinderShape(new Ammo.btVector3(1, 0.2, 1))
  const rigidBody = physicsInfo.createRigidBody(shape, torus, 1)
  physicsInfo.addRigidBody(rigidBody, torus)
  torus.userData.physicsBody = rigidBody
  rigidBody.threeMesh = torus

  renderInfo.scene.add(torus)
}

function addTop(renderInfo, physicsInfo) {
  const pole = new THREE.Group()
  pole.name = 'pole'
  const color = 0xffff00
  const mass = 1

  const part1 = new THREE.Mesh(
    new THREE.BoxGeometry(-1, 14.9, 1),
    new THREE.MeshStandardMaterial({ color })
  )
  part1.position.set(-5, 7.5, 0)
  pole.add(part1)

  const part2 = part1.clone()
  part2.rotateZ(Math.PI / 2)
  part2.scale.set(0.5, 0.75, 0.5)
  part2.position.set(1, 14, 0)
  pole.add(part2)

  const poleShape = new Ammo.btCompoundShape()
  const partShape = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 7.5, 0.5))
  let transform = new Ammo.btTransform()
  transform.setIdentity()
  transform.setOrigin(new Ammo.btVector3(-5, 7.5, 0))
  poleShape.addChildShape(transform, partShape)

  transform = new Ammo.btTransform()
  transform.setIdentity()
  transform.setOrigin(new Ammo.btVector3(2, 14.5, 0))
  transform.setRotation(new Ammo.btQuaternion(0, 0, 1, 1))
  poleShape.addChildShape(transform, partShape)

  const rigidBody = physicsInfo.createRigidBody(poleShape, pole, mass)
  rigidBody.setCollisionFlags(2)
  rigidBody.setActivationState(4)

  physicsInfo.addRigidBody(rigidBody, pole)
  pole.userData.physicsBody = rigidBody
  rigidBody.threeMesh = pole
  renderInfo.scene.add(pole)
}

export default createElevatorScene
