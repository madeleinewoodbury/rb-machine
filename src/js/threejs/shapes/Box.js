import * as THREE from 'three'

class Box {
  constructor(pos, scale, color, castShadow = true, receiveShadow = true) {
    this.pos = pos
    this.scale = scale
    this.color = color
    this.castShadow = castShadow
    this.receiveShadow = receiveShadow

    this.generate()
  }

  generate() {
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshStandardMaterial({ color: this.color })
    )

    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z)
    this.mesh.scale.set(this.scale.x, this.scale.y, this.scale.z)
    this.mesh.castShadow = this.castShadow
    this.mesh.receiveShadow = this.receiveShadow
  }
}

export default Box
