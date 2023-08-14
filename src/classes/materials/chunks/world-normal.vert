viewNormal = normalMatrix * normal;
worldNormal = vec4(modelMatrix * vec4(normal, 0.0)).xyz;