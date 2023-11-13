import * as THREE from 'three'
import materials from '../materials.js'
import Sphere from '../sceneObjects/Sphere.js'
import Cylinder from '../sceneObjects/Cylinder.js'
import Box from '../sceneObjects/Box.js'

function ropeScene(renderInfo, physicsInfo, ammoHelper) {
  const position = { x: 18, y: 0, z: 17 }
  const baseHeight = 50
  const armLength = 10
  const ropeLength = 5

  addRopeStand(renderInfo, position, baseHeight, armLength, ropeLength)

  const ballPosition = {
    x: position.x,
    y: baseHeight - ropeLength,
    z: position.z + armLength - 2,
  }
  console.log(ballPosition)
  addBall(renderInfo, physicsInfo, ballPosition)
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

function addRopeStand(renderInfo, position, baseHeight, armLength, ropeLength) {
  const ropeThing = new THREE.Group()
  ropeThing.name = 'ropeThing'

  const base = new Box(1, baseHeight, 1, materials.ropeStand)
  base.mesh.position.set(position.x, baseHeight / 2, position.z)
  ropeThing.add(base.mesh)

  const arm = new Box(1, 1, armLength, materials.ropeStand)
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

function addBall(renderInfo, physicsInfo, position) {
  const mass = 0
  const radius = 1.5

  const ball = new Sphere(radius, materials.ball)
  ball.mesh.name = 'hangingBall'
  ball.mesh.position.set(position.x, position.y, position.z)
  ball.mesh.mass = mass

  const rigidBody = physicsInfo.createRigidBody(ball.shape, ball.mesh, mass)
  ball.setFriction(rigidBody)
  ball.setRestituition(rigidBody)
  ball.setRollingFriction(rigidBody)

  physicsInfo.addRigidBody(rigidBody, ball.mesh)
  ball.mesh.userData.rigidBody = rigidBody
  renderInfo.scene.add(ball.mesh)
}

export default ropeScene
