import RigidBody from './RigidBody'

class RigidSphere extends RigidBody {
  constructor(pos, quat, mass, radius) {
    super(pos, quat, mass)
    this.radius = radius

    this.createBodyAndShape()
  }

  createBodyAndShape() {
    this.shape = new Ammo.btSphereShape(this.radius)
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

export default RigidSphere
