import * as THREE from 'three'

class PhysicsInfo {
  constructor(gravity = -9.82) {
    this.gravity = gravity
    this.world = undefined
    this.rigidBodies = []
    this.tmpTrans = undefined

    this.collisionGroup = {
      plane: 1,
      hammer: 2,
    }
  }

  /**
   * @description Sets up the physics world by setting up the collision configuration,
   * dispatcher, broadphase, and solver. It also sets the gravity of the world.
   * @returns {void}
   */
  setup() {
    this.tmpTrans = new Ammo.btTransform()

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

  addP2PConstraint(bodyA, bodyB, pivotA, pivotB) {
    const p2p = new Ammo.btPoint2PointConstraint(bodyA, bodyB, pivotA, pivotB)
    this.world.addConstraint(p2p, true)
  }

  addHingeConstraint(bodyA, bodyB, pivotA, pivotB, axisA, axisB) {
    const hingeConstraint = new Ammo.btHingeConstraint(
      bodyA,
      bodyB,
      pivotA,
      pivotB,
      axisA,
      axisB,
      true
    )

    hingeConstraint.enableAngularMotor(true, 1, 50)
    this.world.addConstraint(hingeConstraint, false)
  }

  applyForce(mesh, force, relPos) {
    if (!mesh.userData.physicsBody) return

    const rigidBody = mesh.userData.physicsBody
    rigidBody.activate(true)
    rigidBody.applyForce(force, relPos)
  }

  applyImpluse(rbBody, force, direction) {
    rbBody.activate(true)
    const impulseVector = new Ammo.btVector3(
      force * direction.x,
      force * direction.y,
      force * direction.z
    )
    rbBody.applyCentralImpulse(impulseVector)
  }

  createRigidBody(shape, mesh, mass) {
    const transform = new Ammo.btTransform()
    transform.setIdentity()

    const pos = mesh.position
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))

    const quat = mesh.quaternion
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))

    const scale = mesh.scale
    shape.setLocalScaling(new Ammo.btVector3(scale.x, scale.y, scale.z))

    const motionState = new Ammo.btDefaultMotionState(transform)
    const localInertia = new Ammo.btVector3(0, 0, 0)
    shape.calculateLocalInertia(mass, localInertia)

    const rbInfo = new Ammo.btRigidBodyConstructionInfo(
      mass,
      motionState,
      shape,
      localInertia
    )
    const body = new Ammo.btRigidBody(rbInfo)

    return body
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

    // collision detection
    this.checkCollisions()
  }

  checkCollisions() {
    // Find all possible contact points (broadsphase)
    const numManifolds = this.world.getDispatcher().getNumManifolds()
    for (let i = 0; i < numManifolds; i++) {
      const contactManifold = this.world
        .getDispatcher()
        .getManifoldByIndexInternal(i)
      const numContacts = contactManifold.getNumContacts()

      if (numContacts > 0) {
        // Get the objects involved in the collision and convert them to rigid bodies
        const rigidBody0 = Ammo.castObject(
          contactManifold.getBody0(),
          Ammo.btRigidBody
        )
        const rigidBody1 = Ammo.castObject(
          contactManifold.getBody1(),
          Ammo.btRigidBody
        )

        if (rigidBody0.threeMesh && rigidBody1.threeMesh) {
          for (let j = 0; j < numContacts; j++) {
            const contactPoint = contactManifold.getContactPoint(j)
            const distance = contactPoint.getDistance()

            if (distance <= 0) {
              // We have a collison
              console.log(
                rigidBody0.threeMesh.name,
                'collided with',
                rigidBody1.threeMesh.name
              )
            }
          }
        }
      }
    }
  }
}

export default PhysicsInfo
