class AmmoHelper {
  constructor() {
    this.transform = undefined;
  }

  setTransform(mesh) {
    this.transform = new Ammo.btTransform();
    this.transform.setIdentity();
    this.transform.setOrigin(
      new Ammo.btVector3(mesh.position.x, mesh.position.y, mesh.position.z)
    );
    this.transform.setRotation(
      new Ammo.btQuaternion(
        mesh.quaternion.x,
        mesh.quaternion.y,
        mesh.quaternion.z,
        mesh.quaternion.w
      )
    );
  }

  createRigidBody(shape, mesh, mass) {
    this.setTransform(mesh);
    shape.setLocalScaling(new Ammo.btVector3(mesh.scale.x, mesh.scale.y, mesh.scale.z));

    const motionState = new Ammo.btDefaultMotionState(this.transform);
    const localInertia = new Ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);

    const rbInfo = new Ammo.btRigidBodyConstructionInfo(
      mass,
      motionState,
      shape,
      localInertia
    );

    const rigidBody = new Ammo.btRigidBody(rbInfo);
    return rigidBody;
  }

  generateTriangleShape(mesh, useConvexShape=false) {
    let vertices = this.traverseModel(mesh)
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
  
  traverseModel(mesh, modelVertices = []) {
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
      this.traverseModel(childMesh, modelVertices)
    })
    return modelVertices
  }

}

export default AmmoHelper;