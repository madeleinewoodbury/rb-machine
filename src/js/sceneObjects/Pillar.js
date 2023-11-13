import * as THREE from 'three'
import materials from '../materials'

class Pillar {
  constructor(baseSize, plateauSize, baseX, baseZ) {
    this.baseSize = baseSize
    this.plateauSize = plateauSize
    this.baseX = baseX
    this.baseZ = baseZ

    this.generate()
  }

  generate() {
    this.mesh = new THREE.Group()
    this.mesh.name = 'pillar'

    this.base = new THREE.Mesh(
      new THREE.BoxGeometry(this.baseSize.x, this.baseSize.y, this.baseSize.z),
      materials.white
    )
    this.base.position.set(this.baseX, this.baseSize.y / 2, this.baseZ) // z: 8
    this.base.castShadow = true
    this.mesh.add(this.base)

    this.plateau = new THREE.Mesh(
      new THREE.BoxGeometry(
        this.plateauSize.x,
        this.plateauSize.y,
        this.plateauSize.z
      ),
      materials.white
    )
    this.plateau.position.set(
      -this.plateauSize.x / 2 + this.baseSize.x / 2,
      this.baseSize.y,
      this.baseZ
    )

    this.plateau.castShadow = true
    this.mesh.add(this.plateau)
  }

  getCompoundShape(ammoHelper) {
    const compoundShape = new Ammo.btCompoundShape()
    ammoHelper.setTransform(this.base)
    const baseShape = new Ammo.btBoxShape(
      new Ammo.btVector3(
        this.baseSize.x / 2,
        this.baseSize.y / 2,
        this.baseSize.z / 2
      )
    )
    compoundShape.addChildShape(ammoHelper.transform, baseShape)

    ammoHelper.setTransform(this.plateau)
    const plateauShape = new Ammo.btBoxShape(
      new Ammo.btVector3(
        this.plateauSize.x / 2,
        this.plateauSize.y / 2,
        this.plateauSize.z / 2
      )
    )
    compoundShape.addChildShape(ammoHelper.transform, plateauShape)

    return compoundShape
  }
}

export default Pillar
