/** @jsxImportSource @emotion/react */
import React, { useRef } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, useFrame } from 'react-three-fiber'
import {css, jsx} from '@emotion/react';
import * as THREE from 'three'

const bColor = 'black';

const theme = css`
	width: 100vw;
	height: 100vh;
	background-color: ${bColor};
`;


const vertexShader = `
uniform float testVal;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vec3(testVal * position.x, position.y, position.z), 1.0);
}
`

const fragmentShader = `
precision highp float; 
uniform float val;
uniform float testVal;
void main() {
  gl_FragColor = vec4(testVal, testVal, testVal, 1.0);
}
`

const uniforms = { 
	u_time: { type: 'f', value: 0 },
	testVal: { type: 'f', value: 0 }
 }

function Thing() {
  const material = useRef()

  let t = 0
  useFrame(() => {

  	material.current.uniforms.testVal.value = t = (t + 0.01) % 1
  	//material.current.uniforms.u_time.value += 1

  	console.log(material.current.uniforms.testVal.value);

  })

  return (
    <mesh>
      <planeBufferGeometry attach="geometry" args={[4, 4]} />
      <shaderMaterial
        attach="material"
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}


export const Work = () => (
	<div css={theme}>
		<Canvas>
			<Thing />
		</Canvas>
	</div>
);
