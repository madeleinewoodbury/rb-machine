import * as THREE from 'three'
import GUI from 'lil-gui'
import Stats from 'stats.js'
import RenderInfo from './RenderInfo.js'
import PhysicsInfo from './PhysicsInfo.js'
import AmmoHelper from './AmmoHelper.js'
import Lighting from './lights/Lighting.js'
import materials from './materials.js'

import addElevatorScene from './scenes/elevatorScene.js'
import addTubeScene from './scenes/tubeScene.js'
import addBalancingBoardScene from './scenes/balancingBoardScene.js'
import addPillarScene from './scenes/pillarScene.js'
import addWindScene from './scenes/windScene.js'
import addHammerScene from './scenes/hammerScene.js'
import addFishScene from './scenes/fishScene.js'
import addLaserGunScene from './scenes/laserGunScene.js'

class Environment {
  constructor() {
    this.canvas = document.getElementById('canvas')
    this.physicsInfo = new PhysicsInfo()
    this.renderInfo = new RenderInfo(this.canvas)
    this.stats = new Stats()
    this.ammoHelper = new AmmoHelper()
    this.mouse = new THREE.Vector2()
    this.raycaster = new THREE.Raycaster()
    this.currentIntersect = null
    this.gui = new GUI()

    this.addEventListeners()
  }

  start() {
    this.physicsInfo.setup()
    this.renderInfo.addGuiControls(this.gui)

    this.stats.showPanel(0)
    document.body.appendChild(this.stats.dom)

    this.gui.close()

    this.addSceneObjects()
    this.animate(0)
  }

  addSceneObjects() {
    this.addLights()
    this.addFloor(200, 0.01, 200)

    addFishScene(this.renderInfo, this.physicsInfo, this.ammoHelper)
    addPillarScene(this.renderInfo, this.physicsInfo, this.ammoHelper)
    addBalancingBoardScene(this.renderInfo, this.physicsInfo, this.ammoHelper)
    addElevatorScene(this.renderInfo, this.physicsInfo, this.ammoHelper)
    addTubeScene(this.renderInfo, this.physicsInfo, this.ammoHelper)
    addHammerScene(this.renderInfo, this.physicsInfo, this.ammoHelper)
    addWindScene(this.renderInfo, this.physicsInfo, this.ammoHelper)
    addLaserGunScene(this.renderInfo, this.physicsInfo, this.ammoHelper)
  }

  addFloor(width, height, depth, color) {
    const mass = 0

    const plane = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      materials.plane
    )
    plane.receiveShadow = true
    plane.position.set(0, -height / 2, 0)
    plane.name = 'floor'

    const shape = new Ammo.btBoxShape(
      new Ammo.btVector3(width * 0.5, height * 0.5, depth * 0.5)
    )
    shape.setMargin(0.05)

    const rigidBody = this.physicsInfo.createRigidBody(shape, plane, mass)
    rigidBody.setFriction(0.8)
    rigidBody.setRestitution(0.7)

    this.physicsInfo.addRigidBody(rigidBody, plane)
    this.renderInfo.scene.add(plane)

    plane.userData.rigidBody = rigidBody
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
        const elevator = this.renderInfo.scene.getObjectByName('elevator')
        elevator.start = true
      }
    }
  }

  keyDown(code) {
    const ball = this.renderInfo.scene.getObjectByName('hangingBall')
    const elevator = this.renderInfo.scene.getObjectByName('elevator')

    switch (code) {
      case 'KeyF':
        const rigidBall = ball.userData.rigidBody
        const shape = rigidBall.getCollisionShape()
        const updatedRigidbody = this.ammoHelper.createRigidBody(
          shape,
          ball,
          25
        )

        this.physicsInfo.world.removeRigidBody(rigidBall)
        this.physicsInfo.addRigidBody(updatedRigidbody, ball)

        ball.userData.rigidBody = updatedRigidbody
        break
      // case 'KeyR':
      //   this.physicsInfo.recordPlayerHingeConstraint.enableAngularMotor(
      //     true,
      //     2,
      //     10
      //   )
      // break
      // case 'ArrowUp':
      //   if (elevator.position.y < 10) console.log('eleavator up')
      //   this.moveRigidBody(elevator, { x: 0, y: 0.1, z: 0 })
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
    const motionState = mesh.userData.rigidBody.getMotionState()
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
    const elevator = this.renderInfo.scene.getObjectByName('elevator')
    const ball = this.renderInfo.scene.getObjectByName('ball')
    const hangingBall = this.renderInfo.scene.getObjectByName('hangingBall')
    const laser = this.renderInfo.scene.getObjectByName('laser')

    if (elevator.start) {
      if (elevator.position.y < 53) {
        this.moveRigidBody(elevator, { x: 0, y: 0.05, z: 0 })
        if (elevator.position.y > 52.5) {
          const force = new Ammo.btVector3(-500, 0, 0)
          const relPos = new Ammo.btVector3(1, 0, 0)
          this.physicsInfo.applyForce(ball, force, relPos)
        }
      } else {
        elevator.start = false
      }
    }

    if (
      this.physicsInfo.collisions['hammer'] === 'laserButton' &&
      hangingBall.mass === 0
    ) {
      laser.material.opacity = 1
      const rigidBall = hangingBall.userData.rigidBody
      const shape = rigidBall.getCollisionShape()
      const updatedRigidbody = this.ammoHelper.createRigidBody(
        shape,
        hangingBall,
        35
      )
      this.physicsInfo.world.removeRigidBody(rigidBall)
      this.physicsInfo.addRigidBody(updatedRigidbody, hangingBall)
      hangingBall.userData.rigidBody = updatedRigidbody
      hangingBall.mass = 35
    }
  }

  // animateButtonPress() {
  //   const laserButton = this.renderInfo.scene.getObjectByName('laserButton')
  //   const initialScale = laserButton.scale.clone()
  //   const targetScale = new THREE.Vector3(1, 0.5, 1)

  // }

  animateParticles(deltaTime) {
    const windParticles = this.renderInfo.scene.getObjectByName('windParticles')
    const speed = 3

    windParticles.position.x -= speed * deltaTime

    if (windParticles.position.x < 65) {
      windParticles.material.opacity -= 0.02

      if (windParticles.material.opacity < 0) {
        windParticles.position.x = 75
        windParticles.material.opacity += 0.1
      }
    } else if (windParticles.material.opacity < 1) {
      windParticles.material.opacity += 0.01
    }
  }

  animate(currentTime) {
    const deltaTime = this.renderInfo.clock.getDelta()

    this.stats.begin()
    this.handleIntersects()
    this.handleEvents()
    this.animateParticles(deltaTime)
    this.physicsInfo.update(deltaTime)
    this.renderInfo.update(deltaTime)
    this.stats.end()
    window.requestAnimationFrame((currentTime) => this.animate(currentTime))
  }
}

export default Environment
