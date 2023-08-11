#ifdef USE_MAP

	vec4 sampledDiffuseColor = texture2D( map, vMapUv );

	#ifdef DECODE_VIDEO_TEXTURE

		// use inline sRGB decode until browsers properly support SRGB8_APLHA8 with video textures

		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif

  #ifdef USE_MAP_CLOUDS

    // credit: Martin Donald for the flowmap implementation
    vec2 flowMap = texture2D( mapFlow, vCloudsUv ).xy;
    flowMap = (flowMap.xy - 0.5) * 2.0;

    float flowSpeed = 0.15;
    float flowIntensity = 0.5;
    float timePhaseA = fract(time * flowSpeed);
    float timePhaseB = fract(timePhaseA + 0.5);
    float flowMixed = abs((timePhaseA - 0.5) * 2.0);

    vec4 cloudsDiffuseColorA = texture2D( mapClouds, vCloudsUv + (flowMap * timePhaseA * flowIntensity));
    vec4 cloudsDiffuseColorB = texture2D( mapClouds, vCloudsUv + (flowMap * timePhaseB * flowIntensity));
    vec4 mixedCloudSamples = mix(cloudsDiffuseColorA, cloudsDiffuseColorB, flowMixed);

    vec4 mixedCloudDiffuse = mix(sampledDiffuseColor, mixedCloudSamples, mixedCloudSamples.a);

    diffuseColor *= mixedCloudDiffuse;
  #else
	  diffuseColor *= sampledDiffuseColor;
  #endif
#endif