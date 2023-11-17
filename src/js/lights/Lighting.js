import * as THREE from "three";
import AmbientLight from "./AmbientLight.js";
import DirectionalLight from "./DirectionalLight.js";
import PointLight from "./PointLight.js";

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
    this.group = new THREE.Group();
    this.amibientLight = {
      name: "Ambient Light",
      color: 0xffffff,
      intensity: 0.5,
    };
    this.directionalLight = {
      name: "Directional Light",
      color: 0xfefcec,
      intensity: 2,
      position: { x: 85, y: 100, z: 85 },
    };

    this.pointLight1 = {
      name: 'Point Light 1',
      color: '#ffffff',
      intensity: 70,
      distance: 50,
      position: { x: -24, y: 13, z: 25 },
      castShadow: true,
      shadowMapSize: 1024,
    }
    this.pointLight2 = {
      name: 'Point Light 2',
      color: '#ffffff',
      intensity: 10,
      distance: 3,
      position: { x: 58, y: 6, z: -56 },
      castShadow: false,
    }
  }

  /**
   * Adds GUI controls for the lighting group.
   * @method addGUIFolder
   * @param {dat.GUI} gui - The GUI to add the light controls to.
   * @return {void}
   */
  addLights(gui) {
    this.addAmbientLight(gui, this.amibientLight);
    this.addDirectionalLight(gui, this.directionalLight);
    this.addPointLight(gui, this.pointLight1);
    this.addPointLight(gui, this.pointLight2);
  }

  /**
   * Adds an ambient light to the lighting group.
   * @method addAmbientLight
   * @param {dat.GUI} gui - The GUI to add the light controls to.
   * @param {object} light - The light to add.
   * @return {void}
   */
  addAmbientLight(gui, light) {
    const { name, color, intensity } = light;

    const folder = gui.addFolder(name);
    const ambientLight = new AmbientLight(color, intensity);
    ambientLight.light.name = name;
    ambientLight.addGUIFolder(folder);

    this.group.add(ambientLight.light);
  }

  /**
   * Adds a directional light to the lighting group.
   * @method addDirectionalLight
   * @param {dat.GUI} gui - The GUI to add the light controls to.
   * @param {object} light - The light to add.
   * @return {void}
   */
  addDirectionalLight(gui, light) {
    const { name, color, intensity, position } = light;

    const folder = gui.addFolder(name);
    const directionalLight = new DirectionalLight(color, intensity, position);
    directionalLight.light.castShadow = true;
    directionalLight.light.shadow.mapSize.width = 1024;
    directionalLight.light.shadow.mapSize.height = 1024;
    directionalLight.light.shadow.camera.top = 100;
    directionalLight.light.shadow.camera.right = 100;
    directionalLight.light.shadow.camera.bottom = -100;
    directionalLight.light.shadow.camera.left = -100;
    directionalLight.light.shadow.camera.near = 50;
    directionalLight.light.shadow.camera.far = 200;
    directionalLight.light.name = name;
    directionalLight.addGUIFolder(folder);
    directionalLight.addHelper(1, folder);
    directionalLight.addShadowHelper(folder);

    this.group.add(
      directionalLight.light,
      directionalLight.helper,
      directionalLight.shadowHelper
    );
  }

    /**
   * Adds a point light to the lighting group.
   * @method addPointLight
   * @param {dat.GUI} gui - The GUI to add the light controls to.
   * @param {object} light - The light to add.
   * @return {void}
   */
    addPointLight(gui, light) {
      const {
        name,
        color,
        intensity,
        distance,
        position,
        castShadow,
        shadowMapSize,
      } = light
  
      const folder = gui.addFolder(name)
      const pointLight = new PointLight(color, intensity, distance, position)
  
      pointLight.light.name = light.name
      pointLight.light.castShadow = castShadow
      pointLight.light.shadow.mapSize.width = shadowMapSize
      pointLight.addGUIFolder(folder)
      pointLight.addHelper(1, folder)
  
      this.group.add(pointLight.light, pointLight.helper)
    }
}

export default Lighting;
