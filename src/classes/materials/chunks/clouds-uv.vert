#ifdef USE_MAP_CLOUDS
  vCloudsUv = ( cloudsTransform * vec3( MAP_UV, 1.0 ) ).xy;

  // float amplitude = 0.25;
  // vCloudsUv.x += amplitude * sin(time * 0.1 + uv.x);
  // vCloudsUv.y += amplitude * cos(time + uv.y);
#endif