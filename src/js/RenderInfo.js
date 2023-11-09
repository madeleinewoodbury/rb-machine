import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Class representing the render information. This class is responsible for
 * setting up the camera, controls, and renderer.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 */
class RenderInfo {
  constructor(canvas) {
    this.canvas = canvas
    this.scene = new THREE.Scene()
    this.clock = new THREE.Clock()
    this.target = new THREE.Vector3(0, 30, 0)
    this.axesHelper = new THREE.AxesHelper(100)
    this.showAxesHelper = false
    this.activeCamera = 'Camera 1'

    this.setupCamera()
    this.setupControls()
    this.setupRenderer()
  }

  setupCamera() {
    this.setupCameras()
    this.camera = this.scene.getObjectByName(this.activeCamera)
  }

  setupCameras() {
    this.camera1 = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera1.position.set(0, 50, 55)
    this.camera1.lookAt(this.target)
    this.camera1.name = 'Camera 1'
    this.scene.add(this.camera1)

    this.camera2 = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera2.position.set(0, 30, 0)
    this.camera2.lookAt(this.target)
    this.camera2.name = 'Camera 2'
    this.scene.add(this.camera2)
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true
    this.controls.target = this.target
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0x6de1ff)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.gammaInput = true
    this.renderer.gammaOutput = true
  }

  switchCamera(cameraName) {
    this.activeCamera = cameraName
    this.camera = this.scene.getObjectByName(this.activeCamera)
    this.controls.object = this.camera
  }

  addGuiControls(gui) {
    this.scene.add(this.axesHelper)
    if (!this.showAxesHelper) {
      this.axesHelper.visible = false
    }

    gui.add(this.axesHelper, 'visible').name('axes helper')
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  update() {
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }
}

export default RenderInfo
