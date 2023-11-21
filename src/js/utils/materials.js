import * as THREE from 'three'
import textures from './textures.js'

const materials = {
  white: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.2 }),
  black: new THREE.MeshPhongMaterial({ color: 0x000000 }),
  red: new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.3, roughness: 0.3}),
  elevatorButton: new THREE.MeshPhongMaterial({ color: 0xffff00 }),
  text: new THREE.MeshPhongMaterial({ color: 0xdbbe00 }),
  grey: new THREE.MeshPhongMaterial({ color: 0xc2c2c2 }),
  ballYellow: new THREE.MeshStandardMaterial({ color: 0xfbfb00, metalness: 0.5, roughness: 0.1 }),
  ballRed: new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.4, roughness: 0.2 }),

  elevatorShaft: new THREE.MeshPhongMaterial({
    color: 0x00ffff,
    wireframe: false,
    transparent: true,
    opacity: 0.5,
  }), // 
  wind: new THREE.PointsMaterial({
    size: 0.25,
    sizeAttenuation: true,
    color: 0xffffff,
  }),
  hammerHandle: new THREE.MeshPhongMaterial({ color: 0xd5a785 }),
  water: new THREE.MeshStandardMaterial({
    color: 0x0000ff,
    transparent: true,
    opacity: 0.4,
  }),
  fishFood: new THREE.PointsMaterial({
    size: 0.2,
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
  grass: new THREE.MeshLambertMaterial({
    map: textures.grass.color,
    normalMap: textures.grass.normal,
    displacementMap: textures.grass.displacement,
    displacementScale: 0.2,
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
  foodContainer: new THREE.MeshLambertMaterial({
    map: textures.foodContainer.sides,
    side: THREE.DoubleSide,
  }),
  foodContainerTop: new THREE.MeshLambertMaterial({
    map: textures.foodContainer.top,
    transparent: true,
  }),

}

export default materials
