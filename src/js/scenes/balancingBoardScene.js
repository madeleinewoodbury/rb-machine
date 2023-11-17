import * as THREE from 'three'
import materials from '../utils/materials.js'
import Sphere from '../sceneObjects/Sphere.js'
import Box from '../sceneObjects/Box.js'
import Cylinder from '../sceneObjects/Cylinder.js'

function addBalancingBoardScene(renderInfo, physicsInfo, ammoHelper) {
  const position = { x: 34, y: 0, z: 25 }
  const ballPosition = { x: position.x + 5, y: 5.5, z: position.z }

  const ropePosition = { x: 27, y: 0, z: 17 }
  const baseHeight = 50
  const armLength = 10
  const ropeLength = 5
  const hangingBallPosition = {
    x: ropePosition.x,
    y: baseHeight - ropeLength,
    z: ropePosition.z + armLength - 2,
  }

  addBalancingBoard(renderInfo, physicsInfo, ammoHelper, position)
  addBall(renderInfo, physicsInfo, ballPosition, 2.2, 'balancingBall')
  addRopeStand(renderInfo, ropePosition, baseHeight, armLength, ropeLength)
  addBall(renderInfo, physicsInfo, hangingBallPosition, 0, 'hangingBall')
}

function addBalancingBoard(renderInfo, physicsInfo, ammoHelper, position) {
  const lightWoodMaterial = materials.wood.clone()
  lightWoodMaterial.color.set(0xffffff)

  const cylinder = new Cylinder(0.5, 5, lightWoodMaterial)
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

  const board = new Box(20, 0.5, 3, lightWoodMaterial)
  board.mesh.position.set(0, cylinder.height + board.height / 2, 0)
  boardGroup.add(board.mesh)

  ammoHelper.setTransform(board.mesh)
  compoundShape.addChildShape(ammoHelper.transform, board.shape)

  const boardEdge = new Box(0.5, 1.5, 3, lightWoodMaterial)
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
}

function addRopeStand(renderInfo, position, baseHeight, armLength, ropeLength) {
  const ropeThing = new THREE.Group()
  ropeThing.name = 'ropeThing'

  const base = new Box(1, baseHeight, 1, materials.wood)
  base.mesh.position.set(position.x, baseHeight / 2, position.z)
  ropeThing.add(base.mesh)

  const arm = new Box(1, 1, armLength, materials.wood)
  arm.mesh.position.set(
    position.x,
    baseHeight + arm.height / 2,
    position.z + armLength / 2 - arm.width / 2
  )
  ropeThing.add(arm.mesh)

  const rope = addRope(ropeLength)
  rope.position.set(
    position.x,
    baseHeight - ropeLength,
    position.z + armLength - 2
  )
  ropeThing.add(rope)

  renderInfo.scene.add(ropeThing)
}

function addRope(ropeLength) {
  const material = new THREE.LineBasicMaterial({ color: 0x000000 })
  const points = []

  points.push(new THREE.Vector3(0, 0, 0))
  points.push(new THREE.Vector3(0, ropeLength, 0))

  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const line = new THREE.Line(geometry, material)

  return line
}

function addBall(renderInfo, physicsInfo, position, mass, name) {
  const radius = 1.5

  const ball = new Sphere(radius, materials.red)
  ball.mesh.name = name
  ball.mesh.position.set(position.x, position.y, position.z)
  ball.mesh.mass = mass

  const rigidBody = physicsInfo.createRigidBody(ball.shape, ball.mesh, mass)
  ball.setFriction(rigidBody)
  ball.setRestituition(rigidBody)
  ball.setRollingFriction(rigidBody)

  physicsInfo.addRigidBody(rigidBody, ball.mesh)
  renderInfo.scene.add(ball.mesh)
  ball.mesh.userData.rigidBody = rigidBody
  rigidBody.threeMesh = ball.mesh
}

export default addBalancingBoardScene
