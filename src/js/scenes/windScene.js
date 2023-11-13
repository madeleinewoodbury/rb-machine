import * as THREE from "three";
import Fan from "../sceneObjects/Fan.js";
import materials from "../materials.js";

function createWindScene(renderInfo, physicsInfo, ammoHelper) {
  createWindParticles(renderInfo);
  createFan(renderInfo, physicsInfo, ammoHelper);
}

function createWindParticles(renderInfo) {
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 500;

  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < positions.length; i += 3) {
    positions[i] = (Math.random() - 0.5) * 20;
    positions[i + 1] = (Math.random() - 0.5) * 5;
    positions[i + 2] = (Math.random() - 0.5) * 5;
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const particles = new THREE.Points(particleGeometry, materials.wind);
  particles.position.set(70, 55, -52.5);
  particles.name = "windParticles";

  renderInfo.scene.add(particles);
}

function createFan(renderInfo, physicsInfo, ammoHelper) {
  const baseRadius = 1;
  const baseHeight = 54;
  const topRadius = 1.5;
  const topLength = 5;
  const bladeWidth = 15;
  const bladeHeight = 1;
  const bladeDepth = 0.1;

  const fan = new Fan(
    baseRadius,
    baseHeight,
    topRadius,
    topLength,
    bladeWidth,
    bladeHeight,
    bladeDepth
  );

  fan.group.position.set(85, 0, -52.5);
  fan.group.rotateY(-Math.PI / 2);

  renderInfo.scene.add(fan.group);
}

export default createWindScene;
