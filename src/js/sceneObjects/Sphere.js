import * as THREE from 'three'

class Sphere {
  constructor(radius, material) {
    this.radius = radius
    this.material = material

    // Default values
    this.friction = 0.5
    this.restituition = 0.5
    this.rollingFriction = 0.1

    this.generate()
  }

  generate() {
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, 32, 32),
      this.material
    )
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true

    this.shape = new Ammo.btSphereShape(this.radius)
    this.shape.setMargin(0.05)
  }

  setFriction(rigidBody, friction = null) {
    if (friction) this.friction = friction
    rigidBody.setFriction(this.friction)
  }

  setRestituition(rigidBody, restituition = null) {
    if (restituition) this.restituition = restituition
    rigidBody.setRestitution(this.restituition)
  }

  setRollingFriction(rigidBody, rollingFriction = null) {
    if (rollingFriction) this.rollingFriction = rollingFriction
    rigidBody.setRollingFriction(this.rollingFriction)
  }
}

export default Sphere
