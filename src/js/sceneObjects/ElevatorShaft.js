import * as THREE from 'three'

class ElevatorShaft {
  constructor(height, width, depth, color) {
    this.height = height
    this.width = width
    this.depth = depth
    this.color = color

    this.generate()
  }

  generate() {
    this.mesh = new THREE.Group()
    this.mesh.name = 'elevatorShaft'

    const material = new THREE.MeshStandardMaterial({ color: this.color })
    const side1 = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.depth),
      material
    )

    side1.position.set(-this.depth / 2 - 0.26, this.height / 2, 0)
    side1.rotateY(Math.PI / 2)

    const side2 = side1.clone()
    side2.position.x = 5 + this.depth / 2 - 0.25

    const top = new THREE.Mesh(new THREE.BoxGeometry(7.01, 0.5, 6), material)

    top.position.set(2.25, this.height + 0.25, 0)

    this.mesh.add(side1, side2, top)
  }
}

export default ElevatorShaft
