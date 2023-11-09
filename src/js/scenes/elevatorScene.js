import * as THREE from 'three'
import Elevator from '../sceneObjects/Elevator.js'
import ElevatorShaft from '../sceneObjects/ElevatorShaft.js'
import Sphere from '../sceneObjects/Sphere.js'

function createElevatorScene(renderInfo, physicsInfo) {
  addElevator(renderInfo, physicsInfo)
  addElevatorShaft(renderInfo, physicsInfo)
  addElevatorButton(renderInfo, physicsInfo)
  addBall(renderInfo, physicsInfo)
}

function addElevator(renderInfo, physicsInfo) {
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

function addElevatorShaft(renderInfo, physicsInfo) {
  const height = 16
  const width = 6
  const depth = 1
  const elevatorShaft = new ElevatorShaft(height, width, depth, 0xc2c2c2)
  // elevatorShaft.mesh.position.set(-1, 0, 0)

  renderInfo.scene.add(elevatorShaft.mesh)
}

function addElevatorButton(renderInfo, physicsInfo) {
  const button = new THREE.Mesh(
    new THREE.ConeGeometry(0.25, 0.75, 2),
    new THREE.MeshStandardMaterial({ color: 0xffff00 })
  )
  button.name = 'button'
  button.rotateY(Math.PI / 2)
  button.position.set(5.25, 5, 3.01)

  renderInfo.scene.add(button)
}


export default createElevatorScene
