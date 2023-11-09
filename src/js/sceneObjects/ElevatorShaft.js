import * as THREE from "three";

class ElevatorShaft {
  constructor(height, width, depth, color) {
    this.height = height;
    this.width = width;
    this.depth = depth;
    this.color = color;

    this.generate();
  }

  generate() {
    this.mesh = new THREE.Group();
    this.mesh.name = "elevatorShaft";

    const material = new THREE.MeshStandardMaterial({ color: this.color });
    this.side1 = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.depth),
      material
    );

    this.side1.position.set(-this.depth / 2 - 0.26, this.height / 2, 0);
    this.side1.rotateY(Math.PI / 2);

    this.side2 = this.side1.clone();
    this.side2.position.x = 5 + this.depth / 2 - 0.25;

    this.top = new THREE.Mesh(new THREE.BoxGeometry(7.01, 0.5, 6), material);
    this.top.name = "top";
    this.top.position.set(2.25, this.height + 0.25, 0);

    this.mesh.add(this.side1, this.side2, this.top);
    this.mesh.rotateY(Math.PI / 2);
    this.mesh.position.set(75, 0, -50.5);

    this.button = new THREE.Mesh(
      new THREE.ConeGeometry(0.25, 0.75, 2),
      new THREE.MeshStandardMaterial({ color: 0xffff00 })
    );
    this.button.name = "button";
    this.button.rotateY(Math.PI / 2);
    this.button.position.set(5.25, 5, 3.01);

    this.mesh.add(this.button);
  }

  getCompoundShape(ammoHelper) {
    const compoundShape = new Ammo.btCompoundShape();
    ammoHelper.setTransform(this.side1);
    const sideShape = new Ammo.btBoxShape(
      new Ammo.btVector3(this.width / 2, this.height / 2, this.depth / 2)
    );
    compoundShape.addChildShape(ammoHelper.transform, sideShape);
    ammoHelper.setTransform(this.side2);
    compoundShape.addChildShape(ammoHelper.transform, sideShape);

    const topShape = new Ammo.btBoxShape(new Ammo.btVector3(3.5, 0.25, 3));
    ammoHelper.setTransform(this.top);
    compoundShape.addChildShape(ammoHelper.transform, topShape);

    const buttonShape = ammoHelper.generateTriangleShape(this.button, true);
    ammoHelper.setTransform(this.button);
    compoundShape.addChildShape(ammoHelper.transform, buttonShape);

    return compoundShape;
  }
}

export default ElevatorShaft;
