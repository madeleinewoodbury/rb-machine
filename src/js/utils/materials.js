import * as THREE from 'three'
import textures from './textures.js'

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
    uniforms: textures.waterUniforms,
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
  }),
  bricks: new THREE.MeshStandardMaterial({
    map: textures.bricks.color,
    normalMap: textures.bricks.normal,
    displacementMap: textures.bricks.displacement,
    displacementScale: 0.1,
    alphaMap: textures.bricks.alpha,
  }),
  grass: new THREE.MeshStandardMaterial({
    map: textures.grass.color,
    normalMap: textures.grass.normal,
    displacementMap: textures.grass.displacement,
    displacementScale: 0.9,
    aoMap: textures.grass.ao,
  }),
  metalGrill: new THREE.MeshStandardMaterial({
    map: textures.metalGrill.color,
    normalMap: textures.metalGrill.normal,
    displacementMap: textures.metalGrill.height,
    displacementScale: 0.2,
    roughnessMap: textures.metalGrill.roughness,
    roughness: 0.7,
    aoMap: textures.metalGrill.ao,
    metalnessMap: textures.metalGrill.metallic,
    metalness: 0.2,
    alphaMap: textures.metalGrill.alpha,
    transparent: true,
    side: THREE.DoubleSide,
  }),
  wood: new THREE.MeshStandardMaterial({
    map: textures.wood.color,
    normalMap: textures.wood.normal,
    displacementMap: textures.wood.displacement,
    displacementScale: 0.01,
    roughnessMap: textures.wood.roughness,
    roughness: 0.8,
    aoMap: textures.wood.ao,
  }),
  sciFiWall: new THREE.MeshStandardMaterial({
    map: textures.sciFiWall.color,
    normalMap: textures.sciFiWall.normal,
    displacementMap: textures.sciFiWall.displacement,
    displacementScale: 0.1,
    roughnessMap: textures.sciFiWall.roughness,
    roughness: 0.5,
    aoMap: textures.sciFiWall.ao,
    metalnessMap: textures.sciFiWall.metallic,
    metalness: 0.1,
  }),
  stoneWall: new THREE.MeshStandardMaterial({
    map: textures.stoneWall.color,
    normalMap: textures.stoneWall.normal,
    // displacementMap: textures.stoneWall.displacement,
    // displacementScale: 0.01,
    roughnessMap: textures.stoneWall.roughness,
    roughness: 0.9,
    aoMap: textures.stoneWall.ao,
  }),
  metal: new THREE.MeshStandardMaterial({
    color: '#ff7700',
    map: textures.metal.color,
    normalMap: textures.metal.normal,
    roughnessMap: textures.metal.roughness,
    roughness: 0.9,
    aoMap: textures.metal.ao,
  }),
}

export default materials
