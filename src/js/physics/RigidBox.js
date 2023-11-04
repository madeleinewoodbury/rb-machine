import RigidBody from './RigidBody'

class RigidBox extends RigidBody {
  constructor(pos, quat, mass, scale) {
    super(pos, quat, mass)
    this.scale = scale

    this.createBodyAndShape()
  }

  createBodyAndShape() {
    this.shape = new Ammo.btBoxShape(
      new Ammo.btVector3(
        this.scale.x * 0.5,
        this.scale.y * 0.5,
        this.scale.z * 0.5
      )
    )
    this.shape.setMargin(0.05)
    this.shape.calculateLocalInertia(this.mass, this.localInertia)

    this.rbInfo = new Ammo.btRigidBodyConstructionInfo(
      this.mass,
      this.motionState,
      this.shape,
      this.localInertia
    )

    this.body = new Ammo.btRigidBody(this.rbInfo)
  }
}

export default RigidBox
