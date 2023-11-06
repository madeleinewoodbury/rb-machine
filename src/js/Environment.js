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
    this.physicsInfo.tmpTrans = new Ammo.btTransform()

    this.renderInfo.addGuiControls(this.gui)

    this.addSceneObjects()
    this.animate(0)
  }

  addSceneObjects() {
    this.addLights()
    this.addFloor()
    addDominoScene(this.renderInfo, this.physicsInfo)
    // setTimeout(() => {
    //   hammer(this.renderInfo, this.physicsInfo)
    // }, 2000)
    // hammer(this.renderInfo, this.physicsInfo)
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

    const floor = new Plane(scale.x, scale.z, 0x158000)

    const rigidPlane = new RigidBox(pos, floor.mesh.quaternion, mass, scale)
    rigidPlane.body.setFriction(0.8)
    floor.mesh.userData.physicsBody = rigidPlane.body

    this.physicsInfo.addRigidBody(rigidPlane.body, floor.mesh)
    this.renderInfo.scene.add(floor.mesh)
    floor.mesh.userData.physicsBody = rigidPlane.body
  }

  addGoldfish() {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        transparent: true,
        opacity: 0.3,
      })
    )
    box.scale.set(20, 10, 10)
    box.position.set(0, 5.01, 0)
    this.renderInfo.scene.add(box)

    const loader = new GLTFLoader()
    loader.load('/models/Goldfish.glb', (gltf) => {
      gltf.scene.scale.set(0.1, 0.1, 0.1)
      gltf.scene.position.set(0, 5, 0)
      gltf.scene.rotation.set(0, Math.PI / 2, 0)
      this.renderInfo.scene.add(gltf.scene)
    })
  }

  addEventListeners() {
    window.addEventListener('resize', () => this.renderInfo.resize())
    window.addEventListener('keydown', (e) => this.keyDown(e.code))
    window.addEventListener('keyup', (e) => this.keyUp(e.code))
  }

  keyDown(code) {
    const sphereMesh = this.renderInfo.scene.getObjectByName('sphere')
    const plankMesh = this.renderInfo.scene.getObjectByName('plank')
    const hammerMesh = this.renderInfo.scene.getObjectByName('hammer')
    switch (code) {
      case 'KeyF':
        this.physicsInfo.applyForce(hammerMesh)
        break
    }
  }

  keyUp(code) {}

  animate(currentTime) {
    const deltaTime = this.renderInfo.clock.getDelta()

    this.physicsInfo.update(deltaTime)
    this.renderInfo.update()

    window.requestAnimationFrame((currentTime) => this.animate(currentTime))
  }
}

export default Environment
