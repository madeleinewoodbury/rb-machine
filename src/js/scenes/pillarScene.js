import Pillar from '../sceneObjects/Pillar.js'
import AmmoHelper from '../helpers/AmmoHelper.js'

function createPillarScene(renderInfo, physicsInfo) {
  const ammoHelper = new AmmoHelper()
  const pillar = new Pillar()

  const compoundShape = pillar.getCompoundShape(ammoHelper)
  const rigidBody = ammoHelper.createRigidBody(compoundShape, pillar.mesh, 0)
  rigidBody.setFriction(0.8)

  physicsInfo.addRigidBody(rigidBody, pillar.mesh)
  pillar.mesh.userData.physicsBody = rigidBody
  rigidBody.threeMesh = pillar.mesh
  renderInfo.scene.add(pillar.mesh)
}
export default createPillarScene
