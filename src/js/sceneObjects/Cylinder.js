import * as THREE from "three";

/**
 * Cylinder class. The cylinder is made of a mesh and a shape.
 * @param {number} radius - The radius of the cylinder.
 * @param {number} height - The height of the cylinder.
 * @param {THREE.Material} material - The material of the cylinder.
 * @param {number} radialSegments - The number of segments of the cylinder. Default is 24.
 * @param {number} heightSegments - The number of segments of the cylinder. Default is 1.
 */
class Cylinder {
  constructor(
    radius,
    height,
    material,
    radialSegments = 24,
    heightSegments = 1
  ) {
    this.radius = radius;
    this.height = height;
    this.material = material;

    this.radialSegments = radialSegments;
    this.heightSegments = heightSegments;

    this.generate();
  }

  /**
   * Generate the cylinder mesh and shape.
   */
  generate() {
    this.mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(
        this.radius,
        this.radius,
        this.height,
        this.radialSegments,
        this.heightSegments
      ),
      this.material
    );

    this.mesh.position.set(0, this.height / 2, 0);

    this.shape = new Ammo.btCylinderShape(
      new Ammo.btVector3(this.radius, this.height / 2, this.radius)
    );
    this.shape.setMargin(0.05);
  }
}

export default Cylinder;
