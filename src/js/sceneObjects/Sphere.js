import * as THREE from "three";

/**
 * Sphere class. The sphere is made up of a mesh and a shape.
 * @param {number} radius - The radius of the sphere.
 * @param {THREE.Material} material - The material of the sphere.
 */
class Sphere {
  constructor(radius, material) {
    this.radius = radius;
    this.material = material;

    // Default values
    this.friction = 0.5;
    this.restituition = 0.5;
    this.rollingFriction = 0.1;

    this.generate();
  }

  /**
   * Generate the sphere and the ammo shape
   */
  generate() {
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, 32, 32),
      this.material
    );
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.shape = new Ammo.btSphereShape(this.radius);
    this.shape.setMargin(0.05);
  }

  /**
   * Set the friction of the sphere.
   * @param {Ammo.btRigidBody} rigidBody - The rigid body of the sphere.
   * @param {number} friction - The friction of the sphere. Default is 0.5.
   */
  setFriction(rigidBody, friction = null) {
    if (friction) this.friction = friction;
    rigidBody.setFriction(this.friction);
  }

  /**
   * Set the restituition of the sphere.
   * @param {Ammo.btRigidBody} rigidBody - The rigid body of the sphere.
   * @param {number} restituition - The restituition of the sphere. Default is 0.5.
   */
  setRestituition(rigidBody, restituition = null) {
    if (restituition) this.restituition = restituition;
    rigidBody.setRestitution(this.restituition);
  }

  /**
   * Set the rolling friction of the sphere.
   * @param {Ammo.btRigidBody} rigidBody - The rigid body of the sphere.
   * @param {number} rollingFriction - The rolling friction of the sphere. Default is 0.1.
   */
  setRollingFriction(rigidBody, rollingFriction = null) {
    if (rollingFriction) this.rollingFriction = rollingFriction;
    rigidBody.setRollingFriction(this.rollingFriction);
  }
}

export default Sphere;
