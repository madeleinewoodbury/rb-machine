import * as THREE from 'three'

class Cylinder {
  constructor(
    radius,
    height,
    material,
    radialSegments = 24,
    heightSegments = 1
  ) {
    this.radius = radius
    this.height = height
    this.material = material

    this.radialSegments = radialSegments
    this.heightSegments = heightSegments

    this.generate()
  }

  generate() {
    this.mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(
        this.radius,
        this.radius,
        this.height,
        this.radialSegments,
        this.heightSegments
      ),
      this.material
    )

    this.mesh.position.set(0, this.height / 2, 0)

    this.shape = new Ammo.btCylinderShape(
      new Ammo.btVector3(this.radius, this.height / 2, this.radius)
    )
    this.shape.setMargin(0.05)
  }
}

export default Cylinder
