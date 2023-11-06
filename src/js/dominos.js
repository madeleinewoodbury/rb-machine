import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import Box from './threejs/shapes/Box.js'
import Sphere from './threejs/shapes/Sphere.js'
import RigidBox from './physics/RigidBox.js'
import RigidSphere from './physics/RigidSphere.js'
import RigidBody from './physics/RigidBody.js'

function addDominoScene(renderInfo, physicsInfo) {
  addDominos(renderInfo, physicsInfo)
  addPillar(renderInfo, physicsInfo)
  addBoard(renderInfo, physicsInfo)
  addSphere(renderInfo, physicsInfo)
  //   addSphereTest(renderInfo, physicsInfo)s
  addHammer(renderInfo, physicsInfo)
  //   addFallyThing(renderInfo, physicsInfo)
}

function addDominos(renderInfo, physicsInfo) {
  const pos = { x: -1, y: 21.5, z: 0 }
  for (let i = 0; i < 5; i++) {
    pos.x -= 2
    addBox(pos, renderInfo, physicsInfo)
  }
  pos.x = 0.5
  pos.y = 20.5
  addLeaningBox(pos, renderInfo, physicsInfo)
}

function addSphereTest(renderInfo, physicsInfo) {
  const pos = { x: 14, y: 100, z: 0 }
  const radius = 1.5
  const qaut = { x: 0, y: 0, z: 0, w: 1 }
  const mass = 5

  const sphere = new Sphere(pos, radius, qaut, 0xff0000)
  renderInfo.scene.add(sphere.mesh)

  const rigidSphere = new RigidSphere(pos, qaut, mass, radius)
  rigidSphere.body.setFriction(4)
  rigidSphere.body.setRestitution(2)
  rigidSphere.body.setRollingFriction(10)
  physicsInfo.addRigidBody(rigidSphere.body, sphere.mesh)
  sphere.mesh.userData.physicsBody = rigidSphere.body
}

function addSphere(renderInfo, physicsInfo) {
  const pos = { x: 2, y: 4, z: 0 }
  const radius = 1.5
  const qaut = { x: 0, y: 0, z: 0, w: 1 }
  const mass = 0.5

  const sphere = new Sphere(pos, radius, qaut, 0xff0000)
  sphere.mesh.name = 'sphere'
  renderInfo.scene.add(sphere.mesh)

  const rigidSphere = new RigidSphere(pos, qaut, mass, radius)
  //   rigidSphere.body.setFriction(4)
  //   rigidSphere.body.setRestitution(2)
  //   rigidSphere.body.setRollingFriction(10)
  physicsInfo.addRigidBody(rigidSphere.body, sphere.mesh)
  sphere.mesh.userData.physicsBody = rigidSphere.body
}

function addLeaningBox(pos, renderInfo, physicsInfo) {
  const scale = { x: 3, y: 0.5, z: 2 }
  const mass = 1

  const box = new Box(pos, scale, 0xffffff)
  renderInfo.scene.add(box.mesh)

  const rigidBox = new RigidBox(pos, box.mesh.quaternion, mass, scale)
  physicsInfo.addRigidBody(rigidBox.body, box.mesh)
  box.mesh.userData.physicsBody = rigidBox.body
}

function addBox(pos, renderInfo, physicsInfo) {
  const scale = { x: 0.5, y: 3, z: 2 }
  const mass = 1

  const box = new Box(pos, scale, 0xffffff)
  renderInfo.scene.add(box.mesh)

  const rigidBox = new RigidBox(pos, box.mesh.quaternion, mass, scale)
  physicsInfo.addRigidBody(rigidBox.body, box.mesh)
  box.mesh.userData.physicsBody = rigidBox.body
}

function addPillar(renderInfo, physicsInfo) {
  const pillar = new THREE.Group()
  pillar.name = 'pillar'

  const mass = 0
  const box1Scale = { x: 1, y: 20, z: 5 }
  const box2Scale = { x: 15, y: 1, z: 5 }
  const box1Pos = { x: 0, y: 10, z: 0 }
  const box2Pos = { x: -7, y: 20, z: 0 }
  const box1 = new Box(box1Pos, box1Scale, 0xffffff)
  const box2 = new Box(box2Pos, box2Scale, 0xffffff)
  pillar.add(box1.mesh, box2.mesh)
  renderInfo.scene.add(pillar)

  const rigidBox1 = new RigidBox(box1Pos, box1.mesh.quaternion, mass, box1Scale)
  physicsInfo.addRigidBody(rigidBox1.body, box1.mesh)
  box1.mesh.userData.physicsBody = rigidBox1.body

  const rigidBox2 = new RigidBox(box2Pos, box2.mesh.quaternion, mass, box2Scale)
  physicsInfo.addRigidBody(rigidBox2.body, box2.mesh)
  box2.mesh.userData.physicsBody = rigidBox2.body
}

function addBoard(renderInfo, physicsInfo) {
  const board = new THREE.Group()
  board.name = 'board'

  const spherePos = { x: 8.5, y: 0, z: 0 }
  const plankPos = { x: 8.5, y: 2.25, z: 0 }
  const plankScale = { x: 15, y: 0.5, z: 3 }
  const sphereMass = 0
  const plankMass = 1
  const radius = 2

  const halpSphere = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 24, 12, 0, 2 * Math.PI, 0, 0.5 * Math.PI),
    new THREE.MeshStandardMaterial({ color: 0x0000ff })
  )
  halpSphere.position.set(spherePos.x, spherePos.y, spherePos.z)
  const plank = new Box(plankPos, plankScale, 0xffffff)
  plank.mesh.name = 'plank'
  renderInfo.scene.add(halpSphere, plank.mesh)

  const rigidSphere = new RigidSphere(
    spherePos,
    halpSphere.quaternion,
    sphereMass,
    radius
  )
  physicsInfo.addRigidBody(rigidSphere.body, halpSphere)
  halpSphere.userData.physicsBody = rigidSphere.body

  const rigidBox = new RigidBox(
    plankPos,
    plank.mesh.quaternion,
    plankMass,
    plankScale
  )
  physicsInfo.addRigidBody(rigidBox.body, plank.mesh)
  plank.mesh.userData.physicsBody = rigidBox.body
}

function addFallyThing(renderInfo, physicsInfo) {
  const radius = 2
  const mass = 30
  const pos = { x: 28, y: 6, z: 0 }
  const scale = { x: 1, y: 15, z: 1 }

  //   const mesh = new THREE.Mesh(
  //     new THREE.CylinderGeometry(radius, radius, 12, 8, 1),
  //     new THREE.MeshStandardMaterial({ color: 0xd5a785 })
  //   )

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshStandardMaterial({ color: 0xd5a785 })
  )
  box.scale.set(scale.x, scale.y, scale.z)
  box.position.set(pos.x, pos.y, pos.z)

  box.name = 'hammer'
  renderInfo.scene.add(box)

  const rigidBox = new RigidBox(pos, box.quaternion, mass, scale)
  physicsInfo.addRigidBody(rigidBox.body, box)
  box.userData.physicsBody = rigidBox.body

  //   physicsInfo.addRigidBody(rigidBody, mesh)
  //   mesh.userData.physicsBody = rigidBody
}

function addHammer(renderInfo, physicsInfo) {
  const handleRadius = 0.75
  const malletRadius = 1.75
  const height = 20
  const mass = 50
  const pos = { x: 34, y: height / 2, z: 0 }
  const handlePos = { x: 0, y: 0, z: 0 }
  const malletPos = { x: 0, y: 10, z: 0 }

  const hammer = new THREE.Group()
  hammer.name = 'hammer'

  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(handleRadius, handleRadius, height, 8, 1),
    new THREE.MeshStandardMaterial({ color: 0xd5a785 })
  )
  handle.position.set(handlePos.x, handlePos.y, handlePos.z)
  hammer.add(handle)

  const mallet = new THREE.Mesh(
    new THREE.CylinderGeometry(malletRadius, malletRadius, 5, 12, 1),
    new THREE.MeshStandardMaterial({ color: 0x000000 })
  )
  mallet.position.set(malletPos.x, malletPos.y, malletPos.z)
  mallet.rotation.set(-Math.PI / 2, 0, Math.PI / 2, 'ZXY')
  hammer.add(mallet)

  const compoundShape = new Ammo.btCompoundShape()
  const handleShape = new Ammo.btCylinderShape(
    new Ammo.btVector3(handleRadius, height / 2, handleRadius)
  )
  const malletShape = new Ammo.btCylinderShape(
    new Ammo.btVector3(malletRadius, 2.5, malletRadius)
  )

  const handleTransform = new Ammo.btTransform()
  handleTransform.setIdentity()
  handleTransform.setOrigin(new Ammo.btVector3(0, 0, 0))
  handleTransform.setRotation(
    new Ammo.btQuaternion(
      handle.quaternion.x,
      handle.quaternion.y,
      handle.quaternion.z,
      handle.quaternion.w
    )
  )
  compoundShape.addChildShape(handleTransform, handleShape)

  const malletTransform = new Ammo.btTransform()
  malletTransform.setIdentity()
  malletTransform.setOrigin(new Ammo.btVector3(0, 0, 0))
  malletTransform.setRotation(
    new Ammo.btQuaternion(
      mallet.quaternion.x,
      mallet.quaternion.y,
      mallet.quaternion.z,
      mallet.quaternion.w
    )
  )
  compoundShape.addChildShape(malletTransform, malletShape)

  compoundShape.setMargin(0.05)

  const transform = new Ammo.btTransform()
  transform.setIdentity()
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))

  const motionState = new Ammo.btDefaultMotionState(transform)
  const localInertia = new Ammo.btVector3(0, 0, 0)

  compoundShape.calculateLocalInertia(mass, localInertia)
  const rbInfo = new Ammo.btRigidBodyConstructionInfo(
    mass,
    motionState,
    compoundShape,
    localInertia
  )
  const rigidBody = new Ammo.btRigidBody(rbInfo)
  physicsInfo.addRigidBody(rigidBody, hammer)
  hammer.userData.physicsBody = rigidBody

  renderInfo.scene.add(hammer)
}

function getTransform(mesh, pos) {
  const transform = new Ammo.btTransform()
  transform.setIdentity()
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
  transform.setRotation(
    new Ammo.btQuaternion(
      mesh.quaternion.x,
      mesh.quaternion.y,
      mesh.quaternion.z,
      mesh.quaternion.w
    )
  )

  return transform
}

function getConvexTriangleMeshShape(mesh) {
  const verticesPos = mesh.geometry.getAttribute('position').array
  const triangles = []
  for (let i = 0; i < verticesPos.length; i += 3) {
    triangles.push({
      x: verticesPos[i],
      y: verticesPos[i + 1],
      z: verticesPos[i + 2],
    })
  }

  const triangleMesh = new Ammo.btTriangleMesh()
  let vecA = new Ammo.btVector3(0, 0, 0)
  let vecB = new Ammo.btVector3(0, 0, 0)
  let vecC = new Ammo.btVector3(0, 0, 0)

  for (let i = 0; i < triangles.length - 3; i += 3) {
    vecA.setX(triangles[i].x)
    vecA.setY(triangles[i].y)
    vecA.setZ(triangles[i].z)

    vecB.setX(triangles[i + 1].x)
    vecB.setY(triangles[i + 1].y)
    vecB.setZ(triangles[i + 1].z)

    vecC.setX(triangles[i + 2].x)
    vecC.setY(triangles[i + 2].y)
    vecC.setZ(triangles[i + 2].z)

    triangleMesh.addTriangle(vecA, vecB, vecC, true)
  }

  Ammo.destroy(vecA)
  Ammo.destroy(vecB)
  Ammo.destroy(vecC)

  const shape = new Ammo.btConvexTriangleMeshShape(triangleMesh, true)
  return shape
}

function getRigidBody(shape, mesh, pos, mass) {
  const transform = new Ammo.btTransform()
  transform.setIdentity()
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))

  const quat = mesh.quaternion
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))

  const scale = mesh.scale
  shape.setLocalScaling(new Ammo.btVector3(scale.x, scale.y, scale.z))

  const motionState = new Ammo.btDefaultMotionState(transform)
  const localInertia = new Ammo.btVector3(0, 0, 0)
  shape.calculateLocalInertia(mass, localInertia)

  const rbInfo = new Ammo.btRigidBodyConstructionInfo(
    mass,
    motionState,
    shape,
    localInertia
  )
  const rigidBody = new Ammo.btRigidBody(rbInfo)

  return rigidBody
}

export default addDominoScene
