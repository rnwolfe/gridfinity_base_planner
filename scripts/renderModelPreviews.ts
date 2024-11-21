// // @ts-nocheck
// import { JSDOM } from 'jsdom';
// import * as THREE from 'three';
// import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
// import { SVGRenderer } from 'three/examples/jsm/renderers/SVGRenderer.js';
// import { availableModelsAtom } from '../src/atoms/models.js';
// import fs from 'node:fs/promises';
// import path from 'node:path';
// import sharp from 'sharp';

// // Set up a mock DOM environment
// const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
// global.document = dom.window.document;
// global.window = dom.window as any;
// global.navigator = dom.window.navigator;

// async function renderModel(modelPath: string): Promise<Buffer> {
//   const width = 1200;
//   const height = 1200;

//   const scene = new THREE.Scene();
//   scene.background = new THREE.Color(0xffffff);
  
//   const fov = 25;
//   const aspect = width / height;
//   const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 2000);
  
//   // Load and prepare geometry
//   const loader = new STLLoader();
//   const fullPath = path.join(process.cwd(), 'public', modelPath);
//   const fileContent = await fs.readFile(fullPath);
//   const geometry = loader.parse(fileContent.buffer);
//   geometry.center();

//   // Calculate bounding box
//   const mesh = new THREE.Mesh(geometry);
//   const boundingBox = new THREE.Box3().setFromObject(mesh);
//   const size = boundingBox.getSize(new THREE.Vector3());
  
//   // Use the largest dimension for consistent scaling
//   const maxDimension = Math.max(size.x, size.y, size.z);
  
//   // Position camera based on largest dimension
//   const cameraDistance = (maxDimension * 1.8);  // Reduced from 2.5
//   camera.position.set(cameraDistance, cameraDistance, cameraDistance);
//   camera.lookAt(0, 0, 0);

//   // Scale based on view size
//   const vFOV = (fov * Math.PI) / 180;
//   const viewHeight = 2 * Math.tan(vFOV / 2) * cameraDistance;
//   const scale = (viewHeight * 0.65) / maxDimension;  // Increased from 0.4
//   geometry.scale(scale, scale, scale);

//   const edges = new THREE.EdgesGeometry(geometry);
//   const line = new THREE.LineSegments(
//     edges,
//     new THREE.LineBasicMaterial({ 
//       color: 0x000000,
//       linewidth: 2
//     })
//   );
//   scene.add(line);

//   const renderer = new SVGRenderer({ antialias: true });
//   renderer.setSize(width, height);
  
//   const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//   scene.add(ambientLight);
//   const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//   directionalLight.position.set(1, 1, 1);
//   scene.add(directionalLight);

//   renderer.render(scene, camera);
//   const svgString = renderer.domElement.outerHTML;

//   const pngBuffer = await sharp(Buffer.from(svgString))
//     .resize(800, 800, { 
//       fit: 'contain',
//       background: { r: 255, g: 255, b: 255, alpha: 1 }
//     })
//     .png({ quality: 100 })
//     .toBuffer();

//   geometry.dispose();
//   edges.dispose();

//   return pngBuffer;
// }

// async function main() {
//   const models = availableModelsAtom.init;
//   const previewsDir = path.join(process.cwd(), 'public', 'previews');

//   await fs.mkdir(previewsDir, { recursive: true });

//   for (const model of models) {
//     try {
//       console.log(`Rendering preview for ${model.name}...`);
//       const buffer = await renderModel(model.path);
//       const previewPath = path.join(previewsDir, `${model.id}.png`);
//       await fs.writeFile(previewPath, buffer);
//     } catch (error) {
//       console.error(`Failed to render ${model.name}:`, error);
//     }
//   }
// }

// main().catch(console.error);
