import * as THREE from "three";
import materials from "../utils/materials.js";

/**
 * Fan class. The fan is made up of a base, top and two blades.
 * The base is a cylinder geometry, the top is a capsule geometry
 * and the blades are box geometries.
 * @param {number} baseRadius - The radius of the base.
 * @param {number} baseHeight - The height of the base.
 * @param {number} topRadius - The radius of the top.
 * @param {number} topLength - The length of the top.
 * @param {number} bladeWidth - The width of the blades.
 * @param {number} bladeHeight - The height of the blades.
 * @param {number} bladeDepth - The depth of the blades.
 */
class Fan {
  constructor(
    baseRadius,
    baseHeight,
    topRadius,
    topLength,
    bladeWidth,
    bladeHeight,
    bladeDepth
  ) {
    this.baseRadius = baseRadius;
    this.baseHeight = baseHeight;
    this.topRadius = topRadius;
    this.topLength = topLength;
    this.bladeWidth = bladeWidth;
    this.bladeHeight = bladeHeight;
    this.bladeDepth = bladeDepth;

    this.group = new THREE.Group();
    this.group.name = "Fan";

    this.addBase();
    this.addTop();
    this.addBlades();
  }

  /** 
   * Add the base of the fan. The base is made up of a cylinder geometry
   */ 
  addBase() {
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(
        this.baseRadius,
        this.baseRadius,
        this.baseHeight,
        24,
        1
      ),
      materials.white
    );
    base.position.set(0, this.baseHeight / 2, 0);
    base.castShadow = true;
    this.group.add(base);
  }

  /**
   * Add the top. The top is made up of a cylinder geometry.
   */ 
  addTop() {
    const capsule = new THREE.Mesh(
      new THREE.CapsuleGeometry(
        this.topRadius,
        this.topRadius,
        this.topLength,
        12
      ),
      materials.white
    );
    capsule.rotateX(Math.PI / 2);
    capsule.position.set(0, this.baseHeight + this.topRadius / 2, 1);
    capsule.castShadow = true;
    this.group.add(capsule);
  }

  /**
   * Add the blades. The two blades are made up up a box geomtry and are
   * positioned across each other.
   */
  addBlades() {
    const blade1 = new THREE.Mesh(
      new THREE.BoxGeometry(this.bladeWidth, this.bladeHeight, this.bladeDepth),
      materials.white
    );
    blade1.name = "blade1";
    blade1.rotationAngle = 0;
    blade1.position.set(
      0,
      this.baseHeight + this.topRadius / 2,
      this.topLength / 2
    );
    blade1.castShadow = true;

    const blade2 = blade1.clone();
    blade2.rotationAngle = Math.PI / 2;
    blade2.name = "blade2";
    blade2.rotateZ(blade2.rotationAngle);

    this.group.add(blade1, blade2);
  }
}

export default Fan;
