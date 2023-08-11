worldNormal = normalMatrix * normal;
worldPosition = vec4(modelViewMatrix * vec4(position, 1.0)).xyz;