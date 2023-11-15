import * as THREE from 'three'
import materials from '../utils/materials.js'

class ElevatorShaft {
  constructor(height, width, depth) {
    this.height = height
    this.width = width
    this.depth = depth

    this.generate()
  }

  generate() {
    this.mesh = new THREE.Group()
    this.mesh.name = 'elevatorShaft'

    this.side1 = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.depth),
      materials.metalGrill
    )

    this.side1.position.set(-this.depth / 2 - 0.26, this.height / 2, 0)
    this.side1.rotateY(Math.PI / 2)

    this.side2 = this.side1.clone()
    this.side2.position.x = 5 + this.depth / 2 - 0.25

    this.side3 = new THREE.Mesh(
      new THREE.BoxGeometry(5, this.height - 5, this.depth),
      materials.metalGrill
    )
    this.side3.position.set(2.5, this.height / 2 + 2.75, this.width /2)
    this.side3.wireframe = false
    // this.side3.rotateY(Math.PI / 2)
    
    this.side4 = new THREE.Mesh(
      new THREE.BoxGeometry(5, this.height - 6, this.depth),
      materials.metalGrill
    )
    this.side4.wireframe = false
    this.side4.position.set(2.5, this.height / 2 - 3, -this.width /2)

    this.top = new THREE.Mesh(
      new THREE.BoxGeometry(7.01, 0.5, 6),
      materials.metalGrill
    )

    this.top.wireframe = false

    this.top.name = 'top'
    this.top.position.set(2.25, this.height + 0.25, 0)

    this.mesh.add(this.side1, this.side2, this.side3, this.side4, this.top)
    this.mesh.rotateY(Math.PI / 2)

    this.button = new THREE.Mesh(
      new THREE.ConeGeometry(0.25, 0.75, 2),
      materials.yellow
    )
    this.button.name = 'button'
    this.button.rotateY(Math.PI / 2)
    this.button.position.set(5.25, 5, 3.01)

    this.mesh.add(this.button)
  }

  getCompoundShape(ammoHelper) {
    const compoundShape = new Ammo.btCompoundShape()
    ammoHelper.setTransform(this.side1)
    const sideShape = new Ammo.btBoxShape(
      new Ammo.btVector3(this.width / 2, this.height / 2, this.depth / 2)
    )
    compoundShape.addChildShape(ammoHelper.transform, sideShape)
    ammoHelper.setTransform(this.side2)
    compoundShape.addChildShape(ammoHelper.transform, sideShape)

    const topShape = new Ammo.btBoxShape(new Ammo.btVector3(3.5, 0.25, 3))
    ammoHelper.setTransform(this.top)
    compoundShape.addChildShape(ammoHelper.transform, topShape)

    const buttonShape = ammoHelper.generateTriangleShape(this.button, true)
    ammoHelper.setTransform(this.button)
    compoundShape.addChildShape(ammoHelper.transform, buttonShape)

    return compoundShape
  }
}

export default ElevatorShaft
