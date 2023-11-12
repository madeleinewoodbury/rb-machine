import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import materials from '../materials.js'
import Box from '../sceneObjects/Box.js'

function createFish(renderInfo, physicsInfo, ammoHelper) {
  const loader = new GLTFLoader()
  loader.load('./models/Goldfish.glb', (gltf) => {
    const fish = gltf.scene.children[0]
    fish.position.set(-30, 4, 25)
    fish.rotateY(Math.PI / 2)
    fish.scale.set(0.15, 0.15, 0.15)
    fish.name = 'fish'
    renderInfo.scene.add(fish)
  })

  createAquarium(renderInfo)
}

function createAquarium(renderInfo) {
  const aquarium = new Box(30, 10, 20, materials.aquarium)
  aquarium.mesh.position.set(-30, 5, 25)

  renderInfo.scene.add(aquarium.mesh)

  const side = new Box(30, 10, 0.1, materials.aquariumSide)
  side.mesh.position.set(-30, 5, 15.01)

  const side2 = side.mesh.clone()
  side2.position.set(-30, 5, 34.99)

  const side3 = new Box(0.1, 10, 20, materials.aquariumSide)
  side3.mesh.position.set(-45, 5, 25)

  const side4 = side3.mesh.clone()
  side4.position.set(-15, 5, 25)

  const bottom = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 20),
    materials.aquariumBottom
  )
  bottom.rotateX(-Math.PI / 2)
  bottom.position.set(-30, 0.05, 25)

  renderInfo.scene.add(side.mesh, side2, side3.mesh, side4, bottom)
}

export default createFish
