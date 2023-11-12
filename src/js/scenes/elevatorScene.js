import * as THREE from 'three'
import Elevator from '../sceneObjects/Elevator.js'
import ElevatorShaft from '../sceneObjects/ElevatorShaft.js'
import Sphere from '../sceneObjects/Sphere.js'
import materials from '../materials.js'

function createElevatorScene(renderInfo, physicsInfo, ammoHelper) {
  addElevator(renderInfo, physicsInfo, ammoHelper)
  addElevatorShaft(renderInfo, physicsInfo, ammoHelper)
  addBall(renderInfo, physicsInfo)
}

function addElevator(renderInfo, physicsInfo, ammoHelper) {
  const width = 5
  const height = 5
  const depth = 0.5
  const color = 0x0000ff

  const elevator = new Elevator(width, height, depth, color)
  elevator.mesh.position.set(55, 0, -55)
  const elevatorShape = elevator.getCompoundShape(ammoHelper)
  const rigidBody = physicsInfo.createRigidBody(
    elevatorShape,
    elevator.mesh,
    elevator.mass
  )

  rigidBody.setFriction(elevator.friction)
  rigidBody.setRestitution(elevator.restituition)
  rigidBody.setCollisionFlags(elevator.collisionFlag)
  rigidBody.setActivationState(elevator.activatuonState)

  physicsInfo.addRigidBody(rigidBody, elevator.mesh)
  renderInfo.scene.add(elevator.mesh)
  elevator.mesh.userData.rigidBody = rigidBody
  rigidBody.threeMesh = elevator.mesh
}

function addElevatorShaft(renderInfo, physicsInfo, ammoHelper) {
  const mass = 0
  const height = 39
  const width = 6
  const depth = 1
  const elevatorShaft = new ElevatorShaft(height, width, depth)
  elevatorShaft.mesh.position.set(55, 0, -50.5)

  const compoundShape = elevatorShaft.getCompoundShape(ammoHelper)

  const rigidBody = physicsInfo.createRigidBody(
    compoundShape,
    elevatorShaft.mesh,
    mass
  )
  physicsInfo.addRigidBody(rigidBody, elevatorShaft.mesh)
  renderInfo.scene.add(elevatorShaft.mesh)
  elevatorShaft.mesh.userData.rigidBody = rigidBody
  rigidBody.threeMesh = elevatorShaft.mesh
}

function addBall(renderInfo, physicsInfo) {
  const radius = 1.5
  const mass = 8
  const pos = { x: 55, y: 2, z: -52.75 }

  const ball = new Sphere(radius, materials.ball)
  ball.mesh.position.set(pos.x, pos.y, pos.z)
  ball.mesh.name = 'ball'

  const rigidBody = physicsInfo.createRigidBody(ball.shape, ball.mesh, mass)
  ball.setFriction(rigidBody)
  ball.setRestituition(rigidBody)
  ball.setRollingFriction(rigidBody)

  physicsInfo.addRigidBody(rigidBody, ball.mesh)
  renderInfo.scene.add(ball.mesh)
  ball.mesh.userData.rigidBody = rigidBody
}

export default createElevatorScene
