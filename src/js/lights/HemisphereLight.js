import * as THREE from 'three'
import Light from './Light.js'

/**
 * HemisphereLight class that extends the Light class and creates a HemisphereLight
 * @param {string} color - Hex color of the light
 * @param {number} intensity - Intensity of the light
 * @return {void}
 */
class HemisphereLight extends Light {
  constructor(skyColor, groundColor, intensity) {
    super(skyColor, intensity)
    this.groundColor = groundColor
    this.light = new THREE.HemisphereLight(this.color, this.groundColor, this.intensity)
    this.updatePosition()
  }

  /**
   * Adds GUI controls for the HemisphereLight.
   * @param {dat.GUI} folder - The folder to add the GUI controls to.
   * @return {void}
   */
  addGUIFolder(folder) {
    this.addColorGUI(folder, this.light, 'Sky Color')
    this.addGroundColorGUI(folder)
    this.addIntensityGUI(folder, this.light, 0, 10, 0.001)
  }

  /**
   * Adds a ground color GUI control to the folder.
   * @method addGroundColorGUI
   * @param {dat.GUI} folder - The folder to add the ground color GUI control to.
   * @return {void}
   */
  addGroundColorGUI(folder) {
    folder.addColor(this, 'groundColor').onChange(() => this.light.groundColor.set(this.groundColor)).name('Ground Color')
  }
}

export default HemisphereLight
