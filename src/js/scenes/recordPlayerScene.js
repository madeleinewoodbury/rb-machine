import * as THREE from 'three';
import Cylinder from '../sceneObjects/Cylinder.js';

function createRecordPlayerScene(renderInfo, physicsInfo, ammoHelper) {
  addRecordPlayer(renderInfo, physicsInfo, ammoHelper);
}

function addRecordPlayer(renderInfo, physicsInfo, ammoHelper) {
  const recordPlayer = new THREE.Group();
  recordPlayer.name = 'recordPlayer';

  const textureLoader = new THREE.TextureLoader();
  const recordPlayerTexture = textureLoader.load('/textures/black.png');
  const material = new THREE.MeshStandardMaterial({color: 0x000000, map: recordPlayerTexture});

  const record = new THREE.Mesh(
    new THREE.CylinderGeometry(10, 10, .5, 32),
    material
  );

  record.rotationAngle = 0
  
  const thing = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 5, 32),
    new THREE.MeshStandardMaterial({color: 0xff0000})
  );

  thing.position.set(5, 2.75, 0);
  recordPlayer.add(record, thing);

  const compoundShape = new Ammo.btCompoundShape();
  const recordShape = new Ammo.btCylinderShape(new Ammo.btVector3(10, .5, 10));
  ammoHelper.setTransform(record);
  compoundShape.addChildShape(ammoHelper.transform, recordShape);

  const thingShape = new Ammo.btCylinderShape(new Ammo.btVector3(1, 2.5, 1));
  ammoHelper.setTransform(thing);
  compoundShape.addChildShape(ammoHelper.transform, thingShape);

  const rigidBody = ammoHelper.createRigidBody(compoundShape, recordPlayer, 0);
  rigidBody.setCollisionFlags(2)
  rigidBody.setActivationState(4)

  physicsInfo.addRigidBody(rigidBody, recordPlayer);
  recordPlayer.userData.physicsBody = rigidBody;
  renderInfo.scene.add(recordPlayer);


  // recordPlayer.mesh.name = 'recordPlayer';
  // recordPlayer.mesh.rotationAngle = 0

  // Kinematic rigid body
  // const compoundShape = new Ammo.btCompoundShape();
  // ammoHelper.setTransform()
  // compoundShape.addChildShape(ammoHelper.transform, recordPlayer.shape);

  // const rigidBody = ammoHelper.createRigidBody(recordPlayer.shape, recordPlayer.mesh, 0);
  // rigidBody.setFriction(0.8);
  // rigidBody.setCollisionFlags(2)
  // rigidBody.setActivationState(4)
  // rigidBody.setCollisionShape(recordPlayer.shape)

  // physicsInfo.addRigidBody(rigidBody, recordPlayer.mesh);
  // recordPlayer.mesh.userData.physicsBody = rigidBody;
  // renderInfo.scene.add(recordPlayer.mesh);

  // const thing = new Cylinder(1, 5, 0xff0000);
  // thing.mesh.name = 'thing';
  // thing.mesh.position.set(5, 2.75, 0);

  // ammoHelper.setTransform();
  // compoundShape.addChildShape(ammoHelper.transform, thing.shape);

  // const rigidBody2 = ammoHelper.createRigidBody(thing.shape, thing.mesh, 10);
  // rigidBody2.setFriction(0.8);
  // physicsInfo.addRigidBody(rigidBody2, thing.mesh);
  // thing.mesh.userData.physicsBody = rigidBody2;
  // renderInfo.scene.add(thing.mesh);

}

export default createRecordPlayerScene;

// this.shape = new Ammo.btCylinderShape(
//   new Ammo.btVector3(this.radius, this.height / 2, this.radius)
// );