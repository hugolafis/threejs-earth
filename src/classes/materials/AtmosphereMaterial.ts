import { DoubleSide, IUniform, ShaderMaterial, Vector3 } from 'three';

export class AtmosphereMaterial extends ShaderMaterial {
  vertexShader = `
    varying vec3 vNormal;
    varying vec3 vEye;
    varying vec3 wNormal;

    void main() {

        wNormal = vec4(modelMatrix * vec4(normal, 0.0)).xyz;
        vNormal = normalize(normalMatrix * normal);
        vEye = normalize(vec3(modelViewMatrix * vec4(position, 1.0)).xyz);
  
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  fragmentShader = `
    varying vec3 vNormal;
    varying vec3 vEye;
    uniform vec3 sunDirection;
    varying vec3 wNormal;

    void main() {
      float fresnel = 1.0 - -min(dot(vEye, normalize(vNormal)), 0.0);

      float innerMask = pow(fresnel, 5.0);
      innerMask = clamp(innerMask, 0.0, 1.0);

      vec3 outerAtmosphereColor = vec3(0.34, 0.76, 1.0);
      vec3 mixedColor = mix(vec3(1.0), outerAtmosphereColor, innerMask);

      float outerMask = 1.0 - pow(fresnel, 5.0);
      outerMask = clamp(outerMask, 0.0, 1.0);

      float combinedMask = innerMask * outerMask;

      combinedMask *= 2.5;
      combinedMask = clamp(combinedMask, 0.0, 1.0);

      float bias = 1.5;
      float scale = 3.0;
      float sunDot =  scale * pow(dot(wNormal, sunDirection), 1.0);
      sunDot = clamp(sunDot, 0., 1.);

      combinedMask *= sunDot;

      gl_FragColor = vec4(vec3(mixedColor), combinedMask);
    }
  `;

  readonly sunDirection: IUniform<Vector3> = { value: new Vector3() };

  constructor(sunDir: THREE.Vector3) {
    super();
    this.transparent = true;
    this.side = DoubleSide;
    this.depthTest = false;

    this.sunDirection.value = sunDir;

    this.onBeforeCompile = shader => {
      shader.uniforms.sunDirection = this.sunDirection;
    };
  }
}
