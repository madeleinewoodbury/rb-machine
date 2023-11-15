import * as THREE from "three";
import materials from "../utils/materials.js";

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
    this.group.add(base);
  }

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
    this.group.add(capsule);
  }

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

    const blade2 = blade1.clone();
    blade2.rotationAngle = Math.PI / 2;
    blade2.name = "blade2";
    blade2.rotateZ(blade2.rotationAngle);

    this.group.add(blade1, blade2);
  }
}

export default Fan;
