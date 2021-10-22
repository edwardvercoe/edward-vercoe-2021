// https://www.youtube.com/watch?v=i-uesNLuunw&ab_channel=YuriArtyukh

// timestamp : 26m:35s

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import vertex from "./shaders/vertexParticles.glsl";
import fragment from "./shaders/fragment.glsl";
import { Color } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";

// Debug
// const gui = new dat.GUI();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

scene.background = new Color(0x0e0e11);

// Objects
const geometry = new THREE.BufferGeometry();

let count = 500;

let position = new Float32Array(count * count * 3);
for (let i = 0; i < count; i++) {
  for (let j = 0; j < count; j++) {
    // changing the * 10 changes the amount of particles i think?
    position.set([(i / count - 0.5) * 10, (j / count - 0.5) * 10, 0], 3 * (count * i + j));
  }
}

geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));

// Materials

const material = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  uniforms: {
    time: { type: "f", value: 0 },
    resolution: { type: "v4", value: new THREE.Vector4() },
    uvRate1: {
      value: new THREE.Vector2(1, 1),
    },
  },
  // wireframe: true,
  // transparent: true,
  vertexShader: vertex,
  fragmentShader: fragment,
  depthWrite: false,
  depthTest: false,
  blending: THREE.AdditiveBlending,
});

// Particles
const planeParticles = new THREE.Points(geometry, material);
scene.add(planeParticles);

// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // update  effect composer
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  effectComposer.setSize(sizes.width, sizes.height);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(0, -1, -0.1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Post processing
 */

// render target
const renderTarget = new THREE.WebGLRenderTarget(800, 600, {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat,
  encoding: THREE.sRGBEncoding,
});
// composer
const effectComposer = new EffectComposer(renderer, renderTarget);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
effectComposer.setSize(sizes.width, sizes.height);

//passes
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const effectFilmBW = new FilmPass(0.35, 0.5, 2048, false);
effectComposer.addPass(effectFilmBW);

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  material.uniforms.time.value = elapsedTime;

  // Update Orbital Controls
  controls.update();

  // Render
  //   renderer.render(scene, camera);

  effectComposer.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
