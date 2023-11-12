import * as THREE from 'three'
import materials from '../materials.js'
import Cylinder from './Cylinder.js'
import Box from './Box.js'

class Fan {
  constructor(baseRadius, baseHeight) {
    this.baseRadius = baseRadius
    this.baseHeight = baseHeight

    this.group = new THREE.Group()
    this.group.name = 'Fan'

    this.addBase()
    this.addTop()
    this.addBlade()
  }

  addBase() {
    this.base = new Cylinder(this.baseRadius, this.baseHeight, materials.fan)
    this.group.add(this.base.mesh)
  }

  addTop() {
    this.top = new Cylinder(
      (this.baseRadius = 0.75),
      this.baseRadius * 3,
      materials.fan
    )
    this.top.mesh.position.set(
      0,
      this.baseHeight - this.baseRadius * 2,
      this.baseRadius
    )
    this.top.mesh.rotateX(Math.PI / 2)
    this.group.add(this.top.mesh)
  }

  addBlade() {
    this.blade = new Box(10, 0.5, 0.1, materials.fan)
    this.blade.mesh.position.set(
      0,
      this.top.mesh.position.y,
      this.top.mesh.position.z + this.top.mesh.geometry.parameters.height / 2
    )

    this.group.add(this.blade.mesh)
  }

  //   getCompoundShape(ammoHelper) {
  //     const compoundShape = new Ammo.btCompoundShape()
  //     ammoHelper.setTransform(this.handle.mesh)
  //     compoundShape.addChildShape(ammoHelper.transform, this.handle.shape)

  //     ammoHelper.setTransform(this.mallet.mesh)
  //     compoundShape.addChildShape(ammoHelper.transform, this.mallet.shape)

  //     compoundShape.setMargin(0.05)
  //     return compoundShape
  //   }
}

export default Fan
