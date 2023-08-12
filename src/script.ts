import { Viewer } from './classes/Viewer';
import './style.css';
import * as THREE from 'three';

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl');
const clock = new THREE.Clock();

/**
 * Renderer
 */
THREE.ColorManagement.enabled = true;
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.shadowMap.enabled = true;
//renderer.physicallyCorrectLights = true;

const viewer = new Viewer(renderer, canvas);
const resizeObserver = new ResizeObserver(viewer.resize);
resizeObserver.observe(canvas);

function init() {
  clock.start();

  update();
}

function update() {
  // Calculate delta
  const delta = clock.getDelta();

  // Update the viewer
  viewer.update(delta);

  window.requestAnimationFrame(update);
}

init();
