/**
 * Base Light class. All lights inherit from this class.
 * It contains the color and intensity properties. Includes methods to
 * add GUI controls for the color and intensity.
 * @class Light
 * @constructor
 * @param {string} color - The color of the light
 * @param {number} intensity - The intensity of the light
 * @return {void}
 * @example
 *  const light = new Light(0xffffff, 1)
 *  light.addColorGUI(folder, light)
 *  light.addIntensityGUI(folder, light, 0, 2, 0.01)
 *  scene.add(light)
 */
class Light {
  constructor(color, intensity) {
    this.color = color
    this.intensity = intensity
  }

  /**
   * Adds a color GUI control to the folder.
   * @method addColorGUI
   * @param {dat.GUI} folder - The folder to add the color GUI control to.
   * @param {THREE.Light} light - The light to change the color of.
   * @return {void}
   */
  addColorGUI(folder, light, name='color') {
    folder.addColor(this, 'color').onChange(() => light.color.set(this.color)).name(name)
  }

  /**
   * Adds an intensity GUI control to the folder.
   * @method addIntensityGUI
   * @param {dat.GUI} folder - The folder to add the intensity GUI control to.
   * @param {THREE.Light} light - The light to change the intensity of.
   * @param {number} min - The minimum intensity value.
   * @param {number} max - The maximum intensity value.
   * @param {number} step - The step value.
   * @return {void}
   */
  addIntensityGUI(folder, light, min, max, step) {
    folder
      .add(this, 'intensity')
      .min(min)
      .max(max)
      .step(step)
      .onChange((value) => (light.intensity = value))
  }
}

export default Light
