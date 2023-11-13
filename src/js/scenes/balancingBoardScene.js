import * as THREE from 'three'
import materials from '../materials.js'
import Sphere from '../sceneObjects/Sphere.js'
import Box from '../sceneObjects/Box.js'
import Cylinder from '../sceneObjects/Cylinder.js'

function balancingBoardScene(renderInfo, physicsInfo, ammoHelper) {
  const position = { x: 25, y: 0, z: 25 }

  const cylinder = new Cylinder(0.5, 5, materials.balancingBoard)
  cylinder.mesh.position.x = position.x
  cylinder.mesh.position.z = position.z
  const cylinderBody = ammoHelper.createRigidBody(
    cylinder.shape,
    cylinder.mesh,
    0
  )
  physicsInfo.addRigidBody(cylinderBody, cylinder.mesh)
  renderInfo.scene.add(cylinder.mesh)
  cylinder.mesh.userData.rigidBody = cylinderBody

  const boardGroup = new THREE.Group()
  const compoundShape = new Ammo.btCompoundShape()

  const board = new Box(20, 0.5, 3, materials.balancingBoard)
  board.mesh.position.set(0, cylinder.height + board.height / 2, 0)
  boardGroup.add(board.mesh)

  ammoHelper.setTransform(board.mesh)
  compoundShape.addChildShape(ammoHelper.transform, board.shape)

  const boardEdge = new Box(0.5, 1.5, 3, materials.balancingBoard)
  boardEdge.mesh.position.set(
    10 - boardEdge.width / 2,
    cylinder.height + board.height + boardEdge.height / 2,
    0
  )
  boardGroup.add(boardEdge.mesh)

  ammoHelper.setTransform(boardEdge.mesh)
  compoundShape.addChildShape(ammoHelper.transform, boardEdge.shape)

  boardGroup.position.set(position.x, position.y, position.z)

  const boardBody = ammoHelper.createRigidBody(compoundShape, boardGroup, 2)
  physicsInfo.addRigidBody(boardBody, boardGroup)
  boardGroup.userData.rigidBody = boardBody
  renderInfo.scene.add(boardGroup)

  // Add constraints
  const pivotA = new Ammo.btVector3(0, 0, 0)
  const pivotB = new Ammo.btVector3(0, 3, 0)

  physicsInfo.addP2PConstraint(cylinderBody, boardBody, pivotA, pivotB)

  const ballPosition = { x: position.x + 5, y: 5.5, z: position.z }
  addBall(renderInfo, physicsInfo, ballPosition)
}

function addBall(renderInfo, physicsInfo, position) {
  const mass = 2
  const radius = 1.5

  const ball = new Sphere(radius, materials.ball)
  ball.mesh.position.set(position.x, position.y, position.z)

  const rigidBody = physicsInfo.createRigidBody(ball.shape, ball.mesh, mass)
  ball.setFriction(rigidBody)
  ball.setRestituition(rigidBody)
  ball.setRollingFriction(rigidBody)

  physicsInfo.addRigidBody(rigidBody, ball.mesh)
  renderInfo.scene.add(ball.mesh)
  ball.mesh.userData.rigidBody = rigidBody
  rigidBody.threeMesh = ball.mesh
}

export default balancingBoardScene
