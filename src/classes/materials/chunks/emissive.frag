#ifdef USE_EMISSIVEMAP

	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
  vec3 sunDir = vec4(viewMatrix * vec4(1., 0., 0., 0.0)).xyz;
  //float sunDot = dot(worldNormal, sunDir);

  float bias = 0.75;
  float scale = 5.0;
  float sunDot = bias + scale * pow(dot(worldNormal, sunDir), 1.0);
  sunDot = clamp(sunDot, 0., 1.);

    // vec3 sunDir = vec4(viewMatrix * vec4(1., 0., 0., 0.0)).xyz;
    // float scale = 1.0;
    // float sunDot = scale * pow(dot(worldNormal, sunDir), 1.0);
    // sunDot = clamp(sunDot, 0., 1.);

    // float eyeBias = 1.0;
    // float eyeScale = 0.0;
    // vec3 viewDirection = normalize(worldNormal - worldPosition);
    // float eyeDot = 1.0 - 1.5 * pow(dot(viewDirection, worldNormal), 1.5);
    // eyeDot = clamp(eyeDot, 0., 1.);

    // sunDot *= eyeDot;
    // sunDot = clamp(sunDot, 0., 1.);

    // vec3 outerAtmosphereColor = vec3(0.34, 0.76, 1.0);
    // vec3 mixedColor = mix(vec3(1.0), outerAtmosphereColor, eyeDot);

  vec4 maskedEmissive = mix(emissiveColor, vec4(0.), sunDot);

  // Mask out the lights by the clouds
  maskedEmissive.rgb *= mixedClouds.a;

	//totalEmissiveRadiance *= emissiveColor.rgb;
  totalEmissiveRadiance *= maskedEmissive.rgb;

#endif