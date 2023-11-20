import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import Elevator from "../sceneObjects/Elevator.js";
import ElevatorShaft from "../sceneObjects/ElevatorShaft.js";
import Sphere from "../sceneObjects/Sphere.js";
import materials from "../utils/materials.js";

// Add the elevator, the elevator shaft and the ball inside the elevator.
function addElevatorScene(renderInfo, physicsInfo, ammoHelper) {
  const position = { x: 55, y: 0, z: -55 };

  addElevator(renderInfo, physicsInfo, ammoHelper, position);
  addElevatorShaft(renderInfo, physicsInfo, ammoHelper, position);
  addBall(renderInfo, physicsInfo, ammoHelper, position);
  addText(renderInfo);
}

// Add the elevator to the scene.
function addElevator(renderInfo, physicsInfo, ammoHelper, position) {
  const width = 5;
  const height = 5;
  const depth = 0.5;
  const mass = 0;

  const elevator = new Elevator(width, height, depth);
  elevator.mesh.position.set(position.x, position.y, position.z);
  const elevatorShape = elevator.getCompoundShape(ammoHelper);
  const rigidBody = ammoHelper.createRigidBody(
    elevatorShape,
    elevator.mesh,
    mass
  );

  rigidBody.setFriction(elevator.friction);
  rigidBody.setRestitution(elevator.restituition);
  rigidBody.setCollisionFlags(elevator.collisionFlag);
  rigidBody.setActivationState(elevator.activatuonState);

  physicsInfo.addRigidBody(rigidBody, elevator.mesh);
  renderInfo.scene.add(elevator.mesh);
  elevator.mesh.userData.rigidBody = rigidBody;
  rigidBody.threeMesh = elevator.mesh;
}

// Add the elevator shaft to the scene.
function addElevatorShaft(renderInfo, physicsInfo, ammoHelper, position) {
  const mass = 0;
  const height = 58;
  const width = 6;
  const depth = 1;
  const elevatorShaft = new ElevatorShaft(height, width, depth);
  elevatorShaft.mesh.position.set(position.x, position.y, position.z + 4.5);

  const compoundShape = elevatorShaft.getCompoundShape(ammoHelper);

  const rigidBody = ammoHelper.createRigidBody(
    compoundShape,
    elevatorShaft.mesh,
    mass
  );
  physicsInfo.addRigidBody(rigidBody, elevatorShaft.mesh);
  renderInfo.scene.add(elevatorShaft.mesh);
  elevatorShaft.mesh.userData.rigidBody = rigidBody;
  rigidBody.threeMesh = elevatorShaft.mesh;
}

// Add the ball ro the scene with the given position.
function addBall(renderInfo, physicsInfo, ammoHelper, position) {
  const radius = 1.5;
  const mass = 8;

  const ball = new Sphere(radius, materials.ballYellow);
  ball.mesh.position.set(position.x, position.y + 2, position.z + 2.75);
  ball.mesh.name = "ball";

  const rigidBody = ammoHelper.createRigidBody(ball.shape, ball.mesh, mass);
  rigidBody.setCollisionGroup = physicsInfo.collisionGroup.ball;
  rigidBody.setCollisionMask = physicsInfo.collisionGroup.bridge;

  ball.setFriction(rigidBody);
  ball.setRestituition(rigidBody);
  ball.setRollingFriction(rigidBody);

  physicsInfo.addRigidBody(rigidBody, ball.mesh);
  renderInfo.scene.add(ball.mesh);
  ball.mesh.userData.rigidBody = rigidBody;
  rigidBody.threeMesh = ball.mesh;
}

// Add the text to the scene.
function addText(renderInfo) {
  const fontLoader = new FontLoader();
  fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    const textGeometry = new TextGeometry("Trykk opp", {
      font: font,
      size: 2,
      height: 0.5,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
    });

    // Center the text
    textGeometry.center();

    const text = new THREE.Mesh(textGeometry, materials.text);
    text.position.set(60, 4, -65);
    text.rotation.set(0, Math.PI / 2.75, 0);

    renderInfo.scene.add(text);
  });
}

export default addElevatorScene;
