import * as THREE from "three";
import Sphere from "../sceneObjects/Sphere.js";
import Cylinder from "../sceneObjects/Cylinder.js";
import Box from "../sceneObjects/Box.js";

function balancingBoardScene(renderInfo, physicsInfo, ammoHelper) {
  const cylinder = new Cylinder(0.5, 5, 0x0000ff);
  const cylinderBody = ammoHelper.createRigidBody(cylinder.shape, cylinder.mesh, 0);  
  physicsInfo.addRigidBody(cylinderBody, cylinder.mesh);
  cylinder.mesh.userData.physicsBody = cylinderBody;
  renderInfo.scene.add(cylinder.mesh);

  const boardGroup = new THREE.Group();
  const compoundShape = new Ammo.btCompoundShape();

  const board = new Box(20, 0.5, 3, 0x0000ff);
  board.mesh.position.set(0, cylinder.height + board.height/2, 0);
  boardGroup.add(board.mesh);

  ammoHelper.setTransform(board.mesh);
  compoundShape.addChildShape(ammoHelper.transform, board.shape);

  const boardEdge = new Box(0.5, 1.5, 3, 0x0000ff);
  boardEdge.mesh.position.set(-10 + boardEdge.width / 2, cylinder.height + board.height + boardEdge.height/2, 0);
  boardGroup.add(boardEdge.mesh);

  ammoHelper.setTransform(boardEdge.mesh);
  compoundShape.addChildShape(ammoHelper.transform, boardEdge.shape);

  const boardBody = ammoHelper.createRigidBody(compoundShape, boardGroup, 2);
  physicsInfo.addRigidBody(boardBody, boardGroup);
  boardGroup.userData.physicsBody = boardBody;
  renderInfo.scene.add(boardGroup);


  // Add constraints
  const pivotA = new Ammo.btVector3(0, 0, 0);
  const pivotB = new Ammo.btVector3(0, 3, 0);

  physicsInfo.addP2PConstraint(cylinderBody, boardBody, pivotA, pivotB);

addBall(renderInfo, physicsInfo, { x: -2.55, y: 5.5, z: 0 }, 1);
addBall(renderInfo, physicsInfo, { x: 6, y: 100, z: 0 }, 10);
  
}


function addBall(renderInfo, physicsInfo, pos, mass) {
  const radius = 1.5;
  const color = 0xff0000;

  const ball = new Sphere(radius, mass, color, pos);
  ball.mesh.name = "ball";

  const rigidBody = physicsInfo.createRigidBody(ball.shape, ball.mesh, mass);
  ball.setFriction(rigidBody);
  ball.setRestituition(rigidBody);
  ball.setRollingFriction(rigidBody);

  physicsInfo.addRigidBody(rigidBody, ball.mesh);
  ball.mesh.userData.physicsBody = rigidBody;
  renderInfo.scene.add(ball.mesh);
}

export default balancingBoardScene;
