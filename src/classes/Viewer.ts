import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Viewer {
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private readonly scene = new THREE.Scene();

  constructor(private readonly renderer: THREE.WebGLRenderer, private readonly canvas: HTMLCanvasElement) {
    this.initCamera();
    this.initControls();
    this.initLights();

    this.initMeshes();
  }

  readonly update = (dt: number) => {
    this.controls.update();

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

    const sphereGeo = new THREE.SphereGeometry(1);
    const sphereMat = new THREE.MeshPhysicalMaterial();

    const mesh = new THREE.Mesh(sphereGeo, sphereMat);

    this.scene.add(mesh);
  }
}
