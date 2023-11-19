import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import GUI from "lil-gui";
import Stats from "stats.js";
import RenderInfo from "./RenderInfo.js";
import PhysicsInfo from "./PhysicsInfo.js";
import AmmoHelper from "./AmmoHelper.js";
import sounds from "./utils/sounds.js";

import addWorldScene from "./scenes/worldScene.js";
import addElevatorScene from "./scenes/elevatorScene.js";
import addTubeScene from "./scenes/tubeScene.js";
import addBalancingBoardScene from "./scenes/balancingBoardScene.js";
import addPillarScene from "./scenes/pillarScene.js";
import addWindScene from "./scenes/windScene.js";
import addHammerScene from "./scenes/hammerScene.js";
import addFishScene from "./scenes/fishScene.js";
import addLaserGunScene from "./scenes/laserGunScene.js";

import materials from "./utils/materials.js";

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
    this.interactive = false;
    this.cameraSequence = [1, 2, 3, 4, 0];
    this.sounds = sounds;

    this.addEventListeners();
  }

  /**
   * Initializes the environment. It sets up the physics, renderer, and
   * scene objects. It also adds the GUI controls and stats.
   */
  initialize() {
    this.physicsInfo.setup();
    this.renderInfo.addGuiControls(this.gui);

    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);

    this.gui.close();

    this.addSceneObjects();
    this.animate(0);
  }

  /**
   * Starts the environment. It sets the environment to interactive mode
   * and switches the camera to the first camera in the sequence.
   */
  start() {
    this.interactive = true;
    this.renderInfo.switchCamera(this.cameraSequence.shift());
  }

  /**
   * Adds the scene objects to the scene.
   */
  addSceneObjects() {
    addWorldScene(this.renderInfo, this.physicsInfo, this.ammoHelper, this.gui);
    addFishScene(this.renderInfo, this.physicsInfo, this.ammoHelper);
    addPillarScene(this.renderInfo, this.physicsInfo, this.ammoHelper);
    addBalancingBoardScene(this.renderInfo, this.physicsInfo, this.ammoHelper);
    addElevatorScene(this.renderInfo, this.physicsInfo, this.ammoHelper);
    addTubeScene(this.renderInfo, this.physicsInfo, this.ammoHelper);
    addHammerScene(this.renderInfo, this.physicsInfo, this.ammoHelper);
    addWindScene(this.renderInfo, this.physicsInfo, this.ammoHelper);
    addLaserGunScene(this.renderInfo, this.physicsInfo, this.ammoHelper);

    // this.renderInfo.scene.add(getText())
    this.addText();
  }

  addText() {
    const fontLoader = new FontLoader();
    fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
      const textGeometry = new TextGeometry("Hit up button", {
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

      textGeometry.center();

      const material = new THREE.MeshBasicMaterial({ wireframe: true });
      // const material = new THREE.MeshMatcapMaterial({
      //   matcap: matcapTexture,
      // })
      const text = new THREE.Mesh(textGeometry, materials.yellow);
      text.position.set(60, 4, -65);
      text.rotation.set(0, Math.PI / 2.75, 0);

      this.renderInfo.scene.add(text);
    });
  }

  /**
   * Adds event listeners to the window.
   * - resize: Resizes the renderer and updates the camera aspect ratio.
   * - keydown: Handles keydown events.
   * - mousemove: Handles mousemove events.
   * - click: Handles click events.
   */
  addEventListeners() {
    window.addEventListener("resize", () => this.renderInfo.resize());
    window.addEventListener("keydown", (e) => this.keyDown(e.code));
    window.addEventListener("mousemove", (e) => this.mouseMove(e));
    window.addEventListener("click", (e) => this.mouseClick(e));
  }

  /**
   * Handles mousemove events. It updates the mouse position.
   * @param {MouseEvent} e - The mousemove event.
   */
  mouseMove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  /**
   * Handles click events. It checks if the mouse intersects with the button
   * and if it does, it starts the elevator.
   * @param {MouseEvent} e - The click event.
   */
  mouseClick(e) {
    if (this.currentIntersect) {
      if (this.currentIntersect.object.name === "button") {
        this.sounds.playDing();
        const elevator = this.renderInfo.scene.getObjectByName("elevator");
        elevator.start = true;
      }
    }
  }

  /**
   * Handles keydown events. It switches the camera based on the key pressed.
   * @param {string} code - The key code of the key pressed.
   */
  keyDown(code) {
    switch (code) {
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
        // Camera 4
        this.renderInfo.switchCamera(3);
        break;
      case "Digit5":
        // Camera 5
        this.renderInfo.switchCamera(4);
        break;
    }
  }

  /**
   * Moves the rigid body in the given direction.
   * @param {THREE.Mesh} mesh - The mesh to move.
   * @param {THREE.Vector3} direction - The direction to move the mesh.
   */
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

  /**
   * Handles the intersects. It sets the current intersect to the first
   * intersected object.
   */
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
    const button = this.renderInfo.scene.getObjectByName("laserButton");
    const foodContainer =
      this.renderInfo.scene.getObjectByName("foodContainer");
    const foodContainerTop =
      this.renderInfo.scene.getObjectByName("foodContainerTop");

    this.handleElevatorEvent(elevator, ball);
    this.handleCamerasEvent(ball, hangingBall);
    this.handleLaserEvent(laser, button, hangingBall);
    this.handleDominosEvent(foodContainer, foodContainerTop);
  }

  handleElevatorEvent(elevator, ball) {
    if (elevator.start) {
      if (elevator.position.y < 53) {
        this.moveRigidBody(elevator, { x: 0, y: 0.06, z: 0 });

        if (elevator.position.y > 52.5) {
          const force = new Ammo.btVector3(-500, 0, 0);
          const relPos = new Ammo.btVector3(1, 0, 0);
          this.physicsInfo.applyForce(ball, force, relPos);
        } else if (
          elevator.position.y > 15 &&
          this.cameraSequence.length === 4
        ) {
          // Switch camera
          this.renderInfo.switchCamera(this.cameraSequence.shift());
        }
      } else {
        elevator.start = false;
      }
    }
  }

  handleCamerasEvent(ball, hangingBall) {
    if (this.cameraSequence.length === 3 && ball.position.x < 30) {
      this.renderInfo.switchCamera(this.cameraSequence.shift());
    } else if (this.cameraSequence.length === 2 && ball.position.x < -10) {
      this.renderInfo.switchCamera(this.cameraSequence.shift());
    } else if (this.cameraSequence.length === 1) {
      if (hangingBall.position.y < 44) {
        this.renderInfo.switchCamera(this.cameraSequence.shift());
      }
    }
  }

  handleLaserEvent(laser, button, hangingBall) {
    if (this.physicsInfo.collisions["hammer-laserButton"]) {
      this.physicsInfo.collisions["hammer-laserButton"] = false;
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

      this.sounds.playLaserSound();
      button.children[1].position.y = 1.5;
    }
  }

  handleDominosEvent(foodContainer, foodContainerTop) {
    if (this.physicsInfo.collisions["domino0-domino1"]) {
      this.sounds.playHitSound();
      this.physicsInfo.collisions["domino0-domino1"] = false;
    }

    if (this.physicsInfo.collisions["domino1-domino2"]) {
      this.sounds.playHitSound();
      this.physicsInfo.collisions["domino1-domino2"] = false;
    }

    if (this.physicsInfo.collisions["domino2-domino3"]) {
      this.sounds.playHitSound();
      this.physicsInfo.collisions["domino2-domino3"] = false;
    }

    if (this.physicsInfo.collisions["domino3-domino4"]) {
      this.sounds.playHitSound();
      this.physicsInfo.collisions["domino3-domino4"] = false;
    }

    if (this.physicsInfo.collisions["foodContainer-domino4"]) {
      // The cylinder will rotate around the z-axis
      const euler = this.ammoHelper.getEuler(foodContainer.userData.rigidBody);
      if (Math.abs(euler.z) > 0.7) {
        this.physicsInfo.collisions["foodContainer-domino4"] = false;
        this.renderInfo.feedFish = true;
        foodContainerTop.visible = false; // Hide the top of the container
      }
    }
  }

  animate(currentTime) {
    const deltaTime = this.renderInfo.clock.getDelta();
    const elapsedTime = this.renderInfo.clock.getElapsedTime();
    const water = this.renderInfo.scene.getObjectByName("water");

    this.stats.begin();
    this.interactive && this.handleIntersects();
    this.handleEvents();
    this.physicsInfo.update(deltaTime);
    water.material.uniforms.time.value = elapsedTime;
    this.renderInfo.update(deltaTime);
    this.stats.end();

    window.requestAnimationFrame((currentTime) => this.animate(currentTime));
  }
}

export default Environment;
