import * as THREE from 'three'
import materials from '../utils/materials.js'

/**
 * ElevatorShaft class. The shaft consist of two sides where the elevator will
 * be in between.
 * @param {height} - The height of the elevator shaft
 * @param {width} - The width of the elevator shaft
 * @param {depth} - The depth of the elevator shaft
 */
class ElevatorShaft {
  constructor(height, width, depth) {
    this.height = height
    this.width = width
    this.depth = depth
    this.material = materials.tube

    this.generate()
  }

  /**
   * Generate the elevator shaft. The shaft is made up of two sides and a top
   */ 
  generate() {
    this.mesh = new THREE.Group()
    this.mesh.name = 'elevatorShaft'

    this.side1 = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.depth),
      this.material
    )

    this.side1.position.set(-this.depth / 2 - 0.26, this.height / 2, 0)
    this.side1.rotateY(Math.PI / 2)

    this.side2 = this.side1.clone()
    this.side2.position.x = 5 + this.depth / 2 - 0.25

    this.top = new THREE.Mesh(
      new THREE.BoxGeometry(7.01, 0.5, 6),
      this.material
    )
    this.top.wireframe = false
    this.top.name = 'top'
    this.top.position.set(2.25, this.height + 0.25, 0)

    this.mesh.add(this.side1, this.side2, this.top)
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

  /**
   * Get the compound shape of the elevator.
   * @param {AmmoHelper} ammoHelper
   * @returns {Ammo.btCompoundShape} The compound shape of the elevator.
   */ 
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
