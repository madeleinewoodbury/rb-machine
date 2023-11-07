import Elevator from "../sceneObjects/Elevator.js";
import Box from "../sceneObjects/Box.js";
import Sphere from "../sceneObjects/Sphere.js";

function createElevatorScene(renderInfo, physicsInfo) {
  addEleveator(renderInfo, physicsInfo);
  addWall(renderInfo, physicsInfo);
  addBall(renderInfo, physicsInfo);
}

function addEleveator(renderInfo, physicsInfo) {
  const width = 5;
  const height = 5;
  const depth = 0.5;
  const color = 0x0000ff;

  const elevator = new Elevator(width, height, depth, color);
  const rigidBody = physicsInfo.createRigidBody(
    elevator.shape,
    elevator.mesh,
    elevator.mass
  );

  rigidBody.setFriction(elevator.friction);
  rigidBody.setRestitution(elevator.restituition);
  rigidBody.setCollisionFlags(elevator.collisionFlag);
  rigidBody.setActivationState(elevator.activatuonState);

  physicsInfo.addRigidBody(rigidBody, elevator.mesh);
  elevator.mesh.userData.physicsBody = rigidBody;
  renderInfo.scene.add(elevator.mesh);
}

function addBall(renderInfo, physicsInfo) {
  const radius = 1.5;
  const mass = 10;
  const color = 0xff0000;
  const pos = { x: 2.5, y: 1, z: 0 };

  const ball = new Sphere(radius, mass, color, pos);
  ball.mesh.name = "ball";

  const rigidBody = physicsInfo.createRigidBody(ball.shape, ball.mesh, mass);
  ball.setFriction(rigidBody);
  ball.setRestituition(rigidBody);
  ball.setRollingFriction(rigidBody);

  physicsInfo.addRigidBody(rigidBody, ball.mesh);
  renderInfo.scene.add(ball.mesh);
  ball.mesh.userData.physicsBody = rigidBody;
}

function addElevatorShaft(elevator) {
  const elevatorShaft = new THREE.Group();
  elevatorShaft.name = "elevatorShaft";

  const height = elevator.height + 12;
  const width = elevator.width + 4;
  const depth = elevator.depth*2;
  const wall = new Box(width, height, depth, 0x0000ff);
  

  
  


}

function addWall(renderInfo, physicsInfo) {
  const width = 10;
  const height = 10;
  const depth = 0.5;
  const color = 0xc2c2c2;

  const wall = new Box(width, height, depth, color)
  wall.mesh.name = "wall";
  wall.mesh.position.set(2, 5, -2.75);

  const rigidBody = physicsInfo.createRigidBody(
    wall.shape,
    wall.mesh,
    wall.mass
  );

  physicsInfo.addRigidBody(rigidBody, wall.mesh);
  wall.mesh.userData.physicsBody = rigidBody;
  renderInfo.scene.add(wall.mesh);
}

export default createElevatorScene;
