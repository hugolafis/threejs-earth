import { MeshPhysicalMaterial, MeshPhysicalMaterialParameters } from 'three';
import worldNormal from './chunks/world-normal.vert';
import emissive from './chunks/emissive.frag';

export class EarthPhysicalMaterial extends MeshPhysicalMaterial {
  constructor(params?: MeshPhysicalMaterialParameters) {
    super(params);

    this.onBeforeCompile = shader => {
      shader.vertexShader = `varying vec3 worldNormal;\n ${shader.vertexShader}`;
      shader.vertexShader = `varying vec3 sunDir;\n ${shader.vertexShader}`;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <normal_vertex>',
        `#include <normal_vertex>\n
        ${worldNormal}`
      );

      shader.fragmentShader = `varying vec3 worldNormal;\n ${shader.fragmentShader}`;
      shader.fragmentShader = `varying vec3 sunDir;\n ${shader.fragmentShader}`;
      shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>', `${emissive}`);
    };
  }
}
