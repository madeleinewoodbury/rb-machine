import * as THREE from "three";

class Cylinder {
  constructor(radius, height, color, material) {
    this.radius = radius;
    this.height = height;
    this.color = color;
    this.material =
      material ?? new THREE.MeshStandardMaterial({ color: this.color });

    this.generate();
  }

  generate() {
    this.mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(this.radius, this.radius, this.height, 24),
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
