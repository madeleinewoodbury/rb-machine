import * as THREE from 'three'
import Fan from '../sceneObjects/Fan.js'
import Cylinder from '../sceneObjects/Cylinder.js'
import Box from '../sceneObjects/Box.js'
import Sphere from '../sceneObjects/Sphere.js'
import materials from '../materials.js'

function createWindScene(renderInfo, physicsInfo, ammoHelper) {
  createWindParticles(renderInfo)
  createFan(renderInfo, physicsInfo, ammoHelper)
}

function createWindParticles(renderInfo) {
  const particleGeometry = new THREE.BufferGeometry()
  const particleCount = 500

  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < positions.length; i += 3) {
    positions[i] = (Math.random() - 0.5) * 20
    positions[i + 1] = (Math.random() - 0.5) * 5
    positions[i + 2] = (Math.random() - 0.5) * 5
  }

  particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  )

  const particles = new THREE.Points(particleGeometry, materials.wind)
  particles.position.set(70, 36, -52.5)
  particles.name = 'windParticles'

  renderInfo.scene.add(particles)
}

function createFan(renderInfo, physicsInfo, ammoHelper) {
  const fan = new THREE.Group()
  fan.name = 'fan'

  const base = new Cylinder(1, 35, materials.fan)
  fan.add(base.mesh)

  const capsule = new THREE.Mesh(
    new THREE.CapsuleGeometry(1.5, 1.5, 5, 12),
    materials.fan
  )
  capsule.rotateX(Math.PI / 2)
  capsule.position.set(0, 35.75, 1)
  fan.add(capsule)

  const blade1 = new Box(15, 1, 0.1, materials.fan)
  blade1.mesh.name = 'blade1'
  blade1.mesh.position.set(0, 35.75, 2.75)
  blade1.mesh.rotationAngle = 0
  fan.add(blade1.mesh)

  const blade2 = blade1.mesh.clone()
  blade2.name = 'blade2'
  blade2.rotationAngle = Math.PI / 2
  blade2.rotateZ(blade2.rotationAngle)
  fan.add(blade2)

  fan.position.set(85, 0, -52.5)
  fan.rotateY(-Math.PI / 2)

  renderInfo.scene.add(fan)
}

export default createWindScene
