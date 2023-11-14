import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import materials from '../materials.js'
import Aquarium from '../sceneObjects/Aquarium.js'

function addFishScene(renderInfo, physicsInfo, ammoHelper) {
  const aquariumSize = { width: 30, height: 10, depth: 20, edgeWith: 0.1 }
  const position = { x: -30, y: 0, z: 25 }

  addAquarium(renderInfo, physicsInfo, ammoHelper, aquariumSize, position)
  addWater(renderInfo, aquariumSize, position)
  addFish(renderInfo, position)
}

function addFish(renderInfo, position) {
  const loader = new GLTFLoader()
  loader.load('./models/Goldfish.glb', (gltf) => {
    const fish = gltf.scene.children[0]
    fish.position.set(position.x, 7, position.z)
    fish.rotateY(Math.PI / 2)
    fish.scale.set(0.175, 0.175, 0.175)
    fish.name = 'fish'
    renderInfo.scene.add(fish)
  })
}

function addAquarium(renderInfo, physicsInfo, ammoHelper, size, position) {
  const mass = 0

  const aquarium = new Aquarium(
    size.width,
    size.height,
    size.depth,
    size.edgeWith
  )
  aquarium.mesh.position.set(position.x, position.y, position.z)

  const compoundShape = aquarium.getCompoundShape(ammoHelper)
  const rigidBody = ammoHelper.createRigidBody(
    compoundShape,
    aquarium.mesh,
    mass
  )

  physicsInfo.addRigidBody(rigidBody, aquarium.mesh)
  renderInfo.scene.add(aquarium.mesh)
  aquarium.mesh.userData.rigidBody = rigidBody
}

function addWater(renderInfo, size, position) {
  const height = size.height * 0.9
  const water = new THREE.Mesh(
    new THREE.BoxGeometry(size.width - 0.01, height, size.depth - 0.01),
    materials.water
  )

  water.position.set(position.x - 0.01, height / 2, position.z - 0.01)
  renderInfo.scene.add(water)
}

export default addFishScene
