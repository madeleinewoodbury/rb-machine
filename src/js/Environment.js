import * as THREE from "three";
import GUI from "lil-gui";
import Stats from "stats.js";
import RenderInfo from "./RenderInfo.js";
import PhysicsInfo from "./PhysicsInfo.js";
import AmmoHelper from "./AmmoHelper.js";
import Lighting from "./lights/Lighting.js";
import materials from "./utils/materials.js";

import addElevatorScene from "./scenes/elevatorScene.js";
import addTubeScene from "./scenes/tubeScene.js";
import addBalancingBoardScene from "./scenes/balancingBoardScene.js";
import addPillarScene from "./scenes/pillarScene.js";
import addWindScene from "./scenes/windScene.js";
import addHammerScene from "./scenes/hammerScene.js";
import addFishScene from "./scenes/fishScene.js";
import addLaserGunScene from "./scenes/laserGunScene.js";

class Environment {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.physicsInfo = new PhysicsInfo();
    this.renderInfo = new RenderInfo(this.canvas);
    this.stats = new Stats();
    this.ammoHelper = new AmmoHelper();
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.currentIntersect = null;
    this.gui = new GUI();
    this.feedFish = false;
    this.interactive = false;

    this.addEventListeners();
  }

  initialize() {
    this.physicsInfo.setup();
    this.renderInfo.addGuiControls(this.gui);

    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);

    this.gui.close();

    this.addSceneObjects();
    this.animate(0);
  }

  start() {
    this.interactive = true;
    this.renderInfo.switchCamera(1);
  }

  addSceneObjects() {
    this.addLights();
    this.addFloor(200, 0.01, 200);

    addFishScene(this.renderInfo, this.physicsInfo, this.ammoHelper);
    addPillarScene(this.renderInfo, this.physicsInfo, this.ammoHelper);
    addBalancingBoardScene(this.renderInfo, this.physicsInfo, this.ammoHelper);
    addElevatorScene(this.renderInfo, this.physicsInfo, this.ammoHelper);
    addTubeScene(this.renderInfo, this.physicsInfo, this.ammoHelper);
    addHammerScene(this.renderInfo, this.physicsInfo, this.ammoHelper);
    addWindScene(this.renderInfo, this.physicsInfo, this.ammoHelper);
    addLaserGunScene(this.renderInfo, this.physicsInfo, this.ammoHelper);
  }

  addFloor(width, height, depth) {
    const mass = 0;

    const plane = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      // materials.grass
      // materials.stoneFloor
      materials.plane
      // materials.waterCloud
    );
    plane.receiveShadow = true;
    plane.position.set(0, -height / 2, 0);
    plane.name = "floor";

    const shape = new Ammo.btBoxShape(
      new Ammo.btVector3(width * 0.5, height * 0.5, depth * 0.5)
    );
    shape.setMargin(0.05);

    const rigidBody = this.physicsInfo.createRigidBody(shape, plane, mass);
    rigidBody.setFriction(0.8);
    rigidBody.setRestitution(0.7);

    this.physicsInfo.addRigidBody(rigidBody, plane);
    this.renderInfo.scene.add(plane);

    plane.userData.rigidBody = rigidBody;
  }

  addLights() {
    const lights = new Lighting();
    lights.addLights(this.gui);
    this.renderInfo.scene.add(lights.group);
  }

  addEventListeners() {
    window.addEventListener("resize", () => this.renderInfo.resize());
    window.addEventListener("keydown", (e) => this.keyDown(e.code));
    window.addEventListener("keyup", (e) => this.keyUp(e.code));
    window.addEventListener("mousemove", (e) => this.mouseMove(e));
    window.addEventListener("click", (e) => this.mouseClick(e));
  }

  mouseMove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  mouseClick(e) {
    if (this.currentIntersect) {
      if (this.currentIntersect.object.name === "button") {
        const elevator = this.renderInfo.scene.getObjectByName("elevator");
        elevator.start = true;
      }
    }
  }

  keyDown(code) {
    const ball = this.renderInfo.scene.getObjectByName("hangingBall");

    switch (code) {
      case "KeyF":
        const rigidBall = ball.userData.rigidBody;
        const shape = rigidBall.getCollisionShape();
        const updatedRigidbody = this.ammoHelper.createRigidBody(
          shape,
          ball,
          25
        );

        this.physicsInfo.world.removeRigidBody(rigidBall);
        this.physicsInfo.addRigidBody(updatedRigidbody, ball);

        ball.userData.rigidBody = updatedRigidbody;
        break;
      case "Digit1":
        // Camera 1
        this.renderInfo.switchCamera(0);
        break;
      case "Digit2":
        // Camera 2
        this.renderInfo.switchCamera(1);
        break;
      case "Digit3":
        // Camera 3
        this.renderInfo.switchCamera(2);
        break;
      case "Digit4":
        // Camera 3
        this.renderInfo.switchCamera(2);
        break;
    }
  }

  moveRigidBody(mesh, direction) {
    const transform = new Ammo.btTransform();
    const motionState = mesh.userData.rigidBody.getMotionState();
    motionState.getWorldTransform(transform);

    const position = transform.getOrigin();
    transform.setOrigin(
      new Ammo.btVector3(
        position.x() + direction.x,
        position.y() + direction.y,
        position.z() + direction.z
      )
    );
    motionState.setWorldTransform(transform);
  }

  handleIntersects() {
    this.raycaster.setFromCamera(this.mouse, this.renderInfo.activeCamera);
    const button = this.renderInfo.scene.getObjectByName("button");
    const intersectObjects = [button];
    const intersects = this.raycaster.intersectObjects(intersectObjects);

    if (intersects.length) {
      this.currentIntersect = intersects[0];
    } else {
      this.currentIntersect = null;
    }
  }

  handleEvents() {
    // Move elevator
    const elevator = this.renderInfo.scene.getObjectByName("elevator");
    const ball = this.renderInfo.scene.getObjectByName("ball");
    const hangingBall = this.renderInfo.scene.getObjectByName("hangingBall");
    const laser = this.renderInfo.scene.getObjectByName("laser");
    const foodContainer =
      this.renderInfo.scene.getObjectByName("foodContainer");

    if (elevator.start) {
      if (elevator.position.y < 53) {
        this.moveRigidBody(elevator, { x: 0, y: 0.05, z: 0 });
        if (elevator.position.y > 52.5) {
          const force = new Ammo.btVector3(-500, 0, 0);
          const relPos = new Ammo.btVector3(1, 0, 0);
          this.physicsInfo.applyForce(ball, force, relPos);
        } else if(elevator.position.y > 10 && elevator.position.y < 10.5) {
          // Switch camera
          if
        }
      } else {
        elevator.start = false;
      }
    }

    if (
      this.physicsInfo.collisions["hammer"] === "laserButton" &&
      hangingBall.mass === 0
    ) {
      laser.material.opacity = 1;
      const rigidBall = hangingBall.userData.rigidBody;
      const shape = rigidBall.getCollisionShape();
      const updatedRigidbody = this.ammoHelper.createRigidBody(
        shape,
        hangingBall,
        35
      );
      this.physicsInfo.world.removeRigidBody(rigidBall);
      this.physicsInfo.addRigidBody(updatedRigidbody, hangingBall);
      hangingBall.userData.rigidBody = updatedRigidbody;
      hangingBall.mass = 35;
    }

    if (this.physicsInfo.collisions["foodContainer"] === "domino") {
      // The cylinder will rotate around the z-axis
      const euler = this.ammoHelper.getEuler(foodContainer.userData.rigidBody);
      if (Math.abs(euler.z) > 0.7) {
        this.physicsInfo.collisions["foodContainer"] = null;
        this.feedFish = true;
      }
    }
  }

  animateParticles(deltaTime) {
    const windParticles =
      this.renderInfo.scene.getObjectByName("windParticles");
    const speed = 3;

    windParticles.position.x -= speed * deltaTime;

    if (windParticles.position.x < 65) {
      windParticles.material.opacity -= 0.02;

      if (windParticles.material.opacity < 0) {
        windParticles.position.x = 75;
        windParticles.material.opacity += 0.1;
      }
    } else if (windParticles.material.opacity < 1) {
      windParticles.material.opacity += 0.01;
    }
  }

  animateFishFood() {
    const fishFood = this.renderInfo.scene.getObjectByName("fishFood");

    if (fishFood.position.y > 7) {
      if (fishFood.material.opacity < 1) {
        fishFood.material.opacity += 0.1;
      }
    } else {
      if (fishFood.material.opacity > 0) {
        fishFood.material.opacity -= 0.1;
      }
    }

    if (fishFood.position.y < 0) {
      this.feedFish = false;
    }

    fishFood.position.y -= 0.1;
  }

  animate(currentTime) {
    const deltaTime = this.renderInfo.clock.getDelta();
    const elapsedTime = this.renderInfo.clock.getElapsedTime();
    const water = this.renderInfo.scene.getObjectByName("water");

    this.stats.begin();
    this.interactive && this.handleIntersects();
    this.handleEvents();
    if (this.feedFish) this.animateFishFood();
    this.animateParticles(deltaTime);

    this.physicsInfo.update(deltaTime);
    water.material.uniforms.time.value = elapsedTime;
    this.renderInfo.update(deltaTime);
    this.stats.end();
    window.requestAnimationFrame((currentTime) => this.animate(currentTime));
  }
}

export default Environment;
