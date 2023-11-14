import * as THREE from 'three'

class Camera {
  constructor(fov, near, far, name) {
    this.fov = fov
    this.near = near
    this.far = far
    this.name = name

    this.generate()
  }

  generate() {
    const aspectRatio = window.innerWidth / window.innerHeight
    this.camera = new THREE.PerspectiveCamera(this.fov, aspectRatio, this.near, this.far)
    this.camera.name = this.name
  }

  setLookAt(x, y, z) {
    this.target = new THREE.Vector3(x, y, z)
    this.camera.lookAt(this.target)
    this.camera.target = this.target
  }

  setPosition(x, y, z) {
    this.camera.position.set(x, y, z)
  }
}

export default Camera