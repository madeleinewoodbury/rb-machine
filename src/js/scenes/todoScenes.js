function addCollisionItems(renderInfo, physicsInfo) {
  const ball1 = new Sphere(2, 2, 0xff0000, { x: -5, y: 0, z: 0 })
  ball1.mesh.name = 'ball1'
  const ball2 = new Sphere(2, 2, 0xff0000, { x: 5, y: 0, z: 0 })
  ball2.mesh.name = 'ball2'

  const rigidBody1 = physicsInfo.createRigidBody(
    ball1.shape,
    ball1.mesh,
    ball1.mass
  )
  ball1.setFriction(rigidBody1)
  ball1.setRestituition(rigidBody1)
  ball1.setRollingFriction(rigidBody1)

  const rigidBody2 = physicsInfo.createRigidBody(
    ball2.shape,
    ball2.mesh,
    ball2.mass
  )
  ball2.setFriction(rigidBody2)
  ball2.setRestituition(rigidBody2)
  ball2.setRollingFriction(rigidBody2)

  physicsInfo.addRigidBody(rigidBody1, ball1.mesh)
  physicsInfo.addRigidBody(rigidBody2, ball2.mesh)
  renderInfo.scene.add(ball1.mesh)
  renderInfo.scene.add(ball2.mesh)
  ball1.mesh.userData.physicsBody = rigidBody1
  ball2.mesh.userData.physicsBody = rigidBody2
  rigidBody1.threeMesh = ball1.mesh
  rigidBody2.threeMesh = ball2.mesh
}

function addBalancingBoard(renderInfo, physicsInfo) {
  const radius = 2
  const baseMass = 0
  const boardMass = 10

  const baseMesh = new THREE.Mesh(
    new THREE.SphereGeometry(
      radius,
      24,
      12,
      0,
      2 * Math.PI,
      0,
      0.5 * Math.PI
    ),
    new THREE.MeshStandardMaterial({ color: 0x0000ff })
  )
  baseMesh.position.set(8, 0, 0)

  const baseShape = new Ammo.btSphereShape(radius)
  baseShape.setMargin(0.05)

  const baseRigidBody = physicsInfo.createRigidBody(
    baseShape,
    baseMesh,
    baseMass
  )
  physicsInfo.addRigidBody(baseRigidBody, baseMesh)
  renderInfo.scene.add(baseMesh)
  baseMesh.userData.physicsBody = baseRigidBody

  const boardMesh = new THREE.Mesh(
    new THREE.BoxGeometry(15, 0.5, 3),
    new THREE.MeshStandardMaterial({ color: 0x0000ff })
  )
  boardMesh.position.set(8, 2.25, 0)

  const boardShape = new Ammo.btBoxShape(new Ammo.btVector3(5, 0.25, 1.5))
  boardShape.setMargin(0.05)

  const boardRigidBody = physicsInfo.createRigidBody(
    boardShape,
    boardMesh,
    boardMass
  )
  boardRigidBody.setDamping(0.1, 0.1)
  physicsInfo.addRigidBody(boardRigidBody, boardMesh)
  renderInfo.scene.add(boardMesh)
  boardMesh.userData.physicsBody = boardRigidBody

  // P2P Constraint
  const pivotA = new Ammo.btVector3(0, 2, 0)
  const pivotB = new Ammo.btVector3(0, 0.5, 0)

  const p2p = new Ammo.btPoint2PointConstraint(
    baseRigidBody,
    boardRigidBody,
    pivotA,
    pivotB
  )
  physicsInfo.world.addConstraint(p2p, false)
}

function addPillar(renderInfo, physicsInfo) {
  const pillar = new THREE.Group()
  pillar.name = 'pillar'

  const mass = 0
  const baseSize = { x: 1, y: 20, z: 5 }
  const plateauSize = { x: 15, y: 1, z: 5 }
  const baseLocalOrigin = { x: 0, y: baseSize.y / 2, z: 0 }
  const plateauLocalOrigin = {
    x: -plateauSize.x / 2 + baseSize.x / 2,
    y: baseSize.y,
    z: 0,
  }

  // base mesh
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const baseMesh = new THREE.Mesh(
    new THREE.BoxGeometry(baseSize.x, baseSize.y, baseSize.z),
    material
  )
  baseMesh.position.set(
    baseLocalOrigin.x,
    baseLocalOrigin.y,
    baseLocalOrigin.z
  )
  baseMesh.castShadow = true
  pillar.add(baseMesh)

  // plateau mesh
  const plateauMesh = new THREE.Mesh(
    new THREE.BoxGeometry(plateauSize.x, plateauSize.y, plateauSize.z),
    material
  )
  plateauMesh.position.set(
    plateauLocalOrigin.x,
    plateauLocalOrigin.y,
    plateauLocalOrigin.z
  )
  plateauMesh.castShadow = true
  pillar.add(plateauMesh)

  pillar.castShadow = true
  pillar.receiveShadow = true

  const pillarShape = new Ammo.btCompoundShape()

  // base shape
  const baseShape = new Ammo.btBoxShape(
    new Ammo.btVector3(baseSize.x / 2, baseSize.y / 2, baseSize.z / 2)
  )
  let transform = new Ammo.btTransform()
  transform.setIdentity()
  transform.setOrigin(
    new Ammo.btVector3(
      baseLocalOrigin.x,
      baseLocalOrigin.y,
      baseLocalOrigin.z
    )
  )
  pillarShape.addChildShape(transform, baseShape)

  // plateau shape
  const plateauShape = new Ammo.btBoxShape(
    new Ammo.btVector3(
      plateauSize.x / 2,
      plateauSize.y / 2,
      plateauSize.z / 2
    )
  )
  transform = new Ammo.btTransform()
  transform.setIdentity()
  transform.setOrigin(
    new Ammo.btVector3(
      plateauLocalOrigin.x,
      plateauLocalOrigin.y,
      plateauLocalOrigin.z
    )
  )
  pillarShape.addChildShape(transform, plateauShape)

  pillarShape.setMargin(0.05)
  const rigidPillar = physicsInfo.createRigidBody(
    pillarShape,
    pillar,
    mass
  )
  physicsInfo.addRigidBody(rigidPillar, pillar)
  pillar.userData.physicsBody = rigidPillar
  renderInfo.scene.add(pillar)
}

function addDominos(renderInfo, physicsInfo) {
  const pos = { x: -2, y: 20, z: 0 }
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })

  for (let i = 0; i < 5; i++) {
    pos.x -= 2
    addDomino(pos, material)
  }
}

function addDomino(pos, material, renderInfo, physicsInfo) {
  const scale = { x: 0.5, y: 3, z: 2 }
  const mass = 1

  const domino = new THREE.Mesh(
    new THREE.BoxGeometry(scale.x, scale.y, scale.z),
    material
  )
  domino.position.set(pos.x, pos.y, pos.z)

  const shape = new Ammo.btBoxShape(
    new Ammo.btVector3(scale.x / 2, scale.y / 2, scale.z / 2)
  )
  shape.setMargin(0.05)
  const rigidDomino = physicsInfo.createRigidBody(shape, domino, mass)

  physicsInfo.addRigidBody(rigidDomino, domino)
  domino.userData.physicsBody = rigidDomino
  renderInfo.scene.add(domino)
}

  // addHammer(renderInfo, physicsInfo) {
  //   const handleRadius = 0.75
  //   const malletRadius = 1.75
  //   const height = 20
  //   const mass = 50
  //   const pos = { x: 34, y: height / 2, z: 0 }
  //   const handlePos = { x: 0, y: 0, z: 0 }
  //   const malletPos = { x: 0, y: 10, z: 0 }
  
  //   const hammer = new THREE.Group()
  //   hammer.name = 'hammer'
  
  //   const handle = new THREE.Mesh(
  //     new THREE.CylinderGeometry(handleRadius, handleRadius, height, 8, 1),
  //     new THREE.MeshStandardMaterial({ color: 0xd5a785 })
  //   )
  //   handle.position.set(handlePos.x, handlePos.y, handlePos.z)
  //   hammer.add(handle)
  
  //   const mallet = new THREE.Mesh(
  //     new THREE.CylinderGeometry(malletRadius, malletRadius, 5, 12, 1),
  //     new THREE.MeshStandardMaterial({ color: 0x000000 })
  //   )
  //   mallet.position.set(malletPos.x, malletPos.y, malletPos.z)
  //   mallet.rotation.set(-Math.PI / 2, 0, Math.PI / 2, 'ZXY')
  //   hammer.add(mallet)
  
  //   const compoundShape = new Ammo.btCompoundShape()
  //   const handleShape = new Ammo.btCylinderShape(
  //     new Ammo.btVector3(handleRadius, height / 2, handleRadius)
  //   )
  //   const malletShape = new Ammo.btCylinderShape(
  //     new Ammo.btVector3(malletRadius, 2.5, malletRadius)
  //   )
  
  //   const handleTransform = new Ammo.btTransform()
  //   handleTransform.setIdentity()
  //   handleTransform.setOrigin(new Ammo.btVector3(0, 0, 0))
  //   handleTransform.setRotation(
  //     new Ammo.btQuaternion(
  //       handle.quaternion.x,
  //       handle.quaternion.y,
  //       handle.quaternion.z,
  //       handle.quaternion.w
  //     )
  //   )
  //   compoundShape.addChildShape(handleTransform, handleShape)
  
  //   const malletTransform = new Ammo.btTransform()
  //   malletTransform.setIdentity()
  //   malletTransform.setOrigin(new Ammo.btVector3(0, 0, 0))
  //   malletTransform.setRotation(
  //     new Ammo.btQuaternion(
  //       mallet.quaternion.x,
  //       mallet.quaternion.y,
  //       mallet.quaternion.z,
  //       mallet.quaternion.w
  //     )
  //   )
  //   compoundShape.addChildShape(malletTransform, malletShape)
  
  //   compoundShape.setMargin(0.05)
  
  //   const transform = new Ammo.btTransform()
  //   transform.setIdentity()
  //   transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
  
  //   const motionState = new Ammo.btDefaultMotionState(transform)
  //   const localInertia = new Ammo.btVector3(0, 0, 0)
  
  //   compoundShape.calculateLocalInertia(mass, localInertia)
  //   const rbInfo = new Ammo.btRigidBodyConstructionInfo(
  //     mass,
  //     motionState,
  //     compoundShape,
  //     localInertia
  //   )
  //   const rigidBody = new Ammo.btRigidBody(rbInfo)
  //   physicsInfo.addRigidBody(rigidBody, hammer)
  //   hammer.userData.physicsBody = rigidBody
  
  //   renderInfo.scene.add(hammer)
  // }