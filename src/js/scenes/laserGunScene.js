import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Box from '../sceneObjects/Box.js'
import materials from '../materials'

function addLaserGunScene(renderInfo, physicsInfo, ammoHelper) {
  addLaserGun(renderInfo, physicsInfo, ammoHelper)
  addLaserStand(renderInfo, physicsInfo, ammoHelper)
  addLaser(renderInfo)
}

function addLaserGun(renderInfo, physicsInfo, ammoHelper) {
  const loader = new GLTFLoader()
  loader.load('./models/LaserGun.glb', (gltf) => {
    const laserGun = gltf.scene
    laserGun.position.set(-66, 41, -52.5)
    laserGun.rotateY(Math.PI / 4)
    laserGun.scale.set(7, 7, 7)
    laserGun.name = 'laserGun'
    renderInfo.scene.add(laserGun)
  })
}

function addLaser(renderInfo) {
  const material = new THREE.LineBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0,
  })
  const points = []

  points.push(new THREE.Vector3(-66.3, 46.6, -52.5))
  // points.push(new THREE.Vector3(18, 46.75, 25))
  points.push(new THREE.Vector3(27, 46.75, 25))

  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const line = new THREE.Line(geometry, material)
  line.name = 'laser'

  renderInfo.scene.add(line)
}

function addLaserStand(renderInfo, physicsInfo, ammoHelper) {
  const stand = new Box(15, 41, 15, materials.white)
  stand.mesh.position.set(-66, 20.5, -52.5)
  stand.mesh.name = 'stand'

  const rigidBody = ammoHelper.createRigidBody(stand.shape, stand.mesh, 0)
  physicsInfo.addRigidBody(rigidBody, stand.mesh)
  renderInfo.scene.add(stand.mesh)
  stand.mesh.userData.rigidBody = rigidBody
}

export default addLaserGunScene
