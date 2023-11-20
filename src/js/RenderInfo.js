import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Class representing the render information. This class is responsible for
 * setting up the camera, controls, and renderer.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 */
class RenderInfo {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.axesHelper = new THREE.AxesHelper(100);
    this.showAxesHelper = false;
    this.cameras = [];
    this.activeCamera = null;
    this.feedFish = false;

    this.setupCameras();
    this.setupControls();
    this.setupRenderer();
  }

  reset() {
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.cameras = [];
    this.feedFish = false;

    this.setupCameras();
    this.setupControls();
    this.setupRenderer();
  }


  /**
   * Sets up the cameras. Creates 6 cameras and adds them to the scene.
   * The first camera is the active camera.
   */
  setupCameras() {
    const aspectRatio = window.innerWidth / window.innerHeight;

    const camera1 = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
    camera1.position.set(0, 60, 120);
    camera1.target = new THREE.Vector3(0, 20, 0);
    camera1.lookAt(camera1.target);
    camera1.name = "camera1";

    this.cameras.push(camera1);
    this.scene.add(camera1);

    const camera2 = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000);
    camera2.position.set(82, 10, -54);
    camera2.target = new THREE.Vector3(70, 10, -55);
    camera2.lookAt(camera2.target);
    camera2.name = "camera2";

    this.cameras.push(camera2);
    this.scene.add(camera2);

    const camera3 = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000);
    camera3.position.set(40, 60, -100);
    camera3.target = new THREE.Vector3(60, 40, -55);
    camera3.lookAt(camera3.target);
    camera3.name = "camera3";

    this.cameras.push(camera3);
    this.scene.add(camera3);

    const camera4 = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000);
    camera4.position.set(-50, 40, -90);
    camera4.target = new THREE.Vector3(-10, 40, -55);
    camera4.lookAt(camera4.target);
    camera4.name = "camera4";

    this.cameras.push(camera4);
    this.scene.add(camera4);

    const camera5 = new THREE.PerspectiveCamera(40, aspectRatio, 0.1, 1000);
    camera5.position.set(50, 50, 30);
    camera5.target = new THREE.Vector3(-50, 30, -55);
    camera5.lookAt(camera5.target);
    camera5.name = "camera5";

    this.cameras.push(camera5);
    this.scene.add(camera5);

    const camera6 = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000);
    camera6.position.set(32, 45, 45);
    camera6.target = new THREE.Vector3(-50, 30, -55);
    camera6.lookAt(camera6.target);
    camera6.name = "camera6";

    this.cameras.push(camera6);
    this.scene.add(camera6);

    const testCamera = new THREE.PerspectiveCamera(65, aspectRatio, 0.1, 1000);
    testCamera.position.set(-35, 50, 65);
    testCamera.target = new THREE.Vector3(-10, 20, 0);
    testCamera.lookAt(testCamera.target);
    testCamera.name = "testCamera";

    this.cameras.push(testCamera);
    this.scene.add(testCamera);

    this.activeCamera = this.cameras[6];
  }

  /**
   * Sets up the controls. Creates an OrbitControls object and sets the
   * target to the active camera's target.
   */
  setupControls() {
    this.controls = new OrbitControls(this.activeCamera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.target = this.activeCamera.target;
  }

  /**
   * Sets up the renderer. Creates a WebGLRenderer object and sets the
   * canvas, antialias, and shadowMap properties.
   */
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // Limit pixel ratio to 2
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Enable gamma correction for input textures and final output for accurate rendering.
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
  }

  /**
   * Switches the active camera to the camera at the given index.
   * @param {number} cameraIndex - The index of the camera to switch to.
   */
  switchCamera(cameraIndex) {
    if (this.activeCamera === this.cameras[cameraIndex]) {
      return;
    }

    this.activeCamera = this.cameras[cameraIndex];
    this.controls.object = this.activeCamera;
    this.controls.target = this.activeCamera.target;
  }

  /**
   * Adds the axes helper to the scene and adds the axes helper's visibility
   * to the gui.
   * @param {dat.GUI} gui - The dat.GUI object.
   */
  addGuiControls(gui) {
    this.scene.add(this.axesHelper);
    if (!this.showAxesHelper) {
      this.axesHelper.visible = false;
    }

    gui.add(this.axesHelper, "visible").name("axes helper");
  }

  /**
   * Update the renderer's size and the active camera's aspect ratio.
   */
  resize() {
    // Update cameras
    const aspectRatio = window.innerWidth / window.innerHeight;
    this.cameras.forEach((camera) => {
      camera.aspect = aspectRatio;
      camera.updateProjectionMatrix();
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }


  /**
   * Animate the scene objects.
   * @param {number} deltaTime - The time in seconds since the last frame.
   */
  animateSceneObjects(deltaTime) {
    this.animateWindMill(deltaTime);
    this.animateParticles(deltaTime);

    if (this.feedFish) {
      this.animateFishFood();
    }
  }

  /**
   * Animate the windmill. Rotates the blades.
   * @param {number} deltaTime - The time in seconds since the last frame.
   */ 
  animateWindMill(deltaTime) {
    const rotationSpeed = Math.PI / 2;
    const blade1 = this.scene.getObjectByName("blade1");
    const blade2 = this.scene.getObjectByName("blade2");

    blade1.rotationAngle += rotationSpeed * deltaTime;
    blade2.rotationAngle += rotationSpeed * deltaTime;

    blade1.rotation.z = blade1.rotationAngle;
    blade2.rotation.z = blade2.rotationAngle;
  }

  /**
   * Animate the wind particles. Moves the particles and changes the opacity.
   * @param {number} deltaTime - The time in seconds since the last frame.
   */ 
  animateParticles(deltaTime) {
    const windParticles = this.scene.getObjectByName("windParticles");
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

  /**
   * Animate the fish food. Moves the fish food and changes the opacity.
   */ 
  animateFishFood() {
    const fishFood = this.scene.getObjectByName("fishFood");

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

  /**
   * Render the scene.
   * @param {number} deltaTime - The time in seconds since the last frame.
   */
  update(deltaTime, feedFish) {
    this.animateSceneObjects(deltaTime, feedFish);
    this.controls.update();
    this.renderer.render(this.scene, this.activeCamera);
  }
}

export default RenderInfo;
