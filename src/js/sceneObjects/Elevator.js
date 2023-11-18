import * as THREE from 'three'
import materials from '../utils/materials.js'

/**
 * Elevator class. The shaft consist of four sides with the front and back
 * sides being open.
 * @param {height} - The height of the elevator
 * @param {width} - The width of the elevator
 * @param {depth} - The depth of the elevator
 */
class Elevator {
  constructor(width, height, depth) {
    this.width = width
    this.height = height
    this.depth = depth

    this.friction = 0.3
    this.restituition = 0.0
    this.collisionFlag = 2
    this.activatuonState = 4
    this.material = materials.metal

    this.generate()
  }

  /**
   * Generate the elevator mesh. The elevator is made of 4 sides. 
   * The elevator is open on the front and back.
   */
  generate() {
    this.mesh = new THREE.Group()
    this.mesh.name = 'elevator'

    this.side1 = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.depth),
      this.material
    )
    this.side1.position.set(0, this.height / 2, 0)
    this.side1.receiveShadow = true
    this.side1.castShadow = true

    this.side2 = this.side1.clone()
    this.side2.position.z = this.width - this.depth
    this.side2.receiveShadow = true
    this.side2.castShadow = true

    this.side3 = this.side1.clone()
    this.side3.position.y = 5
    this.side3.position.z = this.width / 2 - this.depth / 2
    this.side3.rotation.x = Math.PI / 2
    this.side3.receiveShadow = true
    this.side3.castShadow = true

    this.side4 = this.side3.clone()
    this.side4.scale.set(1, 1, 0.2)
    this.side4.position.y = this.depth * 0.1
    this.side4.receiveShadow = true
    this.side4.castShadow = true

    this.mesh.add(this.side1, this.side2, this.side3, this.side4)
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
  }

  /**
   * Get the compound shape of the elevator.
   * @param {AmmoHelper} ammoHelper
   * @returns {Ammo.btCompoundShape} The compound shape of the elevator.
   */   
  getCompoundShape(ammoHelper) {
    const sideShape = new Ammo.btBoxShape(
      new Ammo.btVector3(this.width / 2, this.height / 2, this.depth / 2)
    )
    const compoundShape = new Ammo.btCompoundShape()
    ammoHelper.setTransform(this.side1)
    compoundShape.addChildShape(ammoHelper.transform, sideShape)

    ammoHelper.setTransform(this.side2)
    compoundShape.addChildShape(ammoHelper.transform, sideShape)

    ammoHelper.setTransform(this.side3)
    compoundShape.addChildShape(ammoHelper.transform, sideShape)

    ammoHelper.setTransform(this.side4)
    compoundShape.addChildShape(ammoHelper.transform, sideShape)
    compoundShape.setMargin(0.05)

    return compoundShape
  }
}

export default Elevator
