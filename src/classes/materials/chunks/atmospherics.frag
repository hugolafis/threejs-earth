float sunMask = 1.0 * pow(dot(worldNormal, sunDir), 1.0);
sunMask = clamp(sunDot, 0., 1.);

float eyeBias = 1.0;
float eyeScale = 0.0;
float eyeDistance = length(worldNormal - worldPosition);
vec3 viewDirection = normalize(worldNormal - worldPosition);
float eyeDot = 1.0 - 2.0 * pow(dot(viewDirection, worldNormal), 1.0);
eyeDot = clamp(eyeDot, 0., 1.);

sunMask *= eyeDot;
sunMask = clamp(sunMask, 0., 1.);

vec3 outerAtmosphereColor = vec3(0.34, 0.76, 1.0);
vec3 mixedColor = mix(vec3(1.0), vec3(1.0, 0.0, 0.0), sunMask * 1.25);

outerAtmosphereColor *= sunMask * 0.15;

outgoingLight += outerAtmosphereColor;