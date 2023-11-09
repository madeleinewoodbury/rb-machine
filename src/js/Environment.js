import * as THREE from 'three'
import GUI from 'lil-gui'
import RenderInfo from './RenderInfo.js'
import PhysicsInfo from './PhysicsInfo.js'
import Lighting from './threejs/lights/Lighting.js'
import Sphere from './sceneObjects/Sphere.js'

import createElevatorScene from './scenes/elevatorScene.js'
import createTubeScene from './scenes/tubeScene.js'

class Environment {
  constructor() {
    this.canvas = document.getElementById('canvas')
    this.physicsInfo = new PhysicsInfo()
    this.renderInfo = new RenderInfo(this.canvas)
    this.mouse = new THREE.Vector2()
    this.raycaster = new THREE.Raycaster()
    this.currentIntersect = null
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
    this.addFloor(200, 0.5, 200, 0x158000, 'plane')

    createElevatorScene(this.renderInfo, this.physicsInfo)
    createTubeScene(this.renderInfo, this.physicsInfo)
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

  addBall() {
    const ball = new Sphere(1, 1, 0xff0000)
    ball.mesh.name = 'ball'
    ball.mesh.position.set(10, 1, 0)
  
    const rigidBody = this.physicsInfo.createRigidBody(ball.shape, ball.mesh, 2)
    this.physicsInfo.addRigidBody(rigidBody, ball.mesh)
    ball.mesh.userData.physicsBody = rigidBody
    this.renderInfo.scene.add(ball.mesh)
  }

  addLights() {
    const lights = new Lighting()
    lights.addLights(this.gui)
    this.renderInfo.scene.add(lights.group)
  }

  addEventListeners() {
    window.addEventListener('resize', () => this.renderInfo.resize())
    window.addEventListener('keydown', (e) => this.keyDown(e.code))
    window.addEventListener('keyup', (e) => this.keyUp(e.code))
    window.addEventListener('mousemove', (e) => this.mouseMove(e))
    window.addEventListener('click', (e) => this.mouseClick(e))
  }

  mouseMove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  }

  mouseClick(e) {
    if (this.currentIntersect) {
      if (this.currentIntersect.object.name === 'button') {
        const elevator = this.renderInfo.scene.getObjectByName('Elevator')
        elevator.start = true
      }
    }
  }

  keyDown(code) {
    const ball = this.renderInfo.scene.getObjectByName('ball')
    const elevator = this.renderInfo.scene.getObjectByName('Elevator')

    switch (code) {
      case 'KeyF':
        const force = new Ammo.btVector3(-200, 0, 0)
        const relPos = new Ammo.btVector3(1, 0, 0)
        this.physicsInfo.applyForce(ball, force, relPos)
        break
      // case 'ArrowUp':
      //   if (elevator.position.y < 10)
      //     this.moveRigidBody(elevator, { x: 0, y: 0.1, z: 0 })
      //   break
      // case 'ArrowDown':
      //   if (elevator.position.y >= 0.05)
      //     this.moveRigidBody(elevator, { x: 0, y: -0.1, z: 0 })
      case 'Digit1':
        // Camera 1
        if (this.renderInfo.activeCamera !== 'Camera 1')
          this.renderInfo.switchCamera('Camera 1')
        break
      case 'Digit2':
        // Camera 2
        if (this.renderInfo.activeCamera !== 'Camera 2')
          this.renderInfo.switchCamera('Camera 2')
        break
      case 'Digit3':
        // Camera 2
        if (this.renderInfo.activeCamera !== 'Camera 3')
          this.renderInfo.switchCamera('Camera 3')
        break
    }
  }

  keyUp(code) {}

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

  handleIntersects() {
    this.raycaster.setFromCamera(this.mouse, this.renderInfo.camera)
    const button = this.renderInfo.scene.getObjectByName('button')
    const intersectObjects = [button]
    const intersects = this.raycaster.intersectObjects(intersectObjects)

    if (intersects.length) {
      this.currentIntersect = intersects[0]
    } else {
      this.currentIntersect = null
    }
  }

  handleEvents() {
    // Move elevator
    const elevator = this.renderInfo.scene.getObjectByName('Elevator')
    const ball = this.renderInfo.scene.getObjectByName('ball')

    if (elevator.start) {
      if (elevator.position.y < 30) {
        this.moveRigidBody(elevator, { x: 0, y: 0.05, z: 0 })
        if(elevator.position.y > 29){
          const force = new Ammo.btVector3(-100, 0, 0)
          const relPos = new Ammo.btVector3(1, 0, 0)
          this.physicsInfo.applyForce(ball, force, relPos)
          console.log('Applying force');
        }
      } else {
        elevator.start = false
      }
    }
  }

  animate(currentTime) {
    const deltaTime = this.renderInfo.clock.getDelta()

    this.handleIntersects()
    this.handleEvents()
    this.physicsInfo.update(deltaTime)
    this.renderInfo.update()

    window.requestAnimationFrame((currentTime) => this.animate(currentTime))
  }
}

export default Environment
