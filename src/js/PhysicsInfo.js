class PhysicsInfo {
  constructor(gravity = -9.82) {
    this.gravity = gravity
    this.world = undefined
    this.rigidBodies = []
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

  addRigidBody(body, mesh) {
    if (body.collisionGroup && body.collisionMask) {
      this.world.addRigidBody(body, body.collisionGroup, body.collisionMask)
    } else {
      this.world.addRigidBody(body)
    }

    this.rigidBodies.push(mesh)
  }

  update(deltaTime) {
    // Step world
    this.world.stepSimulation(deltaTime, 10)

    // Update rigid bodies
    for (let i = 0; i < this.rigidBodies.length; i++) {
      const mesh = this.rigidBodies[i]
      const body = mesh.userData.physicsBody
      const motionState = body.getMotionState()

      if (motionState) {
        motionState.getWorldTransform(this.tmpTrans)
        const p = this.tmpTrans.getOrigin()
        const q = this.tmpTrans.getRotation()
        mesh.position.set(p.x(), p.y(), p.z())
        mesh.quaternion.set(q.x(), q.y(), q.z(), q.w())
      }
    }
  }
}

export default PhysicsInfo
