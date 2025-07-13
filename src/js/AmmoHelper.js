// --------------------------------------------------------------------------
// The generateTriangleShape and traverseModel methods are based on code example
// from triangleMeshHelpers.js from module7/AmmoAdvancedShapes2triangleMesh
// --------------------------------------------------------------------------
import * as THREE from "three";

/**
 * Helper class for Ammo.js. Contains methods to create rigid bodies, set the
 * transform and get the euler rotation.
 * @class AmmoHelper
 */
class AmmoHelper {
  constructor() {
    this.transform = undefined;
  }

  /**
   * Set the transform of the mesh.
   * @param {THREE.Mesh} mesh - The mesh to set the transform.
   */
  setTransform(mesh) {
    this.transform = new Ammo.btTransform();
    this.transform.setIdentity();
    this.transform.setOrigin(
      new Ammo.btVector3(mesh.position.x, mesh.position.y, mesh.position.z)
    );
    this.transform.setRotation(
      new Ammo.btQuaternion(
        mesh.quaternion.x,
        mesh.quaternion.y,
        mesh.quaternion.z,
        mesh.quaternion.w
      )
    );
  }

  /**
   * Create a rigid body. The rigid body is made up of a shape and a mesh.
   * @param {Ammo.btCollisionShape} shape - The shape of the rigid body.
   * @param {THREE.Mesh} mesh - The mesh of the rigid body.
   * @param {number} mass - The mass of the rigid body.
   * @returns {Ammo.btRigidBody} The rigid body.
   */
  createRigidBody(shape, mesh, mass) {
    this.setTransform(mesh);
    shape.setLocalScaling(
      new Ammo.btVector3(mesh.scale.x, mesh.scale.y, mesh.scale.z)
    );

    const motionState = new Ammo.btDefaultMotionState(this.transform);
    const localInertia = new Ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);

    const rbInfo = new Ammo.btRigidBodyConstructionInfo(
      mass,
      motionState,
      shape,
      localInertia
    );

    const rigidBody = new Ammo.btRigidBody(rbInfo);
    return rigidBody;
  }

  /**
   * Moves the rigid body in the given direction.
   * @param {THREE.Mesh} mesh - The mesh to move.
   * @param {THREE.Vector3} direction - The direction to move the mesh.
   */
  moveRigidBody(mesh, direction) {
    const transform = new Ammo.btTransform();
    const motionState = mesh.userData.rigidBody.getMotionState();
    motionState.getWorldTransform(transform);

    const position = transform.getOrigin();
    transform.setOrigin(
      new Ammo.btVector3(
        position.x() + direction.x,
        position.y() + direction.y,
        position.z() + direction.z
      )
    );
    motionState.setWorldTransform(transform);
  }

  /**
   * Get the euler rotation of the rigid body.
   * @param {Ammo.btRigidBody} rigidBody - The rigid body to get the euler rotation.
   * @returns {THREE.Euler} The euler rotation of the rigid body.
   */
  getEuler(rigidBody) {
    const transform = new Ammo.btTransform();
    const motionState = rigidBody.getMotionState();
    motionState.getWorldTransform(transform);

    const rotation = transform.getRotation();
    const quaternion = new THREE.Quaternion(
      rotation.x(),
      rotation.y(),
      rotation.z(),
      rotation.w()
    );

    const euler = new THREE.Euler().setFromQuaternion(quaternion);
    return euler;
  }

  /**
   * Generates a triangle shape from the given 3D mesh.
   *
   * @param {THREE.Mesh} mesh - The 3D mesh object.
   * @param {boolean} [useConvexShape=false] - Indicates whether to use a convex or concave
   * triangle mesh shape.
   * @returns {Object} - The generated triangle shape for use in physics simulations.
   */
  generateTriangleShape(mesh, useConvexShape = false) {
    let vertices = this.traverseModel(mesh);
    let ammoMesh = new Ammo.btTriangleMesh();

    for (let i = 0; i < vertices.length; i += 9) {
      let v1_x = vertices[i];
      let v1_y = vertices[i + 1];
      let v1_z = vertices[i + 2];

      let v2_x = vertices[i + 3];
      let v2_y = vertices[i + 4];
      let v2_z = vertices[i + 5];

      let v3_x = vertices[i + 6];
      let v3_y = vertices[i + 7];
      let v3_z = vertices[i + 8];

      let bv1 = new Ammo.btVector3(v1_x, v1_y, v1_z);
      let bv2 = new Ammo.btVector3(v2_x, v2_y, v2_z);
      let bv3 = new Ammo.btVector3(v3_x, v3_y, v3_z);

      ammoMesh.addTriangle(bv1, bv2, bv3);
    }

    let triangleShape;
    if (useConvexShape)
      triangleShape = new Ammo.btConvexTriangleMeshShape(ammoMesh, false);
    else triangleShape = new Ammo.btBvhTriangleMeshShape(ammoMesh, false);

    let threeScale = mesh.scale;
    triangleShape.setLocalScaling(
      new Ammo.btVector3(threeScale.x, threeScale.y, threeScale.z)
    );
    return triangleShape;
  }

  /**
   * Traverses the model and returns an array of vertices.
   * @param {THREE.Mesh} mesh - The mesh to traverse.
   * @param {number[]} modelVertices - The array of vertices.
   * @returns {number[]} The array of vertices.
   */
  traverseModel(mesh, modelVertices = []) {
    if (mesh) {
      if (mesh.geometry) {
        let tmpVertices = [...mesh.geometry.attributes.position.array];
        for (let i = 0; i < tmpVertices.length; i += 3) {
          tmpVertices[i] = tmpVertices[i] * mesh.scale.x;
          tmpVertices[i + 1] = tmpVertices[i + 1] * mesh.scale.y;
          tmpVertices[i + 2] = tmpVertices[i + 2] * mesh.scale.z;
        }
        modelVertices.push(...tmpVertices);
      }
    }
    let parentScale = mesh.scale;
    mesh.children.forEach((childMesh, ndx) => {
      childMesh.scale.x = childMesh.scale.x * parentScale.x;
      childMesh.scale.y = childMesh.scale.y * parentScale.y;
      childMesh.scale.z = childMesh.scale.z * parentScale.z;
      this.traverseModel(childMesh, modelVertices);
    });
    return modelVertices;
  }
}

export default AmmoHelper;
