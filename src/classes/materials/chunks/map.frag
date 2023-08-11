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

    float cloudMixSpeed = 0.01;
    float flowSpeed = 0.015;
    float flowIntensity = 0.15;
    float timePhaseA = fract(time * flowSpeed);
    float timePhaseB = fract(timePhaseA + 0.5);
    float flowMixed = abs((timePhaseA - 0.5) * 2.0);

    float cloudMixing = abs((fract(time * cloudMixSpeed) - 0.5) * 2.0);

    vec4 cloudsDiffuseColorA = texture2D( mapClouds, vCloudsUv + (flowMap * timePhaseA * flowIntensity));
    vec4 cloudsDiffuseColorB = texture2D( mapClouds, vCloudsUv + (flowMap * timePhaseB * flowIntensity));

    vec4 clouds2DiffuseColorA = texture2D( mapClouds2, vCloudsUv + (flowMap * timePhaseA * flowIntensity));
    vec4 clouds2DiffuseColorB = texture2D( mapClouds2, vCloudsUv + (flowMap * timePhaseB * flowIntensity));

    vec4 mixedCloudSamples = mix(vec4(cloudsDiffuseColorA.a), vec4(cloudsDiffuseColorB.a), flowMixed);
    vec4 mixedCloud2Samples = mix(vec4(clouds2DiffuseColorA.a), vec4(clouds2DiffuseColorB.a), flowMixed);

    mixedCloudSamples.a *= cloudMixing;
    mixedCloud2Samples.a *= 1.0 - cloudMixing;

    vec4 mixedClouds = mixedCloudSamples + mixedCloud2Samples;

    vec4 mixedCloudDiffuse = mix(sampledDiffuseColor, mixedClouds, mixedClouds.a);

    diffuseColor *= mixedCloudDiffuse;
  #else
	  diffuseColor *= sampledDiffuseColor;
  #endif
#endif