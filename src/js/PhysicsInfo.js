class PhysicsInfo {
  constructor(gravity = -9.82) {
    this.gravity = gravity
    this.world = undefined
    this.bodies = []
    this.tmpTrans = undefined
  }

  /**
   * @description Sets up the physics world by setting up the collision configuration,
   * dispatcher, broadphase, and solver. It also sets the gravity of the world.
   * @returns {void}
   */
  setup() {
    const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration()
    const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration)
    const overlappingPairCache = new Ammo.btDbvtBroadphase()
    const solver = new Ammo.btSequentialImpulseConstraintSolver()

    this.world = new Ammo.btDiscreteDynamicsWorld(
      dispatcher,
      overlappingPairCache,
      solver,
      collisionConfiguration
    )
    this.world.setGravity(new Ammo.btVector3(0, this.gravity, 0))
  }
}

export default PhysicsInfo
