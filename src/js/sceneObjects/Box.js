import * as THREE from 'three';

class Box {
  constructor(width, height, depth, color) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.color = color;

    this.mass = 0
    this.generate();
  }

  generate() {
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.depth),
      new THREE.MeshStandardMaterial({ color: this.color })
    )
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true

    this.shape = new Ammo.btBoxShape(new Ammo.btVector3(this.width/2, this.height/2, this.depth/2))
    this.shape.setMargin(0.05)
  }

}

export default Box;