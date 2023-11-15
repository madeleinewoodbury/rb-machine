import * as THREE from 'three'

const textureLoader = new THREE.TextureLoader()

const waterTexture = textureLoader.load('/textures/water.jpg')
waterTexture.wrapS = THREE.RepeatWrapping
waterTexture.wrapT = THREE.RepeatWrapping

const cloudTexture = textureLoader.load('/textures/cloud.png')
cloudTexture.wrapS = THREE.RepeatWrapping
cloudTexture.wrapT = THREE.RepeatWrapping

const uniforms = {
  baseTexture: { type: 't', value: waterTexture },
  baseSpeed: { type: 'f', value: 0.5 },
  noiseTexture: { type: 't', value: cloudTexture },
  noiseScale: { type: 'f', value: 0.5 },
  alpha: { type: 'f', value: 0.1 },
  time: { type: 'f', value: 0.2 },
}

// Define all materials here
const materials = {
  white: new THREE.MeshStandardMaterial({ color: 0xffffff }),
  black: new THREE.MeshStandardMaterial({ color: 0x000000 }),
  red: new THREE.MeshStandardMaterial({ color: 0xff0000 }),
  blue: new THREE.MeshStandardMaterial({ color: 0x0000ff }),
  yellow: new THREE.MeshStandardMaterial({ color: 0xffff00 }),
  grey: new THREE.MeshStandardMaterial({ color: 0xc2c2c2 }),

  plane: new THREE.MeshStandardMaterial({ color: 0x158000 }),
  tube: new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    wireframe: false,
    transparent: true,
    opacity: 0.5,
  }), // cyan
  wind: new THREE.PointsMaterial({
    size: 0.25,
    sizeAttenuation: true,
    color: 0xffffff,
  }),
  hammerHandle: new THREE.MeshStandardMaterial({ color: 0xd5a785 }),
  water: new THREE.MeshStandardMaterial({
    color: 0x0000ff,
    transparent: true,
    opacity: 0.4,
  }),
  fishFood: new THREE.PointsMaterial({
    size: 0.5,
    sizeAttenuation: true,
    color: 0xffff00,
    transparent: true,
    opacity: 0,
  }),
  waterCloud: new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
  }),
}

export default materials
