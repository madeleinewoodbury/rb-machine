import materials from "../utils/materials.js";
import Tube from "../sceneObjects/Tube.js";
import Box from "../sceneObjects/Box.js";

// Add a tube scene with a tube and a bridge.
function addTubeScene(renderInfo, physicsInfo, ammoHelper) {
  addTube(renderInfo, physicsInfo, ammoHelper);
  addBridge(renderInfo, physicsInfo, ammoHelper);
}

// Add the tube to the scene. The tube is made of two quarter length toruses.
function addTube(renderInfo, physicsInfo, ammoHelper) {
  const tube = new Tube(10, 1.55);
  tube.mesh.position.set(3.4, 4.5, -52.5);

  const compoundShape = tube.getCompoundShape(ammoHelper);

  const rigidBody = ammoHelper.createRigidBody(compoundShape, tube.mesh, 0);
  physicsInfo.addRigidBody(rigidBody, tube.mesh);
  renderInfo.scene.add(tube.mesh);
  tube.mesh.userData.rigidBody = rigidBody;
  rigidBody.threeMesh = tube.mesh;
}

// Add the bridge to the scene. The bridge leads to the tube.
function addBridge(renderInfo, physicsInfo, ammoHelper) {
  const mass = 0;
  const bridge = new Box(48, 1, 6, materials.wood);
  bridge.mesh.position.set(28, 52.5, -52.5);
  bridge.mesh.name = "bridge";
  bridge.mesh.castShadow = true;

  const rigidBody = ammoHelper.createRigidBody(bridge.shape, bridge.mesh, mass);
  rigidBody.setCollisionGroup = physicsInfo.collisionGroup.bridge;
  rigidBody.setCollisionMask = 0;

  rigidBody.setFriction(0.8);
  physicsInfo.addRigidBody(rigidBody, bridge.mesh);
  renderInfo.scene.add(bridge.mesh);
  bridge.mesh.userData.rigidBody = rigidBody;
  rigidBody.threeMesh = bridge.mesh;
}

export default addTubeScene;
