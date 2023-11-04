import * as THREE from 'three'
import GUI from 'lil-gui'
import RenderInfo from './RenderInfo.js'
import PhysicsInfo from './PhysicsInfo.js'
import Lighting from './threejs/lights/Lighting.js'
import Plane from './threejs/shapes/Plane.js'
import Sphere from './threejs/shapes/Sphere.js'
import RigidSphere from './physics/RigidSphere.js'
import RigidBox from './physics/RigidBox.js'

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
    this.physicsInfo.tmpTrans = new Ammo.btTransform()

    this.renderInfo.addGuiControls(this.gui)

    this.addSceneObjects()
    this.animate(0)
  }

  addSceneObjects() {
    this.addLights()
    this.addFloor()
    this.addSphere()
  }

  addLights() {
    const lights = new Lighting()
    lights.addLights(this.gui)
    this.renderInfo.scene.add(lights.group)
  }

  addFloor() {
    const pos = { x: 0, y: 0, z: 0 }
    const scale = { x: 100, y: 0, z: 100 }
    const mass = 0

    const floor = new Plane(scale.x, scale.z, 0x00ff00)

    const rigidPlane = new RigidBox(pos, floor.mesh.quaternion, mass, scale)
    floor.mesh.userData.physicsBody = rigidPlane.body

    this.physicsInfo.addRigidBody(rigidPlane.body, floor.mesh)
    this.renderInfo.scene.add(floor.mesh)
    floor.mesh.userData.physicsBody = rigidPlane.body
  }

  addSphere() {
    const pos = { x: 0, y: 20, z: 0 }
    const radius = 2
    const qaut = { x: 0, y: 0, z: 0, w: 1 }
    const mass = 1

    const sphere = new Sphere(pos, radius, qaut, 0xff0000)
    this.renderInfo.scene.add(sphere.mesh)

    const rigidSphere = new RigidSphere(pos, qaut, mass, radius)
    this.physicsInfo.addRigidBody(rigidSphere.body, sphere.mesh)
    sphere.mesh.userData.physicsBody = rigidSphere.body
  }

  addEventListeners() {
    window.addEventListener('resize', () => this.renderInfo.resize())
    window.addEventListener('keydown', (e) => this.renderInfo.keyDown(e.code))
    window.addEventListener('keyup', (e) => this.renderInfo.keyUp(e.code))
  }

  animate(currentTime) {
    const deltaTime = this.renderInfo.clock.getDelta()

    this.physicsInfo.update(deltaTime)
    this.renderInfo.update()

    window.requestAnimationFrame((currentTime) => this.animate(currentTime))
  }
}

export default Environment
