import * as THREE from 'three'

class Elevator {
  constructor(width, height, depth, color) {
    this.mass = 0
    this.width = width
    this.height = height
    this.depth = depth
    this.color = color

    this.friction = 0.3
    this.restituition = 0.0
    this.collisionFlag = 2
    this.activatuonState = 4

    this.generate()
  }

  generate() {
    this.mesh = new THREE.Group()
    this.mesh.name = 'Elevator'

    const side1 = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.depth),
      new THREE.MeshStandardMaterial({ color: 0x0000ff })
    )
    side1.position.set(0, this.height / 2, 0)
    side1.receiveShadow = true
    side1.castShadow = true

    const side2 = side1.clone()
    side2.position.z = this.width - this.depth
    side2.receiveShadow = true
    side2.castShadow = true

    const side3 = side1.clone()
    side3.position.y = 5
    side3.position.z = this.width / 2 - this.depth / 2
    side3.rotation.x = Math.PI / 2
    side3.receiveShadow = true
    side3.castShadow = true

    const side4 = side3.clone()
    side4.scale.set(1, 1, 0.2)
    side4.position.y = this.depth * 0.1
    side4.receiveShadow = true
    side4.castShadow = true

    const sideShape = new Ammo.btBoxShape(
      new Ammo.btVector3(this.width / 2, this.height / 2, this.depth / 2)
    )

    this.shape = new Ammo.btCompoundShape()
    this.shape.addChildShape(this.getTransform(side1), sideShape)
    this.shape.addChildShape(this.getTransform(side2), sideShape)
    this.shape.addChildShape(this.getTransform(side3), sideShape)
    this.shape.addChildShape(this.getTransform(side4), sideShape)
    this.shape.setMargin(0.05)

    this.mesh.add(side1, side2, side3, side4)
    this.mesh.position.set(75, 0, -55)
    // this.mesh.rotateY(Math.PI / 2)
    this.mesh.csastShadow = true
    this.mesh.receiveShadow = true
  }

  getTransform(sideMesh) {
    const pos = sideMesh.position
    const quat = sideMesh.quaternion

    const transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))

    return transform
  }
}

export default Elevator
