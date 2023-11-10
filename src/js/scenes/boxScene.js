import * as THREE from 'three'
import Box from '../sceneObjects/Box.js'

function createBoxScene(renderInfo, physicsInfo, ammoHelper) {
  const boxes = createBoxes()
  boxes.forEach((box) => addBox(box, renderInfo, physicsInfo, ammoHelper))
}

function createBoxes() {
  const numberOfBoxes = 10
  let width = 3
  let height = 3
  let depth = 3
  let yRot = 0
  const position = { x: 0, y: height / 2, z: -52 }
  const boxes = []

  for (let i = 0; i < numberOfBoxes; i++) {
    const color = new THREE.Color(Math.random(), Math.random(), Math.random())
    const box = new Box(width, height, depth, color)
    box.mesh.position.set(position.x, position.y, position.z)
    box.mesh.rotateY(yRot)
    box.mass = 2
    boxes.push(box)

    position.y += height
    position.z += 0.3
    width += 0.1
    height += 0.1
    // yRot += 0.1
  }

  return boxes
}

function addBox(box, renderInfo, physicsInfo, ammoHelper) {
  const rigidBody = ammoHelper.createRigidBody(box.shape, box.mesh, box.mass)
  rigidBody.setFriction(0.8)
  rigidBody.setRestitution(0.2)

  physicsInfo.addRigidBody(rigidBody, box.mesh)
  box.mesh.userData.physicsBody = rigidBody
  rigidBody.threeMesh = box.mesh

  renderInfo.scene.add(box.mesh)
}

export default createBoxScene
