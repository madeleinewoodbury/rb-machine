import * as THREE from 'three'
import materials from '../materials.js'
import Cylinder from './Cylinder.js'

class Hammer {
  constructor(handleRadius, height, malletRadius, malletWidth) {
    this.handleRadius = handleRadius
    this.height = height
    this.malletRadius = malletRadius
    this.malletWidth = malletWidth

    this.group = new THREE.Group()
    this.group.name = 'hammer'

    this.addHandle()
    this.addMallet()
  }

  addHandle() {
    this.handle = new Cylinder(
      this.handleRadius,
      this.height,
      materials.hammerHandle
    )
    this.group.add(this.handle.mesh)
  }

  addMallet() {
    this.mallet = new Cylinder(
      this.malletRadius,
      this.malletWidth,
      materials.black
    )
    this.mallet.mesh.position.set(0, this.height, 0)
    this.mallet.mesh.rotation.set(0, 0, Math.PI / 2)
    this.group.add(this.mallet.mesh)
  }

  getCompoundShape(ammoHelper) {
    const compoundShape = new Ammo.btCompoundShape()
    ammoHelper.setTransform(this.handle.mesh)
    compoundShape.addChildShape(ammoHelper.transform, this.handle.shape)

    ammoHelper.setTransform(this.mallet.mesh)
    compoundShape.addChildShape(ammoHelper.transform, this.mallet.shape)

    compoundShape.setMargin(0.05)
    return compoundShape
  }
}

export default Hammer
