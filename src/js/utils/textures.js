// -------------------------------------------------------------------------------
// Water texture and cloud texture are from code example from module 8/shaderMaterial4
// -------------------------------------------------------------------------------

import * as THREE from 'three'
const textureLoader = new THREE.TextureLoader()


// Grass texture from https://3dtextures.me
const grass = {
  color: textureLoader.load('/textures/grass/grass_color.jpg'),
  normal: textureLoader.load('/textures/grass/grass_normal.jpg'),
  displacement: textureLoader.load('/textures/grass/grass_disp.png'),
  ao: textureLoader.load('/textures/grass/grass_ao.jpg'),
}

grass.color.colorSpace = THREE.SRGBColorSpace
grass.color.repeat.set(16, 16)
grass.ao.repeat.set(16, 16)
grass.normal.repeat.set(16, 16)
grass.displacement.repeat.set(16, 16)
grass.color.wrapS = THREE.RepeatWrapping
grass.color.wrapT = THREE.RepeatWrapping
grass.ao.wrapS = THREE.RepeatWrapping
grass.ao.wrapT = THREE.RepeatWrapping
grass.normal.wrapS = THREE.RepeatWrapping
grass.normal.wrapT = THREE.RepeatWrapping
grass.displacement.wrapS = THREE.RepeatWrapping
grass.displacement.wrapT = THREE.RepeatWrapping

// Metal grill texture from https://3dtextures.me
const metalGrill = {
  alpha: textureLoader.load('/textures/metalGrill/Metal_Grill_alpha.jpg'),
  ao: textureLoader.load('/textures/metalGrill/Metal_Grill_ao.jpg'),
  color: textureLoader.load('/textures/metalGrill/Metal_Grill_color.jpg'),
  height: textureLoader.load('/textures/metalGrill/Metal_Grill_height.png'),
  metallic: textureLoader.load('/textures/metalGrill/Metal_Grill_metallic.jpg'),
  normal: textureLoader.load('/textures/metalGrill/Metal_Grill_normal.jpg'),
  roughness: textureLoader.load(
    '/textures/metalGrill/Metal_Grill_roughness.jpg'
  ),
}

metalGrill.color.colorSpace = THREE.SRGBColorSpace

// Wood texture from https://3dtextures.me
const wood = {
  color: textureLoader.load('/textures/wood/Wood_Pattern_color.jpg'),
  normal: textureLoader.load('/textures/wood/Wood_Pattern_normal.jpg'),
  displacement: textureLoader.load('/textures/wood/Wood_Pattern_height.png'),
  roughness: textureLoader.load('/textures/wood/Wood_Pattern_roughness.jpg'),
  ao: textureLoader.load('/textures/wood/Wood_Pattern_ao.jpg'),
}

wood.color.colorSpace = THREE.SRGBColorSpace

// Scifi wall from https://3dtextures.me
const sciFiWall = {
  color: textureLoader.load(
    '/textures/scifiWall/Stylized_Sci-fi_Wall_color.jpg'
  ),
  normal: textureLoader.load(
    '/textures/scifiWall/Stylized_Sci-fi_Wall_normal.jpg'
  ),
  displacement: textureLoader.load(
    '/textures/scifiWall/Stylized_Sci-fi_Wall_height.png'
  ),
  roughness: textureLoader.load(
    '/textures/scifiWall/Stylized_Sci-fi_Wall_roughness.jpg'
  ),
  ao: textureLoader.load('/textures/scifiWall/Stylized_Sci-fi_Wall_ao.jpg'),
  metallic: textureLoader.load(
    '/textures/scifiWall/Stylized_Sci-fi_Wall_metallic.jpg'
  ),
}

sciFiWall.color.colorSpace = THREE.SRGBColorSpace

// Stone wall texture from https://3dtextures.me
const stoneWall = {
  color: textureLoader.load('/textures/stoneWall/Substance_graph_colors.jpg'),
  normal: textureLoader.load('/textures/stoneWall/Substance_normal.jpg'),
  displacement: textureLoader.load('/textures/stoneWall/Substance_height.png'),
  roughness: textureLoader.load('/textures/stoneWall/Substance_roughness.jpg'),
  ao: textureLoader.load('/textures/stoneWall/Substance_graph_ao.jpg'),
}

stoneWall.color.colorSpace = THREE.SRGBColorSpace

// Metal texture from https://3dtextures.me
const metal = {
  color: textureLoader.load('/textures/metal/basecolor.jpg'),
  normal: textureLoader.load('/textures/metal/normal.jpg'),
  roughness: textureLoader.load('/textures/metal/roughness.jpg'),
  ao: textureLoader.load('/textures/metal/ambientOcclusion.jpg'),
}

const foodContainer = {
  sides: textureLoader.load('/textures/fishFood/fiskemat.png'),
  top: textureLoader.load('/textures/fishFood/food.png'),
}

foodContainer.sides.colorSpace = THREE.SRGBColorSpace
foodContainer.top.colorSpace = THREE.SRGBColorSpace
foodContainer.sides.wrapS = THREE.RepeatWrapping
foodContainer.sides.wrapT = THREE.RepeatWrapping
foodContainer.top.wrapS = THREE.RepeatWrapping
foodContainer.top.wrapT = THREE.RepeatWrapping

// Water texture
const waterTexture = textureLoader.load('/textures/water.jpg')
waterTexture.wrapS = THREE.RepeatWrapping
waterTexture.wrapT = THREE.RepeatWrapping

// Cloud texture
const cloudTexture = textureLoader.load('/textures/cloud.png')
cloudTexture.wrapS = THREE.RepeatWrapping
cloudTexture.wrapT = THREE.RepeatWrapping

const waterUniforms = {
  baseTexture: { type: 't', value: waterTexture },
  baseSpeed: { type: 'f', value: 0.5 },
  noiseTexture: { type: 't', value: cloudTexture },
  noiseScale: { type: 'f', value: 0.5 },
  alpha: { type: 'f', value: 0.1 },
  time: { type: 'f', value: 0.2 },
}

const textures = {
  grass,
  waterUniforms,
  metalGrill,
  wood,
  sciFiWall,
  stoneWall,
  metal,
  foodContainer
}

export default textures
