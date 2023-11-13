import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Box from '../sceneObjects/Box.js'
import materials from '../materials'

function createLaserGun(renderInfo, physicsInfo, ammoHelper) {
  const loader = new GLTFLoader()
  loader.load('./models/LaserGun.glb', (gltf) => {
    const laserGun = gltf.scene
    console.log(laserGun)
    laserGun.position.set(-66, 41, -52.5)
    laserGun.rotateY(Math.PI / 4)
    laserGun.scale.set(7, 7, 7)
    laserGun.name = 'laserGun'
    renderInfo.scene.add(laserGun)
  })

  laserStand(renderInfo, physicsInfo, ammoHelper)
}

function laser(renderInfo) {
  const material = new THREE.LineBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0,
  })
  const points = []

  points.push(new THREE.Vector3(-66.3, 46.6, -52.5))
  points.push(new THREE.Vector3(18, 46.75, 25))

  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const line = new THREE.Line(geometry, material)
  line.name = 'laser'

  renderInfo.scene.add(line)
}

function laserStand(renderInfo, physicsInfo, ammoHelper) {
  const stand = new Box(15, 41, 15, materials.white)
  stand.mesh.position.set(-66, 20.5, -52.5)
  stand.mesh.name = 'stand'

  const rigidBody = ammoHelper.createRigidBody(stand.shape, stand.mesh, 0)
  physicsInfo.addRigidBody(rigidBody, stand.mesh)
  renderInfo.scene.add(stand.mesh)
  stand.mesh.userData.rigidBody = rigidBody

  laser(renderInfo)
}

export default createLaserGun
