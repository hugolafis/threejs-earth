import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EarthPhysicalMaterial } from './materials/EarthPhysicalMaterial';

export class Viewer {
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;

  private earth: THREE.Mesh;
  private earthGroup: THREE.Group;

  private readonly scene = new THREE.Scene();

  constructor(private readonly renderer: THREE.WebGLRenderer, private readonly canvas: HTMLCanvasElement) {
    this.initCamera();
    this.initControls();
    this.initLights();

    this.initMeshes();
  }

  readonly update = (dt: number) => {
    this.controls.update();

    if (this.earth) {
      this.earth.rotation.y += 1 * (Math.PI / 180) * dt;
    }

    this.renderer.render(this.scene, this.camera);
  };

  readonly resize = () => {
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.render(this.scene, this.camera);
  };

  private initCamera() {
    this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight);

    this.camera.position.set(5, 5, 0);

    this.scene.add(this.camera);
  }

  private initControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.dampingFactor = 0.05;
    this.controls.enableDamping = true;

    this.controls.target.set(0, 0, 0);
  }

  private initLights() {
    const light = new THREE.DirectionalLight();

    const lightPos = new THREE.Vector3(1, 0, 0).multiplyScalar(25);
    light.position.copy(lightPos);

    const helper = new THREE.DirectionalLightHelper(light);
    this.scene.add(light);
    this.scene.add(helper);
  }

  private async initMeshes() {
    const textureLoader = new THREE.TextureLoader();

    const map = await textureLoader.loadAsync('/assets/2k_earth_daymap.jpg');
    const emissiveMap = await textureLoader.loadAsync('./assets/2k_earth_emissive.png');

    const sphereGeo = new THREE.SphereGeometry(1, 256, 256);
    const sphereMat = new EarthPhysicalMaterial({
      map,
      emissiveMap,
      emissiveIntensity: 1,
      emissive: new THREE.Color(0xfaf1af),
    });

    this.earth = new THREE.Mesh(sphereGeo, sphereMat);
    this.earthGroup = new THREE.Group();

    this.earthGroup.add(this.earth);
    this.earthGroup.rotation.z = -23.4 * (Math.PI / 180);

    this.scene.add(this.earthGroup);
  }
}
