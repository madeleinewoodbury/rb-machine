// --------------------------------------------------
// Metodene update og checkCollisions er basert på kodeeksempler fra modul 7 ammoCollisions
// --------------------------------------------------

/**
 * Class for handling physics in the scene. It sets up the physics world and
 * updates the world every frame. It also handles collisions.
 * @class PhysicsInfo
 * @param {number} gravity - The gravity of the physics world. Defaults to -9.82.
 */
class PhysicsInfo {
  constructor(gravity = -9.82) {
    this.gravity = gravity;
    this.world = undefined;
    this.rigidBodies = [];
    this.tmpTrans = undefined;

    this.collisionGroup = {
      domino: 1,
      foodContainer: 2,
      pillar: 4,
      aquarium: 8,
      ball: 16,
      bridge: 32,
      board: 64,
    };

    // Object for storing collisions between objects
    this.collisions = {};
  }

  /**
   * @description Sets up the physics world by setting up the collision configuration,
   * dispatcher, broadphase, and solver. It also sets the gravity of the world.
   */
  setup() {
    this.tmpTrans = new Ammo.btTransform();

    const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    const overlappingPairCache = new Ammo.btDbvtBroadphase();
    const solver = new Ammo.btSequentialImpulseConstraintSolver();

    this.world = new Ammo.btDiscreteDynamicsWorld(
      dispatcher,
      overlappingPairCache,
      solver,
      collisionConfiguration
    );
    this.world.setGravity(new Ammo.btVector3(0, this.gravity, 0));
  }

  /**
   * Add rigid body to the physics world and add the mesh to the rigid bodies array
   * @param {Ammo.btRigidBody} body - The rigid body to add to the physics world.
   * @param {THREE.Mesh} mesh - The mesh to add to the rigid bodies array.
   */
  addRigidBody(body, mesh) {
    this.world.addRigidBody(body);
    this.rigidBodies.push(mesh);
  }

  /**
   * Add a point to point constraint between two bodies
   * @param {Ammo.btRigidBody} bodyA - The first body.
   * @param {Ammo.btRigidBody} bodyB - The second body.
   * @param {Ammo.btVector3} pivotA - The pivot point on the first body.
   * @param {Ammo.btVector3} pivotB - The pivot point on the second body.
   */
  addP2PConstraint(bodyA, bodyB, pivotA, pivotB) {
    const p2p = new Ammo.btPoint2PointConstraint(bodyA, bodyB, pivotA, pivotB);
    this.world.addConstraint(p2p, true);
  }

  /**
   * Apply a force to a rigid body
   * @param {THREE.Mesh} mesh - The mesh to apply the force to.
   * @param {Ammo.btVector3} force - The force to apply.
   * @param {Ammo.btVector3} relPos - The relative position to apply the force to.
   */
  applyForce(mesh, force, relPos) {
    if (!mesh.userData.rigidBody) return;

    const rigidBody = mesh.userData.rigidBody;
    rigidBody.activate(true);
    rigidBody.applyForce(force, relPos);
  }

  /**
   * Update the physics world. This method should be called every frame.
   * @param {number} deltaTime - The time since the last frame.
   */
  update(deltaTime) {
    // Step world
    this.world.stepSimulation(deltaTime, 10);

    // Update rigid bodies
    for (let i = 0; i < this.rigidBodies.length; i++) {
      const mesh = this.rigidBodies[i];
      const body = mesh.userData.rigidBody;
      const motionState = body.getMotionState();

      if (motionState) {
        motionState.getWorldTransform(this.tmpTrans);
        const p = this.tmpTrans.getOrigin();
        const q = this.tmpTrans.getRotation();
        mesh.position.set(p.x(), p.y(), p.z());
        mesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
      }
    }

    // Check if there are any new collisions
    this.checkCollisions();
  }

  /**
   * Check if there are any new collisions. If there are, add them to the collisions object.
   */
  checkCollisions() {
    // Find all possible contact points (broadsphase)
    const numManifolds = this.world.getDispatcher().getNumManifolds();
    for (let i = 0; i < numManifolds; i++) {
      const contactManifold = this.world
        .getDispatcher()
        .getManifoldByIndexInternal(i);
      const numContacts = contactManifold.getNumContacts();

      if (numContacts > 0) {
        // Get the objects involved in the collision and convert them to rigid bodies
        const rigidBody0 = Ammo.castObject(
          contactManifold.getBody0(),
          Ammo.btRigidBody
        );
        const rigidBody1 = Ammo.castObject(
          contactManifold.getBody1(),
          Ammo.btRigidBody
        );

        if (rigidBody0.threeMesh && rigidBody1.threeMesh) {
          for (let j = 0; j < numContacts; j++) {
            const contactPoint = contactManifold.getContactPoint(j);
            const distance = contactPoint.getDistance();

            // Collision
            if (distance <= 0) {
              // Set a unique key for the collision
              const collisionKey = `${rigidBody0.threeMesh.name}-${rigidBody1.threeMesh.name}`;
              if (!(collisionKey in this.collisions)) {
                // Add the collision to the newCollisions object
                this.collisions[collisionKey] = true;
              }
            }
          }
        }
      }
    }
  }
}

export default PhysicsInfo;
