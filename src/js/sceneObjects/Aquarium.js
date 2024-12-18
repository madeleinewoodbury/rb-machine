import * as THREE from "three";
import materials from "../utils/materials.js";

/**
 * Aquarium class. The aquarium is made of 4 sides and a bottom.
 * @param {number} width - The width of the aquarium.
 * @param {number} height - The height of the aquarium.
 * @param {number} depth - The depth of the aquarium.
 * @param {number} edgeWith - The width of the edges of the aquarium.
 */
class Aquarium {
  constructor(width, height, depth, edgeWith) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.edgeWith = edgeWith;

    this.mesh = new THREE.Group();
    this.mesh.name = "aquarium";

    this.addSides();
  }

  /**
   * Add the sides of the aquarium. The aquarium is made of 4 sides and a bottom.
   * The aquarium is open at the top.
   */
  addSides() {
    this.side1 = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.edgeWith),
      materials.stoneWall
    );
    this.side1.position.set(0, this.height / 2, -this.depth / 2 - 0.1);
    this.side1.castShadow = true;

    this.side2 = this.side1.clone();
    this.side2.position.z = this.depth / 2;

    this.side3 = new THREE.Mesh(
      new THREE.BoxGeometry(this.edgeWith, this.height, this.depth),
      materials.stoneWall
    );
    this.side3.position.set(this.width / 2, this.height / 2, 0);
    this.side3.castShadow = true;

    this.side4 = this.side3.clone();
    this.side4.position.x = -this.width / 2;

    this.mesh.add(this.side1, this.side2, this.side3, this.side4);
  }

  /**
   * Get the compound shape of the aquarium.
   * @param {AmmoHelper} ammoHelper
   * @returns {Ammo.btCompoundShape} The compound shape of the aquarium
   */
  getCompoundShape(ammoHelper) {
    const compoundShape = new Ammo.btCompoundShape();
    const sideShape = new Ammo.btBoxShape(
      new Ammo.btVector3(this.width / 2, this.height / 2, this.edgeWith / 2)
    );

    ammoHelper.setTransform(this.side1);
    compoundShape.addChildShape(ammoHelper.transform, sideShape);

    ammoHelper.setTransform(this.side2);
    compoundShape.addChildShape(ammoHelper.transform, sideShape);

    ammoHelper.setTransform(this.side3);
    compoundShape.addChildShape(ammoHelper.transform, sideShape);

    ammoHelper.setTransform(this.side4);
    compoundShape.addChildShape(ammoHelper.transform, sideShape);

    return compoundShape;
  }
}

export default Aquarium;
