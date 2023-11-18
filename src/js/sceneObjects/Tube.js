import * as THREE from 'three'
import materials from '../utils/materials.js'

/**
 * Tube class. The tube is made up of two torus geometries. The toruses
 * are positioned and rotated to form a tube.
 * @param {number} torusRadius - The radius of the torus.
 * @param {number} tubeRadius - The radius of the tube.
 */
class Tube {
  constructor(torusRadius, tubeRadius) {
    this.torusRadius = torusRadius
    this.tubeRadius = tubeRadius

    this.radialSegments = 32
    this.tubularSegments = 32
    this.arc = Math.PI / 1.5
    this.material = materials.metalGrill

    this.generate()
  }

  /**
   * Generate the tube. The tube is made up of two torus geometries. The toruses
   * are positioned and rotated to form a tube.
   */ 
  generate() {
    this.mesh = new THREE.Group()
    this.mesh.name = 'tube'

    this.tube1 = new THREE.Mesh(
      new THREE.TorusGeometry(
        this.torusRadius,
        this.tubeRadius,
        this.radialSegments,
        this.tubularSegments,
        this.arc
      ),
      this.material
    )

    this.tube1.position.set(0, 40, 0)
    this.tube1.rotateZ(1.5)
    this.tube1.castShadow = true

    this.tube2 = this.tube1.clone()
    this.tube2.rotateZ(Math.PI)
    this.tube2.position.set(-18, 31.25, 0)
    this.tube2.castShadow = true

    this.mesh.add(this.tube1, this.tube2)
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
  }

  /**
   * Get the compound shape of the tube
   * @param {AmmoHelper} ammoHelper
   * @returns {Ammo.btCompoundShape} The compound shape of the tube
   */
  getCompoundShape(ammoHelper) {
    const compoundShape = new Ammo.btCompoundShape()
    ammoHelper.setTransform(this.tube1)
    const tube1Shape = ammoHelper.generateTriangleShape(this.tube1, false)
    compoundShape.addChildShape(ammoHelper.transform, tube1Shape)

    ammoHelper.setTransform(this.tube2)
    const tube2Shape = ammoHelper.generateTriangleShape(this.tube2, false)
    compoundShape.addChildShape(ammoHelper.transform, tube2Shape)

    return compoundShape
  }
}

export default Tube
