import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Camera from './Camera.js'

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
    this.axesHelper = new THREE.AxesHelper(100)
    this.showAxesHelper = false
    this.cameras = []
    this.activeCamera = null

    this.setupCameras()
    this.setupControls()
    this.setupRenderer()
    this.addSkyBox()
  }

  addSkyBox() {
    let imagePrefix = '/textures/SkyCubeMap/'
    let directions = ['px', 'nx', 'py', 'ny', 'pz', 'nz']
    let imageSuffix = '.png'
    let materialArray = []

    for (let i = 0; i < 6; i++)
      materialArray.push(
        new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load(
            imagePrefix + directions[i] + imageSuffix
          ),
          side: THREE.BackSide,
        })
      )

    let cubeSize = 200
    let boxGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
    const boxMesh = new THREE.Mesh(boxGeometry, materialArray)
    boxMesh.name = 'skyBoxMesh'
    boxMesh.position.x = 0
    boxMesh.position.y = 0
    boxMesh.position.z = 0

    this.scene.add(boxMesh)
  }

  setupCameras() {
    const aspectRatio = window.innerWidth / window.innerHeight

    const camera1 = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000)
    camera1.position.set(0, 60, 120)
    camera1.target = new THREE.Vector3(0, 20, 0)
    camera1.lookAt(camera1.target)
    camera1.name = 'camera1'

    this.cameras.push(camera1)
    this.scene.add(camera1)

    const camera2 = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000)
    camera2.position.set(82, 10, -54)
    camera2.target = new THREE.Vector3(70, 10, -55)
    camera2.lookAt(camera2.target)
    camera2.name = 'camera2'

    this.cameras.push(camera2)
    this.scene.add(camera2)

    const camera3 = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000)
    camera3.position.set(40, 60, -100)
    camera3.target = new THREE.Vector3(60, 40, -55)
    camera3.lookAt(camera3.target)
    camera3.name = 'camera3'

    this.cameras.push(camera3)
    this.scene.add(camera3)

    const camera4 = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000)
    camera4.position.set(-50, 40, -90)
    camera4.target = new THREE.Vector3(-10, 40, -55)
    camera4.lookAt(camera4.target)
    camera4.name = 'camera4'

    this.cameras.push(camera4)
    this.scene.add(camera4)

    const camera5 = new THREE.PerspectiveCamera(40, aspectRatio, 0.1, 1000)
    camera5.position.set(50, 50, 30)
    camera5.target = new THREE.Vector3(-50, 30, -55)
    camera5.lookAt(camera5.target)
    camera5.name = 'camera5'

    this.cameras.push(camera5)
    this.scene.add(camera5)

    const camera6 = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000)
    camera6.position.set(32, 45, 45)
    camera6.target = new THREE.Vector3(-50, 30, -55)
    camera6.lookAt(camera6.target)
    camera6.name = 'camera6'

    this.cameras.push(camera6)
    this.scene.add(camera6)

    this.activeCamera = this.cameras[0]
  }

  setupControls() {
    this.controls = new OrbitControls(this.activeCamera, this.canvas)
    this.controls.enableDamping = true
    this.controls.target = this.activeCamera.target
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.gammaInput = true
    this.renderer.gammaOutput = true
  }

  switchCamera(cameraIndex) {
    if (this.activeCamera === this.cameras[cameraIndex]) {
      return
    }

    this.activeCamera = this.cameras[cameraIndex]
    this.controls.object = this.activeCamera
    this.controls.target = this.activeCamera.target
  }

  addGuiControls(gui) {
    this.scene.add(this.axesHelper)
    if (!this.showAxesHelper) {
      this.axesHelper.visible = false
    }

    gui.add(this.axesHelper, 'visible').name('axes helper')
  }

  resize() {
    // Update cameras
    const aspectRatio = window.innerWidth / window.innerHeight
    this.cameras.forEach((camera) => {
      camera.aspect = aspectRatio
      camera.updateProjectionMatrix()
    })

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  animateSceneObjects(deltaTime) {
    const rotationSpeed = Math.PI / 2
    const blade1 = this.scene.getObjectByName('blade1')
    const blade2 = this.scene.getObjectByName('blade2')

    blade1.rotationAngle += rotationSpeed * deltaTime
    blade2.rotationAngle += rotationSpeed * deltaTime

    blade1.rotation.z = blade1.rotationAngle
    blade2.rotation.z = blade2.rotationAngle
  }

  update(deltaTime) {
    this.animateSceneObjects(deltaTime)
    this.controls.update()
    this.renderer.render(this.scene, this.activeCamera)
  }
}

export default RenderInfo
