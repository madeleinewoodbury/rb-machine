import * as THREE from 'three'
import materials from '../utils/materials'

/**
 * LaserButton class. The laser button is made up of a base and a button.
 * The base is a box geometry and the button is a cylinder geometry.
 * @param {number} baseWidth - The width of the base.
 * @param {number} baseHeight - The height of the base.
 * @param {number} baseDepth - The depth of the base.
 * @param {number} radius - The radius of the button.
 * @param {number} buttonHeight - The height of the button.
 */ 
class LaserButton {
  constructor(baseWidth, baseHeight, baseDepth, radius, buttonHeight) {
    this.baseWidth = baseWidth
    this.baseHeight = baseHeight
    this.baseDepth = baseDepth
    this.radius = radius
    this.buttonHeight = buttonHeight

    this.generate()
  }

  /**
   * Generate the laser button. The laser button is made up of a base and a button.
   */
  generate() {
    this.mesh = new THREE.Group()
    this.mesh.name = 'laserButton'

    this.base = new THREE.Mesh(
      new THREE.BoxGeometry(this.baseWidth, this.baseHeight, this.baseDepth),
      materials.grey
    )
    this.base.position.set(0, this.baseHeight / 2, 0)
    this.base.castShadow = true
    this.mesh.add(this.base)

    this.button = new THREE.Mesh(
      new THREE.CylinderGeometry(this.radius, this.radius, this.buttonHeight),
      materials.red )
    this.button.position.set(0, this.baseHeight + this.buttonHeight / 2, 0)
    this.button.castShadow = true
    this.mesh.add(this.button)
  }


  /**
   * Get the compound shape of the laser button
   * @param {AmmoHelper} ammoHelper
   * @returns {Ammo.btCompoundShape} The compound shape of the laser button
   */
  getCompoundShape(ammoHelper) {
    const compoundShape = new Ammo.btCompoundShape()
    ammoHelper.setTransform(this.base)
    const baseShape = new Ammo.btBoxShape(
      new Ammo.btVector3(
        this.baseWidth / 2,
        this.baseHeight / 2,
        this.baseDepth / 2)
    )
    compoundShape.addChildShape(ammoHelper.transform, baseShape)

    ammoHelper.setTransform(this.button)
    const buttonShape = new Ammo.btCylinderShape(
      new Ammo.btVector3(this.radius, this.buttonHeight / 2, this.radius)
    )
    compoundShape.addChildShape(ammoHelper.transform, buttonShape)

    return compoundShape
  }
}

export default LaserButton
