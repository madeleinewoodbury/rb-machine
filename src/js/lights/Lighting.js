import * as THREE from 'three'
import AmbientLight from './AmbientLight.js'
import DirectionalLight from './DirectionalLight.js'

/**
 * Lighting class that creates a group of lights to be added to the scene
 * @example
 * const lighting = new Lighting()
 * lighting.addLights(gui)
 * scene.add(lighting.group)
 * @return {void}
 */
class Lighting {
  constructor() {
    this.group = new THREE.Group()
    this.amibientLight = {
      name: 'Ambient Light',
      color: 0xffffff,
      intensity: 0.5,
    }
    this.directionalLight = {
      name: 'Directional Light',
      color: 0xffffff,
      intensity: 5,
      position: { x: 0, y: 40, z: 0 },
    }
  }

  /**
   * Adds GUI controls for the lighting group.
   * @method addGUIFolder
   * @param {dat.GUI} gui - The GUI to add the light controls to.
   * @return {void}
   */
  addLights(gui) {
    this.addAmbientLight(gui, this.amibientLight)
    this.addDirectionalLight(gui, this.directionalLight)
  }

  /**
   * Adds an ambient light to the lighting group.
   * @method addAmbientLight
   * @param {dat.GUI} gui - The GUI to add the light controls to.
   * @param {object} light - The light to add.
   * @return {void}
   */
  addAmbientLight(gui, light) {
    const { name, color, intensity } = light

    const folder = gui.addFolder(name)
    const ambientLight = new AmbientLight(color, intensity)
    ambientLight.light.name = name
    ambientLight.addGUIFolder(folder)

    this.group.add(ambientLight.light)
  }

  /**
   * Adds a directional light to the lighting group.
   * @method addDirectionalLight
   * @param {dat.GUI} gui - The GUI to add the light controls to.
   * @param {object} light - The light to add.
   * @return {void}
   */
  addDirectionalLight(gui, light) {
    const { name, color, intensity, position } = light

    const folder = gui.addFolder(name)
    const directionalLight = new DirectionalLight(color, intensity, position)
    directionalLight.light.castShadow = true
    directionalLight.light.name = name
    directionalLight.addGUIFolder(folder)
    directionalLight.addHelper(1, folder)

    this.group.add(directionalLight.light, directionalLight.helper)
  }
}

export default Lighting
