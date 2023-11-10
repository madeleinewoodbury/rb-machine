import * as THREE from 'three'
import Elevator from '../sceneObjects/Elevator.js'
import ElevatorShaft from '../sceneObjects/ElevatorShaft.js'
import Sphere from '../sceneObjects/Sphere.js'
import AmmoHelper from '../AmmoHelper.js'

function createElevatorScene(renderInfo, physicsInfo) {
  addElevator(renderInfo, physicsInfo)
  addElevatorShaft(renderInfo, physicsInfo)
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
  elevator.mesh.userData.physicsBody = rigidBody
  rigidBody.threeMesh = elevator.mesh
  rigidBody.threeMesh = elevator.mesh
  renderInfo.scene.add(elevator.mesh)
}

function addBall(renderInfo, physicsInfo) {
  const radius = 1.5
  const mass = 5
  const color = 0xff0000
  const pos = { x: 75, y: 2, z: -52.75 }

  const ball = new Sphere(radius, mass, color, pos)
  ball.mesh.name = 'ball'

  const rigidBody = physicsInfo.createRigidBody(ball.shape, ball.mesh, mass)
  ball.setFriction(rigidBody)
  ball.setRestituition(rigidBody)
  ball.setRollingFriction(rigidBody)

  physicsInfo.addRigidBody(rigidBody, ball.mesh)
  ball.mesh.userData.physicsBody = rigidBody
  renderInfo.scene.add(ball.mesh)
}

function addElevatorShaft(renderInfo, physicsInfo) {
  const height = 35
  const width = 6
  const depth = 1
  const elevatorShaft = new ElevatorShaft(height, width, depth, 0xc2c2c2)
  const ammoHelper = new AmmoHelper()
  const compoundShape = elevatorShaft.getCompoundShape(ammoHelper)

  const rigidBody = physicsInfo.createRigidBody(
    compoundShape,
    elevatorShaft.mesh,
    0
  )
  physicsInfo.addRigidBody(rigidBody, elevatorShaft.mesh)
  elevatorShaft.mesh.userData.physicsBody = rigidBody
  rigidBody.threeMesh = elevatorShaft.mesh
  renderInfo.scene.add(elevatorShaft.mesh)
}

export default createElevatorScene
