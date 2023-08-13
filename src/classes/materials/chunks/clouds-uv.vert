#ifdef USE_MAP_CLOUDS
vCloudsUv = (cloudsTransform * vec3(MAP_UV, 1.0)).xy;
vFlowUv = (flowTransform * vec3(MAP_UV, 1.0)).xy;
#endif