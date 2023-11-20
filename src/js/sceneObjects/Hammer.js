import * as THREE from "three";
import materials from "../utils/materials.js";
import Cylinder from "./Cylinder.js";

/**
 * Hammer class. The hammer is made up of a handle and a mallet.
 * The handle is a cylinder geometry and the mallet is a cylinder geometry.
 * @param {number} handleRadius - The radius of the handle.
 * @param {number} height - The height of the handle.
 * @param {number} malletRadius - The radius of the mallet.
 * @param {number} malletWidth - The width of the mallet.
 */
class Hammer {
  constructor(handleRadius, height, malletRadius, malletWidth) {
    this.handleRadius = handleRadius;
    this.height = height;
    this.malletRadius = malletRadius;
    this.malletWidth = malletWidth;

    this.group = new THREE.Group();
    this.group.name = "hammer";

    this.addHandle();
    this.addMallet();
  }

  /**
   * Add the handle. The handle is made up a cylinder geometry.
   */
  addHandle() {
    this.handle = new Cylinder(
      this.handleRadius,
      this.height,
      materials.hammerHandle
    );
    this.handle.mesh.castShadow = true;
    this.group.add(this.handle.mesh);
  }

  /**
   * Add the mallet. The mallet is made up of a cylinder geometry.
   */
  addMallet() {
    this.mallet = new Cylinder(
      this.malletRadius,
      this.malletWidth,
      materials.black
    );
    this.mallet.mesh.castShadow = true;
    this.mallet.mesh.position.set(0, this.height, 0);
    this.mallet.mesh.rotation.set(0, 0, Math.PI / 2);
    this.group.add(this.mallet.mesh);
  }

  /**
   * Get the compound shape of the hammer
   * @param {AmmoHelper} ammoHelper
   * @returns {Ammo.btCompoundShape} The compound shape of the hammer
   */
  getCompoundShape(ammoHelper) {
    const compoundShape = new Ammo.btCompoundShape();
    ammoHelper.setTransform(this.handle.mesh);
    compoundShape.addChildShape(ammoHelper.transform, this.handle.shape);

    ammoHelper.setTransform(this.mallet.mesh);
    compoundShape.addChildShape(ammoHelper.transform, this.mallet.shape);

    compoundShape.setMargin(0.05);
    return compoundShape;
  }
}

export default Hammer;
