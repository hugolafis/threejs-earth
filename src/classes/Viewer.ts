import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EarthPhysicalMaterial } from './materials/EarthPhysicalMaterial';
import { AtmosphereMaterial } from './materials/AtmosphereMaterial';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

export class Viewer {
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;

  private sun: THREE.DirectionalLight;
  private earth: THREE.Mesh;
  private earthGroup: THREE.Group;
  private earthMaterial: EarthPhysicalMaterial;
  private atmosphereMaterial: AtmosphereMaterial;

  private readonly scene = new THREE.Scene();

  constructor(private readonly renderer: THREE.WebGLRenderer, private readonly canvas: HTMLCanvasElement) {
    this.initCamera();
    this.initControls();
    this.initLights();

    this.initMeshes();
  }

  setSunPosition(season: string) {
    if (!this.sun) {
      return;
    }

    switch (season) {
      case 'spring':
        this.sun.position.x = 0;
        this.sun.position.z = 1;

        break;
      case 'summer':
        this.sun.position.x = 1;
        this.sun.position.z = 0;

        break;
      case 'autumn':
        this.sun.position.x = 0;
        this.sun.position.z = -1;

        break;
      case 'winter':
        this.sun.position.x = -1;
        this.sun.position.z = 0;

        break;
    }
  }

  readonly update = (dt: number) => {
    this.controls.update();

    if (this.earth && this.earthMaterial) {
      this.earth.rotation.y += 5 * (Math.PI / 180) * dt;
      this.earthMaterial.mapClouds.value.offset.x = this.earthMaterial.mapClouds.value.offset.x - 0.001 * dt;
      this.earthMaterial.mapFlow.value.offset.x = this.earthMaterial.mapFlow.value.offset.x + 0.005 * dt;

      this.earthMaterial.mapClouds.value.updateMatrix();
      this.earthMaterial.mapFlow.value.updateMatrix();

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

    this.camera.position.set(1.1, 1.25, -1.25);

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

    this.scene.add(light);
    this.sun = light;
  }

  private async initMeshes() {
    const textureLoader = new THREE.TextureLoader();
    const rgbeLoader = new RGBELoader();

    const textures = await Promise.all([
      textureLoader.loadAsync('./assets/2k_earth_daymap.jpg'),
      textureLoader.loadAsync('./assets/2k_earth_emissive.png'),
      textureLoader.loadAsync('./assets/2k_earth_clouds.png'),
      textureLoader.loadAsync('./assets/2k_earth_clouds2.png'),
      textureLoader.loadAsync('./assets/flowmap4.png'),
      textureLoader.loadAsync('./assets/2k_earth_normal_map.png'),
      textureLoader.loadAsync('./assets/2k_earth_water_mask.png'),
    ]);

    const starMap = await rgbeLoader.loadAsync('./assets/starmap_g4k.hdr');
    starMap.mapping = THREE.EquirectangularReflectionMapping;
    this.scene.backgroundIntensity = 0.05;

    const map = textures[0];
    const emissiveMap = textures[1];
    const mapClouds = textures[2];
    const mapClouds2 = textures[3];
    const mapFlow = textures[4];
    const normalMap = textures[5];

    mapFlow.wrapS = THREE.RepeatWrapping;
    mapFlow.wrapT = THREE.RepeatWrapping;

    mapClouds.wrapS = THREE.RepeatWrapping;
    mapClouds.wrapT = THREE.RepeatWrapping;

    mapClouds2.wrapS = THREE.RepeatWrapping;
    mapClouds2.wrapT = THREE.RepeatWrapping;

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
        sunDirection: this.sun.position,
      }
    );

    const atmosphericsGeo = new THREE.SphereGeometry(1.005, 256, 256);
    this.atmosphereMaterial = new AtmosphereMaterial(this.sun.position);

    const atmospherics = new THREE.Mesh(atmosphericsGeo, this.atmosphereMaterial);

    this.earth = new THREE.Mesh(sphereGeo, this.earthMaterial);
    this.earthGroup = new THREE.Group();

    this.earthGroup.add(this.earth);
    this.earthGroup.add(atmospherics);
    this.earthGroup.rotation.z = -23.4 * (Math.PI / 180);

    this.scene.add(this.earthGroup);

    // Stars
    // const starFieldGeo = new THREE.SphereGeometry(1000, 24, 24);
    // const starFieldMat = new THREE.MeshBasicMaterial({
    //   lightMap: starMap,
    //   side: THREE.BackSide,
    //   lightMapIntensity: 0.25,
    // });
    // const stars = new THREE.Mesh(starFieldGeo, starFieldMat);

    this.scene.background = starMap;

    //this.scene.add(stars);
  }
}
