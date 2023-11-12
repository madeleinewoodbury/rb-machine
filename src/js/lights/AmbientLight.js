import * as THREE from 'three'
import Light from './Light.js'

/**
 * AmbientLight class that extends the Light class and creates an AmbientLight
 * @param {string} color - Hex color of the light
 * @param {number} intensity - Intensity of the light
 * @return {void}
 * @example
 * const light = new AmbientLight(0xffffff, 1)
 * scene.add(light)
 */
class AmbientLight extends Light {
  constructor(color, intensity) {
    super(color, intensity)
    this.light = new THREE.AmbientLight(this.color, this.intensity)
  }

  /**
   * Adds GUI controls for the AmbientLight.
   * @method addGUIFolder
   * @param {dat.GUI} folder - The folder to add the GUI controls to.
   * @return {void}
   */
  addGUIFolder(folder) {
    this.addColorGUI(folder, this.light)
    this.addIntensityGUI(folder, this.light, 0, 1, 0.01)
  }
}

export default AmbientLight
