import * as THREE from 'three'
import Box from '../sceneObjects/Box.js'
import Sphere from '../sceneObjects/Sphere.js'

function createRotatingArmScene(renderInfo, physicsInfo, ammoHelper) {
  let mass = 10
  const width = 14,
    height = 0.5,
    depth = 1
  const position = { x: 0, y: 0, z: 0 }

  let mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xf906e4 })
  )
  mesh.name = 'hinge_arm'
  mesh.position.set(-7, 0, 0)
  mesh.castShadow = true
  mesh.receiveShadow = true

  const armShape = new Ammo.btBoxShape(
    new Ammo.btVector3(width / 2, height / 2, depth / 2)
  )
  armShape.setMargin(0.05)

  const armRigidBody = ammoHelper.createRigidBody(armShape, mesh, mass)
  armRigidBody.setActivationState(4)
  physicsInfo.addRigidBody(armRigidBody, mesh)
  mesh.userData.physicsBody = armRigidBody
  renderInfo.scene.add(mesh)

  const radius = 1
  mass = 0

  mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 24, 12, 0, 2 * Math.PI, 0, 0.5 * Math.PI),
    new THREE.MeshStandardMaterial({ color: 0x0000ff })
  )

  mesh.name = 'hinge_anchor'
  mesh.position.set(position.x, position.y, position.z)
  mesh.castShadow = true
  mesh.receiveShadow = true

  const shape = new Ammo.btSphereShape(mesh.geometry.parameters.radius)
  shape.setMargin(0.05)

  const anchorRigidBody = ammoHelper.createRigidBody(shape, mesh, mass)
  physicsInfo.addRigidBody(anchorRigidBody, mesh)
  mesh.userData.physicsBody = anchorRigidBody
  renderInfo.scene.add(mesh)

  const anchorPivot = new Ammo.btVector3(0, 1, 0)
  const anchorAxis = new Ammo.btVector3(0, 1, 0)
  const armPivot = new Ammo.btVector3(0, 0, 0)
  const armAxis = new Ammo.btVector3(0, 1, 0)
  const hingeConstraint = new Ammo.btHingeConstraint(
    anchorRigidBody,
    armRigidBody,
    anchorPivot,
    armPivot,
    anchorAxis,
    armAxis,
    false
  )

  hingeConstraint.enableAngularMotor(true, 2, 100)
  physicsInfo.world.addConstraint(hingeConstraint, false)

  //   const anchor = new Sphere(1, 0, 0xfffff1)
  //   anchor.mesh.name = 'anchor'
  //   anchor.mesh.position.set(0, 0.5, 0)

  //   const anchorRigidBody = ammoHelper.createRigidBody(
  //     anchor.shape,
  //     anchor.mesh,
  //     0
  //   )
  //   physicsInfo.addRigidBody(anchorRigidBody, anchor.mesh)
  //   anchor.mesh.userData.physicsBody = anchorRigidBody
  //   renderInfo.scene.add(anchor.mesh)

  //   const anchorPivot = new Ammo.btVector3(0, 0.5, 0)
  //   const anchorAxis = new Ammo.btVector3(0, 1, 0)
  //   const armPivot = new Ammo.btVector3(-5, 0, 0)
  //   const armAxis = new Ammo.btVector3(0, 1, 0)

  //   physicsInfo.addHingeConstraint(
  //     anchorRigidBody,
  //     armRigidBody,
  //     anchorPivot,
  //     armPivot,
  //     anchorAxis,
  //     armAxis
  //   )
}

export default createRotatingArmScene
