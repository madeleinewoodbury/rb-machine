import * as THREE from 'three';
import materials from '../utils/materials.js';

class FoodContainer {
  constructor(radius, height) {
    this.radius = radius;
    this.height = height;
    this.radialSegments = 32;
    this.heightSegments = 1;
    this.openEnded = true;

    this.mesh = new THREE.Group();
    this.mesh.name = 'foodContainer';

    this.generate();
  }

  generate() {
    this.cylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(
        this.radius,
        this.radius,
        this.height,
        this.radialSegments,
        this.heightSegments,
        this.openEnded
      ),
      materials.foodContainer
    );
    this.cylinder.position.set(0, this.height / 2, 0);
    this.mesh.add(this.cylinder);

    this.top = new THREE.Mesh(
      new THREE.CircleGeometry(this.radius, this.radialSegments),
      materials.foodContainerTop1
    );
    this.top.position.set(0, this.height - 0.4, 0);
    this.top.rotateX(-Math.PI / 2);
    this.mesh.add(this.top);

    this.top2 = new THREE.Mesh(
      new THREE.CircleGeometry(this.radius, this.radialSegments),
      materials.foodContainerTop2
    );
    this.top2.position.set(0, this.height - 0.3, 0);
    this.top2.rotation.set(-Math.PI / 2, 0, 0.5);
    this.mesh.add(this.top2);

    // this.bottom = new THREE.Mesh(
    //   new THREE.CircleGeometry(this.radius, this.radialSegments),
    //   materials.white
    // );
    // this.bottom.position.set(0, 0.01, 0);
    // this.bottom.rotateX(Math.PI / 2);
    // this.mesh.add(this.bottom);
  }

  /**
   * Get the compound shape of the food container.
   * @param {AmmoHelper} ammoHelper 
   * @returns {Ammo.btCompoundShape} The compound shape of the food container
   */ 
  getCompoundShape(ammoHelper) {
    const compoundShape = new Ammo.btCompoundShape()
    const cylinderShape = new Ammo.btCylinderShape(
      new Ammo.btVector3(this.radius, this.height / 2, this.radius)
    )
    const circleShape = new Ammo.btCylinderShape(
      new Ammo.btVector3(this.radius, 0.01, this.radius)
    )

    ammoHelper.setTransform(this.cylinder)
    compoundShape.addChildShape(ammoHelper.transform, cylinderShape)
    
    // ammoHelper.setTransform(this.top)
    // compoundShape.addChildShape(ammoHelper.transform, circleShape)

    // ammoHelper.setTransform(this.top2)
    // compoundShape.addChildShape(ammoHelper.transform, circleShape)

    // ammoHelper.setTransform(this.bottom)
    // compoundShape.addChildShape(ammoHelper.transform, circleShape)

    return compoundShape
  }
}

export default FoodContainer;