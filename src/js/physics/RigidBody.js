class RigidBody {
  constructor(pos, quat, mass) {
    this.pos = pos
    this.quat = quat
    this.mass = mass

    this.generate()
  }

  generate() {
    this.transform = new Ammo.btTransform()
    this.transform.setIdentity()
    this.transform.setOrigin(
      new Ammo.btVector3(this.pos.x, this.pos.y, this.pos.z)
    )
    this.transform.setRotation(
      new Ammo.btQuaternion(this.quat.x, this.quat.y, this.quat.z, this.quat.w)
    )

    this.motionState = new Ammo.btDefaultMotionState(this.transform)
    this.localInertia = new Ammo.btVector3(0, 0, 0)
  }
}

export default RigidBody
