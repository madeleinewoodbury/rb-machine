import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import GUI from 'lil-gui'
import RenderInfo from './RenderInfo.js'
import PhysicsInfo from './PhysicsInfo.js'
import Lighting from './threejs/lights/Lighting.js'
import Plane from './threejs/shapes/Plane.js'
import Sphere from './threejs/shapes/Sphere.js'
import Box from './threejs/shapes/Box.js'
import RigidSphere from './physics/RigidSphere.js'
import RigidBox from './physics/RigidBox.js'

import addDominoScene from './dominos.js'
import hammer from './hammer.js'

class Environment {
  constructor() {
    this.canvas = document.getElementById('canvas')
    this.physicsInfo = new PhysicsInfo()
    this.renderInfo = new RenderInfo(this.canvas)
    this.gui = new GUI()

    this.addEventListeners()
  }

  start() {
    this.physicsInfo.setup()
    this.renderInfo.addGuiControls(this.gui)

    this.addSceneObjects()
    this.animate(0)
  }

  addSceneObjects() {
    this.addLights()
    this.addFloor(100, 0.5, 100, 0x158000, 'plane')
    // this.addPillar()
    // // this.addBalancingBoard();
    // this.addSphere(10, 2, 0xff0000, 'sphere', { x: 0, y: 22, z: 0 })
    // this.addSphere(2, 2, 0xff0000, 'groundBall', { x: 2, y: 2.5, z: 0 })
    // this.addDominos()
    // hammer(this.renderInfo, this.physicsInfo)

    this.addEleveator()
    this.addWall()
    this.addSphere(10, 1.5, 0xff0000, 'ball', { x: 2, y: 0, z: 0 })
  }

  addLights() {
    const lights = new Lighting()
    lights.addLights(this.gui)
    this.renderInfo.scene.add(lights.group)
  }

  addFloor(width, height, depth, color, name) {
    const mass = 0

    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({ color })
    )
    mesh.receiveShadow = true
    mesh.position.set(0, -height / 2, 0)
    mesh.name = name

    const shape = new Ammo.btBoxShape(
      new Ammo.btVector3(width * 0.5, height * 0.5, depth * 0.5)
    )
    shape.setMargin(0.05)
    const rigidBody = this.physicsInfo.createRigidBody(shape, mesh, mass)
    rigidBody.setFriction(0.8)
    rigidBody.setRestitution(0.7)

    this.physicsInfo.addRigidBody(rigidBody, mesh)
    this.renderInfo.scene.add(mesh)
    mesh.userData.physicsBody = rigidBody
  }

  addSphere(mass, radius, color, name, pos = { x: 0, y: 0, z: 0 }) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 32, 32),
      new THREE.MeshStandardMaterial({ color })
    )
    mesh.position.set(pos.x, pos.y, pos.z)
    mesh.name = name
    mesh.castShadow = true
    mesh.receiveShadow = true

    const shape = new Ammo.btSphereShape(radius)
    shape.setMargin(0.05)

    const rigidBody = this.physicsInfo.createRigidBody(shape, mesh, mass)
    rigidBody.setFriction(0.5)
    rigidBody.setRestitution(0.7)

    this.physicsInfo.addRigidBody(rigidBody, mesh)
    this.renderInfo.scene.add(mesh)
    mesh.userData.physicsBody = rigidBody
  }

  addBalancingBoard() {
    const radius = 2
    const baseMass = 0
    const boardMass = 10

    const baseMesh = new THREE.Mesh(
      new THREE.SphereGeometry(
        radius,
        24,
        12,
        0,
        2 * Math.PI,
        0,
        0.5 * Math.PI
      ),
      new THREE.MeshStandardMaterial({ color: 0x0000ff })
    )
    baseMesh.position.set(8, 0, 0)

    const baseShape = new Ammo.btSphereShape(radius)
    baseShape.setMargin(0.05)

    const baseRigidBody = this.physicsInfo.createRigidBody(
      baseShape,
      baseMesh,
      baseMass
    )
    this.physicsInfo.addRigidBody(baseRigidBody, baseMesh)
    this.renderInfo.scene.add(baseMesh)
    baseMesh.userData.physicsBody = baseRigidBody

    const boardMesh = new THREE.Mesh(
      new THREE.BoxGeometry(15, 0.5, 3),
      new THREE.MeshStandardMaterial({ color: 0x0000ff })
    )
    boardMesh.position.set(8, 2.25, 0)

    const boardShape = new Ammo.btBoxShape(new Ammo.btVector3(5, 0.25, 1.5))
    boardShape.setMargin(0.05)

    const boardRigidBody = this.physicsInfo.createRigidBody(
      boardShape,
      boardMesh,
      boardMass
    )
    boardRigidBody.setDamping(0.1, 0.1)
    this.physicsInfo.addRigidBody(boardRigidBody, boardMesh)
    this.renderInfo.scene.add(boardMesh)
    boardMesh.userData.physicsBody = boardRigidBody

    // P2P Constraint
    const pivotA = new Ammo.btVector3(0, 2, 0)
    const pivotB = new Ammo.btVector3(0, 0.5, 0)

    const p2p = new Ammo.btPoint2PointConstraint(
      baseRigidBody,
      boardRigidBody,
      pivotA,
      pivotB
    )
    this.physicsInfo.world.addConstraint(p2p, false)
  }

  addPillar() {
    const pillar = new THREE.Group()
    pillar.name = 'pillar'

    const mass = 0
    const baseSize = { x: 1, y: 20, z: 5 }
    const plateauSize = { x: 15, y: 1, z: 5 }
    const baseLocalOrigin = { x: 0, y: baseSize.y / 2, z: 0 }
    const plateauLocalOrigin = {
      x: -plateauSize.x / 2 + baseSize.x / 2,
      y: baseSize.y,
      z: 0,
    }

    // base mesh
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const baseMesh = new THREE.Mesh(
      new THREE.BoxGeometry(baseSize.x, baseSize.y, baseSize.z),
      material
    )
    baseMesh.position.set(
      baseLocalOrigin.x,
      baseLocalOrigin.y,
      baseLocalOrigin.z
    )
    baseMesh.castShadow = true
    pillar.add(baseMesh)

    // plateau mesh
    const plateauMesh = new THREE.Mesh(
      new THREE.BoxGeometry(plateauSize.x, plateauSize.y, plateauSize.z),
      material
    )
    plateauMesh.position.set(
      plateauLocalOrigin.x,
      plateauLocalOrigin.y,
      plateauLocalOrigin.z
    )
    plateauMesh.castShadow = true
    pillar.add(plateauMesh)

    pillar.castShadow = true
    pillar.receiveShadow = true

    const pillarShape = new Ammo.btCompoundShape()

    // base shape
    const baseShape = new Ammo.btBoxShape(
      new Ammo.btVector3(baseSize.x / 2, baseSize.y / 2, baseSize.z / 2)
    )
    let transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(
      new Ammo.btVector3(
        baseLocalOrigin.x,
        baseLocalOrigin.y,
        baseLocalOrigin.z
      )
    )
    pillarShape.addChildShape(transform, baseShape)

    // plateau shape
    const plateauShape = new Ammo.btBoxShape(
      new Ammo.btVector3(
        plateauSize.x / 2,
        plateauSize.y / 2,
        plateauSize.z / 2
      )
    )
    transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(
      new Ammo.btVector3(
        plateauLocalOrigin.x,
        plateauLocalOrigin.y,
        plateauLocalOrigin.z
      )
    )
    pillarShape.addChildShape(transform, plateauShape)

    pillarShape.setMargin(0.05)
    const rigidPillar = this.physicsInfo.createRigidBody(
      pillarShape,
      pillar,
      mass
    )
    this.physicsInfo.addRigidBody(rigidPillar, pillar)
    pillar.userData.physicsBody = rigidPillar
    this.renderInfo.scene.add(pillar)
  }

  addDominos() {
    const pos = { x: -2, y: 20, z: 0 }
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff })

    for (let i = 0; i < 5; i++) {
      pos.x -= 2
      this.addDomino(pos, material)
    }
  }

  addDomino(pos, material) {
    const scale = { x: 0.5, y: 3, z: 2 }
    const mass = 1

    const domino = new THREE.Mesh(
      new THREE.BoxGeometry(scale.x, scale.y, scale.z),
      material
    )
    domino.position.set(pos.x, pos.y, pos.z)

    const shape = new Ammo.btBoxShape(
      new Ammo.btVector3(scale.x / 2, scale.y / 2, scale.z / 2)
    )
    shape.setMargin(0.05)
    const rigidDomino = this.physicsInfo.createRigidBody(shape, domino, mass)

    this.physicsInfo.addRigidBody(rigidDomino, domino)
    domino.userData.physicsBody = rigidDomino
    this.renderInfo.scene.add(domino)
  }

  // Kinematic body
  addEleveator() {
    const mass = 0
    const elevator = new THREE.Group()
    elevator.name = 'elevator'

    const side1 = new THREE.Mesh(
      new THREE.BoxGeometry(5, 0.5, 5),
      new THREE.MeshStandardMaterial({ color: 0x0000ff })
    )
    side1.rotation.z = Math.PI / 2
    side1.position.set(-2.25, 2.5, 0)
    elevator.add(side1)

    const side2 = side1.clone()
    side2.position.set(2.25, 2.5, 0)
    elevator.add(side2)

    const side3 = side1.clone()
    side3.scale.set(1, 0.2, 1)
    side3.rotation.z = 0
    side3.position.set(0, 5.05, 0)
    elevator.add(side3)

    const side4 = side3.clone()
    side4.position.set(0, 0.05, 0)
    side4.receiveShadow = true
    elevator.add(side4)

    elevator.position.set(2, 0, -5)
    elevator.castShadow = true
    elevator.receiveShadow = true

    const elevatorShape = new Ammo.btCompoundShape()
    const sideShape = new Ammo.btBoxShape(new Ammo.btVector3(2.5, 0.25, 2.5))

    // Side 1
    let transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(new Ammo.btVector3(-2.25, 2.5, 0))
    transform.setRotation(
      new Ammo.btQuaternion(
        side1.quaternion.x,
        side1.quaternion.y,
        side1.quaternion.z,
        side1.quaternion.w
      )
    )
    elevatorShape.addChildShape(transform, sideShape)

    // Side 2
    transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(new Ammo.btVector3(2.25, 2.5, 0))
    transform.setRotation(
      new Ammo.btQuaternion(
        side2.quaternion.x,
        side2.quaternion.y,
        side2.quaternion.z,
        side2.quaternion.w
      )
    )
    elevatorShape.addChildShape(transform, sideShape)

    // Side 3
    transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(new Ammo.btVector3(0, 5.25, 0))
    transform.setRotation(
      new Ammo.btQuaternion(
        side3.quaternion.x,
        side3.quaternion.y,
        side3.quaternion.z,
        side3.quaternion.w
      )
    )
    elevatorShape.addChildShape(transform, sideShape)

    // Side 4
    transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(new Ammo.btVector3(0, 0.25, 0))
    transform.setRotation(
      new Ammo.btQuaternion(
        side4.quaternion.x,
        side4.quaternion.y,
        side4.quaternion.z,
        side4.quaternion.w
      )
    )
    elevatorShape.addChildShape(transform, sideShape)

    elevatorShape.setMargin(0.05)
    const rigidElevator = this.physicsInfo.createRigidBody(
      elevatorShape,
      elevator,
      mass
    )
    rigidElevator.setFriction(0.5)
    rigidElevator.setRestitution(0.7)
    rigidElevator.setCollisionFlags(2)
    rigidElevator.setActivationState(4)

    this.physicsInfo.addRigidBody(rigidElevator, elevator)
    elevator.userData.physicsBody = rigidElevator
    this.renderInfo.scene.add(elevator)
  }

  addWall() {
    const mass = 0
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(10, 10, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xc2c2c2 })
    )
    wall.position.set(2, 5, -7.75)

    const shape = new Ammo.btBoxShape(new Ammo.btVector3(5, 5, 0.25))
    shape.setMargin(0.05)
    const rigidWall = this.physicsInfo.createRigidBody(shape, wall, mass)

    this.physicsInfo.addRigidBody(rigidWall, wall)
    wall.userData.physicsBody = rigidWall
    this.renderInfo.scene.add(wall)
  }

  addEventListeners() {
    window.addEventListener('resize', () => this.renderInfo.resize())
    window.addEventListener('keydown', (e) => this.keyDown(e.code))
    window.addEventListener('keyup', (e) => this.keyUp(e.code))
  }

  keyDown(code) {
    const ball = this.renderInfo.scene.getObjectByName('ball')
    const elevator = this.renderInfo.scene.getObjectByName('elevator')

    switch (code) {
      case 'KeyF':
        const force = new Ammo.btVector3(0, 0, -2000)
        const relPos = new Ammo.btVector3(0, 0, 2)
        this.physicsInfo.applyForce(ball, force, relPos)
        break
      case 'ArrowUp':
        if (elevator.position.y < 10)
          this.moveRigidBody(elevator, { x: 0, y: 0.1, z: 0 })
        break
      case 'ArrowDown':
        if (elevator.position.y >= 0.05)
          this.moveRigidBody(elevator, { x: 0, y: -0.1, z: 0 })
        break
    }
  }

  moveRigidBody(mesh, direction) {
    const transform = new Ammo.btTransform()
    const motionState = mesh.userData.physicsBody.getMotionState()
    motionState.getWorldTransform(transform)

    const position = transform.getOrigin()
    transform.setOrigin(
      new Ammo.btVector3(
        position.x() + direction.x,
        position.y() + direction.y,
        position.z() + direction.z
      )
    )
    motionState.setWorldTransform(transform)
  }

  keyUp(code) {
    console.log(code)
  }

  animate(currentTime) {
    const deltaTime = this.renderInfo.clock.getDelta()

    this.physicsInfo.update(deltaTime)
    this.renderInfo.update()

    window.requestAnimationFrame((currentTime) => this.animate(currentTime))
  }
}

export default Environment
