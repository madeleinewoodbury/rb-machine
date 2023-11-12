import * as THREE from 'three'

class Box {
  constructor(width, height, depth, material) {
    this.width = width
    this.height = height
    this.depth = depth
    this.material = material

    this.generate()
  }

  generate() {
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.depth),
      this.material
    )
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true

    this.shape = new Ammo.btBoxShape(
      new Ammo.btVector3(this.width / 2, this.height / 2, this.depth / 2)
    )
    this.shape.setMargin(0.05)
  }
}

export default Box
