import * as THREE from "three";

class FoodContainer {
  constructor(radius, height) {
    this.radius = radius;
    this.height = height;

    this.generate();
  }

  generate() {
    this.mesh = new THREE.Group();
    this.mesh.name = "foodContainer";
    this.cylinderMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(
        this.radius,
        this.radius,
        this.height,
        64,
        32,
        true
      ),
      new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      })
    );

    this.cylinderMesh.position.set(0, this.height/2 + 0.1, 0);
    this.cylinderMesh.castShadow = true;
    this.mesh.add(this.cylinderMesh);

    this.bottomCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(this.radius, this.radius, 0.1, 64, 32, false),
      new THREE.MeshStandardMaterial({
        color: 0x0000ff
      })
    );

    this.bottomCylinder.position.set(0, 0.05, 0);
    this.bottomCylinder.castShadow = true;
    this.mesh.add(this.bottomCylinder);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.position.set(-21, 30.5, 0);
  }

  getCompoundShape(ammoHelper) {
    const compoundShape = new Ammo.btCompoundShape();
    ammoHelper.setTransform(this.cylinderMesh);
    const cylinderShape = ammoHelper.generateTriangleShape(this.cylinderMesh);
    compoundShape.addChildShape(ammoHelper.transform, cylinderShape);

    ammoHelper.setTransform(this.bottomCylinder);
    const bottomCylinderShape = ammoHelper.generateTriangleShape(
      this.bottomCylinder
    );
    compoundShape.addChildShape(ammoHelper.transform, bottomCylinderShape);

    return compoundShape;
  }
}

export default FoodContainer;
