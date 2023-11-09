import * as THREE from 'three';

class Tube {
  constructor(torusRadius, tubeRadius, color, name='tube') {
    this.torusRadius = torusRadius;
    this.tubeRadius = tubeRadius;
    this.color = color;
    this.name = name;

    this.radialSegments = 32;
    this.tubularSegments = 32;
    this.arc = Math.PI / 1.5;
    this.wireframe = true;
    
    this.generate();
  }

  generate() {
    this.mesh = new THREE.Group();
    this.mesh.name = this.name;

    this.tube1 = new THREE.Mesh(
      new THREE.TorusGeometry(this.torusRadius, this.tubeRadius, this.radialSegments, this.tubularSegments, this.arc),
      new THREE.MeshStandardMaterial({
        color: this.color,
        wireframe: true,
      })
    );

    this.tube1.position.set(0, 40, 0);
    this.tube1.rotateZ(1.5);
    this.tube1.castShadow = true;

    this.tube2 = this.tube1.clone();
    this.tube2.rotateZ(Math.PI);
    this.tube2.position.set(-18, 31.25, 0);
    this.tube2.castShadow = true;

    this.mesh.add(this.tube1, this.tube2);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.position.set(51.4, -18, -52);
  }

  getCompoundShape(ammoHelper) {
    const compoundShape = new Ammo.btCompoundShape()
    ammoHelper.setTransform(this.tube1)
    const tube1Shape = ammoHelper.generateTriangleShape(this.tube1, false)
    compoundShape.addChildShape(ammoHelper.transform, tube1Shape)

    ammoHelper.setTransform(this.tube2)
    const tube2Shape = ammoHelper.generateTriangleShape(this.tube2, false)
    compoundShape.addChildShape(ammoHelper.transform, tube2Shape)

    return compoundShape;
  }
  
}

export default Tube;