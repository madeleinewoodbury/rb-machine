import * as THREE from 'three'

function hammer(renderInfo, physicsInfo) {
  const handleRadius = 0.75
  const malletRadius = 1.75
  const mass = 1
  const pos = { x: 12, y: 1, z: 0 }
  //   const handlePos = { x: 0, y: 0, z: 0 }
  const malletPos = { x: 12, y: 6, z: 0 }

  const hammer = new THREE.Group()
  hammer.name = 'hammer'

  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(handleRadius, handleRadius, 12, 8, 1),
    new THREE.MeshStandardMaterial({ color: 0xd5a785 })
  )
  handle.position.set(pos.x, pos.y, pos.z)
  hammer.add(handle)

  const mallet = new THREE.Mesh(
    new THREE.CylinderGeometry(malletRadius, malletRadius, 5, 12, 1),
    new THREE.MeshStandardMaterial({ color: 0x000000 })
  )
  mallet.position.set(malletPos.x, malletPos.y, malletPos.z)
  mallet.rotation.set(0, 0, Math.PI / 2)
  hammer.add(mallet)

  const compoundShape = new Ammo.btCompoundShape()
  const handleShape = new Ammo.btCylinderShape(
    new Ammo.btVector3(handleRadius, 6, handleRadius)
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

export default hammer
