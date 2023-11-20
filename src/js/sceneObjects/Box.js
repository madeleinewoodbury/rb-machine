import * as THREE from "three";

/**
 * Box class. The box is made of a mesh and a shape.
 * @param {number} width - The width of the box.
 * @param {number} height - The height of the box.
 * @param {number} depth - The depth of the box.
 * @param {THREE.Material} material - The material of the box.
 */
class Box {
  constructor(width, height, depth, material) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.material = material;

    this.generate();
  }

  /**
   * Generate the box mesh and shape.
   */
  generate() {
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.depth),
      this.material
    );
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.shape = new Ammo.btBoxShape(
      new Ammo.btVector3(this.width / 2, this.height / 2, this.depth / 2)
    );
    this.shape.setMargin(0.05);
  }
}

export default Box;
