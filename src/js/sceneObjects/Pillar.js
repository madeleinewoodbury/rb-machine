import * as THREE from 'three';

class Pillar {
  constructor() {
    this.baseSize = {x: 1, y:30, z: 7}
    this.plateauSize = {x: 25, y: 1, z: 7}

    this.generate()
  }

  generate() {
    this.mesh = new THREE.Group()
    this.mesh.name = 'pillar'

    const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
    this.base = new THREE.Mesh(
      new THREE.BoxGeometry(this.baseSize.x, this.baseSize.y, this.baseSize.z),
      material
    )
    this.base.position.set(0, this.baseSize.y / 2, 0 )
    this.base.castShadow = true
    this.mesh.add(this.base)

    this.plateau = new THREE.Mesh(
      new THREE.BoxGeometry(this.plateauSize.x, this.plateauSize.y, this.plateauSize.z),
      material
    )
    this.plateau.position.set( -this.plateauSize.x / 2 + this.baseSize.x / 2, this.baseSize.y, 0)
    this.plateau.castShadow = true
    this.mesh.add(this.plateau)
  }

  getCompoundShape(ammoHelper) {
    const compoundShape = new Ammo.btCompoundShape()
    ammoHelper.setTransform(this.base)
    const baseShape = new Ammo.btBoxShape(new Ammo.btVector3(this.baseSize.x / 2, this.baseSize.y / 2, this.baseSize.z / 2))
    compoundShape.addChildShape(ammoHelper.transform, baseShape)

    ammoHelper.setTransform(this.plateau)
    const plateauShape = new Ammo.btBoxShape(new Ammo.btVector3(this.plateauSize.x / 2, this.plateauSize.y / 2, this.plateauSize.z / 2))
    compoundShape.addChildShape(ammoHelper.transform, plateauShape)

    return compoundShape
  }
}

export default Pillar;