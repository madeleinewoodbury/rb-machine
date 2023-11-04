import * as THREE from 'three'
import AmbientLight from './AmbientLight'

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
  }

  /**
   * Adds GUI controls for the lighting group.
   * @method addGUIFolder
   * @param {dat.GUI} gui - The GUI to add the light controls to.
   * @return {void}
   */
  addLights(gui) {
    this.addAmbientLight(gui, this.amibientLight)
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
}

export default Lighting
