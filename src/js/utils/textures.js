import * as THREE from 'three'
const textureLoader = new THREE.TextureLoader()

// Brick texture
const bricks = {
  color: textureLoader.load('/textures/bricks/bricks2.jpg'),
  normal: textureLoader.load('/textures/bricks/bricks2_normalmap.jpg'),
  displacement: textureLoader.load(
    '/textures/bricks/bricks2_displacementmap.jpg'
  ),
  alpha: textureLoader.load('/textures/bricks/bricks2_alphamap.jpg'),
}

bricks.color.colorSpace = THREE.SRGBColorSpace
bricks.color.wrapS = THREE.RepeatWrapping
bricks.color.wrapT = THREE.RepeatWrapping
bricks.normal.wrapS = THREE.RepeatWrapping
bricks.normal.wrapT = THREE.RepeatWrapping
bricks.displacement.wrapS = THREE.RepeatWrapping
bricks.displacement.wrapT = THREE.RepeatWrapping
bricks.alpha.wrapS = THREE.RepeatWrapping
bricks.alpha.wrapT = THREE.RepeatWrapping

// Stone floor texture
const stoneFloor = {
  color: textureLoader.load('/textures/stoneFloor/stone_floor_basecolor.jpg'),
  normal: textureLoader.load('/textures/stoneFloor/stone_floor_normal.jpg'),
  displacement: textureLoader.load(
    '/textures/stoneFloor/stone_floor_height.png'
  ),
  roughness: textureLoader.load(
    '/textures/stoneFloor/stone_floor_roughness.jpg'
  ),
  ao: textureLoader.load('/textures/stoneFloor/stone_floor_ao.jpg'),
}

stoneFloor.color.colorSpace = THREE.SRGBColorSpace
stoneFloor.color.repeat.set(4, 4)
stoneFloor.ao.repeat.set(4, 4)
stoneFloor.normal.repeat.set(4, 4)
stoneFloor.roughness.repeat.set(4, 4)
stoneFloor.displacement.repeat.set(4, 4)
stoneFloor.color.wrapS = THREE.RepeatWrapping
stoneFloor.color.wrapT = THREE.RepeatWrapping
stoneFloor.ao.wrapS = THREE.RepeatWrapping
stoneFloor.ao.wrapT = THREE.RepeatWrapping
stoneFloor.normal.wrapS = THREE.RepeatWrapping
stoneFloor.normal.wrapT = THREE.RepeatWrapping
stoneFloor.roughness.wrapS = THREE.RepeatWrapping
stoneFloor.roughness.wrapT = THREE.RepeatWrapping
stoneFloor.displacement.wrapS = THREE.RepeatWrapping
stoneFloor.displacement.wrapT = THREE.RepeatWrapping

// Grass texture
const grass = {
  color: textureLoader.load('/textures/grass/grass_color.jpg'),
  normal: textureLoader.load('/textures/grass/grass_normal.jpg'),
  displacement: textureLoader.load('/textures/grass/grass_disp.png'),
  ao: textureLoader.load('/textures/grass/grass_ao.jpg'),
}

grass.color.colorSpace = THREE.SRGBColorSpace
grass.color.repeat.set(4, 4)
grass.ao.repeat.set(4, 4)
grass.normal.repeat.set(4, 4)
grass.displacement.repeat.set(4, 4)
grass.color.wrapS = THREE.RepeatWrapping
grass.color.wrapT = THREE.RepeatWrapping
grass.ao.wrapS = THREE.RepeatWrapping
grass.ao.wrapT = THREE.RepeatWrapping
grass.normal.wrapS = THREE.RepeatWrapping
grass.normal.wrapT = THREE.RepeatWrapping
grass.displacement.wrapS = THREE.RepeatWrapping
grass.displacement.wrapT = THREE.RepeatWrapping

// Metal grill texture
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

// Wood texture
const wood = {
  color: textureLoader.load('/textures/wood/Wood_Pattern_color.jpg'),
  normal: textureLoader.load('/textures/wood/Wood_Pattern_normal.jpg'),
  displacement: textureLoader.load('/textures/wood/Wood_Pattern_height.png'),
  roughness: textureLoader.load('/textures/wood/Wood_Pattern_roughness.jpg'),
  ao: textureLoader.load('/textures/wood/Wood_Pattern_ao.jpg'),
}

wood.color.colorSpace = THREE.SRGBColorSpace

// Scifi wall
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

const stoneWall = {
  color: textureLoader.load('/textures/stoneWall/Substance_graph_colors.jpg'),
  normal: textureLoader.load('/textures/stoneWall/Substance_normal.jpg'),
  displacement: textureLoader.load('/textures/stoneWall/Substance_height.png'),
  roughness: textureLoader.load('/textures/stoneWall/Substance_roughness.jpg'),
  ao: textureLoader.load('/textures/stoneWall/Substance_graph_ao.jpg'),
}

stoneWall.color.colorSpace = THREE.SRGBColorSpace

const metal = {
  color: textureLoader.load('/textures/metal/basecolor.jpg'),
  normal: textureLoader.load('/textures/metal/normal.jpg'),
  roughness: textureLoader.load('/textures/metal/roughness.jpg'),
  ao: textureLoader.load('/textures/metal/ambientOcclusion.jpg'),
}

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
  bricks,
  stoneFloor,
  grass,
  waterUniforms,
  metalGrill,
  wood,
  sciFiWall,
  stoneWall,
  metal,
}

export default textures
