#ifdef USE_EMISSIVEMAP

	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
  //vec3 sunDir = vec4(viewMatrix * vec4(1., 0., 0., 0.0)).xyz;
  //float sunDot = dot(worldNormal, sunDir);

  float bias = 0.75;
  float scale = 5.0;
  float sunDot = bias + scale * pow(dot(worldNormal, sunDirection), 1.0);
  sunDot = clamp(sunDot, 0., 1.);

  vec4 maskedEmissive = mix(emissiveColor, vec4(0.), sunDot);

  // Mask out the lights by the clouds
  maskedEmissive.rgb *= mixedClouds.a;

  totalEmissiveRadiance *= maskedEmissive.rgb;

#endif