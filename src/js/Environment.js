import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import GUI from "lil-gui";
import RenderInfo from "./RenderInfo.js";
import PhysicsInfo from "./PhysicsInfo.js";
import Lighting from "./threejs/lights/Lighting.js";
import Plane from "./threejs/shapes/Plane.js";
import Sphere from "./threejs/shapes/Sphere.js";
import Box from "./threejs/shapes/Box.js";
import RigidSphere from "./physics/RigidSphere.js";
import RigidBox from "./physics/RigidBox.js";

import addDominoScene from "./dominos.js";
import hammer from "./hammer.js";

class Environment {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.physicsInfo = new PhysicsInfo();
    this.renderInfo = new RenderInfo(this.canvas);
    this.gui = new GUI();

    this.addEventListeners();
  }

  start() {
    this.physicsInfo.setup();
    this.renderInfo.addGuiControls(this.gui);

    this.addSceneObjects();
    this.animate(0);
  }

  addSceneObjects() {
    this.addLights();
    this.addFloor(100, 0.5, 100, 0x158000, "plane");
    this.addPillar();  
    // this.addBalancingBoard();
    this.addSphere(10, 2, 0xff0000, "sphere", { x: 0, y: 22, z: 0 });
    this.addSphere(2, 2, 0xff0000, "groundBall", { x: 2, y: 2.5, z: 0 });
    this.addDominos()
    hammer(this.renderInfo, this.physicsInfo)
  }

  addLights() {
    const lights = new Lighting();
    lights.addLights(this.gui);
    this.renderInfo.scene.add(lights.group);
  }

  addFloor(width, height, depth, color, name) {
    const mass = 0;

    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({color})
    );
    mesh.receiveShadow = true;
    mesh.position.set(0, -height / 2, 0);
    mesh.name = name

    const shape = new Ammo.btBoxShape(
      new Ammo.btVector3(width * 0.5, height * 0.5, depth * 0.5)
    );
    shape.setMargin(0.05);
    const rigidBody = this.physicsInfo.createRigidBody(shape, mesh, mass);
    rigidBody.setFriction(0.8);
    rigidBody.setRestitution(0.7);

    this.physicsInfo.addRigidBody(rigidBody, mesh);
    this.renderInfo.scene.add(mesh);
    mesh.userData.physicsBody = rigidBody;
  }

  addSphere(mass, radius, color, name, pos = { x: 0, y: 0, z: 0 }) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 32, 32),
      new THREE.MeshStandardMaterial({ color })
    );
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const shape = new Ammo.btSphereShape(radius);
    shape.setMargin(0.05);

    const rigidBody = this.physicsInfo.createRigidBody(shape, mesh, mass);
    rigidBody.setFriction(0.5);
    rigidBody.setRestitution(0.7);

    this.physicsInfo.addRigidBody(rigidBody, mesh);
    this.renderInfo.scene.add(mesh);
    mesh.userData.physicsBody = rigidBody;
  }

  addBalancingBoard() {
    const radius = 2
    const baseMass = 0
    const boardMass = 10

    const baseMesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 24, 12, 0, 2 * Math.PI, 0, 0.5 * Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x0000ff })
    );
    baseMesh.position.set(8, 0, 0);

    const baseShape = new Ammo.btSphereShape(radius);
    baseShape.setMargin(0.05);

    const baseRigidBody = this.physicsInfo.createRigidBody(baseShape, baseMesh, baseMass);
    this.physicsInfo.addRigidBody(baseRigidBody, baseMesh);
    this.renderInfo.scene.add(baseMesh);
    baseMesh.userData.physicsBody = baseRigidBody;

    const boardMesh = new THREE.Mesh(
      new THREE.BoxGeometry(15, 0.5, 3),
      new THREE.MeshStandardMaterial({ color: 0x0000ff })
    );
    boardMesh.position.set(8, 2.25, 0);

    const boardShape = new Ammo.btBoxShape(new Ammo.btVector3(5, 0.25, 1.5));
    boardShape.setMargin(0.05);

    const boardRigidBody = this.physicsInfo.createRigidBody(boardShape, boardMesh, boardMass);
    boardRigidBody.setDamping(0.1, 0.1);
    this.physicsInfo.addRigidBody(boardRigidBody, boardMesh);
    this.renderInfo.scene.add(boardMesh);
    boardMesh.userData.physicsBody = boardRigidBody;

    // P2P Constraint
    const pivotA = new Ammo.btVector3(0, 2, 0);
    const pivotB = new Ammo.btVector3(0, 0.5, 0);

    const p2p = new Ammo.btPoint2PointConstraint(baseRigidBody, boardRigidBody, pivotA, pivotB);
    this.physicsInfo.world.addConstraint(p2p, false);


  }

  addPillar() {
    const pillar = new THREE.Group()
    pillar.name = 'pillar'

    const mass = 0
    const baseSize = { x: 1, y: 20, z: 5 }
    const plateauSize = { x: 15, y: 1, z: 5 }
    const baseLocalOrigin = { x: 0, y: baseSize.y / 2, z: 0 }
    const plateauLocalOrigin = { x: -plateauSize.x / 2 + baseSize.x/2, y: baseSize.y, z: 0 }

    // base mesh
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(baseSize.x, baseSize.y, baseSize.z), material)
    baseMesh.position.set(baseLocalOrigin.x, baseLocalOrigin.y, baseLocalOrigin.z)
    baseMesh.castShadow = true
    pillar.add(baseMesh)

    // plateau mesh
    const plateauMesh = new THREE.Mesh(new THREE.BoxGeometry(plateauSize.x, plateauSize.y, plateauSize.z), material)
    plateauMesh.position.set(plateauLocalOrigin.x, plateauLocalOrigin.y, plateauLocalOrigin.z)
    plateauMesh.castShadow = true
    pillar.add(plateauMesh)

    pillar.castShadow = true
    pillar.receiveShadow = true

    const pillarShape = new Ammo.btCompoundShape()

    // base shape
    const baseShape = new Ammo.btBoxShape(new Ammo.btVector3(baseSize.x / 2, baseSize.y / 2, baseSize.z / 2))
    let transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(new Ammo.btVector3(baseLocalOrigin.x, baseLocalOrigin.y, baseLocalOrigin.z))
    pillarShape.addChildShape(transform, baseShape)

    // plateau shape
    const plateauShape = new Ammo.btBoxShape(new Ammo.btVector3(plateauSize.x / 2, plateauSize.y / 2, plateauSize.z / 2))
    transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(new Ammo.btVector3(plateauLocalOrigin.x, plateauLocalOrigin.y, plateauLocalOrigin.z))
    pillarShape.addChildShape(transform, plateauShape)

    pillarShape.setMargin(0.05)
    const rigidPillar = this.physicsInfo.createRigidBody(pillarShape, pillar, mass)
    this.physicsInfo.addRigidBody(rigidPillar, pillar)
    pillar.userData.physicsBody = rigidPillar
    this.renderInfo.scene.add(pillar)

  }

  addDominos() {
    const pos = { x: -2, y: 20, z: 0 }
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff })

    for (let i = 0; i < 5; i++) {
      pos.x -= 2
      this.addDomino(pos, material)
    }
  }

  addDomino(pos, material) {
    const scale = { x: 0.5, y: 3, z: 2 }
    const mass = 1

    const domino = new THREE.Mesh(new THREE.BoxGeometry(scale.x, scale.y, scale.z), material)
    domino.position.set(pos.x, pos.y, pos.z)

    const shape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x / 2, scale.y / 2, scale.z / 2))
    shape.setMargin(0.05)
    const rigidDomino = this.physicsInfo.createRigidBody(shape, domino, mass)

    this.physicsInfo.addRigidBody(rigidDomino, domino)
    domino.userData.physicsBody = rigidDomino
    this.renderInfo.scene.add(domino)
  }

  addEventListeners() {
    window.addEventListener("resize", () => this.renderInfo.resize());
    window.addEventListener("keydown", (e) => this.keyDown(e.code));
    window.addEventListener("keyup", (e) => this.keyUp(e.code));
  }

  keyDown(code) {
    const groundBall = this.renderInfo.scene.getObjectByName('groundBall')
    switch(code) {
      case 'KeyF':
        this.physicsInfo.applyForce(groundBall)
        break;
    }
  }

  keyUp(code) {
    console.log(code);
  }

  animate(currentTime) {
    const deltaTime = this.renderInfo.clock.getDelta();

    this.physicsInfo.update(deltaTime);
    this.renderInfo.update();

    window.requestAnimationFrame((currentTime) => this.animate(currentTime));
  }
}

export default Environment;
