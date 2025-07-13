import * as THREE from "three";
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

/**
 * The environment class. It contains the canvas, physics info, render info,
 * stats, ammo helper, mouse, raycaster, current intersect, gui, interactive
 * flag, camera sequence, and sounds. It also contains the methods to
 * initialize and start the environment, add the scene objects, add event
 * listeners, handle mousemove, click, and keydown events, move rigid bodies,
 * handle intersects, handle events, and animate.
 * @example
 * // Create a new environment
 * const environment = new Environment();
 * // Initialize the environment
 * environment.initialize();
 * // Start the environment
 * environment.start();
 */
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
    // calculate mouse position in normalized device coordinates (-1 to +1)
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
        this.sounds.playElevator();
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
      case "Digit6":
        // Camera 5
        this.renderInfo.switchCamera(5);
        break;
    }
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
      button.material.color.setHex(0x0fff00);
    } else {
      this.currentIntersect = null;
      button.material.color.setHex(0xffff00);
    }
  }

  /**
   * Handles the events. It moves the elevator, switches the camera, and
   * plays the sound effects for collisions events.
   */
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

    // Sound effects
    if (this.physicsInfo.collisions["ball-bridge"]) {
      this.physicsInfo.collisions["ball-bridge"] = false;
      this.sounds.playRollingBall();
    }

    if (this.physicsInfo.collisions["ball-tube"]) {
      this.physicsInfo.collisions["ball-tube"] = false;
      this.sounds.playTube();
    }

    if (this.physicsInfo.collisions["hammer-ball"]) {
      this.physicsInfo.collisions["hammer-ball"] = false;
      this.sounds.playHit();
    }

    if (this.physicsInfo.collisions["balancingBoard-hangingBall"]) {
      this.physicsInfo.collisions["balancingBoard-hangingBall"] = false;
      this.sounds.playBoing();
    }
  }

  /**
   * Handles the elevator event. It moves the elevator, plays the wind sound
   * effect, switches the camera, and moves the ball.
   * @param {THREE.Mesh} elevator - The elevator mesh.
   * @param {THREE.Mesh} ball - The ball mesh.
   */
  handleElevatorEvent(elevator, ball) {
    if (elevator.start) {
      if (elevator.position.y < 53) {
        this.ammoHelper.moveRigidBody(elevator, { x: 0, y: 0.06, z: 0 });

        if (elevator.position.y > 45 && elevator.position.y < 50) {
          this.sounds.playWind();
        } else if (elevator.position.y > 52.5) {
          // Move ball by applying force from the direction of the wind particles
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

  /**
   * Handles the camera event. It switches the camera based on the ball
   * or hangingBall position.
   * @param {THREE.Mesh} ball - The ball mesh.
   * @param {THREE.Mesh} hangingBall - The hanging ball mesh.
   */
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

  /**
   * Handles the laser event. It plays the laser sound effect, moves the
   * button down, and increases the mass of the hanging ball.
   * @param {THREE.Mesh} laser - The laser mesh.
   * @param {THREE.Mesh} button - The button mesh.
   * @param {THREE.Mesh} hangingBall - The hanging ball mesh.
   */
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
      // Set the collision group and mask for the updated rigid body
      updatedRigidbody.setCollisionGroup = this.physicsInfo.collisionGroup.ball;
      updatedRigidbody.setCollisionMask =
        this.physicsInfo.collisionGroup.board ||
        this.physicsInfo.collisionGroup.aquarium;

      hangingBall.userData.rigidBody = updatedRigidbody;
      updatedRigidbody.threeMesh = hangingBall;

      this.sounds.playLaser();
      // Move the button down to indicate that it has been pressed
      button.children[1].position.y = 1.5;
    }
  }

  /**
   * Handles the dominos event. It plays the hit sound effect when the dominos
   * fall over and the success sound effect when the fish is fed. It also displays
   * the fish food when the container has fallen over and the start message again.
   * @param {THREE.Mesh} foodContainer - The food container mesh.
   * @param {THREE.Mesh} foodContainerTop - The food container top mesh.
   */
  handleDominosEvent(foodContainer, foodContainerTop) {
    if (this.physicsInfo.collisions["domino0-domino1"]) {
      this.sounds.playHit();
      this.physicsInfo.collisions["domino0-domino1"] = false;
    }

    if (this.physicsInfo.collisions["domino1-domino2"]) {
      this.sounds.playHit();
      this.physicsInfo.collisions["domino1-domino2"] = false;
    }

    if (this.physicsInfo.collisions["domino2-domino3"]) {
      this.sounds.playHit();
      this.physicsInfo.collisions["domino2-domino3"] = false;
    }

    if (this.physicsInfo.collisions["domino3-domino4"]) {
      this.sounds.playHit();
      this.physicsInfo.collisions["domino3-domino4"] = false;
    }

    if (this.physicsInfo.collisions["foodContainer-domino4"]) {
      if (foodContainerTop.material.opacity > 0) {
        // Make the top of the container transparent
        foodContainerTop.material.opacity -= 0.2;
      }
      // The cylinder will rotate around the z-axis
      const euler = this.ammoHelper.getEuler(foodContainer.userData.rigidBody);
      if (Math.abs(euler.z) > 0.7) {
        // The cylinder has fallen over and the fish can be fed
        this.physicsInfo.collisions["foodContainer-domino4"] = false;
        this.sounds.playHit();
        this.renderInfo.feedFish = true;
        foodContainerTop.visible = false; // Hide the top of the container
        this.sounds.playSuccess();

        // Show the start message after 2 seconds
        setTimeout(() => {
          const startMessage = document.querySelector(".start-message");
          const title = startMessage.querySelector("h1");
          const text = startMessage.querySelector("p");
          const button = startMessage.querySelector("button");
          title.innerHTML = "Yum yum!";
          text.innerHTML =
            "The fish has been fed<br>You can control the cameras with number keys 1-6 and look around using the mouse ";
          button.innerHTML = "Start again";
          startMessage.style.display = "flex";
        }, 2000);
      }
    }
  }

  /**
   * Animates the environment. It calculates the delta time and elapsed time,
   * handles intersects, handles events, updates the render info, and sets the
   * water material's time uniform.
   * @param {number} currentTime - The current time in milliseconds.
   */
  animate(currentTime) {
    const deltaTime = this.renderInfo.clock.getDelta();
    const elapsedTime = this.renderInfo.clock.getElapsedTime();
    const water = this.renderInfo.scene.getObjectByName("water");

    this.stats.begin();
    // check for mouse intersections
    this.interactive && this.handleIntersects();
    this.handleEvents();
    this.physicsInfo.update(deltaTime);
    // update the water material's time uniform
    water.material.uniforms.time.value = elapsedTime;
    this.renderInfo.update(deltaTime);
    this.stats.end();

    window.requestAnimationFrame((currentTime) => this.animate(currentTime));
  }
}

export default Environment;
