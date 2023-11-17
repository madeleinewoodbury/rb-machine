import * as THREE from 'three'
import materials from '../utils/materials.js'
import Lighting from '../lights/Lighting.js'

function addWorldScene(renderInfo, physicsInfo, ammoHelper, gui) {
  addSkyBox(renderInfo)
  addGround(renderInfo, physicsInfo, ammoHelper)
  addLights(renderInfo, gui)
}

function addSkyBox(renderInfo) {
  let imagePrefix = '/textures/SkyCubeMap/'
  let directions = ['px', 'nx', 'py', 'ny', 'pz', 'nz']
  let imageSuffix = '.png'
  let materialArray = []

  for (let i = 0; i < 6; i++)
    materialArray.push(
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(
          imagePrefix + directions[i] + imageSuffix
        ),
        side: THREE.BackSide,
      })
    )

  let cubeSize = 200
  let boxGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
  const boxMesh = new THREE.Mesh(boxGeometry, materialArray)
  boxMesh.name = 'skyBoxMesh'
  boxMesh.position.x = 0
  boxMesh.position.y = 0
  boxMesh.position.z = 0

  renderInfo.scene.add(boxMesh)
}

function addGround(renderInfo, physicsInfo, ammoHelper) {
  const width = 200;
    const height = 0.01;
    const depth = 200;
    const mass = 0;

    const plane = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      materials.plane
    );
    plane.receiveShadow = true;
    plane.position.set(0, -height / 2, 0);
    plane.name = "floor";

    const shape = new Ammo.btBoxShape(
      new Ammo.btVector3(width * 0.5, height * 0.5, depth * 0.5)
    );
    shape.setMargin(0.05);

    const rigidBody = ammoHelper.createRigidBody(shape, plane, mass);
    rigidBody.setFriction(0.8);
    rigidBody.setRestitution(0.7);

    physicsInfo.addRigidBody(rigidBody, plane);
    renderInfo.scene.add(plane);

    plane.userData.rigidBody = rigidBody;
}

function addLights(renderInfo, gui) {
    const lights = new Lighting();
    lights.addLights(gui);
    renderInfo.scene.add(lights.group);
}

export default addWorldScene