import * as THREE from 'three'
import Light from './Light.js'

/**
 * PointLight class that extends the Light class and creates a PointLight
 * @param {string} color - Hex color of the light
 * @param {number} intensity - Intensity of the light
 * @param {number} distance - Distance of the light
 * @param {object} position - Position of the light, default {x: 0, y: 0, z: 0}
 * @return {void}
 */
class PointLight extends Light {
  constructor(color, intensity, distance, position={x: 0, y: 0, z: 0}) {
    super(color, intensity)
    this.distance = distance
    this.x = position.x
    this.y = position.y
    this.z = position.z
    this.light = new THREE.PointLight(this.color, this.intensity, this.distance)
    this.updatePosition()
  }

  /**
   * Adds GUI controls for the PointLight.
   * @param {dat.GUI} folder - The folder to add the GUI controls to.
   * @return {void}
   */ 
  addGUIFolder(folder) {
    this.addColorGUI(folder, this.light)
    this.addIntensityGUI(folder, this.light, 0, 100, 0.01)
    this.addDistanceGUI(folder, 0, 100, 0.01)
    this.addPositionGUI(folder, -200, 200, 1)
  }

  /**
   * Adds a distance GUI control to the folder.
   * @param {dat.GUI} folder - The folder to add the distance GUI control to.
   * @param {number} min - The minimum distance value.
   * @param {number} max - The maximum distance value.
   * @param {number} step - The step value.
   * @return {void}
   */ 
  addDistanceGUI(folder, min, max, step) {
    folder
      .add(this, 'distance')
      .min(min)
      .max(max)
      .step(step)
      .onChange((value) => (this.light.distance = value))
  }

  /**
   * Adds a position GUI control to the folder. Adds controls for x, y, and z.
   * @param {dat.GUI} folder - The folder to add the position GUI control to.
   * @param {number} min - The minimum position value.
   * @param {number} max - The maximum position value.
   * @param {number} step - The step value.
   * @return {void}
   */ 
  addPositionGUI(folder, min, max, step) {
    folder
      .add(this, 'x')
      .min(min)
      .max(max)
      .step(step)
      .onChange((value) => (this.light.position.x = value))
    folder
      .add(this, 'y')
      .min(min)
      .max(max)
      .step(step)
      .onChange((value) => (this.light.position.y = value))
    folder
      .add(this, 'z')
      .min(min)
      .max(max)
      .step(step)
      .onChange((value) => (this.light.position.z = value))
  }

  /**
   * Updates the position of the light. 
   * @method updatePosition
   * @param {void}
   * @return {void}
   */ 
  updatePosition() {
    this.light.position.set(this.x, this.y, this.z)
  }

  /**
   * Adds a helper to the light. 
   * @method addHelper
   * @param {number} sphereSize - The size of the sphere for the helper.
   * @param {dat.GUI} folder - The folder to add the helper GUI control to.
   * @param {boolean} visible - Whether the helper is visible or not. Default false.
   * @returns {void}
   */
  addHelper(sphereSize, folder, visible = false) {
    this.helper = new THREE.PointLightHelper(this.light, sphereSize)
    this.helper.visible = visible

    folder.add(this.helper, 'visible').name('helper')
  }
}

export default PointLight