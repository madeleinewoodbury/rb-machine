import * as THREE from 'three'

const materials = {
  plane: new THREE.MeshStandardMaterial({ color: 0x158000 }),
  pillar: new THREE.MeshStandardMaterial({ color: 0xffffff }),
  foodContainer: new THREE.MeshStandardMaterial({ color: 0x0000ff }),
  domino: new THREE.MeshStandardMaterial({ color: 0xffffff }),
  balancingBoard: new THREE.MeshStandardMaterial({ color: 0x0000ff }),
  ball: new THREE.MeshStandardMaterial({ color: 0xff0000 }),
  ropeStand: new THREE.MeshStandardMaterial({ color: 0xffff00 }),
  elevator: new THREE.MeshStandardMaterial({ color: 0x0000ff }),
  elevatorShaft: new THREE.MeshStandardMaterial({ color: 0xc2c2c2 }),
  elevatorButton: new THREE.MeshStandardMaterial({ color: 0xffff00 }),
  tube: new THREE.MeshStandardMaterial({ color: 0x00ffff, wireframe: true }),
  plateau: new THREE.MeshStandardMaterial({ color: 0xffffff }),
  ramp: new THREE.MeshStandardMaterial({ color: 0xffffff }),
  wind: new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    color: 0xfffffff,
  }),
  hammerHandle: new THREE.MeshStandardMaterial({ color: 0xd5a785 }),
  hammerMallet: new THREE.MeshStandardMaterial({ color: 0x000000 }),
  laserButton: new THREE.MeshStandardMaterial({ color: 0xff0000 }),
  fan: new THREE.MeshStandardMaterial({ color: 0xffffff }),
  aquarium: new THREE.MeshStandardMaterial({
    color: 0x0000ff,
    transparent: true,
    opacity: 0.4,
  }),
  aquariumSide: new THREE.MeshStandardMaterial({
    color: 0xffffff,
  }),
  aquariumBottom: new THREE.MeshStandardMaterial({
    color: 0x0000ff,
  }),
}

export default materials
