import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EarthPhysicalMaterial } from './materials/EarthPhysicalMaterial';

export class Viewer {
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;

  private earth: THREE.Mesh;
  private earthGroup: THREE.Group;
  private earthMaterial: EarthPhysicalMaterial;

  private readonly scene = new THREE.Scene();

  constructor(private readonly renderer: THREE.WebGLRenderer, private readonly canvas: HTMLCanvasElement) {
    this.initCamera();
    this.initControls();
    this.initLights();

    this.initMeshes();
  }

  readonly update = (dt: number) => {
    this.controls.update();

    if (this.earth && this.earthMaterial) {
      this.earth.rotation.y += 1 * (Math.PI / 180) * dt;
      this.earthMaterial.mapClouds.value.offset.x = this.earthMaterial.mapClouds.value.offset.x - 0.001 * dt;

      this.earthMaterial.mapClouds.value.updateMatrix();

      this.earthMaterial.time.value += dt;
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
    const light = new THREE.DirectionalLight(undefined, 1.0);

    const lightPos = new THREE.Vector3(1, 0, 0).multiplyScalar(25);
    light.position.copy(lightPos);

    const helper = new THREE.DirectionalLightHelper(light);
    this.scene.add(light);
    this.scene.add(helper);
  }

  private async initMeshes() {
    const textureLoader = new THREE.TextureLoader();

    const textures = await Promise.all([
      textureLoader.loadAsync('./assets/2k_earth_daymap.jpg'),
      textureLoader.loadAsync('./assets/2k_earth_emissive.png'),
      textureLoader.loadAsync('./assets/2k_earth_clouds.png'),
      textureLoader.loadAsync('./assets/2k_earth_clouds2.png'),
      textureLoader.loadAsync('./assets/flowmap3.png'),
      textureLoader.loadAsync('./assets/2k_earth_normal_map.png'),
      textureLoader.loadAsync('./assets/2k_earth_water_mask.png'),
    ]);

    const map = textures[0];
    const emissiveMap = textures[1];
    const mapClouds = textures[2];
    const mapClouds2 = textures[3];
    const mapFlow = textures[4];
    const normalMap = textures[5];
    const roughnessMap = textures[6];

    mapClouds.wrapS = THREE.RepeatWrapping;
    mapClouds.wrapT = THREE.RepeatWrapping;

    mapClouds2.wrapS = THREE.RepeatWrapping;
    mapClouds2.wrapT = THREE.RepeatWrapping;

    //mapFlow.generateMipmaps = false;

    const sphereGeo = new THREE.SphereGeometry(1, 256, 256);
    this.earthMaterial = new EarthPhysicalMaterial(
      {
        map,
        emissiveMap,
        emissiveIntensity: 1,
        emissive: new THREE.Color(0xfaf1af),
        normalMap,
        //roughnessMap,
      },
      {
        mapClouds,
        mapClouds2,
        mapFlow,
      }
    );

    this.earth = new THREE.Mesh(sphereGeo, this.earthMaterial);
    this.earthGroup = new THREE.Group();

    this.earthGroup.add(this.earth);
    this.earthGroup.rotation.z = -23.4 * (Math.PI / 180);

    this.scene.add(this.earthGroup);
  }
}
