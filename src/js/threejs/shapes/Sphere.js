import * as THREE from 'three'

class Sphere {
  constructor(
    pos,
    radius,
    quat,
    color,
    castShadow = true,
    receiveShadow = true
  ) {
    this.pos = pos
    this.radius = radius
    this.quat = quat
    this.color = color
    this.castShadow = castShadow
    this.receiveShadow = receiveShadow

    this.generate()
  }

  generate() {
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, 32, 32),
      new THREE.MeshPhongMaterial({ color: this.color })
    )

    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z)
    this.mesh.castShadow = this.castShadow
    this.mesh.receiveShadow = this.receiveShadow
  }
}

export default Sphere
