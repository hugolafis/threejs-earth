import { IUniform, MeshPhysicalMaterial, MeshPhysicalMaterialParameters, Texture, Vector2 } from 'three';
import worldNormal from './chunks/world-normal.vert';
import emissive from './chunks/emissive.frag';
import map from './chunks/map.frag';
import uv from './chunks/clouds-uv.vert';

export type EarthMaterialParams = {
  mapClouds?: Texture;
};

export class EarthPhysicalMaterial extends MeshPhysicalMaterial {
  readonly mapClouds: IUniform<Texture | null> = { value: null };
  readonly time: IUniform<number> = { value: 0.0 };

  // Have to split the params into two instead of a union, as three tries to take all properties and then errors out
  constructor(params?: MeshPhysicalMaterialParameters, earthParams?: EarthMaterialParams) {
    super(params);

    this.mapClouds.value = earthParams?.mapClouds ?? null;

    this.onBeforeCompile = shader => {
      shader.uniforms.time = this.time;

      if (this.mapClouds.value) {
        this.defines.USE_MAP_CLOUDS = true;
        shader.uniforms.mapClouds = this.mapClouds;
        shader.uniforms.cloudsTransform = { value: this.mapClouds.value.matrix };
      }

      shader.vertexShader = `varying vec3 worldNormal;\n ${shader.vertexShader}`;
      shader.vertexShader = `varying vec3 sunDir;\n ${shader.vertexShader}`;
      shader.vertexShader = `varying vec2 vCloudsUv;\n ${shader.vertexShader}`;
      shader.vertexShader = `uniform mat3 cloudsTransform;\n ${shader.vertexShader}`;
      shader.vertexShader = `uniform float time;\n ${shader.vertexShader}`;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <normal_vertex>',
        `#include <normal_vertex>\n
        ${worldNormal}`
      );
      shader.vertexShader = shader.vertexShader.replace(
        '#include <uv_vertex>',
        `#include <uv_vertex>\n
        ${uv}`
      );

      shader.fragmentShader = `varying vec3 worldNormal;\n ${shader.fragmentShader}`;
      shader.fragmentShader = `varying vec3 sunDir;\n ${shader.fragmentShader}`;
      shader.fragmentShader = `uniform sampler2D mapClouds;\n ${shader.fragmentShader}`;
      shader.fragmentShader = `varying vec2 vCloudsUv;\n ${shader.fragmentShader}`;

      shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `${map}`);
      shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>', `${emissive}`);
    };
  }
}
