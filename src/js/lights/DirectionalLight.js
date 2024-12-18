import * as THREE from "three";
import Light from "./Light.js";

/**
 * DirectionalLight class that extends the Light class and creates a DirectionalLight
 * @param {string} color - Hex color of the light
 * @param {number} intensity - Intensity of the light
 * @param {object} position - Position of the light, default {x: 0, y: 0, z: 0}
 * @return {void}
 */
class DirectionalLight extends Light {
  constructor(color, intensity, position = { x: 0, y: 0, z: 0 }) {
    super(color, intensity);
    this.x = position.x;
    this.y = position.y;
    this.z = position.z;
    this.light = new THREE.DirectionalLight(this.color, this.intensity);
    this.updatePosition();
  }

  /**
   * Adds GUI controls for the DirectionalLight.
   * @param {dat.GUI} folder - The folder to add the GUI controls to.
   * @return {void}
   */
  addGUIFolder(folder) {
    this.addColorGUI(folder, this.light);
    this.addIntensityGUI(folder, this.light, 0, 10, 0.001);
    this.addPositionGUI(folder, -100, 100, 0.01);
  }

  /**
   * Adds a position GUI control to the folder. Adds controls for x, y, and z.
   * @param {dat.GUI} folder - The folder to add the position GUI control to.
   * @param {number} min - The minimum position value.
   * @param {number} max - The maximum position value.
   * @param {number} step - The step value.
   */
  addPositionGUI(folder, min, max, step) {
    folder
      .add(this, "x")
      .min(min)
      .max(max)
      .step(step)
      .onChange((value) => (this.light.position.x = value));
    folder
      .add(this, "y")
      .min(min)
      .max(max)
      .step(step)
      .onChange((value) => (this.light.position.y = value));
    folder
      .add(this, "z")
      .min(min)
      .max(max)
      .step(step)
      .onChange((value) => (this.light.position.z = value));
  }

  /**
   * Updates the position of the light.
   * @method updatePosition
   */
  updatePosition() {
    this.light.position.set(this.x, this.y, this.z);
  }

  /**
   * Adds a helper to the light.
   * @method addHelper
   * @param {number} sphereSize - The size of the sphere for the helper.
   * @param {dat.GUI} folder - The folder to add the helper GUI control to.
   * @param {boolean} visible - Whether the helper is visible or not.
   */
  addHelper(sphereSize, folder, visible = false) {
    this.helper = new THREE.DirectionalLightHelper(this.light, sphereSize);
    this.helper.visible = visible;

    folder.add(this.helper, "visible").name("helper");
  }

  /**
   * Adds a shadow helper to the light.
   * @method addShadowHelper
   * @param {dat.GUI} folder - The folder to add the shadow helper GUI control to.
   */
  addShadowHelper(folder) {
    this.shadowHelper = new THREE.CameraHelper(this.light.shadow.camera);
    this.shadowHelper.visible = false;

    folder.add(this.shadowHelper, "visible").name("shadowHelper");
  }
}

export default DirectionalLight;
