import * as THREE from 'three'

// Define all materials here
const materials = {
  white: new THREE.MeshStandardMaterial({ color: 0xffffff }),
  black: new THREE.MeshStandardMaterial({ color: 0x000000 }),
  red: new THREE.MeshStandardMaterial({ color: 0xff0000 }),
  blue: new THREE.MeshStandardMaterial({ color: 0x0000ff }),
  yellow: new THREE.MeshStandardMaterial({ color: 0xffff00 }),
  grey: new THREE.MeshStandardMaterial({ color: 0xc2c2c2 }),

  plane: new THREE.MeshStandardMaterial({ color: 0x158000 }),
  tube: new THREE.MeshStandardMaterial({ color: 0x00ffff, wireframe: true }), // cyan
  wind: new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    color: 0xffffff,
  }),
  hammerHandle: new THREE.MeshStandardMaterial({ color: 0xd5a785 }),
  water: new THREE.MeshStandardMaterial({
    color: 0x0000ff,
    transparent: true,
    opacity: 0.4,
  }),
}

export default materials
