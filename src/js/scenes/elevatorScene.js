import * as THREE from 'three'
import Elevator from '../sceneObjects/Elevator.js'
import ElevatorShaft from '../sceneObjects/ElevatorShaft.js'
import Sphere from '../sceneObjects/Sphere.js'
import AmmoHelper from '../AmmoHelper.js'

function createElevatorScene(renderInfo, physicsInfo) {
  addElevator(renderInfo, physicsInfo)
  addElevatorShaft(renderInfo, physicsInfo)
  // addElevatorButton(renderInfo, physicsInfo)
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

  // const elevatorShaft = new ElevatorShaft(35, 6, 1, 0xc2c2c2)
  // const button = new THREE.Mesh(
  //   new THREE.ConeGeometry(0.25, 0.75, 2),
  //   new THREE.MeshStandardMaterial({ color: 0xffff00 })
  // )
  // button.name = 'button'
  // button.rotateY(Math.PI / 2)
  // button.position.set(5.25, 5, 3.01)
  
  // elevatorGroup.add(elevator.mesh, elevatorShaft.mesh, button)
  // elevatorGroup.rotateY(Math.PI / 2)
  // elevatorGroup.position.set(75, 0, -55)

  // renderInfo.scene.add(elevatorGroup)
}

function addBall(renderInfo, physicsInfo) {
  const radius = 1.25
  const mass = 10
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

  const rigidBody = physicsInfo.createRigidBody(compoundShape, elevatorShaft.mesh, 0)
  physicsInfo.addRigidBody(rigidBody, elevatorShaft.mesh)
  elevatorShaft.mesh.userData.physicsBody = rigidBody
  rigidBody.threeMesh = elevatorShaft.mesh
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
