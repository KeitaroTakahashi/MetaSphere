/** @jsxImportSource @emotion/react */
import React, { useRef } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, useFrame, useRender } from 'react-three-fiber'
import {css, jsx} from '@emotion/react';
import { theme, PrettoSlider, SliderTitleText, ControllerRight, ControllerLeft } from './layout'
import { Slider, Typography } from '@material-ui/core';
import {SketchPicker} from 'react-color'
import SketchExample from './react-color-ui'
import * as THREE from 'three'

  const fragmentShader = `
    varying vec3 Normal;
    varying vec3 Position;
	uniform float u_time;

    uniform vec3 Ka;
    uniform vec3 Kd;
    uniform vec3 Ks;
    uniform vec4 LightPosition;
    uniform vec4 LightColor;
    uniform vec3 LightIntensity;
    uniform float Shininess;

    vec3 phong() {
      vec3 n = normalize(Normal);
      vec3 s = normalize(vec3(LightPosition) - Position);
      vec3 v = normalize(vec3(-Position));
      vec3 r = reflect(-s, n);

      vec3 ambient = Ka;
      vec3 diffuse = Kd * max(dot(s, n), 0.0);
      vec3 specular = Ks * pow(max(dot(r, v), 0.0), Shininess);

      return LightIntensity * (ambient + diffuse + specular);
    }

    void main() {
      vec3 blue = vec3(LightColor.xyz);
      gl_FragColor = vec4(blue*phong(), 1.0);
  }`
  const vertexShader = `
    varying vec3 Normal;
    varying vec3 Position;

    uniform vec3 offset;
    uniform float scaleIn;
    uniform float scaleOut;
    uniform vec3 scale;
    uniform float u_time;

    // strech
    uniform vec3 positiveStretch;
    uniform vec3 negativeStretch;
    uniform vec4 stretchX;
    uniform vec4 stretchY;
    uniform float stretch_amount;


	// noise ====================
	vec3 mod289(vec3 x) {
	  return x - floor(x * (1.0 / 289.0)) * 289.0;
	}

	vec4 mod289(vec4 x) {
	  return x - floor(x * (1.0 / 289.0)) * 289.0;
	}

	vec4 permute(vec4 x) {
	     return mod289(((x*34.0)+1.0)*x);
	}

	vec4 taylorInvSqrt(vec4 r)
	{
	  return 1.79284291400159 - 0.85373472095314 * r;
	}

	float snoise(vec3 v)
	  { 
	  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
	  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

	// First corner
	  vec3 i  = floor(v + dot(v, C.yyy) );
	  vec3 x0 =   v - i + dot(i, C.xxx) ;

	// Other corners
	  vec3 g = step(x0.yzx, x0.xyz);
	  vec3 l = 1.0 - g;
	  vec3 i1 = min( g.xyz, l.zxy );
	  vec3 i2 = max( g.xyz, l.zxy );

	  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
	  //   x1 = x0 - i1  + 1.0 * C.xxx;
	  //   x2 = x0 - i2  + 2.0 * C.xxx;
	  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
	  vec3 x1 = x0 - i1 + C.xxx;
	  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
	  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

	// Permutations
	  i = mod289(i); 
	  vec4 p = permute( permute( permute( 
	             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
	           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
	           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

	// Gradients: 7x7 points over a square, mapped onto an octahedron.
	// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
	  float n_ = 0.142857142857; // 1.0/7.0
	  vec3  ns = n_ * D.wyz - D.xzx;

	  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

	  vec4 x_ = floor(j * ns.z);
	  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

	  vec4 x = x_ *ns.x + ns.yyyy;
	  vec4 y = y_ *ns.x + ns.yyyy;
	  vec4 h = 1.0 - abs(x) - abs(y);

	  vec4 b0 = vec4( x.xy, y.xy );
	  vec4 b1 = vec4( x.zw, y.zw );

	  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
	  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
	  vec4 s0 = floor(b0)*2.0 + 1.0;
	  vec4 s1 = floor(b1)*2.0 + 1.0;
	  vec4 sh = -step(h, vec4(0.0));

	  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
	  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

	  vec3 p0 = vec3(a0.xy,h.x);
	  vec3 p1 = vec3(a0.zw,h.y);
	  vec3 p2 = vec3(a1.xy,h.z);
	  vec3 p3 = vec3(a1.zw,h.w);

	//Normalise gradients
	  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
	  p0 *= norm.x;
	  p1 *= norm.y;
	  p2 *= norm.z;
	  p3 *= norm.w;

	// Mix final noise value
	  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
	  m = m * m;
	  return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
	                                dot(p2,x2), dot(p3,x3) ) );
	  }
	// noise ====================


    vec3 vertexNoise() {

    	vec3 val = vec3(u_time, 0.5, 0.5);
    	float randomValx = snoise(val + Position.xyz * scaleIn);
    	float randomValy = snoise(val + Position.zyx * scaleIn);
    	float randomValz = snoise(val + Position.yxz * scaleIn);

    	return (Position.xyz + vec3(randomValx, randomValy, randomValz) * scaleOut);


    }

    // stretch_amount
    vec3 stretch(vec3 vertex) {
    	vec3 p_s = (positiveStretch - 1.0) * stretch_amount;
    	vec3 n_s = (negativeStretch - 1.0) * stretch_amount;

    	vec4 s_x = (stretchX - 1.0) * stretch_amount;
    	vec4 s_y = (stretchY - 1.0) * stretch_amount;

    	vec3 transformed = vertex;

	    if(transformed.x >= 0.0)
	    {
	        transformed.x = transformed.x * (1.0 + p_s.x);
	        
	        if(transformed.y >= 0.0)
	        {
	            transformed.x *= (1.0 + (transformed.y * transformed.y) *  s_x.y);
	            transformed.y *= (1.0 + (transformed.x * transformed.x) *  s_y.y);
	        }else{
	            transformed.x *= (1.0 + (transformed.y * transformed.y) *  s_x.w);
	            transformed.y *= (1.0 + (transformed.x * transformed.x) *  s_y.w);
	        }
	          
	    }else if(transformed.x < 0.0)
	    {
	        transformed.x = vertex.x * (1.0 + n_s.x);
	        if(transformed.y >= 0.0)
	        {
	            transformed.x *= (1.0 + (transformed.y * transformed.y) * s_x.x);
	            transformed.y *= (1.0 + (transformed.x * transformed.x) * s_y.x);


	        }else{
	            transformed.x *= (1.0 + (transformed.y * transformed.y) * s_x.z);
	            transformed.y *= (1.0 + (transformed.x * transformed.x) * s_y.z);

	        }
	    }
	    
	    if(transformed.y >= 0.0)
	    {
	        transformed.y = transformed.y * (1.0 + p_s.y);
	    }else if(transformed.y < 0.0)
	    {
	        transformed.y = transformed.y * (1.0 + n_s.y);
	    }

	    if(transformed.z >= 0.0)
	    {
	        transformed.z = vertex.z * (1.0 + n_s.z);
	    }else if(transformed.z < 0.0)
	    {
	        transformed.z = vertex.z * (1.0 + p_s.z);
	    }

	    return transformed;
    }

    void main() {
      Normal = normalize(normalMatrix * normal);
      Position = vec3(modelViewMatrix * vec4(position, 1.0));
      vec3 fixedPos = stretch(vertexNoise());
      gl_Position = projectionMatrix * modelViewMatrix * vec4(fixedPos, 1.0) * vec4(scale, 1.0);
    }
  `

  const uniforms = {
    // phong material uniforms
    u_time: { type: 'f', value: 0 },
    Ka: { value: new THREE.Vector3(1, 1, 1) },
    Kd: { value: new THREE.Vector3(1, 1, 1) },
    Ks: { value: new THREE.Vector3(1, 1, 1) },
    //LightIntensity: { value: new THREE.Vector4(0.5, 0.5, 0.5, 1.0) },
    LightIntensity: { value: new THREE.Vector4(0.8, 0.8, 0.8, 1.0) },
    LightPosition: { value: new THREE.Vector4(30.0, 10.0, 21.0, 0.0) },
    LightColor: { value: new THREE.Vector4(0.8, 0.8, 0.8, 1.0)},
    Shininess: { value: 200.0 },
    offset:{value: new THREE.Vector3(1.0, 0.5, 0.5)},
    scaleIn: {value: 0.16},
    scaleOut: {value: 0.16},
    scale: {value: new THREE.Vector3(1, 1, 1) },

    // stretch
    positiveStretch: {value: new THREE.Vector3(1.0, 1.0, 1.0)},
    negativeStretch: {value: new THREE.Vector3(1.0, 1.0, 1.0)},
    stretchX: {value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0)},    
    stretchY: {value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0)},


    stretch_amount: {value: 1.0}

  }

  const sphereParameter = {
  	fineness: {value: 0.16},
  	intensity: {value: 0.2},
  	speed: {value: 0.01},
  	size: {value: new THREE.Vector3(0.36, 0.36, 0.36)},
  	brightness: { value: 0.8},
  	LightColor: { r: 0.8, g: 0.8, b: 0.8, a:1.0 },
  	stretch0: {value: 1.0},
  	stretch1: {value: 1.0},
  	stretch2: {value: 1.0},
  	stretch3: {value: 1.0},
  	amount: {value: 1.0}
  }

let finenessValue = 0.5;
let intensityValue = 0.5;

function Thing() {
  const ref = useRef()

  let t = 1;
  let test = 2.;
  useFrame(() => {
  		//ref.current.uniforms.u_time.value += 0.01
  		ref.current.uniforms.u_time.value += sphereParameter.speed.value % 360

  		ref.current.uniforms.scaleIn.value = sphereParameter.fineness.value
  		ref.current.uniforms.scaleOut.value = sphereParameter.intensity.value * sphereParameter.amount.value;
  		ref.current.uniforms.scale.value = sphereParameter.size.value
  		ref.current.uniforms.LightColor.value = new THREE.Vector4(sphereParameter.LightColor.r,
  																  sphereParameter.LightColor.g,
  																  sphereParameter.LightColor.b, 
  																  1.0)

  		ref.current.uniforms.LightIntensity.value = new THREE.Vector4(sphereParameter.brightness.value,
  																	  sphereParameter.brightness.value,
  																	  sphereParameter.brightness.value,
  																	  1.0)

		ref.current.uniforms.positiveStretch.value = new THREE.Vector3(sphereParameter.stretch1.value,
																	   sphereParameter.stretch2.value, 
																	   1.0)
		ref.current.uniforms.negativeStretch.value = new THREE.Vector3(sphereParameter.stretch0.value,
																	   sphereParameter.stretch3.value, 
																	   1.0)
		ref.current.uniforms.stretch_amount.value = sphereParameter.amount.value;

  	}
  )


  function handleResize() {
  	console.log('window resized!')
  }

  return (
    <mesh scale={[t, 1.0, 1.0]}>
      <sphereGeometry attach='geometry' args={[6, 100, 100]} />
      <shaderMaterial attach="material" 
      				  ref={ref}
      				  uniforms={uniforms} 
      				  vertexShader={vertexShader} 
      				  fragmentShader={fragmentShader} 
      				  />
    </mesh>
  )
}

const FinenessChangedHandler = (event, newValue) => {
    //console.log(newValue);
    sphereParameter.fineness.value = newValue / 100.0;
  };
const IntensityChangedHandler = (event, newValue) => {
    //console.log(newValue);
    sphereParameter.intensity.value = newValue / 40.0;
  };
const SpeedChangedHandler = (event, newValue) => {
    //console.log(newValue);
    sphereParameter.speed.value = newValue / 1000.0;
  };
const SizeChangedHandler = (event, newValue) => {
	let v = newValue / 100.0;
    sphereParameter.size.value = new THREE.Vector3(v, v, v);
    //console.log("size " + sphereParameter.size.value.x);

  };


const Stretch0ChangedHandler = (event, newValue) => {
	let v = newValue / 30.0;
	sphereParameter.stretch0.value = v;
}


const Stretch1ChangedHandler = (event, newValue) => {
	let v = newValue / 30.0;
	sphereParameter.stretch1.value = v;
}

const Stretch2ChangedHandler = (event, newValue) => {
	let v = newValue / 30.0;
	sphereParameter.stretch2.value = v;
}

const Stretch3ChangedHandler = (event, newValue) => {
	let v = newValue / 30.0;
	sphereParameter.stretch3.value = v;
}

const AmountChangedHandler = (event, newValue) => {
	let v = newValue / 100.0;
	sphereParameter.amount.value = v;
}

const BrightnessChangedHandler = (event, newValue) => {
    //console.log(newValue);
    sphereParameter.brightness.value = newValue / 100.0;
  };

 function colorChangeHandler(color) {
 	//console.log(color.rgb.r)
 	sphereParameter.LightColor = { r: color.rgb.r/255, 
 								   g: color.rgb.g/255, 
 								   b: color.rgb.b/255,
 						       	   a: 1.0}
 }



export const Work = () => (
	<div css={theme}>
		<Canvas>
			<Thing />
		</Canvas>
		<div css={ControllerLeft}>
			<SliderTitleText variant="h6">Fineness</SliderTitleText>
			<PrettoSlider 
				valueLabelDisplay="auto" 
				aria-label="pretto slider" 
				defaultValue={16}
				max={100}
				min={0}
				onChange={FinenessChangedHandler}
			 />

			<SliderTitleText variant="h6">Intensity</SliderTitleText>
			<PrettoSlider 
				valueLabelDisplay="auto" 
				aria-label="pretto slider" 
				defaultValue={20}
				max={100}
				min={0}
				onChange={IntensityChangedHandler}
			 />

			<SliderTitleText variant="h6">Speed</SliderTitleText>
			<PrettoSlider 
				valueLabelDisplay="auto" 
				aria-label="pretto slider" 
				defaultValue={20}
				max={50}
				min={0}
				onChange={SpeedChangedHandler}
			 />
			  
			<SliderTitleText variant="h6">Size</SliderTitleText>
			<PrettoSlider 
				valueLabelDisplay="auto" 
				aria-label="pretto slider" 
				defaultValue={36}
				max={100}
				min={0}
				onChange={SizeChangedHandler}
			 />
			
			<SliderTitleText variant="h6">Stretch Left</SliderTitleText>
			<PrettoSlider 
				valueLabelDisplay="auto" 
				aria-label="pretto slider" 
				defaultValue={30}
				max={200}
				min={0}
				onChange={Stretch0ChangedHandler}
			 />

			<SliderTitleText variant="h6">Stretch Right</SliderTitleText>
			<PrettoSlider 
				valueLabelDisplay="auto" 
				aria-label="pretto slider" 
				defaultValue={30}
				max={200}
				min={0}
				onChange={Stretch1ChangedHandler}
			 />

			<SliderTitleText variant="h6">Stretch Top</SliderTitleText>
			<PrettoSlider 
				valueLabelDisplay="auto" 
				aria-label="pretto slider" 
				defaultValue={30}
				max={200}
				min={0}
				onChange={Stretch2ChangedHandler}
			 />

			<SliderTitleText variant="h6">Stretch bottom</SliderTitleText>
			<PrettoSlider 
				valueLabelDisplay="auto" 
				aria-label="pretto slider" 
				defaultValue={30}
				max={200}
				min={0}
				onChange={Stretch3ChangedHandler}
			 />

			<SliderTitleText variant="h6">Amount</SliderTitleText>
			<PrettoSlider 
				valueLabelDisplay="auto" 
				aria-label="pretto slider" 
				defaultValue={10}
				max={100}
				min={0}
				onChange={AmountChangedHandler}
			 />


		</div>	

		<div css={ControllerRight}>
			<SketchExample 
				colorChanged = { colorChangeHandler }
			/>

			<SliderTitleText variant="h6">Brightness</SliderTitleText>
			<PrettoSlider 
				valueLabelDisplay="auto" 
				aria-label="pretto slider" 
				defaultValue={80}
				max={100}
				min={0}
				onChange={BrightnessChangedHandler}
			 />

		</div>	

	</div>
);

