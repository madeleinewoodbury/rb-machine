import * as THREE from 'three'
import Sphere from '../sceneObjects/Sphere'

function createTubeScene(renderInfo, physicsInfo) {
  createTube(renderInfo, physicsInfo)
  createBall(renderInfo, physicsInfo)
}

function createBall(renderInfo, physicsInfo) {
  const ball = new Sphere(1, 1, 0xff0000)
  ball.mesh.position.set(-10, 25, 0)

  const rigidBody = physicsInfo.createRigidBody(ball.shape, ball.mesh, 2)
  physicsInfo.addRigidBody(rigidBody, ball.mesh)
  ball.mesh.userData.physicsBody = rigidBody
  renderInfo.scene.add(ball.mesh)
}

function createTube(renderInfo, physicsInfo) {
  const mesh = new THREE.Mesh(
    new THREE.TorusGeometry(10, 3, 100, 200, Math.PI / 2),
    new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      //   side: THREE.DoubleSide,s
      wireframe: true,
    })
  )

  mesh.position.set(0, 13, 0)
  mesh.rotateZ(Math.PI)
  mesh.castShadow = true

  //   class CustomSinCurve extends THREE.Curve {
  //     constructor(scale = 1) {
  //       super()
  //       this.scale = scale
  //     }

  //     getPoint(t, optionalTarget = new THREE.Vector3()) {
  //       const tx = t * 3 - 1.5
  //       const ty = Math.sin(2 * Math.PI * t)
  //       const tz = 0

  //       return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale)
  //     }
  //   }

  //   const path = new CustomSinCurve(10)
  //   const geometry = new THREE.TubeGeometry(path, 100, 2, 100, false)
  //   const material = new THREE.MeshBasicMaterial({
  //     color: 0x0011ff,
  //     side: THREE.DoubleSide,
  //     wireframe: true,
  //   })
  //   const mesh = new THREE.Mesh(geometry, material)

  //   mesh.position.set(0, 13, 0)
  //   mesh.rotation.set(0, 0, 1)

  const compoundShape = new Ammo.btCompoundShape()
  const tubeShape = generateTriangleShape(mesh, false)
  const transform = new Ammo.btTransform()
  transform.setIdentity()
  transform.setOrigin(
    new Ammo.btVector3(mesh.position.x, mesh.position.y, mesh.position.z)
  )
  const quat = mesh.quaternion
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))
  compoundShape.addChildShape(transform, tubeShape)

  const rigidBody = physicsInfo.createRigidBody(compoundShape, mesh, 0)
  physicsInfo.addRigidBody(rigidBody, mesh)
  mesh.userData.physicsBody = rigidBody
  renderInfo.scene.add(mesh)
}

function generateTriangleShape(mesh, useConvexShape) {
  let vertices = traverseModel(mesh)
  let ammoMesh = new Ammo.btTriangleMesh()
  for (let i = 0; i < vertices.length; i += 9) {
    let v1_x = vertices[i]
    let v1_y = vertices[i + 1]
    let v1_z = vertices[i + 2]

    let v2_x = vertices[i + 3]
    let v2_y = vertices[i + 4]
    let v2_z = vertices[i + 5]

    let v3_x = vertices[i + 6]
    let v3_y = vertices[i + 7]
    let v3_z = vertices[i + 8]

    let bv1 = new Ammo.btVector3(v1_x, v1_y, v1_z)
    let bv2 = new Ammo.btVector3(v2_x, v2_y, v2_z)
    let bv3 = new Ammo.btVector3(v3_x, v3_y, v3_z)

    ammoMesh.addTriangle(bv1, bv2, bv3)
  }

  let triangleShape
  if (useConvexShape)
    triangleShape = new Ammo.btConvexTriangleMeshShape(ammoMesh, false)
  else triangleShape = new Ammo.btBvhTriangleMeshShape(ammoMesh, false)

  let threeScale = mesh.scale
  triangleShape.setLocalScaling(
    new Ammo.btVector3(threeScale.x, threeScale.y, threeScale.z)
  )
  return triangleShape
}

function traverseModel(mesh, modelVertices = [], scaleFactor) {
  if (mesh) {
    if (mesh.geometry) {
      let tmpVertices = [...mesh.geometry.attributes.position.array]
      for (let i = 0; i < tmpVertices.length; i += 3) {
        tmpVertices[i] = tmpVertices[i] * mesh.scale.x
        tmpVertices[i + 1] = tmpVertices[i + 1] * mesh.scale.y
        tmpVertices[i + 2] = tmpVertices[i + 2] * mesh.scale.z
      }
      modelVertices.push(...tmpVertices)
    }
  }
  let parentScale = mesh.scale
  mesh.children.forEach((childMesh, ndx) => {
    childMesh.scale.x = childMesh.scale.x * parentScale.x
    childMesh.scale.y = childMesh.scale.y * parentScale.y
    childMesh.scale.z = childMesh.scale.z * parentScale.z
    traverseModel(childMesh, modelVertices, scaleFactor)
  })
  return modelVertices
}

export default createTubeScene
