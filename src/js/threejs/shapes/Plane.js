import * as THREE from 'three'

class Plane {
  constructor(height, width, color, receiveShadow = true, castShadow = false) {
    this.height = height
    this.width = width
    this.color = color

    this.receiveShadow = receiveShadow
    this.castShadow = castShadow

    this.generate()
  }

  generate() {
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(this.width, this.height, 1, 1),
      new THREE.MeshStandardMaterial({
        color: this.color,
        side: THREE.DoubleSide,
      })
    )

    this.mesh.geometry.rotateX(-Math.PI / 2)
    this.mesh.receiveShadow = this.receiveShadow
    this.mesh.castShadow = this.castShadow
  }
}

export default Plane
